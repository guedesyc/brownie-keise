<?php

declare(strict_types=1);

session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Strict',
    'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
]);
session_start();

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    send_json(['error' => 'missing_config'], 500);
}
require_once $configPath;

function send_json(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        send_json(['error' => 'invalid_json'], 400);
    }
    return $data;
}

function require_auth(): void
{
    if (empty($_SESSION['authenticated'])) {
        send_json(['error' => 'unauthorized'], 401);
    }
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    ensure_schema($pdo);

    return $pdo;
}

function ensure_schema(PDO $pdo): void
{
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS app_state (
            id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
            data LONGTEXT NOT NULL,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS suggested_orders (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            data LONGTEXT NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    );
}

function validate_state($state): array
{
    if (!is_array($state)) {
        send_json(['error' => 'invalid_state'], 400);
    }

    return [
        'ingredients' => array_values(is_array($state['ingredients'] ?? null) ? $state['ingredients'] : []),
        'recipes' => array_values(is_array($state['recipes'] ?? null) ? $state['recipes'] : []),
        'movements' => array_values(is_array($state['movements'] ?? null) ? $state['movements'] : []),
        'sales' => array_values(is_array($state['sales'] ?? null) ? $state['sales'] : []),
    ];
}
