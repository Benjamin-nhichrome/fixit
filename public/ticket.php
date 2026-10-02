<?php

require_once __DIR__ . '/../app/includes/auth.php';
require_once __DIR__ . '/../app/config/database.php';
require_once __DIR__ . '/../app/functions/helpers.php';

requireLogin();

if (isAdmin()) {
    header('Location: ' . BASE_URL . '/admin/dashboard.php');
    exit;
}

$ticketId = filter_input(
    INPUT_GET,
    'id',
    FILTER_VALIDATE_INT
);

if (!$ticketId) {
    http_response_code(400);
    exit('Ongeldig ticketnummer.');
}

$stmt = $pdo->prepare(
    'SELECT
        id,
        subject,
        description,
        category,
        status,
        priority,
        admin_note,
        created_at,
        updated_at
     FROM tickets
     WHERE id = :ticket_id
       AND user_id = :user_id
     LIMIT 1'
);

$stmt->execute([
    'ticket_id' => $ticketId,
    'user_id' => $_SESSION['user']['id']
]);

$ticket = $stmt->fetch();

if (!$ticket) {
    http_response_code(404);
    exit('Ticket niet gevonden.');
}

$pageTitle = 'Ticket #' . (int) $ticket['id'];

require_once __DIR__ . '/../app/includes/header.php';
?>

<div class="page-header">

    <h1>
        Ticket #<?= (int) $ticket['id'] ?>
    </h1>

    <p>
        Bekijk de gegevens en actuele voortgang van je ticket.
    </p>

</div>

<div class="ticket-layout">

    <div>

        <section class="card">

            <h2 class="card-title">
                <?= escape($ticket['subject']) ?>
            </h2>

            <div class="detail-list">

                <div class="detail-item">

                    <span class="detail-label">
                        Omschrijving
                    </span>

                    <p>
                        <?= nl2br(
                            escape($ticket['description'])
                        ) ?>
                    </p>

                </div>

                <div class="detail-item">

                    <span class="detail-label">
                        Oplossing / notitie van beheerder
                    </span>

                    <?php if (!empty($ticket['admin_note'])): ?>

                        <p>
                            <?= nl2br(
                                escape($ticket['admin_note'])
                            ) ?>
                        </p>

                    <?php else: ?>

                        <p>
                            Er is nog geen oplossing of notitie
                            toegevoegd.
                        </p>

                    <?php endif; ?>

                </div>

            </div>

        </section>

    </div>

    <aside>

        <section class="card">

            <h2 class="card-title">
                Ticketinformatie
            </h2>

            <div class="detail-list">

                <div class="detail-item">

                    <span class="detail-label">
                        Status
                    </span>

                    <span
                        class="badge <?= getStatusBadgeClass(
                            $ticket['status']
                        ) ?>"
                    >
                        <?= escape($ticket['status']) ?>
                    </span>

                </div>

                <div class="detail-item">

                    <span class="detail-label">
                        Prioriteit
                    </span>

                    <span
                        class="badge <?= getPriorityBadgeClass(
                            $ticket['priority']
                        ) ?>"
                    >
                        <?= escape($ticket['priority']) ?>
                    </span>

                </div>

                <div class="detail-item">

                    <span class="detail-label">
                        Categorie
                    </span>

                    <?= escape($ticket['category']) ?>

                </div>

                <div class="detail-item">

                    <span class="detail-label">
                        Aangemaakt
                    </span>

                    <?= escape(
                        date(
                            'd-m-Y H:i',
                            strtotime($ticket['created_at'])
                        )
                    ) ?>

                </div>

                <div class="detail-item">

                    <span class="detail-label">
                        Laatst bijgewerkt
                    </span>

                    <?= escape(
                        date(
                            'd-m-Y H:i',
                            strtotime($ticket['updated_at'])
                        )
                    ) ?>

                </div>

            </div>

        </section>

    </aside>

</div>

<div class="form-actions">

    <a
        href="<?= BASE_URL ?>/dashboard.php"
        class="btn btn-outline"
    >
        ← Terug naar mijn tickets
    </a>

</div>

<?php
require_once __DIR__ . '/../app/includes/footer.php';
?>