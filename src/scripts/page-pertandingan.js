import getFootballData from "./app-datasource.js";
import generateInitialPage from "./gen-initial-page.js";
import generateCompetition from "./gen-competitions.js";
import errorPopUpHandler from "./app-error-handler.js";
import { compareValues } from "./app-utilities";
import generateMatchContent from "./gen-pertandingan-konten.js";

const activateSelectFunctionality = () => {
    const select = document.querySelectorAll("select");
    M.FormSelect.init(select);

    const instance = document.querySelector("#select-competition");
    if(instance === null) return;

    instance.addEventListener("change", event => {
        location = `#pertandingan?competition=${event.target.value}`;
    });
}

const generateCompetitionData = (data, signal, competitionId) => {
    generateCompetition(document.querySelector("#select-content"), data, competitionId);
    activateSelectFunctionality(signal);

    if(competitionId !== -9999) {
        generateMatchData(signal, competitionId);
    } else {
        generateMatchData(signal, data[0].id);
    }
}

const generateMatchData = (signal, competitionId) => {
    /* Cache Strategy: StaleWhileRevalidate */
    getFootballData(signal, `competitions/${competitionId}/matches?status=SCHEDULED`)
        .then(data => generateMatchContent(document.querySelector("#page-content"), data.matches))
        .catch(error => {
            if(error.name === "AbortError") {
                console.log("Aborted! => Load Matches");
            } else {
                errorPopUpHandler(error.message, "Mohon maaf atas ketidaknyamanannya.");
                document.querySelector("#page-preloader").style.display = "none";
            }
        });
}

const setPertandinganPage = (signal, competitionId) => {
    let parent = document.querySelector("#pageContent");
    generateInitialPage(parent);

    /* Cache Strategy: CacheFirst */
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

export default setPertandinganPage;