/**
 * Displays a temporary message notification on the screen.
 *
 * @param {string} message - The message text to display.
 * @param {"success" | "error"} type - The type of message, which affects styling and icon (e.g., "success" or "error").
 */
export function showMessage(message, type) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message", type);

  const icon = document.createElement("i");

  if (type === "success") {
    icon.classList.add("fa-solid", "fa-circle-check");
  } else if (type === "error") {
    icon.classList.add("fa-solid", "fa-circle-exclamation");
  }

  const text = document.createElement("p");
  text.textContent = message;

  messageContainer.append(icon, text);
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

/** 
 * Displays loading spinner in a container while an API call is being made
 * @param {HTMLElement} container the container for the spinner
*/
export function showLoadingSpinner(container) {
  if (container.querySelector('.spinner')) return;
  const spinner = document.createElement("div");
  spinner.classList.add("spinner")
  container.append(spinner)
}

/**
 * Removes the loading spinner when the API call is done
 * @param {HTMLElement} container the container where the spinner has been appended
 */
export function hideLoadingSpinner(container) {
  const spinner = container.querySelector(".spinner");
  if (spinner) {
    spinner.remove();
  }
}