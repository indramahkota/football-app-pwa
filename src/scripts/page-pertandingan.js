import getFootballData from "./app-datasource.js";

const generatePertandinganPage = (parent, jsonData) => {
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
    `;

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

    htmlHelper += `
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

const setPertandinganPage = () => {
    document.querySelector("#preloader").style.display = "block";
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    getFootballData("competitions/2021/matches")
        .then(data => generatePertandinganPage(parent, data.matches))
        .catch(error => console.log(error));
}

export default setPertandinganPage;