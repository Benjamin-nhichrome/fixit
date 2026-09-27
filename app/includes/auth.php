<?php

require_once __DIR__ . '/../config/config.php';

function requireLogin(): void
{
    if (!isset($_SESSION['user'])) {
        header('Location: ' . BASE_URL . '/login.php');
        exit;
    }
}

function requireAdmin(): void
{
    requireLogin();

    if ($_SESSION['user']['role'] !== 'admin') {
        header('Location: ' . BASE_URL . '/dashboard.php');
        exit;
    }
}

function isLoggedIn(): bool
{
    return isset($_SESSION['user']);
}

function isAdmin(): bool
{
    return isset($_SESSION['user'])
        && $_SESSION['user']['role'] === 'admin';
}