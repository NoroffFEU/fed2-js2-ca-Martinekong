import NoroffAPI from "../api/noroffAPI.js"

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

async function showFeedContent(posts) {
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
  authorImg.src = post.author.avatar.url;
  authorImg.alt = post.author.avatar.alt || `${post.author.name}'s avatar image`;
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

  container.append(postContainer)
}

function formatPostDate(dateToFormat) {
  const postDate = new Date(dateToFormat);
  const now = new Date();
  const diffInSeconds = Math.floor((now - postDate) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return "now";
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  if (diffInHours < 24) return `${diffInHours} hrs ago`;
  if (diffInDays === 1) return "1 day ago";
  
  return `${diffInDays} days ago`;
}