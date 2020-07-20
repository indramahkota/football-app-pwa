import M from "materialize-css/dist/js/materialize.min.js";
import { getFootballDataInCaches, getFootballData } from "./app-datasource.js";
import fetchErrorHandler from "./app-error-handler.js";
import { compareValues, getFormattedDate } from "./app-utilities";
import { setTabsActive } from "./app-state.js";
import { createFavoriteTeamData, getFavoriteTeamDataById, deleteFavoriteTeamDataById } from "./app-db-operation.js";

import nullImage from "../assets/images/null-image.jpg";

const generateMatchContent = (parent, jsonData) => {
    document.querySelector("#page-preloader").style.display = "none";
    let htmlHelper = "";
    
    if(jsonData.length === 0) {
        parent.innerHTML = `
            <div class="col s12">
                <div class="card card-content padding-10">
                    <div class="card-title" style="padding: 0px 8px 12px;">Mohon maaf, data yang Anda minta tidak tersedia.</div>
                </div>
            </div>
        `;
        return;
    }

    jsonData.forEach(element => {
        const badgeColor = () => element.status === "FINISHED" ? "" : "red";
        const badgeText = () => element.status === "FINISHED" ? "Selesai" : "Belum Selesai";
        htmlHelper += `
            <div class="col s12 m6">
                <div class="card card-content padding-10">
                    <div class="row">
                        <div class="card-title" style="padding: 0px 8px 12px;">${getFormattedDate(element.utcDate)}</div>
                        <div style="padding-left:8px">Status<span class="new badge ${badgeColor()}"
                                data-badge-caption="${badgeText()}"></span>
                        </div>
                        <div class="divider"></div>
                    </div>
                    <div class="row" style="padding-top:12px">
                        <div class="col center side-percentage">
                            <div class="cut-text min-height-45">
                                ${element.homeTeam.name}
                            </div>
                        </div>
                        <div class="col center mid-percentage">
                            <div class="cut-text">vs</div>
                        </div>
                        <div class="col center side-percentage">
                            <div class="cut-text min-height-45">
                                ${element.awayTeam.name}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col center side-percentage">
                            <div>
                                ${element.score.fullTime.homeTeam != null ? element.score.fullTime.homeTeam : "~"}
                            </div>
                        </div>
                        <div class="col center mid-percentage">
                            <div>:</div>
                        </div>
                        <div class="col center side-percentage">
                            <div>
                                ${element.score.fullTime.awayTeam != null ? element.score.fullTime.awayTeam : "~"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    parent.innerHTML = htmlHelper;
}

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
                    M.toast({html: "Berhasil menambahkan tim favorit!"});
                    favoriteButton.innerHTML = `<i class="material-icons pink-text text-lighten-1">favorite</i>`
                })
                .catch(error => console.log(error));
            } else {
                deleteFavoriteTeamDataById(data.id)
                .then(() => {
                    M.toast({html: "Berhasil menghapus tim favorit!"});
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

    /* always use cache, because static data. until developer detect changes */
    getFootballDataInCaches(`teams/${teamId}`)
        .then(data => generateTeamDetailData(data))
        .catch(error => {
            if(error.message === "No cache." && navigator.onLine) {
                getFootballData(signal, `teams/${teamId}`)
                .then(data => generateTeamDetailData(data))
                .catch(error => {
                    if(error.name === "AbortError") {
                        console.log("Aborted! => Load Competitions");
                    } else {
                        fetchErrorHandler(error, "Mohon maaf atas ketidaknyamanannya.");
                        document.querySelector("#page-preloader").style.display = "none";
                        console.log(error);
                    }
                });
            } else {
                fetchErrorHandler("Anda saat ini sedang offline!", "Lanjutkan dengan halaman tersimpan?");
            }
        });
    
    /* cache first, then replace with original data from server */
    getFootballDataInCaches(`teams/${teamId}/matches?status=SCHEDULED`)
        .then(data => generateMatchContent(document.querySelector("#match-section"), data.matches))
        .catch(error => console.log(error.message));

    if(navigator.onLine) {
        getFootballData(signal, `teams/${teamId}/matches?status=SCHEDULED`)
            .then(data => generateMatchContent(document.querySelector("#match-section"), data.matches))
            .catch(error => {
                if(error.name === "AbortError") {
                    console.log("Aborted! => Load Matches");
                } else {
                    fetchErrorHandler(error.message, "Mohon maaf atas ketidaknyamanannya.");
                    document.querySelector("#page-preloader").style.display = "none";
                }
            });
        return;
    }
    fetchErrorHandler("Anda saat ini sedang offline!", "Lanjutkan dengan halaman tersimpan?");
}

export default setTimDetailPage;