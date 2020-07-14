import { getFootballDataInCaches, getFootballData } from "./app-datasource.js";
import generateInitialPage from "./gen-initial-page.js";
import generateSelectCompetition from "./gen-select-competitions.js";
import fetchErrorHandler from "./app-error-handler.js";

const generateClassementContent = (parent, jsonData) => {
    let htmlHelper = `
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
        changeKlasemenContent(event.target.value);
    });
}

let classementFetchController = new AbortController();

const changeKlasemenContent = (id) => {
    document.querySelector("#page-content").innerHTML = "";
    document.querySelector("#page-preloader").style.display = "block";

    getFootballDataInCaches(`competitions/${id}/standings`)
        .then(generateClassementData)
        .catch(error => console.log(error));

    classementFetchController.abort();
    const newController = new AbortController();
    classementFetchController = newController;

    getFootballData(classementFetchController.signal, `competitions/${id}/standings`)
        .then(generateClassementData)
        .catch(error => {
            if(error.name === 'AbortError') {
                console.log("Aborted! in Change Content");
            } else {
                console.log(error);
            }
        });
}

const generateCompetitionData = (data, signal, isFetch) => {
    generateSelectCompetition(document.querySelector("#select-content"), data);
    activateSelectFunctionality(signal);

    if(isFetch) {
        return getFootballData(signal, `competitions/${data[0].id}/standings`);
    }
    return getFootballDataInCaches(`competitions/${data[0].id}/standings`);
}

const generateClassementData = (data) => {
    generateClassementContent(document.querySelector("#page-content"), data.standings[0]);
    document.querySelector("#page-preloader").style.display = "none";
}

const setKlasemenPage = (signal) => {
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    generateInitialPage(parent);
    document.querySelector("#page-preloader").style.display = "block";

    getFootballDataInCaches("competitions")
        .then(data => data.competitions.filter(key => key.plan === "TIER_ONE"))
        .then(data => generateCompetitionData(data, signal, false))
        .then(generateClassementData)
        .catch(error => console.log(error))

    getFootballData(signal, "competitions")
        .then(data => data.competitions.filter(key => key.plan === "TIER_ONE"))
        .then(data => generateCompetitionData(data, signal, true))
        .then(generateClassementData)
        .catch(error => {
            if(error.name === 'AbortError') {
                console.log("Aborted! in Load Page");
            } else {
                fetchErrorHandler();
                document.querySelector("#page-preloader").style.display = "none";
                console.log(error);
            }
        });
}

export default setKlasemenPage;