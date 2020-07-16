import { getFootballDataInCaches, getFootballData } from "./app-datasource.js";
import generateInitialPage from "./gen-initial-page.js";
import generateSelectCompetition from "./gen-select-competitions.js";
import fetchErrorHandler from "./app-error-handler.js";
import { compareValues } from "./app-utilities";

const generateClassementContent = (parent, jsonData) => {
    document.querySelector("#page-preloader").style.display = "none";
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
        <div class="col s12" style="overflow-x:auto;">
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
        </div>
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

const generateCompetitionData = (data, signal, competitionId) => {
    generateSelectCompetition(document.querySelector("#select-content"), data, competitionId);
    activateSelectFunctionality(signal);

    if(competitionId !== -9999) {
        generateClassementData(signal, competitionId);
    } else {
        generateClassementData(signal, data[0].id);
    }
}

const generateClassementData = (signal, competitionId) => {
    /* cache first, the replace with original data from server */
    getFootballDataInCaches(`competitions/${competitionId}/standings`)
        .then(data => generateClassementContent(document.querySelector("#page-content"), data.standings[0]))
        .catch(error => console.log(error.message));

    if(navigator.onLine) {
        getFootballData(signal, `competitions/${competitionId}/standings`)
            .then(data => generateClassementContent(document.querySelector("#page-content"), data.standings[0]))
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

const setKlasemenPage = (signal, competitionId) => {
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    generateInitialPage(parent);
    document.querySelector("#page-preloader").style.display = "block";

    /* always use cache, because static data. */
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

export default setKlasemenPage;