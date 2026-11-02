<?php
declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

handle(function () {
    $data = bootstrap_request();
    check_honeypot($data);
    rate_limit('newsletter');

    $input = validate_input($data, [
        'email' => ['required' => true, 'email' => true, 'max' => 255, 'label' => 'Email'],
    ]);

    // INSERT IGNORE: duplicates still return ok so we don't leak who is subscribed.
    db()->prepare('INSERT IGNORE INTO subscribers (email, ip) VALUES (:email, :ip)')
        ->execute([':email' => mb_strtolower($input['email']), ':ip' => client_ip()]);

    json_response(200, ['ok' => true]);
});
