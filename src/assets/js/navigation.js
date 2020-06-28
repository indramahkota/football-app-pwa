import beranda from "../pages/beranda.html";
import pengaturan from "../pages/pengaturan.html";
import tentang from "../pages/tentang.html";

const initNav = () => {
  // Activate sidebar nav
  var elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);

  // Load page content
  var page = window.location.hash.substr(1);
  if (page == "") page = "beranda";
  loadPage(page);

  document.querySelectorAll(".sidenav a, .topnav a").forEach(function (elm) {
    elm.addEventListener("click", function (event) {
      // Tutup sidenav
      var sidenav = document.querySelector(".sidenav");
      M.Sidenav.getInstance(sidenav).close();

      // Muat konten halaman yang dipanggil
      page = event.target.getAttribute("href").substr(1);
      loadPage(page);
    });
  });

  function loadPage(page) {
    let content = document.querySelector("#body-content");

    switch (page) {
      case "beranda":
        content.innerHTML = beranda;
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
