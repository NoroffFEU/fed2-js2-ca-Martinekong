import NoroffAPI from "../../api/noroffAPI.js"
const api = new NoroffAPI()

const loginForm = document.getElementById("register-form")

async function onRegisterFormSubmit(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const formFields = Object.fromEntries(formData)

  api.auth.register(formFields)
}

loginForm.addEventListener("submit", onRegisterFormSubmit)