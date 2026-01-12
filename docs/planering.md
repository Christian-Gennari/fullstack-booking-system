# Edugrade Booking System

## Grundbehovet

### Vad ska appen lösa?

- Se vilka salar som finns
- Se när de är lediga eller upptagna
- Boka en sal ett visst tidsintervall
- Undvika dubbelbokningar (Strikt validering i backend)
- Kunna ändra eller avboka
- Kunna logga in/ut med tokenbaserade sessioner (via Cookies)

## Användartyper

#### Elever

- Se tillgänglighet
- Göra bokningar
- Se sina egna bokningar

#### Lärare

- Allt ovan
- Möjligen boka återkommande tider
- Prioritet över elever

#### Admin, till exempel skoladministration

- Skapa och redigera salar
- Ta bort bokningar
- Se alla bokningar
- Sätta regler
- Hantera användare och roller

## Sal-information

- Namn eller nummer
- Typ:
  - Klassrum
  - Datasal,
  - Labb
- Kapacitet
- Utrustning:
  - Projektor
  - Datorer
  - Whiteboard
- Plats, hus eller våning

## Regler och logik

- Får elever boka på kvällstid?
- Får man boka mer än X timmar per vecka?
- **Vad händer vid krock?** Backend gör en "Overlap Check" (StartA < EndB && EndA > StartB). Om krock uppstår returneras **409 Conflict** och bokningen nekas.
- Vem vinner vid konflikt, elev vs lärare?
- Hur långt i förväg får man boka?
- Rollen styr via `authorization.middleware.js` (student, teacher, admin)

## UI och UX

Hur ska det kännas att använda?

- Veckovy eller dagvy, kalender
- Färgkodning per sal eller bokningstyp
- Snabb överblick
- Mobilvänlighet

Konkreta vyer:

- Inloggningsskärm
- Startsida med “vad är ledigt just nu?”
- Kalendervy per sal
- Min sida med mina bokningar (Via Modal/Dashboard)

## Architecture

### Data models

#### User

user_id  
user_pw  
user_class

#### Rooms

room_number  
room_assets

#### Bookings

room_number  
user_id
start_time
end_time

#### Roles/Permission

role (text): 'student' | 'teacher' | 'admin'

Behörighetsmatris (MVP):

- student: Se rum, göra egna bokningar, se egna bokningar
- teacher: Allt som student + skapa/uppdatera rum (administrativt), hantera fler bokningar vid behov
- admin: Full behörighet – hantera användare, radera rum, radera bokningar

### Assets

Edugrade logo

## Tech stack

### Frontend

Javascript  
CSS
Native HTML5 Dialog (Modaler)

### Backend

Javascript
Node.js
Express

### Databas

SQL (SQLite)

### Auth & Security

**Strict Cookie Authentication**

- **Enbart Cookies**: Vi använder strikt `HttpOnly` Cookies (`auth_token`). Detta gör applikationen säkrare mot XSS (JavaScript kan inte läsa token).
- **Ingen Header-hantering**: Frontend behöver inte manuellt sätta headers. Webbläsaren skickar automatiskt med cookien via `credentials: 'include'`.
- `cookieParser.middleware.js`: Hanterar inkommande cookies på servern.

**Role-Based Authorization**

- Separat middleware för roller: `authorization.middleware.js`
- **Server-Side Protection**: Statiska filer för `/student`, `/teacher`, och `/admin` skyddas direkt i `app.js` innan de levereras.
- 401 = Saknar token (Redirect till /login om det är en sidvisning).
- 403 = Inloggad men saknar behörighet (Försöker en elev nå /admin).

Praktisk tillämpning (MVP):

- Users: Endast admin får lista/hämta/skapa användare
- Rooms: GET kräver inloggning; POST/PUT kräver teacher eller admin; DELETE kräver admin
- Bookings: Alla inloggade får skapa bokningar. Backend validerar att tiden är ledig.

## MVP

- Ingen återkommande bokning i MVP
- Ingen avancerad prioriteringslogik i MVP
- En typ av inloggning i början
- En vy för bokning