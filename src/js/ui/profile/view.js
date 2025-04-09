import NoroffAPI from "../../api/noroffAPI.js"
import { getUsername } from "../../api/storage.js";
import { authGuard } from "../../utilities/authGuard.js";
import { createPostThumbnail } from "../../utilities/utils.js";

authGuard();

const api = new NoroffAPI();

const params = new URLSearchParams(window.location.search);
const username = params.get("user");
const container = document.getElementById("profile-posts");
const user = await api.profile.view(username, container)

async function renderProfile() {
  setupProfileInfo(user)
  setupFollowing(user)
  setupFollowers(user)
  setupPosts(user)
}

renderProfile()

async function setupProfileInfo(user) {
  const profileInfoContainer = document.getElementById("profile-info");

  const image = document.createElement("img");
  image.src = user.avatar.url;
  image.alt = user.avatar.alt || `${user.name}'s avatar image`;

  const info = document.createElement("div");

  const username = document.createElement("h2");
  username.textContent = user.name;
  info.append(username);

  const numbers = document.createElement("div");
  numbers.classList.add("numbers");

  const posts = document.createElement("div");
  const postsNumber = document.createElement("p");
  const postsText = document.createElement("p");
  postsNumber.textContent = user._count.posts;;
  postsText.textContent = "Posts";
  posts.append(postsNumber, postsText);

  const followers = document.createElement("div");
  const followersNumber = document.createElement("p");
  const followersText = document.createElement("p");
  followersNumber.textContent = user._count.followers;
  followersText.textContent = "Followers";
  followers.append(followersNumber, followersText);

  const following = document.createElement("div");
  const followingNumber = document.createElement("p");
  const followingText = document.createElement("p");
  followingNumber.textContent = user._count.following;
  followingText.textContent = "Following";
  following.append(followingNumber, followingText);

  numbers.append(posts, followers, following);

  profileInfoContainer.append(image, info, numbers);

  if (user.bio) {
    const bio = document.createElement("p");
    bio.textContent = user.bio;
    profileInfoContainer.append(bio);
  }

  profileInfoContainer.append(await createProfileBtn())
}

function setupFollowing(user) {
  const followingContainer = document.getElementById("profile-following");

  if (user.following.length === 0) {
    const message = document.createElement("p")
    message.textContent = "This profile follows no one"
    followingContainer.appendChild(message)
    return;
  }

  user.following.forEach((following) => {
    const follow = document.createElement("div");

    const followImg = document.createElement("img")
    followImg.src = following.avatar.url;
    followImg.alt = following.avatar.alt || `${following.name}'s avatar image`
    followImg.style.cursor = "pointer";

    followImg.addEventListener("click", () => {
      window.location.href = `/profile/index.html?user=${encodeURIComponent(following.name)}`
    })

    const followUsername = document.createElement("p")
    followUsername.textContent = following.name

    follow.append(followImg, followUsername);
    followingContainer.append(follow)
  })
}

function setupFollowers(user) {
  const followersContainer = document.getElementById("profile-followers");

  if (user.followers.length === 0) {
    const message = document.createElement("p")
    message.textContent = "This profile has 0 followers"
    followersContainer.appendChild(message)
  }

  user.followers.forEach((follower) => {
    const follow = document.createElement("div");

    const followImg = document.createElement("img")
    followImg.src = follower.avatar.url;
    followImg.alt = follower.avatar.alt || `${follower.name}'s avatar image`
    followImg.style.cursor = "pointer";

    followImg.addEventListener("click", () => {
      window.location.href = `/profile/index.html?user=${encodeURIComponent(follower.name)}`
    })

    const followUsername = document.createElement("p")
    followUsername.textContent = follower.name

    follow.append(followImg, followUsername);
    followersContainer.append(follow)
  })
}

function setupPosts(user) {
  const profilePosts = document.getElementById("profile-posts");

  if (user.posts.length === 0) {
    const message = document.createElement("p");
    message.textContent = "This user has no posts"
    message.style.padding = "2rem"
    profilePosts.append(message)
    return;
  }

  user.posts.sort((a, b) => new Date(b.created) - new Date(a.created));

  user.posts.forEach((post) => {
    createPostThumbnail(profilePosts, post, user)
  })
}

async function createProfileBtn() {
  const params = new URLSearchParams(window.location.search);
  const userProfile = params.get("user");
  const loggedInUser = getUsername();
  
  const button = document.createElement("button");
  button.classList.add("btn", "primary-border");

  if (loggedInUser === userProfile) {
    button.textContent = "Edit Profile";
    button.onclick = () => {
      window.location.href = `/profile/edit.html?user=${encodeURIComponent(loggedInUser)}`;
    };
  } else {
    await updateFollowButton(button, userProfile, loggedInUser);
  }

  return button;
}

async function updateFollowButton(button, userProfile, loggedInUser) {
  try {
    const loggedInUsersProfile = await api.profile.view(loggedInUser);
    const isFollowing = loggedInUsersProfile.following.some(profile => profile.name === userProfile);

    button.textContent = isFollowing ? "Unfollow" : "Follow";

    button.onclick = async () => {
      try {
        if (isFollowing) {
          await api.profile.unfollow(userProfile);
        } else {
          await api.profile.follow(userProfile);
        }
        updateFollowButton(button, userProfile, loggedInUser);
      } catch (error) {
        console.error("Error updating follow status:", error);
      }
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}