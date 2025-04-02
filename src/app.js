import NoroffAPI from "./js/api/noroffAPI.js";
import { getUsername } from "./js/api/storage.js";

const api = new NoroffAPI();

async function displayHeaderButtons(pathname = window.location.pathname) {
  console.log(`Pathname: ${pathname}`)

  const headerBtnContainer = document.getElementById("header-btns")
  const button = document.createElement("a")
  button.classList.add("btn");

  switch (pathname) {
    case "/":
    case "/index.html":
      button.textContent = "Login";
      button.href = "/auth/login";
      button.classList.add("primary-filled")
      headerBtnContainer.append(button);
      break;
    case "/auth/login/":
    case "/auth/login/index.html":
      button.textContent = "Register";
      button.href = "/auth/register";
      button.classList.add("primary-filled")
      headerBtnContainer.append(button);
      setLogoPath("/")
      break;
    case "/auth/register/":
    case "/auth/register/index.html":
      button.textContent = "Login";
      button.href = "/auth/login";
      button.classList.add("primary-filled")
      headerBtnContainer.append(button);
      setLogoPath("/")
      break;
    case "/posts/":
    case "/posts/index.html":
      button.textContent = "Logout"
      button.href = "/"
      button.classList.add("secondary-border")
      headerBtnContainer.append(await createProfileBtn(), button)
      button.addEventListener("click", () => {
        api.auth.logout()
      })
      break;
    case "/profile/index.html":
      button.textContent = "Logout"
      button.href = "/"
      button.classList.add("secondary-border")
      headerBtnContainer.append(await createProfileBtn(), button)
      button.addEventListener("click", () => {
        api.auth.logout()
      })
      setLogoPath("/posts/")
      break;
    case "/profile/edit.html":
      button.textContent = "Logout"
      button.href = "/"
      button.classList.add("secondary-border")
      headerBtnContainer.append(await createProfileBtn(), button)
      button.addEventListener("click", () => {
        api.auth.logout()
      })
      setLogoPath("/posts/")
      break;
    case "/posts/edit/":
    case "/posts/edit/index.html/":
      button.textContent = "Logout"
      button.href = "/"
      button.classList.add("secondary-border")
      headerBtnContainer.append(await createProfileBtn(), button)
      button.addEventListener("click", () => {
        api.auth.logout()
      })
      setLogoPath("/posts/")
      break;
  }
}

function setLogoPath(path) {
  const logo = document.getElementById("logo");
  logo.style.cursor = "pointer"
  logo.addEventListener("click", () => {
    window.location.pathname = path
  })
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

