export function showSuccessMessage(message) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("success-message");

  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-circle-check");

  const successMessage = document.createElement("p");
  successMessage.textContent = message;

  messageContainer.append(icon, successMessage);
  document.body.appendChild(messageContainer);

  setTimeout(() => {
    messageContainer.classList.add("show");
  }, 100);

  setTimeout(() => {
    messageContainer.classList.add("hide");

    setTimeout(() => {
      messageContainer.remove();
    }, 500);
  }, 2000);
}

export function showErrorMessage(message) {
  //almost same as success, but needs to be used inside api.utils.handleResponse - maybe exept from the api.post.delete()
}