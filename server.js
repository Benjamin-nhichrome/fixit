// Laadt de variabelen uit het .env bestand, zoals PORT, DB_NAME en SESSION_SECRET.
require("dotenv").config();

// Importeert de volledige Express applicatie uit src/app.js.
const app = require("./src/app");

// Gebruikt de PORT uit .env. Als die niet bestaat, gebruikt de app standaard poort 3000.
const port = process.env.PORT || 3000;

// Start de server en toont in de terminal op welke localhost URL de app draait.
app.listen(port, () => {
  console.log(`FixIT running on http://localhost:${port}`);
});
