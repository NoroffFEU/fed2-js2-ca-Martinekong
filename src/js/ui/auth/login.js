import NoroffAPI from "../../api/noroffAPI.js"
const api = new NoroffAPI()

const loginForm = document.getElementById("login-form")

async function onLoginFormSubmit(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const formFields = Object.fromEntries(formData)

  api.auth.login(formFields)
}

loginForm.addEventListener("submit", onLoginFormSubmit)

// Todo:
// Show error overlay if not successfull (fix this in NoroffAPI.js)