import { API_KEY, BASE_URL } from "./constants.js";
import { getToken, getUsername, saveToken, saveUsername } from "./storage.js";

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
        const response = await fetch(`${this.apiBase}/social/posts`, {
          headers: {
            "Authorization": `Bearer ${getToken()}`,
            "X-Noroff-API-Key": `${API_KEY}`
          }
        })

        if (response.ok) {
          const { data } = await response.json()
          console.log(data)
          return data;
        }

        throw new Error(`Failed to get all posts`)

      } catch(error) {
        console.log(error)
      }
    }
  }

  post = {
    view: async (id) => {
      try {
        const response = await fetch(`${this.apiBase}/social/posts/${id}`, {
          headers: {
            "Authorization": `Bearer ${getToken()}`,
            "X-Noroff-API-Key": `${API_KEY}`
          }
        })

        if (response.ok) {
          const { data } = await response.json()
          console.log(data)
          return data;
        }

        throw new Error(`Failed to get the post with id ${id}`)

      } catch(error) {
        console.log(error)
      }
    },

    create: async (title) => {
      const newPost = { title: title }
      try {
        const response = await fetch(`${this.apiBase}/social/posts`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
            "X-Noroff-API-Key": `${API_KEY}`
          },
          method: "POST",
          body: JSON.stringify(newPost)
        })

        if (response.ok) {
          const { data } = await response.json()
          console.log(data)
          return data;
        }
  
        throw new Error(`Failed to create post with the title: ${title}`)

      } catch(error) {
        console.log(error)
      }
    },

    delete: async (id) => {
      try {
        const response = await fetch(`${this.apiBase}/social/posts/${id}`, {
          headers: {
            "Authorization": `Bearer ${getToken()}`,
            "X-Noroff-API-Key": `${API_KEY}`
          },
          method: "DELETE"
        })

        if (response.ok) {
          console.log(response)
          console.log(`Post deleted successfully`)
          return;
        }
  
        throw new Error(`Failed to delete post with id ${id}`)

      } catch(error) {
        console.log(error)
      }
    },

    update: async (title, id) => {
      const updatedPost = { title: title }
      try {
        const response = await fetch(`${this.apiBase}/social/posts/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
            "X-Noroff-API-Key": `${API_KEY}`
          },
          method: "PUT", 
          body: JSON.stringify(updatedPost)
        })

        if (response.ok) {
          const { data } = await response.json();
          console.log(data)
          return data;
        }
  
        throw new Error(`Failed to update post`)

      } catch(error) {
        console.log(error)
      }
    }
  }

  profile = {
    view: async () => {
      const name = getUsername()
      try {
        const response = await fetch(`${this.apiBase}/social/profiles/${name}`, {
          headers: {
            "Authorization": `Bearer ${getToken()}`,
            "X-Noroff-API-Key": `${API_KEY}`
          }
        })

        if (response.ok) {
          const { data } = await response.json()
          console.log(data)
          return data;
        }

        throw new Error(`Failed to get the profile of ${name}`)
      } catch(error) {
        console.log(error)
      }
    },

    update: async (updates) => {
      const name = getUsername()
      try {
        const response = await fetch(`${this.apiBase}/social/profiles/${name}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
            "X-Noroff-API-Key": `${API_KEY}`
          },
          method: "PUT",
          body: JSON.stringify(updates)
        })

        if (response.ok) {
          const { data } = await response.json()
          console.log(data)
          return data;
        }

        throw new Error(`Failed to update the profile of ${name}`)
      } catch(error) {
        console.log(error)
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

//api.allPosts.view()

//api.post.view("8072")
//api.post.create("hello world!") //created successfully, id: 8083
//api.post.delete("8083") // deleted successfully, id: 8083
//api.post.create("hello world!") //created successfully, id:8085
//api.post.update("updated hello world!", "8085") //updated successfully, id: 8085

// const profile = await api.profile.view()
// console.log(profile.name)
// console.log(profile._count.posts)
// console.log(profile._count.followers)

//api.profile.update({
//  bio: "Student"
//})