import NoroffAPI from "../api/noroffAPI.js"
import { addEditBtnToOwnPosts, formatPostDate } from "../utilities/utils.js"

const api = new NoroffAPI()

const posts = await api.allPosts.viewAll()
showFeedContent(posts)

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

function createPostThumbnail(container, post) {
  const postContainer = document.createElement("div")
  postContainer.classList.add("post-container")

  const postHeader = document.createElement("div");
  postHeader.classList.add("post-header")

  const authorInfo = document.createElement("div")
  authorInfo.classList.add("author-info")

  const authorImg = document.createElement("img")
  authorImg.style.cursor = "pointer"
  authorImg.src = post.author.avatar.url;
  authorImg.alt = post.author.avatar.alt || `${post.author.name}'s avatar image`;

  authorImg.addEventListener("click", () => {
    window.location.href = `/profile/index.html?user=${encodeURIComponent(post.author.name)}`
  })

  const authorName = document.createElement("p")
  authorName.textContent = post.author.name;

  authorInfo.append(authorImg, authorName)

  const postCreated = document.createElement("p")
  postCreated.textContent = formatPostDate(post.created)

  postHeader.append(authorInfo, postCreated)

  const postTitle = document.createElement("h2")
  postTitle.textContent = post.title

  postContainer.append(postHeader, postTitle)
  
  if (post.body) {
    const postBody = document.createElement("p")
    postBody.textContent = post.body
    postContainer.append(postBody)
  }

  if (post.media) {
    const postMedia = document.createElement("img");
    postMedia.classList.add("post-image")
    postMedia.src = post.media.url;
    postMedia.alt = post.media.alt;
    postContainer.append(postMedia)
  }

  const EditBtn = addEditBtnToOwnPosts(post);
  if (EditBtn) {
  postContainer.append(EditBtn);
  }

  container.append(postContainer)
}