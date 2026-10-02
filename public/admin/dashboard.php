<?php

require_once __DIR__ . '/../../app/includes/auth.php';
require_once __DIR__ . '/../../app/config/database.php';
require_once __DIR__ . '/../../app/functions/helpers.php';

requireAdmin();

$stmt = $pdo->prepare(
    'SELECT
        tickets.id,
        tickets.subject,
        tickets.category,
        tickets.status,
        tickets.priority,
        tickets.created_at,
        users.name AS employee_name,
        users.email AS employee_email
     FROM tickets
     INNER JOIN users
        ON tickets.user_id = users.id
     ORDER BY tickets.created_at DESC'
);

$stmt->execute();
$tickets = $stmt->fetchAll();

$updated = isset($_GET['updated'])
    && $_GET['updated'] === '1';

$pageTitle = 'Admin Dashboard';

require_once __DIR__ . '/../../app/includes/header.php';
?>

<div class="dashboard-top">

    <div>
        <h1>Alle tickets</h1>

        <p>
            Bekijk en beheer alle supporttickets van medewerkers.
        </p>
    </div>

</div>

<?php if ($updated): ?>

    <div class="alert alert-success">
        Ticket is succesvol bijgewerkt.
    </div>

<?php endif; ?>

<?php if (empty($tickets)): ?>

    <section class="empty-state">

        <h2>Geen tickets</h2>

        <p>
            Er zijn op dit moment geen supporttickets.
        </p>

    </section>

<?php else: ?>

    <div class="table-wrapper">

        <table class="ticket-table">

            <thead>
                <tr>
                    <th>ID</th>
                    <th>Medewerker</th>
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
                            #<?= (int) $ticket['id'] ?>
                        </td>

                        <td>
                            <strong>
                                <?= escape($ticket['employee_name']) ?>
                            </strong>

                            <br>

                            <small>
                                <?= escape($ticket['employee_email']) ?>
                            </small>
                        </td>

                        <td>
                            <?= escape($ticket['subject']) ?>
                        </td>

                        <td>
                            <?= escape($ticket['category']) ?>
                        </td>

                        <td>
                            <span
                                class="badge <?= getStatusBadgeClass(
                                    $ticket['status']
                                ) ?>"
                            >
                                <?= escape($ticket['status']) ?>
                            </span>
                        </td>

                        <td>
                            <span
                                class="badge <?= getPriorityBadgeClass(
                                    $ticket['priority']
                                ) ?>"
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
                                href="<?= BASE_URL ?>/admin/ticket.php?id=<?= (int) $ticket['id'] ?>"
                                class="btn btn-outline"
                            >
                                Beheren
                            </a>
                        </td>

                    </tr>

                <?php endforeach; ?>

            </tbody>

        </table>

    </div>

<?php endif; ?>

<?php
require_once __DIR__ . '/../../app/includes/footer.php';
?>