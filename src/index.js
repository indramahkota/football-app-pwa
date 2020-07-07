import "materialize-css/dist/css/materialize.min.css";
import "material-icons/iconfont/material-icons.css";
import "./styles/styles.css";

import M from "materialize-css/dist/js/materialize.min.js";

const appBarTemplate = document.createElement("template");
appBarTemplate.innerHTML = require("./components/app-bar/template.html");
document.body.appendChild(appBarTemplate.content.cloneNode(true));

const sideBarTemplate = document.createElement("template");
sideBarTemplate.innerHTML = require("./components/side-bar/template.html");
document.body.appendChild(sideBarTemplate.content.cloneNode(true));

const modalTemplate = document.createElement("template");
modalTemplate.innerHTML = require("./components/app-modal/template.html");
document.body.appendChild(modalTemplate.content.cloneNode(true));

document.addEventListener("DOMContentLoaded", () => {
  let sidenav = document.querySelectorAll(".sidenav");
  M.Sidenav.init(sidenav);

  let dropdown = document.querySelectorAll(".dropdown-trigger");
  M.Dropdown.init(dropdown, {
    coverTrigger: false,
  });
  
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
