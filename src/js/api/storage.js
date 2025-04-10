const TOKEN_KEY = "token"
const USERNAME_KEY = "username"

/**
 * Saves the user's access token in localStorage.
 * @param {string} token - The user's access token.
 */
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Retrieves the user's access token from localStorage.
 * @returns {string | null} The user's access token, or null if not found.
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Saves the user's username in localStorage.
 * @param {string} username - The user's username.
 */
export function saveUsername(username) {
  localStorage.setItem(USERNAME_KEY, username);
}

/**
 * Retrieves the user's username from localStorage.
 * @returns {string | null} The user's username, or null if not found.
 */
export function getUsername() {
  return localStorage.getItem(USERNAME_KEY);
}