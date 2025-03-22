import { API_KEY, BASE_URL } from "./constants.js";
import { getToken, getUsername, saveToken, saveUsername } from "./storage.js";

export default class NoroffAPI {
  constructor(apiBase = `${BASE_URL}`) {
    this.apiBase = apiBase
  }

  utils = {
    setupHeaders: ({ auth = true, apiKey = true, json = true} = {}) => {
      const headers = {};
      if (json) headers["Content-Type"] = "application/json";
      if (auth) headers["Authorization"] = `Bearer ${getToken()}`;
      if (apiKey) headers["X-Noroff-API-Key"] = `${API_KEY}`;
      return headers;
    },

    handleResponse: async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.errors?.[0]?.message || "Unknown error occurred");
      }
      return response.json()
    }
  }

  auth = {
    login: async ({email, password}) => {
      try {
        const response = await fetch(`${this.apiBase}/auth/login`, {
          headers: this.utils.setupHeaders({ auth: false, apiKey: false }),
          method: "POST",
          body: JSON.stringify({email, password})
        })

        const { data } = await this.utils.handleResponse(response);
        saveToken(data.accessToken)
        saveUsername(data.name)
        console.log(data)
        console.log(`User successfully logged in`)
        return data;
        
      } catch(error) {
        console.log(error)
      }
    },

    register: async ({name, email, password}) => {
      try {
        const response = await fetch(`${this.apiBase}/auth/register`, {
          headers: this.utils.setupHeaders({ auth: false, apiKey: false}),
          method: "POST",
          body: JSON.stringify({name, email, password})
        })

        const { data } = await this.utils.handleResponse(response)
        console.log(`User registered successfully`)
        return data;

      } catch(error) {
        console.log(error)
      }
    },

    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      console.log(`User successfully logged out`)
      // Redirect to index.html (login page) - need if statements depending on the path
    }
  }

  allPosts = {
    viewAll: async () => {
      try {
        const response = await fetch(`${this.apiBase}/social/posts`, {
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response)
        console.log(data);
        console.log(`Successfully fetched all posts`)
        return data;

      } catch(error) {
        console.log(error)
      }
    },

    viewFollowing: async () => {
      try {
        const response = await fetch(`${this.apiBase}/social/posts/following`, {
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response)
        console.log(data);
        console.log(`Successfully fetched posts by following`)
        return data;

      } catch(error) {
        console.log(error)
      }
    },

    viewOwn : async () => {
      const username = getUsername()
      try {
        const response = await fetch(`${this.apiBase}/social/profiles/${username}/posts`, {
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response)
        console.log(data);
        console.log(`Successfully fetched users posts`)
        return data;

      } catch(error) {
        console.log(error)
      }
    }
  }

  post = {
    view: async (id) => {
      try {
        const response = await fetch(`${this.apiBase}/social/posts/${id}`, {
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response)
        console.log(data)
        console.log(`Successfully got a single post by its id`)
        return data;

      } catch(error) {
        console.log(error)
      }
    },

    create: async (title) => {
      const newPost = { title: title }
      try {
        const response = await fetch(`${this.apiBase}/social/posts`, {
          headers: this.utils.setupHeaders(),
          method: "POST",
          body: JSON.stringify(newPost)
        })

        const { data } = await this.utils.handleResponse(response);
        console.log(data)
        console.log(`Successfully created a post with the title: ${title}`)
        return data;

      } catch(error) {
        console.log(error)
      }
    },

    delete: async (id) => {
      try {
        const response = await fetch(`${this.apiBase}/social/posts/${id}`, {
          headers: this.utils.setupHeaders({ json: false }),
          method: "DELETE"
        })

        if (response.ok) {
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
          headers: this.utils.setupHeaders(),
          method: "PUT", 
          body: JSON.stringify(updatedPost)
        })

        const { data } = await this.utils.handleResponse(response);
        console.log(data)
        console.log(`Post updated successfully`)
        return data;

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
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response)
        console.log(data)
        console.log(`Successfully viewed the users profile`)
        return data;

      } catch(error) {
        console.log(error)
      }
    },

    update: async (updates) => {
      const name = getUsername()
      try {
        const response = await fetch(`${this.apiBase}/social/profiles/${name}`, {
          headers: this.utils.setupHeaders(),
          method: "PUT",
          body: JSON.stringify(updates)
        })

        const { data } = await this.utils.handleResponse(response)
        console.log(data)
        console.log(`Successfully updated the users profile`)
        return data;

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
//api.post.update("updated hello world!", "8085") //updated successfully, id: 8085

//const profile = await api.profile.view()
//console.log(profile.name)
// console.log(profile._count.posts)
// console.log(profile._count.followers)

// api.profile.update({
//  bio: "Student at Noroff"
// })