import getFootballData from "./app-datasource.js";
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

const activateSelectFunctionality = (signal) => {
    const select = document.querySelectorAll("select");
    M.FormSelect.init(select);

    const instance = document.querySelector("#select-competition");
    instance.addEventListener("change", event => {
        changeMatchContent(signal, event.target.value);
    });
}

const changeMatchContent = (signal, id)=> {
    document.querySelector("#page-content").innerHTML = "";
    document.querySelector("#page-preloader").style.display = "block";
    getFootballData(signal, `competitions/${id}/matches`)
        .then(data =>{
            generateMatchContent(document.querySelector("#page-content"), data.matches);
            document.querySelector("#page-preloader").style.display = "none";
        })
        .catch(error => console.log(error));
}

const setPertandinganPage = (signal) => {
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    generateInitialPage(parent);
    document.querySelector("#page-preloader").style.display = "block";
    
    getFootballData(signal, "competitions")
        .then(data => data.competitions.filter(key => key.plan === "TIER_ONE"))
        .then(data => {
            generateSelectCompetition(document.querySelector("#select-content"), data);
            activateSelectFunctionality(signal);
            return getFootballData(signal, `competitions/${data[0].id}/matches`);
        })
        .then(data => {
            generateMatchContent(document.querySelector("#page-content"), data.matches);
            document.querySelector("#page-preloader").style.display = "none";
        })
        .catch(error => {
            if (error.name === 'AbortError') {
                console.log("Aborted!");
            } else {
                fetchErrorHandler();
                document.querySelector("#page-preloader").style.display = "none";
                console.log(error);
            }
        });
}

export default setPertandinganPage;