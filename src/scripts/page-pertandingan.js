import { getFootballDataInCaches, getFootballData } from "./app-datasource.js";
import generateInitialPage from "./gen-initial-page.js";
import generateSelectCompetition from "./gen-select-competitions.js";
import fetchErrorHandler from "./app-error-handler.js";
import { compareValues, getFormattedDate } from "./app-utilities";

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
                        <div style="padding-left:8px">Status<span class="new badge ${badgeColor()}" data-badge-caption="${badgeText()}"></span></div>
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

const activateSelectFunctionality = () => {
    const select = document.querySelectorAll("select");
    M.FormSelect.init(select);

    const instance = document.querySelector("#select-competition");
    if(instance === null) return;

    instance.addEventListener("change", event => {
        location = `#pertandingan?competitionId=${event.target.value}`;
    });
}

const generateCompetitionData = (data, signal, competitionId) => {
    generateSelectCompetition(document.querySelector("#select-content"), data, competitionId);
    activateSelectFunctionality(signal);

    if(competitionId !== -9999) {
        generateMatchData(signal, competitionId);
    } else {
        generateMatchData(signal, data[0].id);
    }
}

const generateMatchData = (signal, competitionId) => {
    /* cache first, the replace with original data from server */
    getFootballDataInCaches(`competitions/${competitionId}/matches?status=SCHEDULED`)
    .then(data => generateMatchContent(document.querySelector("#page-content"), data.matches))
    .catch(error => console.log(error.message));

    if(navigator.onLine) {
        getFootballData(signal, `competitions/${competitionId}/matches?status=SCHEDULED`)
            .then(data => generateMatchContent(document.querySelector("#page-content"), data.matches))
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

const setPertandinganPage = (signal, competitionId) => {
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

export default setPertandinganPage;