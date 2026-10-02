<?php

if (!defined('BASE_URL')) {
    require_once __DIR__ . '/../config/config.php';
}

$pageTitle = $pageTitle ?? 'FixIT';
$isLoggedIn = isset($_SESSION['user']);
?>

<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        <?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?> | FixIT
    </title>

    <link
        rel="stylesheet"
        href="<?= BASE_URL ?>/assets/css/style.css"
    >
</head>

<body>

<header class="main-header">

    <div class="header-container">

        <a
            href="<?= BASE_URL ?>/index.php"
            class="brand"
        >
            <span class="brand-icon">F</span>

            <span class="brand-text">
                Fix<span>IT</span>
            </span>
        </a>

        <?php if ($isLoggedIn): ?>

            <div class="header-user">

                <div class="user-info">

                    <strong>
                        <?= htmlspecialchars(
                            $_SESSION['user']['name'],
                            ENT_QUOTES,
                            'UTF-8'
                        ) ?>
                    </strong>

                    <span>
                        <?= $_SESSION['user']['role'] === 'admin'
                            ? 'Beheerder'
                            : 'Medewerker' ?>
                    </span>

                </div>

                <a
                    href="<?= BASE_URL ?>/logout.php"
                    class="btn btn-outline"
                >
                    Uitloggen
                </a>

            </div>

        <?php endif; ?>

    </div>

</header>

<main class="main-content">
