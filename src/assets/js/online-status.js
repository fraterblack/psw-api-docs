window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

function updateOnlineStatus() {
  if (!navigator.onLine) {
    document.body.classList.add("app-offline");
  } else {
    document.body.classList.remove("app-offline");
  }
}
