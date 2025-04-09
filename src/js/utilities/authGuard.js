import { getToken } from "../api/storage.js";

export function authGuard() {
  const token = getToken()

  if (!token) {
    alert("You must be logged in to view this page");
    window.location.href = "./auth/login.html";
  }
}