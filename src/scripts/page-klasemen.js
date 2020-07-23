import getFootballData from "./app-datasource.js";
import generateInitialPage from "./gen-initial-page.js";
import generateCompetition from "./gen-competitions.js";
import errorPopUpHandler from "./app-error-handler.js";
import { compareValues } from "./app-utilities";
import generateClassementContent from "./gen-klasemen-konten.js";

const activateSelectFunctionality = () => {
    const select = document.querySelectorAll("select");
    M.FormSelect.init(select);

    const instance = document.querySelector("#select-competition");
    if(instance === null) return;

    instance.addEventListener("change", event => {
        location = `#klasemen?competition=${event.target.value}`;
    });
}

const generateCompetitionData = (data, signal, competitionId) => {
    generateCompetition(document.querySelector("#select-content"), data, competitionId);
    activateSelectFunctionality(signal);

    if(competitionId !== -9999) {
        generateClassementData(signal, competitionId);
    } else {
        generateClassementData(signal, data[0].id);
    }
}

const generateClassementData = (signal, competitionId) => {
    /* Cache Strategy: StaleWhileRevalidate */
    getFootballData(signal, `competitions/${competitionId}/standings`)
        .then(data => generateClassementContent(document.querySelector("#page-content"), data.standings[0]))
        .catch(error => {
            if(error.name === "AbortError") {
                console.log("Aborted! => Load Matches");
            } else {
                errorPopUpHandler(error.message, "Mohon maaf atas ketidaknyamanannya.");
                document.querySelector("#page-preloader").style.display = "none";
            }
        });
}

const setKlasemenPage = (signal, competitionId) => {
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

export default setKlasemenPage;