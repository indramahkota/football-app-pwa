import footballAppConstant from "./app-constants.js";

const generatePertandinganPage = () => {
    let content = document.querySelector("#pageContent");
    content.innerHTML = "";
}

const setPertandinganPage = () => {
    console.log("pertandingan page");

    /* avoid "No Access-Control-Allow-Origin header" */
    /* possible error: (Too Many Requests) */
    /* ref: https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe */
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = `${footballAppConstant.baseUrl}competitions/2021/matches`;
    fetch(proxyurl + url, {
        headers: {
        "X-Auth-Token": footballAppConstant.apiKey
        }
    }).then(response => {
        return response.json();
    }).then(responseJson => {
        if(responseJson.matches) {
            generatePertandinganPage();
        } else {
            console.log("error: promise rejeted.");
        }
    })
    .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"));
}

export default setPertandinganPage;