import footballAppConstant from "./app-constants.js";

const getFootballDataInCaches = (endPoint) => {
    const proxyurl = footballAppConstant.proxyUrl;
    const url = `${footballAppConstant.baseUrl}${endPoint}`;

    if("caches" in window) {
        return caches.match(proxyurl + url).then(response => response.json());
    }
    return Promise.reject("No item");
}

const getFootballData = (signal, endPoint) => {
    /* possible error: registered clients are allowed for 10 requests/minute (free plan). */
    /* if requset exceed response will be 429 (Too Many Requests) */
    /* avoid "No Access-Control-Allow-Origin header" */
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
        if(response.status !== 200) {
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

export { getFootballDataInCaches, getFootballData };