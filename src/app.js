import NoroffAPI from "./js/api/noroffAPI.js";
import { getUsername } from "./js/api/storage.js";

const api = new NoroffAPI();

async function displayHeaderButtons(pathname = window.location.pathname) {
  console.log(`Pathname: ${pathname}`)

  const headerBtnContainer = document.getElementById("header-btns")

  switch (pathname) {
    case "/":
    case "/index.html":
    case "/auth/register.html":
      setLogoPath("/")
      createPathButton("Login", "/auth/login.html");
      break;
    case "/auth/login.html":
      setLogoPath("/")
      createPathButton("Register", "/auth/register.html")
      break;
    case "/posts/feed.html":
    case "/posts/create.html":
    case "/posts/edit.html":
    case "/profile/index.html":
    case "/profile/edit.html":
      setLogoPath("/posts/feed.html")
      const logoutBtn = createPathButton("Logout", "/", "secondary-border");
      headerBtnContainer.prepend(await createProfileBtn());
      logoutBtn.addEventListener("click", () => api.auth.logout());
      break;
  }
}

function setLogoPath(path) {
  const logo = document.getElementById("logo");
  logo.style.cursor = "pointer";
  logo.addEventListener("click", () => { window.location.pathname = path });
}

function createPathButton(text, href, className = "primary-filled") {
  const headerBtnContainer = document.getElementById("header-btns");
  if (!headerBtnContainer) return;

  const button = document.createElement("a");
  button.classList.add("btn", className);
  button.textContent = text;
  button.href = href;

  headerBtnContainer.append(button);
  return button;
}

async function createProfileBtn() {
  const profileBtn = document.createElement("img")
  profileBtn.classList.add("profile-btn")

  const user = getUsername()
  const profile = await api.profile.view(user)

  profileBtn.src = profile.avatar.url;
  profileBtn.alt = profile.avatar.alt || `${profile.name}'s avatar image`;
  profileBtn.style.cursor = "pointer"

  profileBtn.addEventListener("click", () => {
    window.location.href = `/profile/index.html?user=${encodeURIComponent(profile.name)}`;
  })

  return profileBtn;
}

displayHeaderButtons()