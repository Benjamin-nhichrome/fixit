<?php

require_once __DIR__ . '/../app/includes/auth.php';
require_once __DIR__ . '/../app/config/database.php';
require_once __DIR__ . '/../app/functions/helpers.php';

requireLogin();

if (isAdmin()) {
    header('Location: ' . BASE_URL . '/admin/dashboard.php');
    exit;
}

$stmt = $pdo->prepare(
    'SELECT
        id,
        subject,
        category,
        status,
        priority,
        created_at
     FROM tickets
     WHERE user_id = :user_id
     ORDER BY created_at DESC'
);

$stmt->execute([
    'user_id' => $_SESSION['user']['id']
]);

$tickets = $stmt->fetchAll();

$ticketCreated = isset($_GET['created'])
    && $_GET['created'] === '1';
?>

<?php

$pageTitle = 'Mijn tickets';

require_once __DIR__ . '/../app/includes/header.php';

?>

<div class="dashboard-top">

    <div>
        <h1>Mijn tickets</h1>

        <p>
            Welkom <?= escape($_SESSION['user']['name']) ?>.
            Bekijk en beheer hier je supporttickets.
        </p>
    </div>

    <a
        href="<?= BASE_URL ?>/ticket_create.php"
        class="btn btn-primary"
    >
        + Nieuwe ticket
    </a>

</div>

<?php if ($ticketCreated): ?>

    <div class="alert alert-success">
        Ticket is succesvol aangemaakt.
    </div>

<?php endif; ?>


<?php if (empty($tickets)): ?>

    <section class="empty-state">

        <h2>Nog geen tickets</h2>

        <p>
            Je hebt op dit moment nog geen supporttickets.
        </p>

        <a
            href="<?= BASE_URL ?>/ticket_create.php"
            class="btn btn-primary"
        >
            Nieuwe ticket aanmaken
        </a>

    </section>

<?php else: ?>

    <div class="table-wrapper">

        <table class="ticket-table">

            <thead>
                <tr>
                    <th>Onderwerp</th>
                    <th>Categorie</th>
                    <th>Status</th>
                    <th>Prioriteit</th>
                    <th>Aangemaakt</th>
                    <th>Actie</th>
                </tr>
            </thead>

            <tbody>

                <?php foreach ($tickets as $ticket): ?>

                    <tr>

                        <td>
                            <strong>
                                <?= escape($ticket['subject']) ?>
                            </strong>
                        </td>

                        <td>
                            <?= escape($ticket['category']) ?>
                        </td>

                        <td>

                            <?php
                            $statusClass =
                                $ticket['status'] === 'Open'
                                    ? 'badge-open'
                                    : 'badge-closed';
                            ?>

                            <span
                                class="badge <?= $statusClass ?>"
                            >
                                <?= escape($ticket['status']) ?>
                            </span>

                        </td>

                        <td>

                            <?php
                            $priorityClass = match (
                                $ticket['priority']
                            ) {
                                'Low' => 'badge-low',
                                'Urgent' => 'badge-urgent',
                                default => 'badge-normal'
                            };
                            ?>

                            <span
                                class="badge <?= $priorityClass ?>"
                            >
                                <?= escape($ticket['priority']) ?>
                            </span>

                        </td>

                        <td>
                            <?= escape(
                                date(
                                    'd-m-Y H:i',
                                    strtotime($ticket['created_at'])
                                )
                            ) ?>
                        </td>

                        <td>

                            <a
                                href="<?= BASE_URL ?>/ticket.php?id=<?= (int) $ticket['id'] ?>"
                                class="btn btn-outline"
                            >
                                Bekijken
                            </a>

                        </td>

                    </tr>

                <?php endforeach; ?>

            </tbody>

        </table>

    </div>

<?php endif; ?>

<?php
require_once __DIR__ . '/../app/includes/footer.php';
?>