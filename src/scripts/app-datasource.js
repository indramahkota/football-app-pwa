import footballAppConstant from "./app-constants.js";

const getFootballData = (signal, endPoint) => {
    /* registered clients are allowed for 10 requests/minute (free plan). */
    /* if requset exceed response will be 429 (Too Many Requests) */
    /* avoid "No Access-Control-Allow-Origin header" */
    /* possible error: (Too Many Requests) */
    /* ref: https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe */
    const proxyurl = "https://indratestapp.herokuapp.com/";
    const url = `${footballAppConstant.baseUrl}${endPoint}`;

    return fetch(proxyurl + url, {
        headers: {
            "X-Auth-Token": footballAppConstant.apiKey
        },
        signal: signal
    })
    .then(response => response.json())
    .then(jsonData => {
        if(!jsonData.errorCode || jsonData.errorCode === null) {
            return jsonData;
        } else {
            return Promise.reject(`Error: ${jsonData.errorCode}, ${jsonData.message}`);
        }
    })
}

export default getFootballData;