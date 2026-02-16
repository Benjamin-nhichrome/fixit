
# FixIT – Meldingen Systeem

FixIT is a web application where users can register, login and create repair tickets (meldingen).  
Admins can manage and update the status of tickets.

---

## Functionaliteiten

### Gebruiker
- Registreren (bcrypt password hashing)
- Inloggen (session based)
- Melding aanmaken
- Eigen meldingen bekijken
- Dashboard

### Admin
- Alle meldingen bekijken
- Status aanpassen
- Admin dashboard

---

## Security

- Password hashing (bcrypt)
- SQL injection protection (prepared statements)
- CSRF protection
- Session management
- Helmet security headers

---

## Technologieën

- Node.js
- Express
- MySQL
- EJS
- bcrypt
- express-session

---

## Installatie

1. Clone repository
2. Run:


npm install


3. Maak `.env` bestand:



DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fixit
SESSION_SECRET=yourSecret


4. Start server:



npm start


Server draait op:


http://localhost:3000


---

## Project structuur



src/
├── controllers/
├── models/
├── routes/
├── middleware/
├── views/
├── public/
├── db.js
└── app.js


---

## Auteur
Benjamin











# git add .
# git commit -m "feat(tickets): create ticket" 
# git push