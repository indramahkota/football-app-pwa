import getFootballData from "./app-datasource.js";
import errorPopUpHandler from "./app-error-handler.js";
import { compareValues, showToast } from "./app-utilities";
import { setTabsActive } from "./app-state.js";
import { createFavoriteTeamData, getFavoriteTeamDataById,
    deleteFavoriteTeamDataById } from "./app-db-operation.js";
import generateMatchContent from "./gen-pertandingan-konten.js";

import nullImage from "../assets/images/null-image.jpg";

const generateTeamDetailData = data => {
    document.querySelector("#page-preloader").style.display = "none";
    const teamSection = document.querySelector("#team-section");
    const detailsSection = document.querySelector("#details-section");
    const playerSection = document.querySelector("#player-section");

    /* Team Image dapat merespon 404 */
    //console.log(`${typeof data.crestUrl} ${data.crestUrl === null ? "null" : ""} ${data.crestUrl === "" ? "kosong" : "" }`);
    let teamImage = (data.crestUrl !== null && data.crestUrl !== "") ? data.crestUrl.replace(/^http:\/\//i, "https://") : nullImage;
    
    teamSection.innerHTML = `
        <div class="card-image col s12 center">
            <img class="team-image" alt="Team Image" src="${teamImage}"
                onerror="this.onerror=null;this.src='${nullImage}';console.log('Gambar ini diganti karena 404 not found.');">
        </div>
        <div class="row">
            <div class="col s9"">
                <h5 class="card-title truncate">${data.name}</h5>
            </div>
            <div class="col s3 right-align" style="padding:8px;">
                <a id="favorite-button" class="btn-floating waves-effect waves-light cyan lighten-2">
                    <i class="material-icons">favorite_border</i>
                </a>
            </div>
        </div>
        <div class="col s12 divider"></div>
        <div class="col s12">
            <ul id="team-tabs" class="tabs">
                <li class="tab deep-purple lighten-5" style="cursor: pointer;"><a id="details-tab" class="red-text">Detail</a></li>
                <li class="tab" style="cursor: pointer;"><a id="player-tab" class="grey-text">Player</a></li>
                <li class="tab" style="cursor: pointer;"><a id="match-tab" class="grey-text">Pertandingan</a></li>
            </ul>
        </div>
    `;

    const favoriteButton = document.querySelector("#favorite-button");
    getFavoriteTeamDataById(data.id).then(data => {
        if(data !== undefined) {
            favoriteButton.innerHTML = `<i class="material-icons pink-text text-lighten-1">favorite</i>`;
        }
    })

    favoriteButton.addEventListener("click", () => {
        const addData = {
            teamId: data.id,
            nama: data.name,
            image: teamImage,
            area: data.area.name
        }
        getFavoriteTeamDataById(data.id).then(dbData => {
            if(dbData === undefined) {
                createFavoriteTeamData(addData)
                .then(() => {
                    showToast("Berhasil menambahkan tim favorit!");
                    favoriteButton.innerHTML = `<i class="material-icons pink-text text-lighten-1">favorite</i>`
                })
                .catch(error => console.log(error));
            } else {
                deleteFavoriteTeamDataById(data.id)
                .then(() => {
                    showToast("Berhasil menghapus tim favorit!");
                    favoriteButton.innerHTML = `<i class="material-icons">favorite_border</i>`
                })
                .catch(error => console.log(error));
            }
        })
        .catch(error => console.log(error));
    });

    let count = 1;
    let coach = "";
    let playerHelper = "";
    data.squad.sort(compareValues("name"));
    data.squad.forEach(element => {
        if(element.role === "COACH") {
            coach = element.name;
            return
        }
        if(element.role === "PLAYER") {
            playerHelper += `
                <div class="col s12 m6">
                    <div class="card-panel padding-10">
                        <span class="card-title black-text truncate" style="padding:0;margin:0;">${count}. ${element.name}</span>
                        <p class="cut-text" style="padding:0;margin:0;">Position: ${element.position}</p>
                        <p class="cut-text" style="padding:0;margin:0;">Nationality: ${element.nationality}</p>
                    </div>
                </div>
            `;
            count += 1;
        }
    });

    detailsSection.innerHTML = `
        <div class="col s12">
            <p class="cut-text" style="margin:0;padding:0;">Area: ${data.area.name}</p>
            <p class="cut-text" style="margin:0;padding:0;">Pelatih: ${coach}</p>
            <p class="cut-text" style="margin:0;padding:0;">Address: ${data.address}</p>
        </div>
    `;

    playerSection.innerHTML = playerHelper;

    const tabs = document.querySelectorAll("tabs");
    M.Tabs.init(tabs);

    const tabElement = document.querySelector("#team-tabs");
    tabElement.addEventListener("click", e => {
        switch (e.target.innerHTML) {
            case "Detail":
                setTabsActive("details-tab");
                showHideTabsSectionElement("details-section");
                localStorage.setItem("football-app-indramahkota-tabs-state", "details-section");
                break;
            
            case "Player":
                setTabsActive("player-tab");
                showHideTabsSectionElement("player-section");
                localStorage.setItem("football-app-indramahkota-tabs-state", "player-section");
                break;
                
            case "Pertandingan":
                setTabsActive("match-tab");
                showHideTabsSectionElement("match-section");
                localStorage.setItem("football-app-indramahkota-tabs-state", "match-section");
                break;
        
            default:
                break;
        }

    });

    const tabsLocalStorage = localStorage.getItem("football-app-indramahkota-tabs-state");

    if(tabsLocalStorage !== undefined && tabsLocalStorage !== null) {
        switch (localStorage.getItem("football-app-indramahkota-tabs-state")) {
            case "details-section":
                setTabsActive("details-tab");
                showHideTabsSectionElement("details-section");
                break;

            case "player-section":
                setTabsActive("player-tab");
                showHideTabsSectionElement("player-section");
                break;

            case "match-section":
                setTabsActive("match-tab");
                showHideTabsSectionElement("match-section");
                break;
        
            default:
                break;
        }
        return;
    }
    setTabsActive("details-tab");
    showHideTabsSectionElement("details-section");
}

const showHideTabsSectionElement = id => {
    document.querySelector("#details-section").style.display = "none";
    document.querySelector("#player-section").style.display = "none";
    document.querySelector("#match-section").style.display = "none";
    document.querySelector(`#${id}`).style.display = "block";
}

const setTimDetailPage = (signal, teamId) => {
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = `
        <div id="page-content" class="row">
            <div id="team-section" class="row" style="box-shadow:none!important;"></div>
            <div id="details-section" class="row" style="padding-top:32px;display:none;"></div>
            <div id="player-section" class="row" style="padding-top:32px;display:none;"></div>
            <div id="match-section" class="row" style="padding-top:32px;display:none;"></div>
        </div>
        <div class="container center-align" id="page-preloader">
            <div class="preloader-wrapper big active">
                <div class="spinner-layer spinner-blue-only">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div>
                    <div class="gap-patch">
                        <div class="circle"></div>
                    </div>
                    <div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    /* Cache Strategy: CacheFirst */
    getFootballData(signal, `teams/${teamId}`)
        .then(data => generateTeamDetailData(data))
        .catch(error => {
            if(error.name === "AbortError") {
                console.log("Aborted! => Load Competitions");
            } else {
                errorPopUpHandler(error, "Mohon maaf atas ketidaknyamanannya.");
                document.querySelector("#page-preloader").style.display = "none";
                console.log(error);
            }
        });
    
    /* Cache Strategy: StaleWhileRevalidate */
    getFootballData(signal, `teams/${teamId}/matches?status=SCHEDULED`)
        .then(data => generateMatchContent(document.querySelector("#match-section"), data.matches))
        .catch(error => {
            if(error.name === "AbortError") {
                console.log("Aborted! => Load Matches");
            } else {
                errorPopUpHandler(error.message, "Mohon maaf atas ketidaknyamanannya.");
                document.querySelector("#page-preloader").style.display = "none";
            }
        });
}

export default setTimDetailPage;