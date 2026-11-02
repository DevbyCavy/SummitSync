<?php
declare(strict_types=1);

function config(): array
{
    static $config = null;
    if ($config === null) {
        $path = getenv('SUMMITSYNC_CONFIG') ?: __DIR__ . '/config.php';
        if (!is_file($path)) {
            error_log('Summit Sync API: config.php missing');
            json_response(500, ['ok' => false, 'error' => 'Server is not configured.']);
        }
        $config = require $path;
    }
    return $config;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $c = config()['db'];
        $dsn = "mysql:host={$c['host']};dbname={$c['name']};charset={$c['charset']}";
        $pdo = new PDO($dsn, $c['user'], $c['pass'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}
