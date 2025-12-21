/**
 * 🤵 AUTH CONTROLLER
 * * PURPOSE:
 * Handles User Login attempts.
 * * SCOPE:
 * - login(req, res):
 * 1. Get email/password from req.body.
 * 2. Ask userRepo for the user.
 * 3. Check if password matches (using hash comparison).
 * 4. If Match: Generate a Session Token (via utils/security.js), save it to DB, and return the Token.
 * 5. If No Match: Return 401 Error.
 * * RELATION:
 * - Imports: 'src/repositories/user.repo.js', 'src/utils/security.js'
 * - Imported by: 'src/routes/auth.routes.js'
 */
