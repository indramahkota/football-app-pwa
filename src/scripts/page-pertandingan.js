import getFootballData from "./app-datasource.js";

const generatePertandinganPage = () => {
    let content = document.querySelector("#pageContent");
    content.innerHTML = "";
}

const setPertandinganPage = () => {
    console.log("pertandingan page");

    getFootballData("competitions/2021/matches")
        .then(data => generatePertandinganPage(data.matches))
        .catch(error => console.log(error));
}

export default setPertandinganPage;