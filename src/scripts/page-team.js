import getFootballData from "./app-datasource.js";

const generateTeamPage = (parent, jsonData) => {
    let htmlHelper = "";
    jsonData.forEach(element => {
        htmlHelper += `
        <div class="col l6 m6 s12">
            <div id="club-articles" class="card">
                <div class="card-image waves-effect waves-block waves-light">
                    <img src="${element.crestUrl}" alt="Football Club Badge"/>
                </div>
                <div class="divider"></div>
                <div class="card-content">
                    <span class="card-title truncate">${element.name}</span>
                    <p class="cut-text">Address: ${element.address}</p>
                </div>
            </div>
        </div>
        `;
    }); 
    parent.innerHTML = htmlHelper;
}

const setTeamPage = () => {
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    getFootballData("competitions/2021/teams")
        .then(data => generateTeamPage(parent, data.teams))
        .catch(error => console.log(error));
}

export default setTeamPage;