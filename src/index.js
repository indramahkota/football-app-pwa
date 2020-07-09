import M from "materialize-css/dist/js/materialize.min.js";
import navigationApp from "./scripts/navigation.js";

import "materialize-css/dist/css/materialize.min.css";
import "material-icons/iconfont/material-icons.css";
import "./styles/styles.css";

document.querySelector("header").innerHTML = require("./components/app-bar/template.html");
document.querySelector("aside").innerHTML = require("./components/side-bar/template.html");
document.querySelector("modal").innerHTML = require("./components/app-modal/template.html");

document.addEventListener("DOMContentLoaded", () => {
  let sidenav = document.querySelectorAll(".sidenav");
  M.Sidenav.init(sidenav);

  let dropdown = document.querySelectorAll(".dropdown-trigger");
  M.Dropdown.init(dropdown, {
    coverTrigger: false,
  });

  var modal = document.querySelectorAll(".modal");
  M.Modal.init(modal);

  navigationApp();
});

/* Sementara dinonaktifkan */
/* if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./worker.js")
      .then(() => {
        console.log("Pendaftaran ServiceWorker berhasil");
      })
      .catch(() => {
        console.log("Pendaftaran ServiceWorker gagal");
      });
  });
} else {
  console.log("ServiceWorker belum didukung browser ini.");
} */
