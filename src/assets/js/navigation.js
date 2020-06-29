import beranda from "../pages/beranda.html";
import pengaturan from "../pages/pengaturan.html";
import tentang from "../pages/tentang.html";

import data from "../js/data-source.js";

const images = require.context('../images', true);
const imagePath = (name) => images(name, true);

const initNav = () => {
  // Activate sidebar nav
  var elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);

  var page = window.location.hash.substr(1);
  if (page == "") page = "beranda";
  loadPage(page);

  document.querySelectorAll(".sidenav a, .topnav a").forEach(function (elm) {
    elm.addEventListener("click", function (event) {
      var sidenav = document.querySelector(".sidenav");
      M.Sidenav.getInstance(sidenav).close();

      page = event.target.getAttribute("href").substr(1);
      if (window.location.hash.substr(1) === page) return;

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

      default:
        content.innerHTML = beranda;
        break;
    }
  }
};

export default initNav;
