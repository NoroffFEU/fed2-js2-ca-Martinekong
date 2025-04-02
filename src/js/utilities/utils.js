import NoroffAPI from "../api/noroffAPI.js";
import { getUsername } from "../api/storage.js";

export function createPostThumbnail(container, post, user) {
  const postContainer = document.createElement("div");
  postContainer.classList.add("post-container");
  postContainer.style.cursor = "pointer";

  const postHeader = document.createElement("div");
  postHeader.classList.add("post-header");

  const authorInfo = document.createElement("div");
  authorInfo.classList.add("author-info");

  let postOwner = post.author || user;

  const authorImg = document.createElement("img");
  authorImg.style.cursor = "pointer";
  authorImg.src = postOwner?.avatar?.url;
  authorImg.alt = postOwner?.avatar?.alt || `${postOwner?.name}`;

  authorImg.addEventListener("click", (event) => {
    event.stopPropagation();
    window.location.href = `/profile/index.html?user=${encodeURIComponent(postOwner.name)}`;
  });

  const authorName = document.createElement("p");
  authorName.textContent = postOwner?.name || "Unknown";

  authorInfo.append(authorImg, authorName);

  const postCreated = document.createElement("p");
  postCreated.textContent = formatPostDate(post.created);

  postHeader.append(authorInfo, postCreated);

  const postTitle = document.createElement("h2");
  postTitle.textContent = post.title;

  postContainer.append(postHeader, postTitle);

  if (post.body) {
    const postBody = document.createElement("p");
    postBody.textContent = post.body;
    postContainer.append(postBody);
  }

  if (post.media?.url) {
    const postMedia = document.createElement("img");
    postMedia.classList.add("post-image");
    postMedia.src = post.media.url;
    postMedia.alt = post.media.alt || "Post image";
    postContainer.append(postMedia);
  }

  const editBtn = addEditBtnToOwnPosts(post);
  if (editBtn) {
    postContainer.append(editBtn);
  }

  postContainer.addEventListener("click", () => {
    displaySingelPostOverlay(post);
  });

  container.append(postContainer);
}

function formatPostDate(dateToFormat) {
  const postDate = new Date(dateToFormat);
  const now = new Date();
  const diffInSeconds = Math.floor((now - postDate) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return "now";
  if (diffInMinutes < 60) return `${diffInMinutes} min`;
  if (diffInHours < 24) return `${diffInHours} hrs`;
  if (diffInDays === 1) return "1 day";
  
  return `${diffInDays} days`;
}

function addEditBtnToOwnPosts(post) {
  const user = getUsername();
  const button = document.createElement("button");
  button.classList.add("btn", "primary-border");

  const postOwner = post.author?.name || post.owner;

  if (user !== postOwner) {
    return null;
  }

  button.textContent = "Edit Post";

  button.addEventListener("click", () => {
    window.location.href = `/posts/edit.html?id=${encodeURIComponent(post.id)}`;
  });

  return button;
}

async function displaySingelPostOverlay(post) {
  document.querySelector(".overlay-bg")?.remove();
  document.querySelector(".post-overlay")?.remove();

  const overlayBg = document.createElement("div");
  const overlay = document.createElement("div");
  overlayBg.classList.add("overlay-bg")
  overlay.classList.add("post-overlay")

  let user = null;

  if (window.location.pathname === "/profile/index.html") {
    const api = new NoroffAPI();
    const params = new URLSearchParams(window.location.search);
    const username = params.get("user");

    user = await api.profile.view(username)
  }

  createPostThumbnail(overlay, post, user);

  document.body.append(overlayBg, overlay)

  overlayBg.addEventListener("click", () => {
    overlayBg.remove()
    overlay.remove()
  })
}