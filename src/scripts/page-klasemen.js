import getFootballData from "./app-datasource.js";
import generateInitialPage from "./gen-initial-page.js";
import generateSelectCompetition from "./gen-select-competitions.js";

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
    instance.addEventListener("change", event => {
        changeClassementContent(event.target.value);
    });
}

const changeClassementContent = id => {
    document.querySelector("#page-content").innerHTML = "";
    document.querySelector("#page-preloader").style.display = "block";
    getFootballData(`competitions/${id}/standings`)
        .then(response => response.json())
        .then(data =>{
            generateClassementContent(document.querySelector("#page-content"), data.standings[0]);
            document.querySelector("#page-preloader").style.display = "none";
        })
        .catch(error => console.log(error));
}

const setKlasemenPage = () => {
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    generateInitialPage(parent);
    document.querySelector("#page-preloader").style.display = "block";

    getFootballData("competitions")
        .then(response => response.json())
        .then(data => data.competitions.filter(key => key.plan === "TIER_ONE"))
        .then(data => {
            generateSelectCompetition(document.querySelector("#select-content"), data);
            return getFootballData(`competitions/${data[0].id}/standings`);
        })
        .then(response => response.json())
        .then(data => {
            generateClassementContent(document.querySelector("#page-content"), data.standings[0]);
            document.querySelector("#page-preloader").style.display = "none";
            activateSelectFunctionality();
        })
        .catch(error => console.log(error));
}

export default setKlasemenPage;