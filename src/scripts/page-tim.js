import getFootballData from "./app-datasource.js";
import generateInitialPage from "./gen-initial-page.js";
import generateCompetition from "./gen-competitions.js";
import errorPopUpHandler from "./app-error-handler.js";
import { compareValues } from "./app-utilities";
import { getFavoriteTeamDataById } from "./app-db-operation.js";
import generateTimContent from "./gen-tim-konten.js";

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
    /* Cache Strategy: StaleWhileRevalidate */
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

const setTimPage = (signal, competitionId) => {
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

export default setTimPage;