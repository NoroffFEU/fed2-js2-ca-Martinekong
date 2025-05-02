import { API_KEY, BASE_URL } from "./constants.js";
import { getToken, getUsername, saveToken, saveUsername } from "./storage.js";
import { hideLoadingSpinner, showLoadingSpinner, showMessage } from "./userFeedback.js"

export default class NoroffAPI {
  constructor(apiBase = `${BASE_URL}`) {
    this.apiBase = apiBase
  }

  utils = {
    /**
     * Sets up the headers for an API request. All options are `true` as default.
     * @param {Object} [options={}] - The options for the headers.
     * @param {boolean} [options.auth=true] - Whether to include the authorization header.
     * @param {boolean} [options.apiKey=true] - Whether to include the API key header.
     * @param {boolean} [options.json=true] - Whether to include the `Content-Type : application/json` header.
     * @returns {Object} The header object to be used in the API request. 
     */
    setupHeaders: ({ auth = true, apiKey = true, json = true} = {}) => {
      const headers = {};
      if (json) headers["Content-Type"] = "application/json";
      if (auth) headers["Authorization"] = `Bearer ${getToken()}`;
      if (apiKey) headers["X-Noroff-API-Key"] = `${API_KEY}`;
      return headers;
    },

    /**
     * Handles the response on an API call. If the response is not okay, it will throw an error.
     * @async
     * @param {Response} response - The response object from the fetch API.
     * @returns {Promise<Object>} A promise that resolves to the parsed JSON data from the response.
     * @throws {Error} Throws an error if the response status is not ok. 
     */
    handleResponse: async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.errors?.[0]?.message || "Unknown error occured!";
        showMessage(errorMessage, "error");
        throw new Error(errorMessage);
      }
      return response.json();
    },

    /**
     * Redirects the user to another page after a delay.
     * @param {string} path - The path the user will be redirected to.
     * @param {number} delay - The number of milliseconds before the redirect.
     */
    redirectAfterTimeout: (path, delay) => {
      setTimeout(() => {
        window.location.href = path;
      }, delay);
    }
  }

  auth = {
    /**
     * Logs in a user with provided email and password.
     * Saves access token and username to localStorage on succes.
     * Redirects to feed page after successfull login. 
     * @param {Object} credentials - The login details.
     * @param {string} credentials.email - The user's email.
     * @param {string} credentials.password - the user's password.
     * @returns {Promise<Object | undefined>} The user data if successful, otherwise undefined.
     */
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

        this.utils.redirectAfterTimeout("./../posts/feed.html", 2000)

        return data;
        
      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      }
    },

    /**
     * Registers user with provided name, email and password.
     * Redirects to login page after successfull register.
     * @param {Object} credentials - The register details.
     * @param {string} credentials.name - The user's username.
     * @param {string} credentials.email - The user's email.
     * @param {string} credentials.password - The user's password.
     * @returns {Promise<Object | undefined>} The user data if successful, otherwise undefined.
     */
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

        this.utils.redirectAfterTimeout("./login.html", 2000)

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
    /**
     * Fetches all posts including author data and shows a loading spinner while loading.
     * @param {HTMLElement} container - The HTML element where the spinner is shown.
     * @returns {Promise<Object[] | undefined>} An array of post objects, or undefined on error.
     */
    viewAll: async (container) => {
      try {
        showLoadingSpinner(container)
        const response = await fetch(`${this.apiBase}/social/posts?_author=true`, {
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response);
        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      } finally {
        hideLoadingSpinner(container)
      }
    },

    /**
     * Fetches all posts from accounts that the user logged in is following.
     * Shows loading spinner while loading.
     * @param {HTMLElement} container  - The HTML element where the spinner is shown.
     * @returns {Promise<Object[] | undefined>} An array of post objects, or undefined on error.
     */
    viewFollowing: async (container) => {
      try {
        showLoadingSpinner(container)
        const response = await fetch(`${this.apiBase}/social/posts/following?_author=true`, {
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response);
        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      } finally {
        hideLoadingSpinner(container)
      }
    },

    /**
     * Fetches all of the users own posts, showing a loading spinner while loading. 
     * @param {HTMLElement} container - The HTML element where the spinner is shown. 
     * @returns {Promise<Object[] | undefined>} An array of post objects, or undefined on error.
     */
    viewOwn : async (container) => {
      const username = getUsername();
      try {
        showLoadingSpinner(container)
        const response = await fetch(`${this.apiBase}/social/profiles/${username}/posts?_author=true`, {
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response);
        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      } finally {
        hideLoadingSpinner(container)
      }
    },

    /**
     * Taking the query the user inputs in the search field, and searches through all posts from the API.
     * @param {string} query - The input from the search field
     * @returns {Promise<Object[] | undefined>} An array of post objects, or undefined on error.
     */
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
    /**
     * Gets a single post by its ID from the API, including author information.
     * @param {number} id - The ID of the post to get.
     * @returns {Promise<Object | undefined>} A post object, or undefined on error.
    */
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

    /**
     * Creates a new post by sending a POST request to the API. 
     * Redirects to feed page on success.
     * @param {Object} content - An object representing the post content. Requires `title`. Can optionally include `body`, `media.url` and `media.alt`.
     * @returns {Promise<Object | undefined>} The created post object, or undefined on error.
     */
    create: async (content) => {
      try {
        const response = await fetch(`${this.apiBase}/social/posts`, {
          headers: this.utils.setupHeaders(),
          method: "POST",
          body: JSON.stringify(content)
        })

        const { data } = await this.utils.handleResponse(response);
        showMessage("Post created successfully!", "success");

        this.utils.redirectAfterTimeout("./feed.html", 2000)

        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      }
    },

    /**
     * Deletes a post by ID from the API.
     * Redirects to profile page on success.
     * @param {number} id - The ID of the post to delete.
     * @returns {Promise<Void | undefined>} Resolves on success, or undefined on error.
     */
    delete: async (id) => {
      try {
        const response = await fetch(`${this.apiBase}/social/posts/${id}`, {
          headers: this.utils.setupHeaders({ json: false }),
          method: "DELETE"
        })

        if (response.ok) {
          showMessage("Post deleted successfully!", "success");
          const user = getUsername();
          this.utils.redirectAfterTimeout(`./../profile/index.html?user=${encodeURIComponent(user)}`, 2000)
          return;
        }

        showMessage(`Failed to delete post with id ${id}`, "error")
        throw new Error(`Failed to delete post with id ${id}`)

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      }
    },

    /**
     * Updates a post by ID in the API.
     * Redirects to profile on success.
     * @param {Object} updates - An object containing updated fields. Can include `title`, `body`, `media.url` or `media.alt`.
     * @param {number} id - The ID of the post to update
     * @returns {Promise<Object | undefined>} The updated post object, or undefined on error.
     */
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
        this.utils.redirectAfterTimeout(`./../profile/index.html?user=${encodeURIComponent(user)}`, 2000)
        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      }
    }
  }

  profile = {
    /**
     * Gets a profile by the users name. If the profile will be displayed, the function takes in a container to display loading spinner. 
     * @param {string} name - The user's name.
     * @param {HTMLElement} container - The HTML element where the spinner is shown.
     * @returns {Promise<Object | undefined>} the user object, or undefined on error. 
     */
    view: async (name, container = null) => {
      try {
        if (container) {
          showLoadingSpinner(container)
        }
        const response = await fetch(`${this.apiBase}/social/profiles/${name}?_followers=true&_following=true&_posts=true`, {
          headers: this.utils.setupHeaders({ json: false })
        })

        const { data } = await this.utils.handleResponse(response);
        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      } finally {
        if (container) {
          hideLoadingSpinner(container)
        }
      }
    },

    /**
     * Updates the logged in users profile.
     * @param {Object} updates - An object containing updated fields. Can include `bio`, `avatar.url` or `avatar.alt`.
     * @returns {Promise<Object | undefined>} The user object, or undefined on error.
     */
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
        this.utils.redirectAfterTimeout(`./index.html?user=${encodeURIComponent(user)}`, 2000)
        return data;

      } catch(error) {
        showMessage(error.message || "Something went wrong", "error");
      }
    },

    /**
     * Sends a request to follow the specified user.
     * @param {string} user  - The username of the user to follow.
     * @returns {Promise<Object | undefined>} The response data, or undefined on error.
     */
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

    /**
     * Sends a request to unfollow the specified user.
     * @param {string} user - The username of the user to unfollow.
     * @returns {Promise<Object | undefined>} The response data, or undefined on error.
     */
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