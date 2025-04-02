import { getUsername } from "../api/storage.js";

export function formatPostDate(dateToFormat) {
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

export function addEditBtnToOwnPosts(post) {
  const user = getUsername();
  const button = document.createElement("button");
  button.classList.add("btn", "primary-border");

  const postOwner = post.author?.name || post.owner;

  if (user !== postOwner) {
    return null;
  }

  button.textContent = "Edit Post";

  button.addEventListener("click", () => {
    window.location.pathname = "/posts/edit"
  });

  return button;
}