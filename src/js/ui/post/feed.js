import NoroffAPI from "../../api/noroffAPI.js"
import { createPostThumbnail } from "../../utilities/utils.js"

const api = new NoroffAPI()

const posts = await api.allPosts.viewAll()
showFeedContent(posts)

const addPostBtn = document.getElementById("add-post-btn")
addPostBtn.addEventListener("click", () => {
  window.location.href = "/posts/create.html";
})

const allBtn = document.getElementById("all-btn")
const followingBtn = document.getElementById("following-btn")
const myPostsBtn = document.getElementById("my-posts-btn")

allBtn.addEventListener("click", async () => {
  const posts = await api.allPosts.viewAll()
  showFeedContent(posts)
})

followingBtn.addEventListener("click", async () => {
  const posts = await api.allPosts.viewFollowing()
  showFeedContent(posts)
})

myPostsBtn.addEventListener("click", async () => {
  const posts = await api.allPosts.viewOwn()
  showFeedContent(posts)
})

function showFeedContent(posts) {
  const displayContainer = document.getElementById("feed-container");
  displayContainer.innerHTML = "";

  if (posts.length === 0) {
    const message = document.createElement("p")
    message.style.padding = "2rem"
    message.textContent = "No posts match this filter"
    displayContainer.append(message)
    return;
  }

  posts.forEach((post) => {
    createPostThumbnail(displayContainer, post)
  })
}