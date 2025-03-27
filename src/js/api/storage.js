const TOKEN_KEY = "token"
const USERNAME_KEY = "username"

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveUsername(username) {
  localStorage.setItem(USERNAME_KEY, username)
}

export function getUsername() {
  return localStorage.getItem(USERNAME_KEY)
}