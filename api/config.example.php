<?php
/**
 * Copy to config.php and fill in real values. config.php is git-ignored and blocked by .htaccess.
 * If the host allows, keep config.php OUTSIDE public_html and set SUMMITSYNC_CONFIG to its path.
 */
return [
    'db' => [
        'host'    => 'localhost',
        'name'    => 'summitsync',
        'user'    => 'root',
        'pass'    => '',
        'charset' => 'utf8mb4',
    ],

    // TODO(open): contact form recipient + SMTP credentials (§13.6)
    'mail' => [
        'to'         => 'info@summitsync.co.zw',
        'from'       => 'no-reply@summitsync.co.zw',
        'from_name'  => 'Summit Sync Website',
        'smtp_host'  => 'smtp.hostinger.com',
        'smtp_port'  => 465,
        'smtp_user'  => 'no-reply@summitsync.co.zw',
        'smtp_pass'  => '',
        'smtp_secure'=> 'ssl', // 'ssl' (465) or 'tls' (587)
    ],

    // Origins allowed to call the API (CORS). Same-origin requests need no entry.
    'allowed_origins' => [
        'https://summitsync.co.zw',
        'https://www.summitsync.co.zw',
        'http://localhost:5173', // Vite dev server — remove in production
    ],

    // Per-IP, per-endpoint rate limit
    'rate_limit' => ['max' => 5, 'window' => 600],
];
