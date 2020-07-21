import "materialize-css/dist/css/materialize.min.css";
import "material-icons/iconfont/material-icons.css";
import "./styles/styles.css";

import M from "materialize-css";
import navigationApp from "./scripts/app-navigation.js";
import { showOfflineToast, dismissOfflineToast } from "./scripts/app-utilities.js";

window.addEventListener("DOMContentLoaded", () => {
  const sidenav = document.querySelectorAll(".sidenav");
  M.Sidenav.init(sidenav);

  const dropdown = document.querySelectorAll(".dropdown-trigger");
  M.Dropdown.init(dropdown, {
    coverTrigger: false,
  });

  const modal = document.querySelectorAll(".modal");
  M.Modal.init(modal);

  navigationApp();
  
});

window.addEventListener('online',  () => dismissOfflineToast());
window.addEventListener('offline', () => showOfflineToast());

const urlBase64ToUint8Array = base64String => {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./worker.js")
      .then(() => {
        console.log("Pendaftaran ServiceWorker berhasil");
      })
      .catch(() => {
        console.log("Pendaftaran ServiceWorker gagal");
      });
  });

  if("Notification" in window) {
    Notification.requestPermission()
      .then(result => {
        if(result === "denied") {
          console.log("Fitur notifikasi tidak diijinkan.");
          return;
        } else if(result === "default") {
          console.error("Pengguna menutup kotak dialog permintaan ijin.");
          return;
        }
        if("PushManager" in window) {
          navigator.serviceWorker.getRegistration()
            .then(registration =>
              registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array("BKrlDhc0zQnMTPFjLdezIyRaxklJTEegifGWrNHhN3TvHkNVSAI-jYwqRUhigqeqG42C3mFnJL7uJ-JUpGzWbCs")
              })
            )
            .then(subscribe => {
              console.log(`endpoint: "${subscribe.endpoint}", keys: { p256dh: "${btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("p256dh"))))}", auth: "${btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("auth"))))}"}`);
              // console.log("Berhasil melakukan subscribe dengan endpoint: ", subscribe.endpoint);
              // console.log("Berhasil melakukan subscribe dengan p256dh key: ", btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("p256dh")))));
              // console.log("Berhasil melakukan subscribe dengan auth key: ", btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("auth")))));
            })
            .catch(e =>
              console.error("Tidak dapat melakukan subscribe ", e.message)
            );
        } else {
          console.log("PushManager tidak didukung browser ini.");
        }
      });
  } else {
    console.log("PushManager tidak didukung browser ini.");
  }
} else {
  console.log("ServiceWorker tidak didukung browser ini.");
}