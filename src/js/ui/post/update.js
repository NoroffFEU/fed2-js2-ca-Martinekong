import NoroffAPI from "../../api/noroffAPI.js";
import { showMessage } from "../../api/userFeedback.js";
import { authGuard } from "../../utilities/authGuard.js";

authGuard();

const api = new NoroffAPI()

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

if (!postId) {
  showMessage("No post ID found in URL", "error")
} 

async function showPostData() {
    const post = await api.post.view(postId);
    
    document.getElementById("title").value = post.title || "";
    document.getElementById("body").value = post.body || "";
    document.getElementById("mediaUrl").value = post.media?.url || "";
    document.getElementById("mediaAlt").value = post.media?.alt || "";
}

showPostData()

async function updatePost(event) {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const body = document.getElementById("body").value.trim()
  const mediaUrl = document.getElementById("mediaUrl").value.trim();
  const mediaAlt = document.getElementById("mediaAlt").value.trim();

  const updatedPost = {};

  if (title) updatedPost.title = title;
  if (body) updatedPost.body = body;
  if (mediaUrl || mediaAlt) {
    updatedPost.media = {};
    if (mediaUrl) updatedPost.media.url = mediaUrl
    if (mediaAlt) updatedPost.media.alt = mediaAlt
  }

  await api.post.update(updatedPost, postId)
}

document.getElementById("edit-post-form").addEventListener("submit", updatePost);