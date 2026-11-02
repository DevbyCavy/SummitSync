<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

function json_response(int $status, array $body): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body);
    exit;
}

/** CORS (own origin only), security headers, method check. Returns the decoded JSON body. */
function bootstrap_request(): array
{
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('X-Frame-Options: SAMEORIGIN');
    header('Cache-Control: no-store');

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '') {
        if (!in_array($origin, config()['allowed_origins'] ?? [], true) && !is_same_origin($origin)) {
            json_response(403, ['ok' => false, 'error' => 'Origin not allowed.']);
        }
        header("Access-Control-Allow-Origin: $origin");
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }

    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if ($method === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
    if ($method !== 'POST') {
        header('Allow: POST, OPTIONS');
        json_response(405, ['ok' => false, 'error' => 'Method not allowed.']);
    }

    $raw = file_get_contents('php://input', false, null, 0, 20000) ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_response(422, ['ok' => false, 'error' => 'Invalid request body.']);
    }
    return $data;
}

function is_same_origin(string $origin): bool
{
    $host = $_SERVER['HTTP_HOST'] ?? '';
    return $host !== '' && parse_url($origin, PHP_URL_HOST) . (parse_url($origin, PHP_URL_PORT) ? ':' . parse_url($origin, PHP_URL_PORT) : '') === $host;
}

/** Honeypot: bots fill the hidden `website` field. Pretend success and discard. */
function check_honeypot(array $data): void
{
    if (trim((string)($data['website'] ?? '')) !== '') {
        json_response(200, ['ok' => true]);
    }
}

function client_ip(): string
{
    return substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45);
}

/**
 * Per-IP fixed-window rate limit stored in the `rate_limits` table.
 * Responds 429 when the limit for this endpoint is exceeded.
 */
function rate_limit(string $endpoint): void
{
    $cfg = config()['rate_limit'] ?? ['max' => 5, 'window' => 600];
    $pdo = db();
    $ip = client_ip();

    $pdo->prepare('DELETE FROM rate_limits WHERE created_at < (NOW() - INTERVAL :window SECOND)')
        ->execute([':window' => (int)$cfg['window']]);

    $count = $pdo->prepare('SELECT COUNT(*) FROM rate_limits WHERE ip = :ip AND endpoint = :endpoint');
    $count->execute([':ip' => $ip, ':endpoint' => $endpoint]);
    if ((int)$count->fetchColumn() >= (int)$cfg['max']) {
        header('Retry-After: ' . (int)$cfg['window']);
        json_response(429, ['ok' => false, 'error' => 'Too many requests. Please try again later.']);
    }

    $pdo->prepare('INSERT INTO rate_limits (ip, endpoint) VALUES (:ip, :endpoint)')
        ->execute([':ip' => $ip, ':endpoint' => $endpoint]);
}

/**
 * Validates and cleans fields. $rules: name => ['required' => bool, 'max' => int, 'email' => bool, 'in' => array, 'label' => string].
 * Returns cleaned values (tags stripped, trimmed, '' → null for optional fields). Responds 422 on the first error.
 */
function validate_input(array $data, array $rules): array
{
    $clean = [];
    foreach ($rules as $field => $rule) {
        $label = $rule['label'] ?? ucfirst($field);
        $value = $data[$field] ?? '';
        if (!is_scalar($value)) {
            json_response(422, ['ok' => false, 'error' => "$label is invalid."]);
        }
        $value = trim(strip_tags((string)$value));

        if ($value === '') {
            if (!empty($rule['required'])) {
                json_response(422, ['ok' => false, 'error' => "$label is required."]);
            }
            $clean[$field] = $rule['default'] ?? null;
            continue;
        }
        if (isset($rule['max']) && mb_strlen($value) > $rule['max']) {
            json_response(422, ['ok' => false, 'error' => "$label must be {$rule['max']} characters or fewer."]);
        }
        if (!empty($rule['email']) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
            json_response(422, ['ok' => false, 'error' => 'Please enter a valid email address.']);
        }
        if (isset($rule['in']) && !in_array($value, $rule['in'], true)) {
            json_response(422, ['ok' => false, 'error' => "$label is invalid."]);
        }
        $clean[$field] = $value;
    }
    return $clean;
}

/** Wraps an endpoint so unexpected errors become a generic 500 instead of leaking details. */
function handle(callable $fn): void
{
    try {
        $fn();
    } catch (Throwable $e) {
        error_log('Summit Sync API: ' . $e->getMessage());
        json_response(500, ['ok' => false, 'error' => 'Something went wrong. Please try again later.']);
    }
}
