Här är en kort, konkret beskrivning av varje mapp och fil i scaffolden, så att vi kan se vad som hör ihop med vad:

---

### `src/`

Huvudkatalog för backend-kod.

- **`server.js`** – startar Node/Express-servern på vald port.
- **`app.js`** – definierar Express-applikationen, middleware och routes.

#### `routes/`

- **`rooms.routes.js`**, **`bookings.routes.js`**, **`auth.routes.js`** – mappar HTTP-adresser (URL) till controllers.

#### `controllers/`

- **`rooms.controller.js`**, **`bookings.controller.js`**, **`auth.controller.js`** – tar emot request från routes, skickar vidare till services och returnerar JSON.

#### `services/`

- **`room.service.js`**, **`booking.service.js`**, **`auth.service.js`**, **`rule.service.js`** – innehåller backend-logik och regler, beslutar om konflikter, roller och bokningar.

#### `repositories/`

- **`room.repo.js`**, **`booking.repo.js`**, **`user.repo.js`** – talar direkt med SQLite, kör SQL-frågor och returnerar rådata till services.

#### `db/`

- **`db.js`** – kopplar upp mot SQLite, exporterar databasobjekt.
- **`query.js`** – wrapper för async/await-anrop till SQLite (all, get, run).
- **`schema.sql`** – SQL-schema för att skapa tabeller och struktur i databasen.

#### `middleware/`

- **`auth.middleware.js`** – hanterar autentisering och roller innan request går vidare till controllers.

---

### `public/`

Frontend, körs i webbläsaren.

- **`index.html`**, **`bookings.html`** – sidor med strukturen och element för användargränssnittet.
- **`css/`** – innehåller stilmallar, t.ex. `styles.css`.
- **`js/`** – frontend-logik.

  - **`api/`** – fetch-anrop mot backend (`bookings.api.js`, `rooms.api.js`).
  - **`ui/`** – presentation och användarinteraktion (`calendar.ui.js`, `dashboard.ui.js`).
  - **`app.js`** – entry point för frontend, kopplar ihop UI och API.

---

### `edugrade.db`

SQLite-fil som lagrar alla data: användare, rum och bokningar.
