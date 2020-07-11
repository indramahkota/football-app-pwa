import getFootballData from "./app-datasource.js";

const generatePertandinganPage = (parent, jsonData) => {
    
}

const setPertandinganPage = () => {
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    getFootballData("competitions/2021/matches")
        .then(data => generatePertandinganPage(parent, data.matches))
        .catch(error => console.log(error));
}

export default setPertandinganPage;