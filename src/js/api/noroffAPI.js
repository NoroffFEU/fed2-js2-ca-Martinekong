import { API_KEY, BASE_URL } from "./constants.js";
import { getToken, getUsername, saveToken, saveUsername } from "./storage.js";
import { showSuccessMessage} from "./userFeedback.js"

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
        // Create error overlay message
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
        const successMessage = "Login success!"
        showSuccessMessage(successMessage)

        setTimeout(() => {
          window.location.href = "/posts/feed.html";
        }, 2000);
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
        const successMessage = "Register success!"
        showSuccessMessage(successMessage)

        setTimeout(() => {
          window.location.href = "/auth/login.html";
        }, 2000);
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
        const response = await fetch(`${this.apiBase}/social/posts?_author=true`, {
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
        const response = await fetch(`${this.apiBase}/social/posts/following?_author=true`, {
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
        const response = await fetch(`${this.apiBase}/social/profiles/${username}/posts?_author=true`, {
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response)
        console.log(data);
        console.log(`Successfully fetched users posts`)
        return data;

      } catch(error) {
        console.log(error)
      }
    },

    search : async (query) => {
      try {
        const response = await fetch(`${this.apiBase}/social/posts/search?q=${encodeURIComponent(query)}&_author=true`, {
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response);
        console.log(data)
        console.log(`Successfully searched through the posts`)
        return data;
      } catch(error) {
        console.log(error)
      }
    }
  }

  post = {
    view: async (id) => {
      try {
        const response = await fetch(`${this.apiBase}/social/posts/${id}?_author=true`, {
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

    create: async (content) => {
      try {
        const response = await fetch(`${this.apiBase}/social/posts`, {
          headers: this.utils.setupHeaders(),
          method: "POST",
          body: JSON.stringify(content)
        })

        const { data } = await this.utils.handleResponse(response);
        const successMessage = "Post created successfully!"
        showSuccessMessage(successMessage)

        setTimeout(() => {
          window.location.href = "/posts/feed.html";
        }, 2000);
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
          const successMessage = "Post deleted successfully!";
          showSuccessMessage(successMessage);
          setTimeout(() => {
            const user = getUsername()
            window.location.href = `/profile/index.html?user=${encodeURIComponent(user)}`;
          }, 2000);
          return;
        }
  
        throw new Error(`Failed to delete post with id ${id}`)

      } catch(error) {
        console.log(error)
      }
    },

    update: async (updates, id) => {
      try {
        const response = await fetch(`${this.apiBase}/social/posts/${id}`, {
          headers: this.utils.setupHeaders(),
          method: "PUT", 
          body: JSON.stringify(updates)
        })

        const { data } = await this.utils.handleResponse(response);
        const successMessage = "Post updated successfully"
        showSuccessMessage(successMessage)

        setTimeout(() => {
          const user = getUsername()
          window.location.href = `/profile/index.html?user=${encodeURIComponent(user)}`;
        }, 2000);
        return data;

      } catch(error) {
        console.log(error)
      }
    }
  }

  profile = {
    view: async (name) => {
      try {
        const response = await fetch(`${this.apiBase}/social/profiles/${name}?_followers=true&_following=true&_posts=true`, {
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response)
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
        const successMessage = "Successfully updated the users profile";
        showSuccessMessage(successMessage)

        setTimeout(() => {
          const user = getUsername()
          window.location.href = `/profile/index.html?user=${encodeURIComponent(user)}`;
        }, 2000);
        return data;

      } catch(error) {
        console.log(error)
      }
    },

    follow: async (user) => {
      try {
        const response = await fetch(`${this.apiBase}/social/profiles/${user}/follow`, {
          headers: this.utils.setupHeaders(),
          method: "PUT"
        })

        const {data} = await this.utils.handleResponse(response)
        const successMessage = `You are now following: ${user}`;
        showSuccessMessage(successMessage)
        return data;

      } catch(error) {
        console.log(error)
      }
    },

    unfollow: async (user) => {
      try {
        const response = await fetch(`${this.apiBase}/social/profiles/${user}/unfollow`, {
          headers: this.utils.setupHeaders(),
          method: "PUT"
        })

        const {data} = await this.utils.handleResponse(response)
        const successMessage = `You have unfollowed: ${user}`;
        showSuccessMessage(successMessage)
        return data;

      } catch(error) {
        console.log(error)
      }
    },
  }
}