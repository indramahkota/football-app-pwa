import { getFootballDataInCaches, getFootballData } from "./app-datasource.js";
import generateInitialPage from "./gen-initial-page.js";
import generateCompetition from "./gen-competitions.js";
import errorPopUpHandler from "./app-error-handler.js";
import { compareValues } from "./app-utilities";
import { getFavoriteTeamDataById } from "./app-db-operation.js";

import nullImage from "../assets/images/null-image.jpg";

const generateTimContent = (parent, jsonData) => {
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
        /* Team Image dapat merespon 404 */
        //console.log(`${typeof element.crestUrl} ${element.crestUrl === null ? "null" : ""} ${element.crestUrl === "" ? "kosong" : "" }`);
        const teamImage = (element.crestUrl !== null && element.crestUrl !== "") ? element.crestUrl.replace(/^http:\/\//i, "https://") : nullImage;
        htmlHelper += `
            <div class="col s12 m6">
                <a href="#tim/detail?id=${element.id}">
                    ${element.favorite ? `<div><span class="new badge pink" data-badge-caption="Favorit"></span></div>` : ""}
                    <div class="card-panel">
                        <div class="row">
                            <div class="col s4">
                                <img class="small-team-image" src="${teamImage}"
                                    onerror="this.onerror=null;this.src='${nullImage}';console.log('Gambar ini diganti karena 404 not found.');" alt="Team Image" class="circle responsive-img">
                            </div>
                            <div class="col s8" style="padding:0;margin:0;">
                                <span class="card-title black-text truncate" style="padding:0;margin:0;">${element.name}</span>
                                <p class="cut-text" style="padding:0;margin:0;">${element.area.name}</p>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
    });
    parent.innerHTML = htmlHelper;
}

const activateSelectFunctionality = () => {
    const select = document.querySelectorAll("select");
    M.FormSelect.init(select);

    const instance = document.querySelector("#select-competition");
    if(instance === null) return;
    
    instance.addEventListener("change", event => {
        location = `#tim?competition=${event.target.value}`;
    });
}

const generateCompetitionData = (data, signal, competitionId) => {
    generateCompetition(document.querySelector("#select-content"), data, competitionId);
    activateSelectFunctionality(signal);

    if(competitionId !== -9999) {
        generateTeamData(signal, competitionId);
    } else {
        generateTeamData(signal, data[0].id);
    }
}

/* some magic :D */
const checkData = async data => {
    const content = await getFavoriteTeamDataById(data.id);
    if(content !== undefined) {
        return Object.assign(data, {favorite: true});
    } else {
        return Object.assign(data, {favorite: false});
    }
}

const checkDataInDatabase = async data => {
    let newData = [];
    data.forEach(element => {
        newData.push(checkData(element));
    });
    return Promise.all(newData);
}

const generateTeamData = (signal, competitionId) => {
    /* cache first, then replace with original data from server */
    getFootballDataInCaches(`competitions/${competitionId}/teams`)
        .then(data => data.teams.sort(compareValues("name")))
        .then(data => checkDataInDatabase(data))
        .then(data => generateTimContent(document.querySelector("#page-content"), data))
        .catch(error => console.log(error.message));

    if(navigator.onLine) {
        getFootballData(signal, `competitions/${competitionId}/teams`)
            .then(data => data.teams.sort(compareValues("name")))
            .then(data => checkDataInDatabase(data))
            .then(data => generateTimContent(document.querySelector("#page-content"), data))
            .catch(error => {
                if(error.name === "AbortError") {
                    console.log("Aborted! => Load Matches");
                } else {
                    errorPopUpHandler(error.message, "Mohon maaf atas ketidaknyamanannya.");
                    document.querySelector("#page-preloader").style.display = "none";
                }
            });
    }
}

const setTimPage = (signal, competitionId) => {
    let parent = document.querySelector("#pageContent");
    generateInitialPage(parent);

    /* always use cache, because static data. until developer detect changes */
    getFootballDataInCaches("competitions?plan=TIER_ONE")
        .then(data => data.competitions.sort(compareValues("name")))
        .then(data => generateCompetitionData(data, signal, competitionId))
        .catch(error => {
            if(error.message === "No cache." && navigator.onLine) {
                getFootballData(signal, "competitions?plan=TIER_ONE")
                .then(data => data.competitions.sort(compareValues("name")))
                .then(data => generateCompetitionData(data, signal, competitionId))
                .catch(error => {
                    if(error.name === "AbortError") {
                        console.log("Aborted! => Load Competitions");
                    } else {
                        errorPopUpHandler(error, "Mohon maaf atas ketidaknyamanannya.");
                        document.querySelector("#page-preloader").style.display = "none";
                        console.log(error);
                    }
                });
            }
        });
}

export default setTimPage;