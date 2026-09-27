# ServiceDesk Portaal FixIT

FixIT is een webgebaseerd servicedeskportaal waarmee medewerkers IT-problemen kunnen melden en beheerders supporttickets kunnen behandelen.

Dit project is ontwikkeld als onderdeel van mijn MBO Software Developer niveau 4 portfolio.

## Functionaliteiten

### Medewerker
- Inloggen met e-mailadres en wachtwoord
- Eigen tickets bekijken
- Nieuw supportticket aanmaken
- Onderwerp, omschrijving en categorie invoeren
- Status van een ticket bekijken
- Oplossing of notitie van de beheerder bekijken

### Beheerder
- Inloggen als beheerder
- Alle tickets bekijken
- Ticketstatus wijzigen
- Prioriteit instellen
- Oplossing of notitie toevoegen

## Technieken

- PHP 8
- MySQL
- PDO
- HTML
- CSS
- Flexbox
- CSS Grid
- PHP Sessions

## Beveiliging

De applicatie bevat onder andere:

- Wachtwoorden worden gehasht opgeslagen
- PDO prepared statements
- CSRF-beveiliging
- Output escaping tegen XSS
- Server-side validatie
- Autorisatie op basis van gebruikersrollen
- Medewerkers kunnen alleen hun eigen tickets bekijken

## Projectstructuur

```text
fixit/
├── app/
│   ├── config/
│   ├── functions/
│   └── includes/
├── database/
├── public/
│   ├── admin/
│   └── assets/
└── README.md