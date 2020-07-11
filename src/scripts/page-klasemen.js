import getFootballData from "./app-datasource.js";

const generateKlasemenPage = (parent, jsonData) => {
    
}

const setKlasemenPage = () => {
    let parent = document.querySelector("#pageContent");
    parent.innerHTML = "";

    getFootballData("competitions/2021/standings")
        .then(data => generateKlasemenPage(parent, data.standings))
        .catch(error => console.log(error));
}

export default setKlasemenPage;