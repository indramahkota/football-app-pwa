import { getFootballDataInCaches, getFootballData } from "./app-datasource.js";
import generateInitialPage from "./gen-initial-page.js";
import generateSelectCompetition from "./gen-select-competitions.js";
import fetchErrorHandler from "./app-error-handler.js";

import nullImage from "../assets/images/null-image.jpg";

const generateTimContent = (parent, jsonData) => {
    let htmlHelper = "";
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
        changeTimContent(event.target.value);
    });
}

let teamFetchController = new AbortController();

const changeTimContent = (id) => {
    document.querySelector("#page-content").innerHTML = "";
    document.querySelector("#page-preloader").style.display = "block";

    getFootballDataInCaches(`competitions/${id}/teams`)
        .then(generateTeamData)
        .catch(error => console.log(error));

    teamFetchController.abort();
    const newController = new AbortController();
    teamFetchController = newController;
    
    if(navigator.onLine) {
        getFootballData(teamFetchController.signal, `competitions/${id}/teams`)
            .then(generateTeamData)
            .catch(error => {
                if(error.name === 'AbortError') {
                    console.log("Aborted! in Change Content");
                } else {
                    fetchErrorHandler("Anda saat ini sedang offline!", "Mohon maaf atas ketidaknyamanannya.");
                    document.querySelector("#page-preloader").style.display = "none";
                    console.log(error);
                }
            });
        return;
    }
    fetchErrorHandler("Anda saat ini sedang offline!", "Mohon maaf atas ketidaknyamanannya.");
}

const generateCompetitionData = (data, signal, isFetch) => {
    generateSelectCompetition(document.querySelector("#select-content"), data);
    activateSelectFunctionality(signal);

    if(isFetch) {
        return getFootballData(signal, `competitions/${data[0].id}/teams`);
    }
    return getFootballDataInCaches(`competitions/${data[0].id}/teams`);
}

const generateTeamData = (data) => {
    generateTimContent(document.querySelector("#page-content"), data.teams);
    document.querySelector("#page-preloader").style.display = "none";
}

const setTimPage = (signal) => {
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    generateInitialPage(parent);
    document.querySelector("#page-preloader").style.display = "block";

    getFootballDataInCaches("competitions")
        .then(data => data.competitions.filter(key => key.plan === "TIER_ONE"))
        .then(data => generateCompetitionData(data, signal, false))
        .then(generateTeamData)
        .catch(error => console.log(error))

    if(navigator.onLine) {
        getFootballData(signal, "competitions")
            .then(data => data.competitions.filter(key => key.plan === "TIER_ONE"))
            .then(data => generateCompetitionData(data, signal, true))
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