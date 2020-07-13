import getFootballData from "./app-datasource.js";
import generateInitialPage from "./gen-initial-page.js";
import generateSelectCompetition from "./gen-select-competitions.js";
import fetchErrorHandler from "./app-error-handler.js";

const controller = new AbortController();
const signal = controller.signal;

const generateMatchContent = (parent, jsonData) => {
    let htmlHelper = "";
    jsonData.forEach(element => {
        htmlHelper += `
            <div class="col s12 m6">
                <div class="match-card card">
                    <table class="striped centered grey-text text-darken-2">
                        <thead>
                            <th>${element.homeTeam.name}</th>
                            <th>vs</th>
                            <th>${element.awayTeam.name}</th>
                        </thead>
                        <tbody>
                            <td>${element.score.fullTime.homeTeam != null ? element.score.fullTime.homeTeam : "tidak tersedia"}</td>
                            <td>:</td>
                            <td>${element.score.fullTime.awayTeam != null ? element.score.fullTime.awayTeam : "tidak tersedia"}</td>
                        </tbody>
                    </table>
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