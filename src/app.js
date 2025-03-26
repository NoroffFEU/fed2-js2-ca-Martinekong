function displayHeaderButtons(pathname = window.location.pathname) {
  console.log(`Pathname: ${pathname}`)

  const headerBtnContainer = document.getElementById("header-btns")
  const button = document.createElement("a")
  button.classList.add("btn", "primary-filled");

  switch (pathname) {
    case "/":
    case "/index.html":
      button.textContent = "Login";
      button.href = "/auth/login";
      headerBtnContainer.append(button);
      break;
    case "/auth/login/":
      button.textContent = "Register";
      button.href = "/auth/register";
      headerBtnContainer.append(button);
      setLogoPath("/")
      break;
    case "/auth/register/":
      button.textContent = "Login";
      button.href = "/auth/login";
      headerBtnContainer.append(button);
      setLogoPath("/")
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

displayHeaderButtons()