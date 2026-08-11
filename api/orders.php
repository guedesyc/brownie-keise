<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function normalize_order_item($item): ?array
{
    if (!is_array($item)) {
        return null;
    }

    $name = trim((string) ($item['name'] ?? ''));
    $quantity = (int) ($item['quantity'] ?? 0);
    $price = (float) ($item['price'] ?? 0);

    if ($name === '' || $quantity <= 0 || $price < 0) {
        return null;
    }

    return [
        'productId' => (string) ($item['productId'] ?? ''),
        'name' => $name,
        'quantity' => $quantity,
        'price' => $price,
    ];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = read_json_body();

    if (($body['action'] ?? '') === 'updateStatus') {
        require_auth();
        $id = (int) ($body['id'] ?? 0);
        $status = (string) ($body['status'] ?? '');
        if ($id <= 0 || !in_array($status, ['converted', 'dismissed'], true)) {
            send_json(['error' => 'invalid_order_update'], 400);
        }

        $stmt = db()->prepare('UPDATE suggested_orders SET status = :status WHERE id = :id');
        $stmt->execute(['id' => $id, 'status' => $status]);
        send_json(['ok' => true]);
    }

    $items = array_values(array_filter(array_map('normalize_order_item', $body['items'] ?? [])));

    if (count($items) === 0) {
        send_json(['error' => 'empty_order'], 400);
    }

    $total = 0;
    foreach ($items as $item) {
        $total += $item['quantity'] * $item['price'];
    }
    $order = [
        'items' => $items,
        'total' => $total,
        'source' => 'site',
    ];
    $json = json_encode($order, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        send_json(['error' => 'encode_failed'], 500);
    }

    $stmt = db()->prepare('INSERT INTO suggested_orders (data) VALUES (:data)');
    $stmt->execute(['data' => $json]);

    send_json(['ok' => true, 'id' => (int) db()->lastInsertId()]);
}

require_auth();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = db()->query(
        "SELECT id, data, status, created_at
         FROM suggested_orders
         WHERE status = 'pending'
         ORDER BY created_at DESC
         LIMIT 50"
    );
    $orders = [];
    foreach ($stmt->fetchAll() as $row) {
        $data = json_decode((string) $row['data'], true);
        if (!is_array($data)) {
            continue;
        }
        $orders[] = [
            'id' => (int) $row['id'],
            'items' => is_array($data['items'] ?? null) ? $data['items'] : [],
            'total' => (float) ($data['total'] ?? 0),
            'status' => $row['status'],
            'createdAt' => $row['created_at'],
        ];
    }
    send_json(['ok' => true, 'orders' => $orders]);
}

if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $body = read_json_body();
    $id = (int) ($body['id'] ?? 0);
    $status = (string) ($body['status'] ?? '');
    if ($id <= 0 || !in_array($status, ['converted', 'dismissed'], true)) {
        send_json(['error' => 'invalid_order_update'], 400);
    }

    $stmt = db()->prepare('UPDATE suggested_orders SET status = :status WHERE id = :id');
    $stmt->execute(['id' => $id, 'status' => $status]);
    send_json(['ok' => true]);
}

send_json(['error' => 'method_not_allowed'], 405);
