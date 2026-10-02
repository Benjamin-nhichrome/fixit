<?php

if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');

    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => false
    ]);

    session_start();
}

define('BASE_URL', '/fixit/public');