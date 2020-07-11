import getFootballData from "./app-datasource.js";

const generateKlasemenPage = () => {
    let content = document.querySelector("#pageContent");
    content.innerHTML = "";
}

const setKlasemenPage = () => {
    console.log("klasemen page");

    getFootballData("competitions/2021/standings")
        .then(data => generateKlasemenPage(data.standings))
        .catch(error => console.log(error));
}

export default setKlasemenPage;