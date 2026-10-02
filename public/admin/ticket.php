<?php

require_once __DIR__ . '/../../app/includes/auth.php';
require_once __DIR__ . '/../../app/config/database.php';
require_once __DIR__ . '/../../app/functions/helpers.php';

requireAdmin();

$ticketId = filter_input(
    INPUT_GET,
    'id',
    FILTER_VALIDATE_INT
);

if (!$ticketId) {
    http_response_code(400);
    exit('Ongeldig ticketnummer.');
}

$allowedStatuses = [
    'Open',
    'Closed'
];

$allowedPriorities = [
    'Low',
    'Normal',
    'Urgent'
];

$errors = [];

$stmt = $pdo->prepare(
    'SELECT
        tickets.id,
        tickets.subject,
        tickets.description,
        tickets.category,
        tickets.status,
        tickets.priority,
        tickets.admin_note,
        tickets.created_at,
        tickets.updated_at,
        users.name AS employee_name,
        users.email AS employee_email
     FROM tickets
     INNER JOIN users
        ON tickets.user_id = users.id
     WHERE tickets.id = :ticket_id
     LIMIT 1'
);

$stmt->execute([
    'ticket_id' => $ticketId
]);

$ticket = $stmt->fetch();

if (!$ticket) {
    http_response_code(404);
    exit('Ticket niet gevonden.');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = $_POST['csrf_token'] ?? '';

    if (!verifyCsrfToken($csrfToken)) {
        $errors[] = 'Ongeldig verzoek. Probeer het opnieuw.';
    } else {
        $status = trim($_POST['status'] ?? '');
        $priority = trim($_POST['priority'] ?? '');
        $adminNote = trim($_POST['admin_note'] ?? '');

        if (!in_array($status, $allowedStatuses, true)) {
            $errors[] = 'Selecteer een geldige status.';
        }

        if (!in_array($priority, $allowedPriorities, true)) {
            $errors[] = 'Selecteer een geldige prioriteit.';
        }

        if (strlen($adminNote) > 2000) {
            $errors[] = 'Oplossing / notitie mag maximaal 2000 tekens bevatten.';
        }

        if (empty($errors)) {
            $updateStmt = $pdo->prepare(
                'UPDATE tickets
                 SET
                    status = :status,
                    priority = :priority,
                    admin_note = :admin_note
                 WHERE id = :ticket_id'
            );

            $updateStmt->execute([
                'status' => $status,
                'priority' => $priority,
                'admin_note' => $adminNote,
                'ticket_id' => $ticketId
            ]);

            header(
                'Location: '
                . BASE_URL
                . '/admin/dashboard.php?updated=1'
            );
            exit;
        }

        $ticket['status'] = $status;
        $ticket['priority'] = $priority;
        $ticket['admin_note'] = $adminNote;
    }
}

$csrfToken = generateCsrfToken();

$pageTitle = 'Ticket #' . (int) $ticket['id'] . ' beheren';

require_once __DIR__ . '/../../app/includes/header.php';
?>

<div class="page-header">

    <h1>
        Ticket #<?= (int) $ticket['id'] ?> beheren
    </h1>

    <p>
        Bekijk het probleem en werk de status,
        prioriteit en oplossing bij.
    </p>

</div>

<?php if (!empty($errors)): ?>

    <div class="alert alert-danger">

        <strong>
            De wijzigingen konden niet worden opgeslagen.
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

<div class="ticket-layout">

    <div>

        <section class="card">

            <h2 class="card-title">
                <?= escape($ticket['subject']) ?>
            </h2>

            <div class="detail-list">

                <div class="detail-item">

                    <span class="detail-label">
                        Medewerker
                    </span>

                    <strong>
                        <?= escape($ticket['employee_name']) ?>
                    </strong>

                    <br>

                    <?= escape($ticket['employee_email']) ?>

                </div>

                <div class="detail-item">

                    <span class="detail-label">
                        Categorie
                    </span>

                    <?= escape($ticket['category']) ?>

                </div>

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

    </div>

    <aside>

        <section class="card">

            <h2 class="card-title">
                Ticket beheren
            </h2>

            <form method="POST" action="">

                <input
                    type="hidden"
                    name="csrf_token"
                    value="<?= escape($csrfToken) ?>"
                >

                <div class="form-group">

                    <label for="status">
                        Status
                    </label>

                    <select
                        class="form-control"
                        id="status"
                        name="status"
                        required
                    >

                        <?php foreach ($allowedStatuses as $status): ?>

                            <option
                                value="<?= escape($status) ?>"
                                <?= $ticket['status'] === $status
                                    ? 'selected'
                                    : '' ?>
                            >
                                <?= escape($status) ?>
                            </option>

                        <?php endforeach; ?>

                    </select>

                </div>

                <div class="form-group">

                    <label for="priority">
                        Prioriteit
                    </label>

                    <select
                        class="form-control"
                        id="priority"
                        name="priority"
                        required
                    >

                        <?php foreach ($allowedPriorities as $priority): ?>

                            <option
                                value="<?= escape($priority) ?>"
                                <?= $ticket['priority'] === $priority
                                    ? 'selected'
                                    : '' ?>
                            >
                                <?= escape($priority) ?>
                            </option>

                        <?php endforeach; ?>

                    </select>

                </div>

                <div class="form-group">

                    <label for="admin_note">
                        Oplossing / notitie
                    </label>

                    <textarea
                        class="form-control"
                        id="admin_note"
                        name="admin_note"
                        maxlength="2000"
                        placeholder="Beschrijf de oplossing of voeg een notitie toe..."
                    ><?= escape($ticket['admin_note'] ?? '') ?></textarea>

                </div>

                <div class="form-actions">

                    <button
                        class="btn btn-primary"
                        type="submit"
                    >
                        Wijzigingen opslaan
                    </button>

                </div>

            </form>

        </section>

    </aside>

</div>

<div class="form-actions">

    <a
        href="<?= BASE_URL ?>/admin/dashboard.php"
        class="btn btn-outline"
    >
        ← Terug naar alle tickets
    </a>

</div>

<?php
require_once __DIR__ . '/../../app/includes/footer.php';
?>