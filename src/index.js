// import M from "materialize-css/dist/js/materialize.min.js";

import "./styles/materialize-css/dist/css/materialize.min.css";
import "./styles/material-icons/iconfont/material-icons.css";
import "./styles/styles.css";

import "./components/app-bar";
import "./components/side-bar";


document.addEventListener("DOMContentLoaded", () => {
  /* const sideBar = document.querySelector("side-bar");
  sideBar.initDropdown();
  console.log(sideBar); */
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
