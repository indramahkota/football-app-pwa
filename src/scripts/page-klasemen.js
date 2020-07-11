import getFootballData from "./app-datasource.js";

const generateKlasemenPage = (parent, jsonData) => {
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

    let tabledata = jsonData.table;
    tabledata.forEach(element => {
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
    document.querySelector("#preloader").style.display = "none";
}

const setKlasemenPage = () => {
    document.querySelector("#preloader").style.display = "block";
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    getFootballData("competitions/2021/standings")
        .then(data => generateKlasemenPage(parent, data.standings[0]))
        .catch(error => console.log(error));
}

export default setKlasemenPage;