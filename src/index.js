import "materialize-css/dist/css/materialize.min.css";
import "material-icons/iconfont/material-icons.css";
import "./assets/css/styles.css";

import M from "materialize-css/dist/js/materialize.min.js";
import initNav from "./assets/js/navigation.js";

document.addEventListener("DOMContentLoaded", () => {
  let dropdownElems = document.querySelectorAll(".dropdown-trigger");
  M.Dropdown.init(dropdownElems, {
    coverTrigger: false,
  });

  let modalElems = document.querySelectorAll(".modal");
  M.Modal.init(modalElems, {
    onCloseEnd: () => {
      let content = document.querySelector("#body-content");
      content.innerHTML = "";
    },
  });

  initNav();
});

if ("serviceWorker" in navigator) {
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
}
