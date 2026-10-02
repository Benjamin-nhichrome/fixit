<?php

require_once __DIR__ . '/../config/config.php';

function requireLogin(): void
{
    if (!isLoggedIn()) {
        header('Location: ' . BASE_URL . '/login.php');
        exit;
    }
}

function requireAdmin(): void
{
    requireLogin();

    if (!isAdmin()) {
        header('Location: ' . BASE_URL . '/dashboard.php');
        exit;
    }
}

function isLoggedIn(): bool
{
    return isset($_SESSION['user'])
        && is_array($_SESSION['user'])
        && isset($_SESSION['user']['id']);
}

function isAdmin(): bool
{
    return isLoggedIn()
        && isset($_SESSION['user']['role'])
        && $_SESSION['user']['role'] === 'admin';
}
