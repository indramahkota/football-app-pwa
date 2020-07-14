import { getFootballDataInCaches, getFootballData } from "./app-datasource.js";
import generateInitialPage from "./gen-initial-page.js";
import generateSelectCompetition from "./gen-select-competitions.js";
import fetchErrorHandler from "./app-error-handler.js";

const generateMatchContent = (parent, jsonData) => {
    let htmlHelper = "";
    jsonData.forEach(element => {
        htmlHelper += `
            <div class="col s12 m6">
                <div class="card card-content padding-10">
                    <div class="row">
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

    getFootballData(matchFetchController.signal, `competitions/${id}/matches`)
        .then(generateMatchData)
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
        return getFootballData(signal, `competitions/${data[0].id}/matches`);
    }
    return getFootballDataInCaches(`competitions/${data[0].id}/matches`);
}

const generateMatchData = (data) => {
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
    
    getFootballData(signal, "competitions")
        .then(data => data.competitions.filter(key => key.plan === "TIER_ONE"))
        .then(jsonData => generateCompetitionData(jsonData, signal, true))
        .then(generateMatchData)
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

export default setPertandinganPage;