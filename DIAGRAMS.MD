# App Sequence Diagram (Who talks to who?)

```mermaid
sequenceDiagram
    autonumber
    participant User as 👤 User
    participant Frontend as 🖥️ Frontend (public/js)
    participant Auth as 🛡️ Authentication (The Bouncer)
    participant AuthZ as 🔐 Authorization (The Gatekeeper)
    participant Controller as 🤵 Controller (The Waiter)
    participant Repo as 📚 Repository (The Librarian)
    participant DB as 💽 Database (SQLite)

    Note right of Auth: 🛡️ Bearer Token Auth: The Bouncer validates the token<br/>against the sessions table and attaches the user to the request.
    Note right of AuthZ: 🔐 Role Check: Ensures the authenticated user has the right role.<br/>Returns 403 Forbidden on insufficient permissions.

    Note over User, Frontend: Phase 1: The Order
    User->>Frontend: Clicks "Book Room"
    Frontend->>Frontend: Retrieves token from localStorage<br/>(Stored after successful login)
    Frontend->>Auth: POST /api/bookings Headers: { Authorization: "Bearer abc123..." }
    Frontend->>Auth: DELETE /api/auth/logout Headers: { Authorization: "Bearer abc123..." } // Added logout functionality
    Note over User, Frontend: Phase 2: Logout
    User->>Frontend: Clicks "Logout"

    Note over Auth, Controller: Phase 2: Authentication
    Auth->>DB: SELECT * FROM sessions WHERE token = "..." AND expires_at > NOW
    alt Invalid or Expired Token?
        Auth-->>Frontend: 401 Unauthorized ⛔
    else Valid Token
        Auth->>DB: SELECT * FROM users WHERE id = session.user_id
        Auth->>AuthZ: next() (User attached to req.user) ✅
    end

    Note over AuthZ, Controller: Phase 3: Authorization
    alt Role Allowed?
        AuthZ->>Controller: next() ✅
    else Insufficient Role
        AuthZ-->>Frontend: 403 Forbidden ⛔
    end

    Note over Controller, DB: Phase 4: Processing
    Controller->>Repo: createBooking(roomId, userId...)
    Repo->>DB: INSERT INTO bookings...
    DB-->>Repo: Success (Row ID: 42)
    Repo-->>Controller: Returns Result

    Note over Controller, User: Phase 5: Response
    Controller-->>Frontend: 201 Created (JSON)
    Frontend->>User: Alert("Booking Confirmed! 🎉")
    Frontend->>Frontend: Reloads Room List
```

# The Architecture Diagram (Physical Structure)

```mermaid
graph TD
    subgraph Client ["🍽️ Dining Room (Frontend)"]
        User((👤 User))
        Browser["🖥️ Browser / public/"]
        LS[("Token / localStorage")]
    end

    subgraph Server ["The Kitchen (Backend)"]
        App["⚙️ App.js / Server.js"]

        subgraph Logic ["The Staff"]
            MW["🛡️ Middleware"]
            AuthB["Authentication (Bouncer)"]
            Gate["Authorization (Gatekeeper)"]
            Route["📜 Routes"]
            Ctrl["🤵 Controllers"]
            Repo["📚 Repositories"]
            Utils["🧰 Utils"]
        end

        DB[("💽 SQLite Database")]
    end

    %% Connections
    User -- Clicks Button --> Browser
    Browser -- 1. Reads Token --> LS
    Browser -- 2. Sends HTTP Request with Bearer Token --> App

    App --> Route
    Route --> AuthB
    AuthB -- Validates Token in Sessions Table --> DB
    AuthB -- If Valid --> Gate
    Gate -- If Role Allowed --> Ctrl

    Ctrl -- Asks for Data --> Repo
    Repo -- SQL Query --> DB

    DB -- Raw Data --> Repo
    Repo -- Data --> Ctrl
    Ctrl -- JSON Response --> Browser
    Browser -- Updates UI --> User
```
