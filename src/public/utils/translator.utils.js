/**
 * TRANSLATOR UTILITY
 * * PURPOSE:
 * Translates error messages and API responses from English to Swedish.
 * Provides a centralized place for all translations to ensure consistency.
 *
 * * USAGE:
 * import { translateError, translateMessage } from './translator.utils.js';
 * const swedishError = translateError(englishErrorMessage);
 */

// Error message translations (English -> Swedish)
const ERROR_TRANSLATIONS = {
  // Authentication errors
  "Invalid credentials": "Felaktiga inloggningsuppgifter",
  "Email and password are required": "E-post och lösenord krävs",
  "Unauthorized": "Obehörig åtkomst",
  "Access denied": "Åtkomst nekad",
  "Access denied.": "Åtkomst nekad",
  "Token expired": "Session har gått ut",
  "Invalid token": "Ogiltig session",

  // User errors
  "User not found": "Användare hittades inte",
  "User with this email already exists": "En användare med denna e-postadress finns redan",
  "Missing or invalid userId": "Felaktigt eller saknat användar-ID",

  // Booking errors
  "This room is already booked for the selected time slot.": "Detta rum är redan bokat för den valda tiden",
  "This room is already booked for the selected time slot": "Detta rum är redan bokat för den valda tiden",
  "The new time slot conflicts with another booking.": "Den nya tiden krockar med en annan bokning",
  "The new time slot conflicts with another booking": "Den nya tiden krockar med en annan bokning",
  "Booking not found": "Bokningen hittades inte",
  "Could not update booking": "Kunde inte uppdatera bokningen",
  "No valid fields provided for update": "Inga giltiga fält att uppdatera",
  "Missing required fields": "Obligatoriska fält saknas",
  "Start time must be before end time": "Starttiden måste vara före sluttiden",
  "Booking time must be in the future": "Bokningstiden måste vara i framtiden",

  // Room errors
  "Room not found": "Rummet hittades inte",
  "Invalid room data": "Ogiltig rumsdata",

  // General errors
  "Internal server error": "Serverfel",
  "Bad request": "Felaktig förfrågan",
  "Not found": "Hittades inte",
  "Forbidden": "Förbjuden",
  "Network error": "Nätverksfel",
  "Failed to fetch": "Kunde inte hämta data",
  "Something went wrong": "Något gick fel",
  "Invalid input": "Ogiltig inmatning",
  "Missing required data": "Obligatorisk data saknas",
  "Operation failed": "Operationen misslyckades",
};

// Success message translations
const SUCCESS_TRANSLATIONS = {
  "Login successful": "Inloggning lyckades",
  "Logout successful": "Utloggning lyckades",
  "User created successfully": "Användare skapad",
  "User updated successfully": "Användare uppdaterad",
  "User deleted successfully": "Användare borttagen",
  "Booking created successfully": "Bokning skapad",
  "Booking updated successfully": "Bokning uppdaterad",
  "Booking cancelled successfully": "Bokning avbokad",
  "Room created successfully": "Rum skapat",
  "Room updated successfully": "Rum uppdaterat",
};

/**
 * Translates an error message from English to Swedish.
 * If no translation is found, returns the original message.
 *
 * @param {string} message - The error message to translate
 * @returns {string} The translated message or original if no translation exists
 */
export function translateError(message) {
  if (!message) return "Ett okänt fel uppstod";

  // Try exact match first
  if (ERROR_TRANSLATIONS[message]) {
    return ERROR_TRANSLATIONS[message];
  }

  // Try case-insensitive match
  const lowerMessage = message.toLowerCase();
  const matchingKey = Object.keys(ERROR_TRANSLATIONS).find(
    key => key.toLowerCase() === lowerMessage
  );

  if (matchingKey) {
    return ERROR_TRANSLATIONS[matchingKey];
  }

  // Try partial match (if message contains a known error)
  const partialMatch = Object.keys(ERROR_TRANSLATIONS).find(
    key => message.includes(key)
  );

  if (partialMatch) {
    return ERROR_TRANSLATIONS[partialMatch];
  }

  // Return original message if no translation found
  return message;
}

/**
 * Translates a success message from English to Swedish.
 * If no translation is found, returns the original message.
 *
 * @param {string} message - The success message to translate
 * @returns {string} The translated message or original if no translation exists
 */
export function translateSuccess(message) {
  if (!message) return message;

  return SUCCESS_TRANSLATIONS[message] || message;
}

/**
 * Generic message translator that tries both error and success dictionaries.
 *
 * @param {string} message - The message to translate
 * @returns {string} The translated message
 */
export function translateMessage(message) {
  return translateSuccess(message) !== message
    ? translateSuccess(message)
    : translateError(message);
}

/**
 * Translates HTTP status codes to user-friendly Swedish messages.
 *
 * @param {number} statusCode - HTTP status code
 * @returns {string} User-friendly Swedish error message
 */
export function translateStatusCode(statusCode) {
  const STATUS_MESSAGES = {
    400: "Felaktig förfrågan",
    401: "Du måste vara inloggad",
    403: "Du har inte behörighet för denna åtgärd",
    404: "Hittades inte",
    409: "Konflikt - resursen finns redan eller är upptagen",
    500: "Serverfel - försök igen senare",
    502: "Servern är tillfälligt otillgänglig",
    503: "Tjänsten är tillfälligt nere",
  };

  return STATUS_MESSAGES[statusCode] || `Fel (${statusCode})`;
}

