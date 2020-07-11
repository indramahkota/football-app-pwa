import footballAppConstant from "./app-constants.js";

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

    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = `${footballAppConstant.baseUrl}competitions/2021/teams`;
    fetch(proxyurl + url, {
        headers: {
        "X-Auth-Token": footballAppConstant.apiKey
        }
    }).then(response => {
        return response.json();
    }).then(responseJson => {
        if(responseJson.teams) {
            generateTeamPage(responseJson.teams);
        } else {
            console.log("error: promise rejeted.");
        }
    })
    .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"));
}

export default setTeamPage;