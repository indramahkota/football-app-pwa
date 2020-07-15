import { getFootballDataInCaches, getFootballData } from "./app-datasource.js";
import generateInitialPage from "./gen-initial-page.js";
import generateSelectCompetition from "./gen-select-competitions.js";
import fetchErrorHandler from "./app-error-handler.js";
import getFormattedDate from "./app-utilities";

const generateMatchContent = (parent, jsonData) => {
    let htmlHelper = "";
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
        changePertandinganContent(event.target.value);
    });
}

let matchFetchController = new AbortController();

const changePertandinganContent = (id)=> {
    document.querySelector("#page-content").innerHTML = "";
    document.querySelector("#page-preloader").style.display = "block";

    getFootballDataInCaches(`competitions/${id}/matches`)
        .then(generateMatchData)
        .catch(error => console.log(error));

    matchFetchController.abort();
    const newController = new AbortController();
    matchFetchController = newController;

    if(navigator.onLine) {
        getFootballData(matchFetchController.signal, `competitions/${id}/matches`)
            .then(generateMatchData)
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
        return getFootballData(signal, `competitions/${data[0].id}/matches`);
    }
    return getFootballDataInCaches(`competitions/${data[0].id}/matches`);
}

const generateMatchData = (data) => {
    location = `#pertandingan?competitionId=${data.competition.id}`;
    generateMatchContent(document.querySelector("#page-content"), data.matches);
    document.querySelector("#page-preloader").style.display = "none";
}

const setPertandinganPage = (signal) => {
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    generateInitialPage(parent);
    document.querySelector("#page-preloader").style.display = "block";

    getFootballDataInCaches("competitions")
        .then(data => data.competitions.filter(key => key.plan === "TIER_ONE"))
        .then(data => generateCompetitionData(data, signal, false))
        .then(generateMatchData)
        .catch(error => console.log(error))
    
    if(navigator.onLine) {
        getFootballData(signal, "competitions")
            .then(data => data.competitions.filter(key => key.plan === "TIER_ONE"))
            .then(jsonData => generateCompetitionData(jsonData, signal, true))
            .then(generateMatchData)
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

export default setPertandinganPage;