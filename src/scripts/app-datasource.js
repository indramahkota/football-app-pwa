import footballAppConstant from "./app-constants.js";

const getFootballData = (endPoint) => {
    /* avoid "No Access-Control-Allow-Origin header" */
    /* possible error: (Too Many Requests) */
    /* ref: https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe */
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = `${footballAppConstant.baseUrl}${endPoint}`;

    return fetch(proxyurl + url, {
        headers: {
        "X-Auth-Token": footballAppConstant.apiKey
        }
    })
    .then(response => response.json())
    .then(responseJson => Promise.resolve(responseJson))
    .catch(error => Promise.reject(error));
}

export default getFootballData;