<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_json(['error' => 'method_not_allowed'], 405);
}

$stmt = db()->query('SELECT data, updated_at FROM app_state WHERE id = 1');
$row = $stmt->fetch();
if (!$row) {
    send_json(['ok' => true, 'siteConfig' => null, 'updatedAt' => null]);
}

$state = json_decode((string) $row['data'], true);
$siteConfig = is_array($state) && is_array($state['siteConfig'] ?? null)
    ? $state['siteConfig']
    : null;

send_json([
    'ok' => true,
    'siteConfig' => $siteConfig,
    'updatedAt' => $row['updated_at'],
]);
