<?php

require_once __DIR__ . '/../app/includes/auth.php';
require_once __DIR__ . '/../app/config/database.php';
require_once __DIR__ . '/../app/functions/helpers.php';

requireLogin();

if (isAdmin()) {
    header('Location: ' . BASE_URL . '/admin/dashboard.php');
    exit;
}

$errors = [];
$subject = '';
$description = '';
$category = '';

$allowedCategories = [
    'Hardware',
    'Software',
    'Account',
    'Netwerk',
    'Overig'
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = $_POST['csrf_token'] ?? '';

    if (!verifyCsrfToken($csrfToken)) {
        $errors[] = 'Ongeldig verzoek. Probeer het opnieuw.';
    }

    $subject = trim($_POST['subject'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $category = trim($_POST['category'] ?? '');

    if ($subject === '') {
        $errors[] = 'Onderwerp is verplicht.';
    } elseif (strlen($subject) > 150) {
        $errors[] = 'Onderwerp mag maximaal 150 tekens bevatten.';
    }

    if ($description === '') {
    $errors[] = 'Omschrijving is verplicht.';
} elseif (strlen($description) > 2000) {
    $errors[] = 'Omschrijving mag maximaal 2000 tekens bevatten.';
}

    if (!in_array($category, $allowedCategories, true)) {
        $errors[] = 'Selecteer een geldige categorie.';
    }

    if (empty($errors)) {
        $stmt = $pdo->prepare(
            'INSERT INTO tickets (
                user_id,
                subject,
                description,
                category
            )
            VALUES (
                :user_id,
                :subject,
                :description,
                :category
            )'
        );

        $stmt->execute([
            'user_id' => $_SESSION['user']['id'],
            'subject' => $subject,
            'description' => $description,
            'category' => $category
        ]);

        header(
            'Location: ' . BASE_URL . '/dashboard.php?created=1'
        );
        exit;
    }
}

$csrfToken = generateCsrfToken();
?>

<?php

$pageTitle = 'Nieuw ticket';

require_once __DIR__ . '/../app/includes/header.php';

?>

<div class="page-header">

    <h1>Nieuw ticket</h1>

    <p>
        Beschrijf je probleem zodat de servicedesk je kan helpen.
    </p>

</div>

<?php if (!empty($errors)): ?>

    <div class="alert alert-danger">

        <strong>
            De ticket kon niet worden aangemaakt.
        </strong>

        <ul>
            <?php foreach ($errors as $error): ?>

                <li>
                    <?= escape($error) ?>
                </li>

            <?php endforeach; ?>
        </ul>

    </div>

<?php endif; ?>


<section class="card">

    <h2 class="card-title">
        Ticketgegevens
    </h2>

    <form method="POST" action="">

        <input
            type="hidden"
            name="csrf_token"
            value="<?= escape($csrfToken) ?>"
        >

        <div class="form-group">

            <label for="subject">
                Onderwerp
            </label>

            <input
                class="form-control"
                type="text"
                id="subject"
                name="subject"
                maxlength="150"
                value="<?= escape($subject) ?>"
                placeholder="Bijvoorbeeld: Laptop start niet op"
                required
            >

        </div>


        <div class="form-group">

            <label for="category">
                Categorie
            </label>

            <select
                class="form-control"
                id="category"
                name="category"
                required
            >

                <option value="">
                    Kies een categorie
                </option>

                <?php foreach ($allowedCategories as $option): ?>

                    <option
                        value="<?= escape($option) ?>"
                        <?= $category === $option
                            ? 'selected'
                            : '' ?>
                    >
                        <?= escape($option) ?>
                    </option>

                <?php endforeach; ?>

            </select>

        </div>


        <div class="form-group">

            <label for="description">
                Beschrijving
            </label>

            <textarea
                class="form-control"
                id="description"
                name="description"
                maxlength="2000"
                placeholder="Beschrijf het probleem zo duidelijk mogelijk..."
                required
            ><?= escape($description) ?></textarea>

        </div>


        <div class="form-actions">

            <button
                class="btn btn-primary"
                type="submit"
            >
                Ticket aanmaken
            </button>

            <a
                href="<?= BASE_URL ?>/dashboard.php"
                class="btn btn-outline"
            >
                Annuleren
            </a>

        </div>

    </form>

</section>

<?php
require_once __DIR__ . '/../app/includes/footer.php';
?>