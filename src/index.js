import "materialize-css/dist/css/materialize.min.css";
import "material-icons/iconfont/material-icons.css";
import "./assets/css/styles.css";

import M from "materialize-css/dist/js/materialize.min.js";
import initNav from "./assets/js/navigation.js";

M.AutoInit();

document.addEventListener("DOMContentLoaded", function () {
  initNav();
});

/* if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("./worker.js")
      .then(function () {
        console.log("Pendaftaran ServiceWorker berhasil");
      })
      .catch(function () {
        console.log("Pendaftaran ServiceWorker gagal");
      });
  });
} else {
  console.log("ServiceWorker belum didukung browser ini.");
} */
