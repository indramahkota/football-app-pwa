import footballAppConstant from "./app-constants.js";

const getFootballData = (signal, endPoint) => {
    /* registered clients are allowed for 10 requests/minute (free plan). */
    /* if requset exceed response will be 429 (Too Many Requests) */
    /* avoid "No Access-Control-Allow-Origin header" */
    /* possible error: (Too Many Requests) */
    /* ref: https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe */
    const proxyurl = footballAppConstant.proxyUrl;
    const url = `${footballAppConstant.baseUrl}${endPoint}`;

    return fetch(proxyurl + url, {
        headers: {
            "X-Auth-Token": footballAppConstant.apiKey
        },
        signal: signal
    })
    .then(response => {
        if(response.status != 200) {
            return Promise.reject(new Error(response.statusText));
        }
        return response;
    })
    .then(response => response.json())
    .then(jsonData => {
        if(!jsonData.errorCode || jsonData.errorCode === null) {
            return jsonData;
        }
        return Promise.reject(`Code: ${jsonData.errorCode}, ${jsonData.message}`);
    })
}

export default getFootballData;