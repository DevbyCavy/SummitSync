<?php
declare(strict_types=1);

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/mailer.php';

handle(function () {
    $data = bootstrap_request();
    check_honeypot($data);
    rate_limit('contact');

    $input = validate_input($data, [
        'name'         => ['required' => true, 'max' => 120, 'label' => 'Name'],
        'email'        => ['required' => true, 'email' => true, 'max' => 255, 'label' => 'Email'],
        'phone'        => ['max' => 40, 'label' => 'Phone'],
        'organisation' => ['max' => 160, 'label' => 'Organisation'],
        'subject'      => ['max' => 160, 'label' => 'Subject'],
        'message'      => ['required' => true, 'max' => 5000, 'label' => 'Message'],
    ]);

    db()->prepare(
        'INSERT INTO contact_messages (name, email, phone, organisation, subject, message, ip)
         VALUES (:name, :email, :phone, :organisation, :subject, :message, :ip)'
    )->execute([
        ':name'         => $input['name'],
        ':email'        => $input['email'],
        ':phone'        => $input['phone'],
        ':organisation' => $input['organisation'],
        ':subject'      => $input['subject'],
        ':message'      => $input['message'],
        ':ip'           => client_ip(),
    ]);

    $subject = 'Website enquiry: ' . ($input['subject'] ?? 'New message from ' . $input['name']);
    $body = implode("\n", [
        "Name: {$input['name']}",
        "Email: {$input['email']}",
        'Phone: ' . ($input['phone'] ?? '-'),
        'Organisation: ' . ($input['organisation'] ?? '-'),
        'Subject: ' . ($input['subject'] ?? '-'),
        '',
        $input['message'],
    ]);

    // Message is already stored; a mail failure is logged and reported so the visitor can retry or call.
    if (!send_mail($subject, $body, $input['email'], $input['name'])) {
        json_response(500, ['ok' => false, 'error' => 'Your message was saved but we could not send a notification. Please also call us if urgent.']);
    }

    json_response(200, ['ok' => true]);
});
