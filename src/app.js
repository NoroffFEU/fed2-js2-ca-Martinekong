async function router(pathname = window.location.pathname) {
  console.log(pathname)
  switch (pathname) {
    case "/":
      // functions and eventListeners for index
      break;
    case "/auth/":
      // functions and eventListeners for auth
      console.log("Redirect to index?")
      break;
    case "/auth/login/":
      // functions and eventListeners for login
      break;
    case "/auth/register/":
      // functions and eventListeners for register
      break;
    case "/posts/":
      // functions and eventListeners for feed
      break;
    case "/posts/view/":
      // functions and eventListeners for single post
      break;
    case "/profile/":
      // functions and eventListeners for profile
      break;
    default:
      // default functions and eventListeners / if no matches are found / 404 not found page?
      // Redirect to index? Or ifUserLoggedIn redirect to feed?
  }
}

document.addEventListener("DOMContentLoaded", () => router());
// router()


// PWA test (service-worker.js + public/manifest.json)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}