import NoroffAPI from "../../api/noroffAPI.js"
import { createPostThumbnail } from "../../utilities/utils.js"

const api = new NoroffAPI()
const displayContainer = document.getElementById("feed-container");

const posts = await api.allPosts.viewAll(displayContainer)
showFeedContent(posts)

const addPostBtn = document.getElementById("add-post-btn")
const allBtn = document.getElementById("all-btn");
const followingBtn = document.getElementById("following-btn");
const myPostsBtn = document.getElementById("my-posts-btn");
const searchInput = document.getElementById("search");

addPostBtn.addEventListener("click", () => {
  window.location.href = "/posts/create.html";
})

function setActiveButton(activeButton) {
  const buttons = [allBtn, followingBtn, myPostsBtn];

  buttons.forEach(button => {
    button.classList.remove("primary-filled");
    button.classList.add("primary-border");
  });

  activeButton.classList.remove("primary-border");
  activeButton.classList.add("primary-filled");
}

allBtn.addEventListener("click", async () => {
  const posts = await api.allPosts.viewAll(displayContainer);
  showFeedContent(posts);
  setActiveButton(allBtn);
});

followingBtn.addEventListener("click", async () => {
  const posts = await api.allPosts.viewFollowing(displayContainer);
  showFeedContent(posts);
  setActiveButton(followingBtn);
});

myPostsBtn.addEventListener("click", async () => {
  const posts = await api.allPosts.viewOwn(displayContainer);
  showFeedContent(posts);
  setActiveButton(myPostsBtn);
});

searchInput.addEventListener("input", async (event) => {
  const query = event.target.value.trim();

  if (query.length > 0) {
    const posts = await api.allPosts.search(query)
    showFeedContent(posts)
    setActiveButton(allBtn)
  }
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