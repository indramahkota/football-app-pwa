import footballAppConstant from "./app-constants.js";

const customUrl = footballAppConstant.proxyUrl + footballAppConstant.baseUrl;

/* prefix await before return a Promise */
const getFootballDataInCaches = async endPoint => {
    if("caches" in window) {
        const response = await caches.match(customUrl + endPoint);
        /* if no cache, response will be undefined */
        if (response !== undefined && response.status === 200) {
            return await Promise.resolve(response.json());
        }
        return await Promise.reject(new Error("No cache."));
    }
    return await Promise.reject(new Error("No cache."));
}

const getFootballData = async (signal, endPoint) => {
    /* possible error: registered clients are allowed for 10 requests/minute (free plan). */
    /* if requset exceed response will be 429 (Too Many Requests) */
    /* avoid "No Access-Control-Allow-Origin header" */
    /* ref: https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe */
    const response = await fetch(customUrl + endPoint, {
        headers: {
            "X-Auth-Token": footballAppConstant.apiKey
        },
        signal: signal
    });
    if (response !== undefined && response.status === 200) {
        return await Promise.resolve(response.json());
    }
    return await Promise.reject(new Error(`Code: ${response.status}, ${response.statusText}`));
}

export { getFootballDataInCaches, getFootballData };