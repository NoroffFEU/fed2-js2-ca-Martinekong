import NoroffAPI from "../../api/noroffAPI.js";
import { authGuard } from "../../utilities/authGuard.js";

authGuard();

const api = new NoroffAPI()

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

async function deletePost() {
  const confirmDelete = confirm("Are you sure you want to delete this post?");
  
  if (!confirmDelete) return;

  await api.post.delete(postId);
}

document.getElementById("delete-post-btn").addEventListener("click", deletePost);