/**
 * 🤵 AUTH CONTROLLER
 * * PURPOSE:
 * Handles User Login attempts.
 * * SCOPE:
 * - login(req, res):
 * 1. Get email/password from req.body.
 * 2. Ask userRepo for the user.
 * 3. Check if password matches.
 * 4. If Match: Return Success + User Data (JSON).
 * 5. If No Match: Return 401 Error.
 * * RELATION:
 * - Imports: 'src/repositories/user.repo.js'
 * - Imported by: 'src/routes/auth.routes.js'
 */
