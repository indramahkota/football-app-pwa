import { getFootballDataInCaches, getFootballData } from "./app-datasource.js";
import generateInitialPage from "./gen-initial-page.js";
import generateSelectCompetition from "./gen-select-competitions.js";
import fetchErrorHandler from "./app-error-handler.js";
import { compareValues } from "./app-utilities";

import nullImage from "../assets/images/null-image.jpg";

const generateTimContent = (parent, jsonData) => {
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
                <div class="card">
                    <a href="#matchtim?id=${element.id}">
                        <div class="card-image">
                            <img class="team-image" alt="Team Image" src="${element.crestUrl !== null
                                && element.crestUrl !== ""
                                ? element.crestUrl.replace(/^http:\/\//i, 'https://') : nullImage}"
                                onerror="this.onerror=null;this.src='${nullImage}';console.log('Gambar ini diganti karena 404 not found.');"
                                >
                            <a class="btn-floating halfway-fab waves-effect waves-light cyan lighten-2">
                                <i class="material-icons">favorite_border</i>
                            </a>
                        </div>
                        <div class="divider"></div>
                        <div class="card-content min-height-175">
                            <span class="card-title truncate">${element.name}</span>
                            <p class="cut-text">Area: ${element.area.name}</p>
                            <p class="cut-text">Address: ${element.address}</p>
                        </div>
                    </a>
                </div>
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

let teamCompetitionId;
const generateCompetitionData = (data, signal, isFetch) => {
    generateSelectCompetition(document.querySelector("#select-content"), data, teamCompetitionId);
    activateSelectFunctionality(signal);

    if(teamCompetitionId !== -9999) {
        if(isFetch) {
            return getFootballData(signal, `competitions/${teamCompetitionId}/teams`);
        }
        return getFootballDataInCaches(`competitions/${teamCompetitionId}/teams`);
    } else {
        if(isFetch) {
            return getFootballData(signal, `competitions/${data[0].id}/teams`);
        }
        return getFootballDataInCaches(`competitions/${data[0].id}/teams`);
    }
}

const generateTeamData = data => {
    generateTimContent(document.querySelector("#page-content"), data);
    document.querySelector("#page-preloader").style.display = "none";
}

/* Mengakibatkan 2x perubahan halaman, 1: saat data offline tersedia, 2: saat data online tersedia */
const setTimPage = (signal, competitionId) => {
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    teamCompetitionId = competitionId;

    generateInitialPage(parent);
    document.querySelector("#page-preloader").style.display = "block";

    getFootballDataInCaches("competitions")
        .then(data => data.competitions.filter(key => key.plan === "TIER_ONE"))
        .then(data => data.sort(compareValues("name")))
        .then(data => generateCompetitionData(data, signal, false))
        .then(data => data.teams.sort(compareValues("name")))
        .then(generateTeamData)
        .catch(error => console.log(error))

    if(navigator.onLine) {
        getFootballData(signal, "competitions")
            .then(data => data.competitions.filter(key => key.plan === "TIER_ONE"))
            .then(data => data.sort(compareValues("name")))
            .then(data => generateCompetitionData(data, signal, true))
            .then(data => data.teams.sort(compareValues("name")))
            .then(generateTeamData)
            .catch(error => {
                if(error.name === 'AbortError') {
                    console.log("Aborted!");
                } else {
                    fetchErrorHandler(error, "Mohon maaf atas ketidaknyamanannya.");
                    document.querySelector("#page-preloader").style.display = "none";
                    console.log(error);
                }
            });
        return;
    }
    fetchErrorHandler("Anda saat ini sedang offline!", "Lanjutkan dengan halaman tersimpan?");
}

export default setTimPage;