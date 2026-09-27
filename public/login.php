<?php

require_once __DIR__ . '/../app/config/config.php';
require_once __DIR__ . '/../app/config/database.php';

if (isset($_SESSION['user'])) {
    if ($_SESSION['user']['role'] === 'admin') {
        header('Location: ' . BASE_URL . '/admin/dashboard.php');
    } else {
        header('Location: ' . BASE_URL . '/dashboard.php');
    }

    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($email === '' || $password === '') {
        $error = 'Vul je e-mailadres en wachtwoord in.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Vul een geldig e-mailadres in.';
    } else {
        $stmt = $pdo->prepare(
            'SELECT id, name, email, password, role
             FROM users
             WHERE email = :email
             LIMIT 1'
        );

        $stmt->execute([
            'email' => $email
        ]);

        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            session_regenerate_id(true);

            $_SESSION['user'] = [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ];

            if ($user['role'] === 'admin') {
                header('Location: ' . BASE_URL . '/admin/dashboard.php');
            } else {
                header('Location: ' . BASE_URL . '/dashboard.php');
            }

            exit;
        }

        $error = 'E-mailadres of wachtwoord is onjuist.';
    }
}
?>

<?php

$pageTitle = 'Inloggen';

require_once __DIR__ . '/../app/includes/header.php';

?>

<div class="login-layout">

    <section class="login-card">

        <h1>Welkom bij FixIT</h1>

        <p class="login-subtitle">
            Log in om je servicedesktickets te beheren.
        </p>

        <?php if ($error !== ''): ?>

            <div class="alert alert-danger">
                <?= htmlspecialchars(
                    $error,
                    ENT_QUOTES,
                    'UTF-8'
                ) ?>
            </div>

        <?php endif; ?>

        <form method="POST" action="">

            <div class="form-group">

                <label for="email">
                    E-mailadres
                </label>

                <input
                    class="form-control"
                    type="email"
                    id="email"
                    name="email"
                    autocomplete="email"
                    required
                >

            </div>

            <div class="form-group">

                <label for="password">
                    Wachtwoord
                </label>

                <input
                    class="form-control"
                    type="password"
                    id="password"
                    name="password"
                    autocomplete="current-password"
                    required
                >

            </div>

            <button
                class="btn btn-primary"
                type="submit"
            >
                Inloggen
            </button>

        </form>

    </section>

</div>

<?php
require_once __DIR__ . '/../app/includes/footer.php';
?>