function displayHeaderButtons(pathname = window.location.pathname) {
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
      button.textContent = "Register";
      button.href = "/auth/register";
      button.classList.add("primary-filled")
      headerBtnContainer.append(button);
      setLogoPath("/")
      break;
    case "/auth/register/":
      button.textContent = "Login";
      button.href = "/auth/login";
      button.classList.add("primary-filled")
      headerBtnContainer.append(button);
      setLogoPath("/")
      break;
    case "/posts/":
      button.textContent = "Logout"
      button.href = "/"
      button.classList.add("secondary-border")
      headerBtnContainer.append(button)
      // Need to log out the user when this button is clicked
  }
}

function setLogoPath(path) {
  const logo = document.getElementById("logo");
  logo.style.cursor = "pointer"
  logo.addEventListener("click", () => {
    window.location.pathname = path
  })
}

displayHeaderButtons()