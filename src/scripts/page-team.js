import getFootballData from "./app-datasource.js";
import generateInitialPage from "./gen-initial-page.js";
import generateSelectCompetition from "./gen-select-competitions.js";
import fetchErrorHandler from "./app-error-handler.js";

import nullImage from "../assets/images/null-image.jpg";

const generateTeamContent = (parent, jsonData) => {
    let htmlHelper = "";
    jsonData.forEach(element => {
        /* Team Image dapat merespon 404 */
        htmlHelper += `
            <div class="col s12 m6">
                <div class="card">
                    <div class="card-image">
                        <img alt="Team Image" src="${element.crestUrl !== null
                            && element.crestUrl !== ""
                            ? element.crestUrl : nullImage}"
                            onerror="this.onerror=null;this.src='${nullImage}';"
                            >
                        <a class="btn-floating halfway-fab waves-effect waves-light cyan lighten-2">
                            <i class="material-icons">favorite_border</i>
                        </a>
                    </div>
                    <div class="divider"></div>
                    <div class="card-content min-height-175">
                        <span class="card-title truncate">${element.name}</span>
                        <p class="cut-text">Area: ${element.area.name}</p>
                        <p class="cut-text">Address: ${element.address}</p>
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
        changeTeamContent(signal, event.target.value);
    });
}

const changeTeamContent = (signal, id) => {
    document.querySelector("#page-content").innerHTML = "";
    document.querySelector("#page-preloader").style.display = "block";
    getFootballData(signal, `competitions/${id}/teams`)
        .then(data =>{
            generateTeamContent(document.querySelector("#page-content"), data.teams);
            document.querySelector("#page-preloader").style.display = "none";
        })
        .catch(error => console.log(error));
}

const setTeamPage = (signal) => {
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    generateInitialPage(parent);
    document.querySelector("#page-preloader").style.display = "block";

    getFootballData(signal, "competitions")
        .then(data => data.competitions.filter(key => key.plan === "TIER_ONE"))
        .then(data => {
            generateSelectCompetition(document.querySelector("#select-content"), data);
            activateSelectFunctionality();
            return getFootballData(signal, `competitions/${data[0].id}/teams`);
        })
        .then(data => {
            generateTeamContent(document.querySelector("#page-content"), data.teams);
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

export default setTeamPage;