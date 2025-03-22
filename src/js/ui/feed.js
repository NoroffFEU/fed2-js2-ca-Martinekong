import NoroffAPI from "../api/noroffAPI.js"

const api = new NoroffAPI()

// Refactor this so that all posts are displayed as default when the user goes to their feed

// Now this code is linked to index.html - need to:
// 1. Remove btns from index, and move them to feed.html
// 2. Export this functionality/the eventListeners to app.js (router)

const allBtn = document.getElementById("all-posts")
const followingBtn = document.getElementById("following-posts")
const ownBtn = document.getElementById("own-posts")

allBtn.addEventListener("click", async () => {
  const posts = await api.allPosts.viewAll()
  showFeedContent(posts)
})

followingBtn.addEventListener("click", async () => {
  const posts = await api.allPosts.viewFollowing()
  showFeedContent(posts)
})

ownBtn.addEventListener("click", async () => {
  const posts = await api.allPosts.viewOwn()
  showFeedContent(posts)
})

async function showFeedContent(posts) {
  const displayContainer = document.getElementById("feed-container");
  displayContainer.innerHTML = "";

  if (posts.length === 0) {
    const message = document.createElement("p")
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

  const postTitle = document.createElement("h2")
  postTitle.textContent = post.title

  const postCreated = document.createElement("p")
  postCreated.textContent = formatPostDate(post.created)

  postContainer.append(postTitle, postCreated)
  
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