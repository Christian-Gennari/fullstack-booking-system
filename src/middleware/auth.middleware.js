/* The "Bouncer". It looks for a token in the request header, finds the user in the DB, and attaches the user to req.user. If no valid token, it blocks the request. */
