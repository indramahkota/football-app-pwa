import getFootballData from "./app-datasource.js";

const generateKlasemenPage = (parent, jsonData) => {
    let htmlHelper = `
        <div class="row">
            <div class="input-field col s12">
                <select>
                    <option value="" disabled selected>Pilih opsi disini</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                </select>
                <label>Pilih Kompetisi</label>
            </div>
        </div>
        <div class="row">
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
        </div>
    `;

    parent.innerHTML = htmlHelper;
    document.querySelector("#preloader").style.display = "none";

    activateSelectFunctionality();
}

const activateSelectFunctionality = () => {
    var select = document.querySelectorAll("select");
    M.FormSelect.init(select);
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