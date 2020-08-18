import nullImage from "../assets/images/null-image.jpg";

const generateTimContent = (parent, jsonData) => {
    document.querySelector("#page-preloader").style.display = "none";
    let htmlHelper = "";
    if(jsonData.length === 0) {
        parent.innerHTML = `
            <div class="col s12">
                <div class="card card-content padding-10">
                    <div class="card-title" style="padding: 0px 8px 12px;">Mohon maaf, data yang Anda minta tidak tersedia.</div>
                </div>
            </div>
        `;
        return;
    }
    jsonData.forEach(element => {
        /* Team Image dapat merespon 404 */
        //console.log(`${typeof element.crestUrl} ${element.crestUrl === null ? "null" : ""} ${element.crestUrl === "" ? "kosong" : "" }`);
        const teamImage = (element.crestUrl !== null && element.crestUrl !== "") ? element.crestUrl.replace(/^http:\/\//i, "https://") : nullImage;
        htmlHelper += `
            <div class="col s12 m6">
                <a href="#tim/detail?id=${element.id}">
                    ${element.favorite ? `<div><span class="new badge pink" data-badge-caption="Favorit"></span></div>` : ""}
                    <div class="card-panel">
                        <div class="row">
                            <div class="col s4">
                                <img class="small-team-image" src="${teamImage}"
                                    onerror="this.onerror=null;this.src='${nullImage}';console.log('Gambar ini diganti karena 404 not found.');" alt="Team Image" class="circle responsive-img">
                            </div>
                            <div class="col s8" style="padding:0;margin:0;">
                                <span class="card-title black-text truncate" style="padding:0;margin:0;">${element.name}</span>
                                <p class="cut-text" style="padding:0;margin:0;">${element.area.name}</p>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
    });
    parent.innerHTML = htmlHelper;
}

export default generateTimContent;