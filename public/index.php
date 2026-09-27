<?php

require_once __DIR__ . '/../app/config/config.php';

if (!isset($_SESSION['user'])) {
    header('Location: ' . BASE_URL . '/login.php');
    exit;
}

if ($_SESSION['user']['role'] === 'admin') {
    header('Location: ' . BASE_URL . '/admin/dashboard.php');
    exit;
}

header('Location: ' . BASE_URL . '/dashboard.php');
exit;