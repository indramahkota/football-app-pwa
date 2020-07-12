import getFootballData from "./app-datasource.js";

const generateTeamPage = (parent, jsonData) => {
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
                <div class="card">
                    <div class="card-image">
                        <img src="${element.crestUrl}">
                        <a class="btn-floating halfway-fab waves-effect waves-light cyan lighten-2">
                            <i class="material-icons">favorite_border</i>
                        </a>
                    </div>
                    <div class="divider"></div>
                    <div class="card-content">
                        <span class="card-title truncate">${element.name}</span>
                        <p class="cut-text">Area: ${element.area.name}</p>
                        <p class="cut-text">Address: ${element.address}</p>
                    </div>
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

const setTeamPage = () => {
    document.querySelector("#preloader").style.display = "block";
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    getFootballData("competitions/2021/teams")
        .then(data => generateTeamPage(parent, data.teams))
        .catch(error => console.log(error));
}

export default setTeamPage;