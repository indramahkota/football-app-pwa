import getFootballData from "./app-datasource.js";

const generateMatchPage = (parent) => {
    const htmlHelper = `
        <div id="select-content" class="row"></div>
        <div id="match-content" class="row"></div>
        <div class="container center-align" id="match-preloader">
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

const generateMatchContent = (parent, jsonData) => {
    let htmlHelper = "";
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
    parent.innerHTML = htmlHelper;
}

const activateSelectFunctionality = () => {
    const select = document.querySelectorAll("select");
    M.FormSelect.init(select);

    const instance = document.querySelector("#select-competition");
    instance.addEventListener("change", event => {
        changeMatchContent(event.target.value);
    });
}

const changeMatchContent = id => {
    document.querySelector("#match-content").innerHTML = "";
    document.querySelector("#match-preloader").style.display = "block";
    getFootballData(`competitions/${id}/matches`)
        .then(response => response.json())
        .then(data =>{
            generateMatchContent(document.querySelector("#match-content"), data.matches);
            document.querySelector("#match-preloader").style.display = "none";
        })
        .catch(error => console.log(error));
}

const setPertandinganPage = () => {
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    generateMatchPage(parent);
    document.querySelector("#match-preloader").style.display = "block";
    
    getFootballData("competitions")
        .then(response => response.json())
        .then(data => data.competitions.filter(key => key.plan === "TIER_ONE"))
        .then(data => {
            generateSelectCompetition(document.querySelector("#select-content"), data);
            return getFootballData(`competitions/${data[0].id}/matches`);
        })
        .then(response => response.json())
        .then(data => {
            generateMatchContent(document.querySelector("#match-content"), data.matches);
            document.querySelector("#match-preloader").style.display = "none";
            activateSelectFunctionality();
        })
        .catch(error => console.log(error));
}

export default setPertandinganPage;