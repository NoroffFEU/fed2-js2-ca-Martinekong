import NoroffAPI from "../../api/noroffAPI.js"
import { formatPostDate } from "../../utilities/utils.js";

const api = new NoroffAPI();

// Add Edit btn if user logged in === userProfile
// Add follow/unfollow btn if another profile

async function renderProfile() {
  const params = new URLSearchParams(window.location.search);
  const username = params.get("user");
  const user = await api.profile.view(username)

  setupProfileInfo(user)
  setupFollowing(user)
  setupFollowers(user)
  setupPosts(user)
}

renderProfile()

function setupProfileInfo(user) {
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
}

function setupFollowing(user) {
  const followingContainer = document.getElementById("profile-following");

  if (user.following.length === 0) {
    const message = document.createElement("p")
    message.textContent = "This profile follows no one"
    followingContainer.appendChild(message)
  }
}

function setupFollowers(user) {
  const followersContainer = document.getElementById("profile-followers");

  if (user.followers.length === 0) {
    const message = document.createElement("p")
    message.textContent = "This profile has 0 followers"
    followersContainer.appendChild(message)
  }
}

function setupPosts(user) {
  const profilePosts = document.getElementById("profile-posts");

  if (user.posts.length === 0) {
    const message = document.createElement("p");
    message.textContent = "This user has no posts"
    profilePosts.append(message)
    return;
  }

  const posts = user.posts;
  posts.forEach((post) => {
    const postContainer = document.createElement("div")
    postContainer.classList.add("post-container")

    const postHeader = document.createElement("div");
    postHeader.classList.add("post-header")

    const authorInfo = document.createElement("div")
    authorInfo.classList.add("author-info")
    const authorImg = document.createElement("img")
    authorImg.src = user.avatar.url;
    authorImg.alt = user.avatar.alt || `${user.name}'s avatar image`;
    const authorName = document.createElement("p")
    authorName.textContent = post.owner;
    authorInfo.append(authorImg, authorName)

    const created = document.createElement("p")
    created.textContent = formatPostDate(post.created)

    postHeader.append(authorInfo, created)

    const postTitle = document.createElement("h2")
    postTitle.textContent = post.title

    postContainer.append(postHeader, postTitle)

    if (post.body) {
      const postBody = document.createElement("p")
      postBody.textContent = post.body
      postContainer.append(postBody)
    }

    if (post.media) {
      const postMedia = document.createElement("img");
      postMedia.classList.add("post-image")
      postMedia.src = post.media.url;
      postMedia.alt = post.media.alt;
      postContainer.append(postMedia)
    }

    profilePosts.append(postContainer)

    console.log(post)
  })
}