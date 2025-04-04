import { API_KEY, BASE_URL } from "./constants.js";
import { getToken, getUsername, saveToken, saveUsername } from "./storage.js";
import { showMessage } from "./userFeedback.js"

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
        const errorMessage = errorData?.errors?.[0]?.message || "Unknown error occured!";
        showMessage(errorMessage, "error");
        throw new Error(errorMessage);
      }
      return response.json();
    },

    redirectAfterTimeout: (path, delay) => {
      setTimeout(() => {
        window.location.href = path;
      }, delay);
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

        if (!email || !password) {
          showMessage("Email and password are required", "error");
          return;
        }

        const { data } = await this.utils.handleResponse(response);
        saveToken(data.accessToken)
        saveUsername(data.name)
        showMessage("Login success!", "success");

        this.utils.redirectAfterTimeout("/posts/feed.html", 2000)

        return data;
        
      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      }
    },

    register: async ({name, email, password}) => {
      try {
        const response = await fetch(`${this.apiBase}/auth/register`, {
          headers: this.utils.setupHeaders({ auth: false, apiKey: false}),
          method: "POST",
          body: JSON.stringify({name, email, password})
        })

        if (!name || !email || !password) {
          showMessage("Username, email and password are required", "error");
          return;
        }

        const { data } = await this.utils.handleResponse(response)
        showMessage("Register success!", "success");

        this.utils.redirectAfterTimeout("/auth/login.html", 2000)

        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      }
    },

    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    }
  }

  allPosts = {
    viewAll: async () => {
      try {
        const response = await fetch(`${this.apiBase}/social/posts?_author=true`, {
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response);
        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      }
    },

    viewFollowing: async () => {
      try {
        const response = await fetch(`${this.apiBase}/social/posts/following?_author=true`, {
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response);
        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      }
    },

    viewOwn : async () => {
      const username = getUsername();
      try {
        const response = await fetch(`${this.apiBase}/social/profiles/${username}/posts?_author=true`, {
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response);
        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      }
    },

    search : async (query) => {
      try {
        const response = await fetch(`${this.apiBase}/social/posts/search?q=${encodeURIComponent(query)}&_author=true`, {
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response);
        return data;
      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      }
    }
  }

  post = {
    view: async (id) => {
      try {
        const response = await fetch(`${this.apiBase}/social/posts/${id}?_author=true`, {
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response);
        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
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
        showMessage("Post created successfully!", "success");

        this.utils.redirectAfterTimeout("/posts/feed.html", 2000)

        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      }
    },

    delete: async (id) => {
      try {
        const response = await fetch(`${this.apiBase}/social/posts/${id}`, {
          headers: this.utils.setupHeaders({ json: false }),
          method: "DELETE"
        })

        if (response.ok) {
          showMessage("Post deleted successfully!", "success");
          const user = getUsername();
          this.utils.redirectAfterTimeout(`/profile/index.html?user=${encodeURIComponent(user)}`, 2000)
          return;
        }

        showMessage(`Failed to delete post with id ${id}`, "error")
        throw new Error(`Failed to delete post with id ${id}`)

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
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
        showMessage("Post updated successfully!", "success");

        const user = getUsername();
        this.utils.redirectAfterTimeout(`/profile/index.html?user=${encodeURIComponent(user)}`, 2000)
        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      }
    }
  }

  profile = {
    view: async (name) => {
      try {
        const response = await fetch(`${this.apiBase}/social/profiles/${name}?_followers=true&_following=true&_posts=true`, {
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response);
        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
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

        const { data } = await this.utils.handleResponse(response);
        showMessage("Profile updated successfully!", "success");

        const user = getUsername();
        this.utils.redirectAfterTimeout(`/profile/index.html?user=${encodeURIComponent(user)}`, 2000)
        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      }
    },

    follow: async (user) => {
      try {
        const response = await fetch(`${this.apiBase}/social/profiles/${user}/follow`, {
          headers: this.utils.setupHeaders(),
          method: "PUT"
        })

        const {data} = await this.utils.handleResponse(response);
        showMessage(`You are now following: ${user}`, "success");
        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      }
    },

    unfollow: async (user) => {
      try {
        const response = await fetch(`${this.apiBase}/social/profiles/${user}/unfollow`, {
          headers: this.utils.setupHeaders(),
          method: "PUT"
        })

        const {data} = await this.utils.handleResponse(response);
        showMessage(`You have unfollowed: ${user}`, "success")
        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      }
    },
  }
}