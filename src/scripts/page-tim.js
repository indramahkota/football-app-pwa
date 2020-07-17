import { getFootballDataInCaches, getFootballData } from "./app-datasource.js";
import generateInitialPage from "./gen-initial-page.js";
import generateSelectCompetition from "./gen-select-competitions.js";
import fetchErrorHandler from "./app-error-handler.js";
import { compareValues } from "./app-utilities";

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
        htmlHelper += `
            <div class="col s12 m6">
                <a href="#timdetail?teamId=${element.id}">
                    <div class="card-panel">
                        <div class="row">
                            <div class="col s4">
                                <img class="small-team-image" src="${element.crestUrl !== null
                                    && element.crestUrl !== ""
                                    ? element.crestUrl.replace(/^http:\/\//i, 'https://') : nullImage}"
                                    onerror="this.onerror=null;this.src='${nullImage}';console.log('Gambar ini diganti karena 404 not found.');" alt="" class="circle responsive-img">
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
        location = `#tim?competitionId=${event.target.value}`;
    });
}

const generateCompetitionData = (data, signal, competitionId) => {
    generateSelectCompetition(document.querySelector("#select-content"), data, competitionId);
    activateSelectFunctionality(signal);

    if(competitionId !== -9999) {
        generateTeamData(signal, competitionId);
    } else {
        generateTeamData(signal, data[0].id);
    }
}

const generateTeamData = (signal, competitionId) => {
    /* cache first, the replace with original data from server */
    getFootballDataInCaches(`competitions/${competitionId}/teams`)
        .then(data => data.teams.sort(compareValues("name")))
        .then(data => generateTimContent(document.querySelector("#page-content"), data))
        .catch(error => console.log(error.message));

    if(navigator.onLine) {
        getFootballData(signal, `competitions/${competitionId}/teams`)
            .then(data => data.teams.sort(compareValues("name")))
            .then(data => generateTimContent(document.querySelector("#page-content"), data))
            .catch(error => {
                if(error.name === 'AbortError') {
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
                    if(error.name === 'AbortError') {
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
}

export default setTimPage;