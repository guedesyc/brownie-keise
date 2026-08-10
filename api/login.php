<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['error' => 'method_not_allowed'], 405);
}

$body = read_json_body();
$username = (string) ($body['username'] ?? '');
$password = (string) ($body['password'] ?? '');

if (!hash_equals(APP_USERNAME, $username) || !hash_equals(APP_PASSWORD, $password)) {
    send_json(['error' => 'invalid_credentials'], 401);
}

session_regenerate_id(true);
$_SESSION['authenticated'] = true;

send_json(['ok' => true]);
