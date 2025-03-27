import NoroffAPI from "../../api/noroffAPI.js";
import { getUsername } from "../../api/storage.js";

const api = new NoroffAPI();

async function showUserInfo() {
  const editProfileInfo = document.getElementById("edit-profile-info");
  const user = getUsername();
  const userToEdit = await api.profile.view(user);

  const profileImage = document.createElement("img");
  profileImage.src = userToEdit.avatar.url;
  profileImage.alt = userToEdit.avatar.alt;

  const infoContainer = document.createElement("p");
  infoContainer.classList.add("info-container");
  const username = document.createElement("h2");
  username.textContent = userToEdit.name;
  const email = document.createElement("p");
  email.textContent = userToEdit.email;
  infoContainer.append(username, email);

  editProfileInfo.append(profileImage, infoContainer);

  document.getElementById("bio").placeholder = userToEdit.bio || "Enter your bio...";
  document.getElementById("avatarUrl").placeholder = userToEdit.avatar.url || "Enter image URL...";
  document.getElementById("avatarAlt").placeholder = userToEdit.avatar.alt || "Enter image description...";
}

showUserInfo();

async function updateProfile(event) {
  event.preventDefault();

  const bio = document.getElementById("bio").value.trim();
  const avatarUrl = document.getElementById("avatarUrl").value.trim();
  const avatarAlt = document.getElementById("avatarAlt").value.trim();

  const updatedProfile = {};

  if (bio) updatedProfile.bio = bio;
  if (avatarUrl || avatarAlt) {
    updatedProfile.avatar = {};
    if (avatarUrl) updatedProfile.avatar.url = avatarUrl;
    if (avatarAlt) updatedProfile.avatar.alt = avatarAlt;
  }

  await api.profile.update(updatedProfile);
}

document.getElementById("edit-profile-form").addEventListener("submit", updateProfile);