import NoroffAPI from "../../api/noroffAPI.js"
import { createPostThumbnail } from "../../utilities/utils.js"

const api = new NoroffAPI()

const posts = await api.allPosts.viewAll()
showFeedContent(posts)

const addPostBtn = document.getElementById("add-post-btn")
addPostBtn.addEventListener("click", () => {
  window.location.href = "/posts/create.html";
})

const allBtn = document.getElementById("all-btn");
const followingBtn = document.getElementById("following-btn");
const myPostsBtn = document.getElementById("my-posts-btn");

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
  const posts = await api.allPosts.viewAll();
  showFeedContent(posts);
  setActiveButton(allBtn);
});

followingBtn.addEventListener("click", async () => {
  const posts = await api.allPosts.viewFollowing();
  showFeedContent(posts);
  setActiveButton(followingBtn);
});

myPostsBtn.addEventListener("click", async () => {
  const posts = await api.allPosts.viewOwn();
  showFeedContent(posts);
  setActiveButton(myPostsBtn);
});

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