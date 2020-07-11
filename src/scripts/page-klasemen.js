import footballAppConstant from "./app-constants.js";

const generateKlasemenPage = () => {
    let content = document.querySelector("#pageContent");
    content.innerHTML = "";
}

const setKlasemenPage = () => {
    console.log("klasemen page");

    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = `${footballAppConstant.baseUrl}competitions/2021/standings`;
    fetch(proxyurl + url, {
        headers: {
        "X-Auth-Token": footballAppConstant.apiKey
        }
    }).then(response => {
        return response.json();
    }).then(responseJson => {
        if(responseJson.standings) {
            generateKlasemenPage();
        } else {
            console.log("error: promise rejeted.");
        }
    })
    .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"));
}

export default setKlasemenPage;