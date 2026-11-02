<?php
declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

// TODO(open): "Sign Up" = industry network registration by default (§13.1).

handle(function () {
    $data = bootstrap_request();
    check_honeypot($data);
    rate_limit('signup');

    $input = validate_input($data, [
        'name'         => ['required' => true, 'max' => 120, 'label' => 'Name'],
        'email'        => ['required' => true, 'email' => true, 'max' => 255, 'label' => 'Email'],
        'organisation' => ['max' => 160, 'label' => 'Organisation'],
        'role'         => ['in' => ['Venue', 'Supplier', 'Planner', 'Corporate', 'Media', 'Other'], 'default' => 'Other', 'label' => 'Role'],
    ]);

    db()->prepare(
        'INSERT INTO signups (name, email, organisation, role, ip) VALUES (:name, :email, :organisation, :role, :ip)'
    )->execute([
        ':name'         => $input['name'],
        ':email'        => $input['email'],
        ':organisation' => $input['organisation'],
        ':role'         => $input['role'],
        ':ip'           => client_ip(),
    ]);

    json_response(200, ['ok' => true]);
});
