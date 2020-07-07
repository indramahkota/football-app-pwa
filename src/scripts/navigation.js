import setButtonActive from "./set-state-active.js";

const initMain = () => {
  let viewItem = index => {
    let content = document.querySelector("#body-content");
    data.forEach(elm => {
      if (elm.link === index) {
        content.innerHTML = "";
        content.innerHTML = `
          <div id="club-articles" class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${elm.strImage}" alt="Football Club Badge"/>
            </div>
            <div class="card-content">
              <span class="card-title truncate">${elm.strName}</span>
              <p>${elm.strDescription}</p>
            </div>
          </div>
        `;
      }
    });
  };

  let loadPage = page => {
    let content = document.querySelector("#body-content");

    switch (page) {
      case "beranda":
        content.innerHTML = beranda;
        setButtonActive("beranda-menu");

        //competitions/2021/standings
        //competitions/2021/teams
        //Liga Inggris
        fetch(`${baseUrl}competitions/2021/teams`, {
          headers: {
            "X-Auth-Token": "4ad21fead9504a41a72cad5585bf532a"
          }
        }).then((response) => {
            return response.json();
        }).then((responseJson) => {
          if(responseJson.error) {
            console.log("response error");
          } else {
            //console.log(JSON.stringify(responseJson.teams));
            
            let articlesHTML = "";
            responseJson.teams.forEach(item => {
              articlesHTML += `
                <div class="col l6 m6 s12">
                  <div id="club-articles" class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                      <img src="${item.crestUrl}" alt="Football Club Badge"/>
                    </div>
                    <div class="card-content">
                      <span class="card-title truncate">${item.name}</span>
                    </div>
                    </div>
                </div>
              `;
            });

            document.getElementById("articles").innerHTML = articlesHTML;
            document.querySelectorAll("#club-articles").forEach(elm => {
              elm.addEventListener("click", () => {
                let index = elm.getAttribute("data");
                viewItem(index);
              });
            });
          }
        });



        /* let articlesHTML = "";
        data.forEach(item => {
          articlesHTML += `
            <div class="col l6 m6 s12">
              <div id="club-articles" class="card" data=${item.link}>
                <a href="#${item.link}">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img src="${imagePath(item.strImage).default}" alt="Football Club Badge"/>
                  </div>
                </a>
                <div class="card-content">
                  <span class="card-title truncate">${item.strName}</span>
                  <p class="cut-text">${item.strDescription}</p>
                </div>
                </div>
            </div>
          `;
        });

        document.getElementById("articles").innerHTML = articlesHTML;
        document.querySelectorAll("#club-articles").forEach(elm => {
          elm.addEventListener("click", () => {
            let index = elm.getAttribute("data");
            viewItem(index);
          });
        }); */

        
        

        break;

      case "pengaturan":
        content.innerHTML = pengaturan;
        setButtonActive("pengaturan-menu");
        break;

      case "tentang":
        content.innerHTML = tentang;
        //competitions/2021/standings
        //competitions/2021/teams
        //Liga Inggris
        fetch(`${baseUrl}competitions/2021/teams`, {
          headers: {
            "X-Auth-Token": "4ad21fead9504a41a72cad5585bf532a"
          }
        }).then((response) => {
            return response.json();
        }).then((responseJson) => {
          if(responseJson.error) {
            console.log("response error");
          } else {
            //console.log(JSON.stringify(responseJson.teams));
            
            let articlesHTML = "";
            responseJson.teams.forEach(item => {
              articlesHTML += `
                <div class="col l6 m6 s12">
                  <div id="club-articles" class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                      <img src="${item.crestUrl}" alt="Football Club Badge"/>
                    </div>
                    <div class="card-content">
                      <span class="card-title truncate">${item.name}</span>
                    </div>
                    </div>
                </div>
              `;
            });

            document.getElementById("teams").innerHTML = articlesHTML;
            document.querySelectorAll("#club-articles").forEach(elm => {
              elm.addEventListener("click", () => {
                let index = elm.getAttribute("data");
                viewItem(index);
              });
            });
          }
        });
        break;

      case "keluar":
        let modal = document.querySelector("#keluar-modal");
        M.Modal.getInstance(modal).open();
        break;

      default:
        viewItem(page);
        break;
    }
  };

  document.querySelectorAll(".sidenav a, .topnav a").forEach(elm => {
    elm.addEventListener("click", event => {
      let sidenav = document.querySelector(".sidenav");
      M.Sidenav.getInstance(sidenav).close();

      let reference = event.target.getAttribute("href");
      if (!reference) return;

      let page = reference.substr(1);
      loadPage(page);
    });
  });

  document.querySelector("#beranda-logo").addEventListener("click", () => {
    loadPage("beranda");
  });

  let init = () => {
    let page = window.location.hash.substr(1);
    if (page === "") page = "beranda";
    loadPage(page);
  }
  init();

  window.onhashchange = () => {
    init();
  }
};

export default initMain;
