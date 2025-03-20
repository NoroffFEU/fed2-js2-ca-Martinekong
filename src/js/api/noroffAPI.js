import { BASE_URL } from "./constants.js";

export default class NoroffAPI {
  constructor(apiBase = `${BASE_URL}`) {
    this.apiBase = apiBase
  }

  auth = {
    login: async ({email, password}) => {
      try {
        //
      } catch {
        //
      }
    },

    register: async ({name, email, password}) => {
      try {
        //
      } catch {
        //
      }
    },

    logout: () => {
      try {
        //
      } catch {
        //
      }
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