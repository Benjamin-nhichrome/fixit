CREATE DATABASE IF NOT EXISTS fixit
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE fixit;

-- =========================
-- USERS
-- =========================

CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('employee', 'admin') NOT NULL DEFAULT 'employee',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TICKETS
-- =========================

CREATE TABLE tickets (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    subject VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category ENUM(
        'Hardware',
        'Software',
        'Account',
        'Netwerk',
        'Overig'
    ) NOT NULL,
    status ENUM('Open', 'Closed') NOT NULL DEFAULT 'Open',
    priority ENUM('Low', 'Normal', 'Urgent') NOT NULL DEFAULT 'Normal',
    admin_note TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_tickets_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- TEST USERS
-- =========================
-- Test accounts use bcrypt password hashes.

INSERT INTO users (name, email, password, role) VALUES
(
    'Test Employee',
    'employee@fixit.test',
    '$2y$10$xxm1gJge7fULaHcJRbK9u.BkI7iD1Vs1pkHpzlJNXwbCFF4WIVDOO',
    'employee'
),
(
    'Test Admin',
    'admin@fixit.test',
    '$2y$10$xxm1gJge7fULaHcJRbK9u.BkI7iD1Vs1pkHpzlJNXwbCFF4WIVDOO',
    'admin'
);