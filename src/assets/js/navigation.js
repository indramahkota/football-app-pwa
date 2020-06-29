import beranda from "../pages/beranda.html";
import pengaturan from "../pages/pengaturan.html";
import tentang from "../pages/tentang.html";

import data from "../js/data-source.js";

const images = require.context("../images", true);
const imagePath = (name) => images(name, true);

const initNav = () => {
  // Activate sidebar nav
  let elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);

  let page = window.location.hash.substr(1);
  if (page == "") page = "beranda";
  loadPage(page);

  document.querySelectorAll(".sidenav a, .topnav a").forEach(function (elm) {
    elm.addEventListener("click", function (event) {
      let sidenav = document.querySelector(".sidenav");
      M.Sidenav.getInstance(sidenav).close();

      let reference = event.target.getAttribute("href");
      if (!reference) return;

      page = reference.substr(1);
      loadPage(page);
    });
  });

  function loadPage(page) {
    let content = document.querySelector("#body-content");

    switch (page) {
      case "beranda":
        content.innerHTML = beranda;

        let articlesHTML = "";
        data.forEach(function (item) {
          articlesHTML += `
                  <div class="card">
                    <a href="#">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${imagePath(item.strImage).default}" />
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate">${item.strName}</span>
                      <p>${item.strDescription}</p>
                    </div>
                  </div>
                `;
        });

        document.getElementById("articles").innerHTML = articlesHTML;

        break;

      case "pengaturan":
        content.innerHTML = pengaturan;
        break;

      case "tentang":
        content.innerHTML = tentang;
        break;

      case "keluar":
        let modal = document.querySelector("#keluar-modal");
        M.Modal.getInstance(modal).open();
        break;

      default:
        break;
    }
  }
};

export default initNav;
