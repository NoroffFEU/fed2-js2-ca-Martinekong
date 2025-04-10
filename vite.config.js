import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  appType: "mpa",
  base: "/fed2-js2-ca-Martinekong/",
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "auth/login.html"),
        register: resolve(__dirname, "auth/register.html"),
        feed: resolve(__dirname, "posts/feed.html"),
        createPost: resolve(__dirname, "posts/create.html"),
        editPost: resolve(__dirname, "posts/edit.html"),
        profile: resolve(__dirname, "profile/index.html"),
        editProfile: resolve(__dirname, "profile/edit.html"),
      },
    },
  },
});