import { BASE_URL } from "./constants.js";
import { saveToken, saveUsername } from "./storage.js";

export default class NoroffAPI {
  constructor(apiBase = `${BASE_URL}`) {
    this.apiBase = apiBase
  }

  auth = {
    login: async ({email, password}) => {
      try {
        const response = await fetch(`${this.apiBase}/auth/login`, {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({email, password})
        })

        if (response.ok) {
          const { data } = await response.json()
          saveToken(data.accessToken)
          saveUsername(data.name)
          console.log(data)
          return data;
        }

        throw new Error(`Could not log in user`)
        
      } catch(error) {
        console.log(error)
      }
    },

    register: async ({name, email, password}) => {
      try {
        const response = await fetch(`${this.apiBase}/auth/register`, {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({name, email, password})
        })

        if (response.ok) {
          const { data } = await response.json()
          console.log(`Response: ${response}`)
          console.log(`Data: ${data}`)
        }

        throw new Error(`Could not register user`)

      } catch(error) {
        console.log(error)
      }
    },

    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      // Redirect to index.html (login page) - need if statements depending on the path
    }
  }

  allPosts = {
    view: async () => {
      try {
        //
      } catch {
        //
      }
    }
  }

  post = {
    view: async (id) => {
      try {
        //
      } catch {
        //
      }
    },

    create: async (title) => {
      try {
        //
      } catch {
        //
      }
    },

    delete: async (id) => {
      try {
        //
      } catch {
        //
      }
    },

    update: async (title, id) => {
      try {
        //
      } catch {
        //
      }
    }
  }

  profile = {
    view: async () => {
      try {
        //
      } catch {
        //
      }
    },

    update: async () => {
      try {
        //
      } catch {
        //
      }
    }
  }
}


const name = ``
const email = ``
const password = ``

const api = new NoroffAPI()

//api.auth.login({email, password})
//api.auth.register({name, email, password})
//api.auth.logout()