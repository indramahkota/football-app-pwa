import getFootballData from "./app-datasource.js";

const generateClassementPage = (parent) => {
    const htmlHelper = `
        <div id="select-content" class="row"></div>
        <div id="classement-content" class="row"></div>
        <div class="container center-align" id="classement-preloader">
            <div class="preloader-wrapper big active">
                <div class="spinner-layer spinner-blue-only">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div>
                    <div class="gap-patch">
                        <div class="circle"></div>
                    </div>
                    <div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    parent.innerHTML = htmlHelper;
}

const generateSelectCompetition = (parent, jsonData) => {
    let htmlHelper = `
        <div class="input-field col s12">
            <select id="select-competition">
    `;
    jsonData.forEach(element => {
        htmlHelper += `
                <option value="${element.id}">${element.name}</option>
        `;
    });
    htmlHelper += `
            </select>
            <label>Pilih Kompetisi</label>
        </div>
    `;
    parent.innerHTML = htmlHelper;
}

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
    const tabledata = jsonData.table;
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
    document.querySelector("#classement-content").innerHTML = "";
    document.querySelector("#classement-preloader").style.display = "block";
    getFootballData(`competitions/${id}/standings`)
        .then(response => response.json())
        .then(data =>{
            generateClassementContent(document.querySelector("#classement-content"), data.standings[0]);
            document.querySelector("#classement-preloader").style.display = "none";
        })
        .catch(error => console.log(error));
}

const setKlasemenPage = () => {
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    generateClassementPage(parent);
    document.querySelector("#classement-preloader").style.display = "block";

    getFootballData("competitions")
        .then(response => response.json())
        .then(data => data.competitions.filter(key => key.plan === "TIER_ONE"))
        .then(data => {
            generateSelectCompetition(document.querySelector("#select-content"), data);
            return getFootballData(`competitions/${data[0].id}/standings`);
        })
        .then(response => response.json())
        .then(data => {
            generateClassementContent(document.querySelector("#classement-content"), data.standings[0]);
            document.querySelector("#classement-preloader").style.display = "none";
            activateSelectFunctionality();
        })
        .catch(error => console.log(error));
}

export default setKlasemenPage;