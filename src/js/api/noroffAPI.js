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
        const successMessage = "Login success!";
        showMessage(successMessage, "success");

        setTimeout(() => {
          window.location.href = "/posts/feed.html";
        }, 2000);
        return data;
        
      } catch(error) {
        showMessage(error, "error");
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
        const successMessage = "Register success!";
        showMessage(successMessage, "success");

        setTimeout(() => {
          window.location.href = "/auth/login.html";
        }, 2000);
        return data;

      } catch(error) {
        showMessage(error, "error")
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
        showMessage(error, "error");
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
        showMessage(error, "error");
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
        showMessage(error, "error");
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
        showMessage(error, "error");
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
        showMessage(error, "error")
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
        const successMessage = "Post created successfully!";
        showMessage(successMessage, "success");

        setTimeout(() => {
          window.location.href = "/posts/feed.html";
        }, 2000);
        return data;

      } catch(error) {
        showMessage(error, "error");
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
          showMessage(successMessage, "success");
          setTimeout(() => {
            const user = getUsername()
            window.location.href = `/profile/index.html?user=${encodeURIComponent(user)}`;
          }, 2000);
          return;
        }
  
        throw new Error(`Failed to delete post with id ${id}`)

      } catch(error) {
        showMessage(error, "error");
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
        const successMessage = "Post updated successfully!";
        showMessage(successMessage, "success");

        setTimeout(() => {
          const user = getUsername()
          window.location.href = `/profile/index.html?user=${encodeURIComponent(user)}`;
        }, 2000);
        return data;

      } catch(error) {
        showMessage(error, "error");
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
        showMessage(error, "error");
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
        const successMessage = "Profile successfully updated!";
        showMessage(successMessage, "success");

        setTimeout(() => {
          const user = getUsername()
          window.location.href = `/profile/index.html?user=${encodeURIComponent(user)}`;
        }, 2000);
        return data;

      } catch(error) {
        showMessage(error, "error");
      }
    },

    follow: async (user) => {
      try {
        const response = await fetch(`${this.apiBase}/social/profiles/${user}/follow`, {
          headers: this.utils.setupHeaders(),
          method: "PUT"
        })

        const {data} = await this.utils.handleResponse(response);
        const successMessage = `You are now following: ${user}`;
        showMessage(successMessage, "success");
        return data;

      } catch(error) {
        showMessage(error, "error");
      }
    },

    unfollow: async (user) => {
      try {
        const response = await fetch(`${this.apiBase}/social/profiles/${user}/unfollow`, {
          headers: this.utils.setupHeaders(),
          method: "PUT"
        })

        const {data} = await this.utils.handleResponse(response);
        const successMessage = `You have unfollowed: ${user}`;
        showMessage(successMessage, "success")
        return data;

      } catch(error) {
        showMessage(error, "error");
      }
    },
  }
}