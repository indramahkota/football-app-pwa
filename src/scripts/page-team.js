import getFootballData from "./app-datasource.js";

const generateTeamPage = (jsonData) => {
    let content = document.querySelector("#pageContent");
    content.innerHTML = "";

    let htmlHelper = "";
    jsonData.forEach(element => {
        htmlHelper += `
        <div class="col l6 m6 s12">
            <div id="club-articles" class="card">
            <div class="card-image waves-effect waves-block waves-light">
                <img src="${element.crestUrl}" alt="Football Club Badge"/>
            </div>
            <div class="card-content">
                <span class="card-title truncate">${element.name}</span>
            </div>
            </div>
        </div>
        `;
    }); 
    content.innerHTML = htmlHelper;
}

const setTeamPage = () => {
    console.log("team page");

    getFootballData("competitions/2021/teams")
        .then(data => generateTeamPage(data.teams))
        .catch(error => console.log(error));
}

export default setTeamPage;