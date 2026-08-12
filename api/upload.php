<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

require_auth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['error' => 'method_not_allowed'], 405);
}

if (empty($_FILES['image']) || !is_array($_FILES['image'])) {
    send_json(['error' => 'missing_image'], 400);
}

$image = $_FILES['image'];
if (($image['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    send_json(['error' => 'upload_error'], 400);
}

$maxBytes = 5 * 1024 * 1024;
if (($image['size'] ?? 0) > $maxBytes) {
    send_json(['error' => 'file_too_large'], 400);
}

$tmpName = (string) ($image['tmp_name'] ?? '');
if ($tmpName === '' || !is_uploaded_file($tmpName)) {
    send_json(['error' => 'invalid_upload'], 400);
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($tmpName);
$extensions = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
];

if (!isset($extensions[$mime])) {
    send_json(['error' => 'invalid_image_type'], 400);
}

$uploadDir = dirname(__DIR__) . '/assets/uploads';
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
    send_json(['error' => 'upload_dir_failed'], 500);
}

$fileName = 'brownie-' . date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.' . $extensions[$mime];
$target = $uploadDir . '/' . $fileName;

if (!move_uploaded_file($tmpName, $target)) {
    send_json(['error' => 'move_failed'], 500);
}

send_json([
    'ok' => true,
    'path' => './assets/uploads/' . $fileName,
]);
