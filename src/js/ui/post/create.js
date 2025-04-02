import NoroffAPI from "../../api/noroffAPI.js";

const api = new NoroffAPI()

function onCreatePostFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData)

  const newPost = {
    title: formFields.title.trim()
  }

  if (formFields.body) newPost.body = formFields.body.trim()
  if (formFields.mediaUrl || formFields.mediaAlt) newPost.media = {};
  if (formFields.mediaUrl) newPost.media.url = formFields.mediaUrl.trim();
  if (formFields.mediaAlt) newPost.media.alt = formFields.mediaAlt.trim();

  api.post.create(newPost)
}

document.getElementById("create-post-form").addEventListener("submit", onCreatePostFormSubmit);