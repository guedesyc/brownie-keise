<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

require_auth();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = db()->query('SELECT data, updated_at FROM app_state WHERE id = 1');
    $row = $stmt->fetch();
    if (!$row) {
        send_json(['ok' => true, 'data' => null, 'updatedAt' => null]);
    }

    $state = json_decode((string) $row['data'], true);
    send_json([
        'ok' => true,
        'data' => validate_state($state),
        'updatedAt' => $row['updated_at'],
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = read_json_body();
    $state = validate_state($body['data'] ?? null);
    $json = json_encode($state, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        send_json(['error' => 'encode_failed'], 500);
    }

    $stmt = db()->prepare(
        'INSERT INTO app_state (id, data) VALUES (1, :data)
         ON DUPLICATE KEY UPDATE data = VALUES(data)'
    );
    $stmt->execute(['data' => $json]);

    send_json(['ok' => true]);
}

send_json(['error' => 'method_not_allowed'], 405);

