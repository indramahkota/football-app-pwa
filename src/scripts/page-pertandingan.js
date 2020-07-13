import getFootballData from "./app-datasource.js";
import generateInitialPage from "./gen-initial-page.js";
import generateSelectCompetition from "./gen-select-competitions.js";

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

const activateSelectFunctionality = () => {
    const select = document.querySelectorAll("select");
    M.FormSelect.init(select);

    const instance = document.querySelector("#select-competition");
    instance.addEventListener("change", event => {
        changeMatchContent(event.target.value);
    });
}

const changeMatchContent = id => {
    document.querySelector("#page-content").innerHTML = "";
    document.querySelector("#page-preloader").style.display = "block";
    getFootballData(`competitions/${id}/matches`)
        .then(response => response.json())
        .then(data =>{
            generateMatchContent(document.querySelector("#page-content"), data.matches);
            document.querySelector("#page-preloader").style.display = "none";
        })
        .catch(error => console.log(error));
}

const setPertandinganPage = () => {
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    generateInitialPage(parent);
    document.querySelector("#page-preloader").style.display = "block";
    
    getFootballData("competitions")
        .then(response => response.json())
        .then(data => data.competitions.filter(key => key.plan === "TIER_ONE"))
        .then(data => {
            generateSelectCompetition(document.querySelector("#select-content"), data);
            return getFootballData(`competitions/${data[0].id}/matches`);
        })
        .then(response => response.json())
        .then(data => {
            generateMatchContent(document.querySelector("#page-content"), data.matches);
            document.querySelector("#page-preloader").style.display = "none";
            activateSelectFunctionality();
        })
        .catch(error => console.log(error));
}

export default setPertandinganPage;