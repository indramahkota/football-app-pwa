import { getFootballDataInCaches, getFootballData } from "./app-datasource.js";
import generateInitialPage from "./gen-initial-page.js";
import generateSelectCompetition from "./gen-select-competitions.js";
import fetchErrorHandler from "./app-error-handler.js";
import { compareValues } from "./app-utilities";

const generateClassementContent = (parent, jsonData) => {
    let htmlHelper = "";
    
    if(jsonData.table.length === 0) {
        parent.innerHTML = `
            <div class="col s12">
                <div class="card card-content padding-10">
                    <div class="card-title" style="padding: 0px 8px 12px;">Mohon maaf, data yang Anda minta tidak tersedia.</div>
                </div>
            </div>
        `;
        return;
    }

    htmlHelper += `
        <table>
            <thead>
                <tr>
                    <th>Club</th>
                    <th>MP</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Pts</th>
                </tr>
            </thead>
            <tbody>
    `;

    jsonData.table.forEach(element => {
        htmlHelper += `
                <tr>
                    <td>${element.team.name}</td>
                    <td>${element.playedGames}</td>
                    <td>${element.won}</td>
                    <td>${element.draw}</td>
                    <td>${element.lost}</td>
                    <td>${element.goalsFor}</td>
                    <td>${element.goalsAgainst}</td>
                    <td>${element.goalDifference}</td>
                    <td>${element.points}</td>
                </tr>
        `;
    });

    htmlHelper += `
            </tbody>
        </table>
    `;
    parent.innerHTML = htmlHelper;
}

const activateSelectFunctionality = () => {
    const select = document.querySelectorAll("select");
    M.FormSelect.init(select);

    const instance = document.querySelector("#select-competition");
    if(instance === null) return;

    instance.addEventListener("change", event => {
        location = `#klasemen?competitionId=${event.target.value}`;
    });
}

let classementCompetitionId;
const generateCompetitionData = (data, signal, isFetch) => {
    generateSelectCompetition(document.querySelector("#select-content"), data, classementCompetitionId);
    activateSelectFunctionality(signal);

    if(classementCompetitionId !== -9999) {
        if(isFetch) {
            return getFootballData(signal, `competitions/${classementCompetitionId}/standings`);
        }
        return getFootballDataInCaches(`competitions/${classementCompetitionId}/standings`);
    } else {
        if(isFetch) {
            return getFootballData(signal, `competitions/${data[0].id}/standings`);
        }
        return getFootballDataInCaches(`competitions/${data[0].id}/standings`);
    }
}

const generateClassementData = data => {
    generateClassementContent(document.querySelector("#page-content"), data.standings[0]);
    document.querySelector("#page-preloader").style.display = "none";
}

/* Mengakibatkan 2x perubahan halaman, 1: saat data offline tersedia, 2: saat data online tersedia */
const setKlasemenPage = (signal, competitionId) => {
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    classementCompetitionId = competitionId;

    generateInitialPage(parent);
    document.querySelector("#page-preloader").style.display = "block";

    getFootballDataInCaches("competitions")
        .then(data => data.competitions.filter(key => key.plan === "TIER_ONE"))
        .then(data => data.sort(compareValues("name")))
        .then(data => generateCompetitionData(data, signal, false))
        .then(generateClassementData)
        .catch(error => console.log(error))

    if(navigator.onLine) {
        getFootballData(signal, "competitions")
            .then(data => data.competitions.filter(key => key.plan === "TIER_ONE"))
            .then(data => data.sort(compareValues("name")))
            .then(data => generateCompetitionData(data, signal, true))
            .then(generateClassementData)
            .catch(error => {
                if(error.name === 'AbortError') {
                    console.log("Aborted! in Load Page");
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

export default setKlasemenPage;