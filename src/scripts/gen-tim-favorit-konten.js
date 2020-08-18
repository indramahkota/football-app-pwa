import nullImage from "../assets/images/null-image.jpg";

const generateFavoriteTimContent = (parent, jsonData) => {
    let htmlHelper = `<div class="row">`;
    if(jsonData.length === 0) {
        parent.innerHTML = `
            <div class="row">
                <div class="col s12">
                    <div class="card card-content padding-10">
                        <div class="card-title" style="padding: 0px 8px 12px;">Mohon maaf, data yang Anda minta tidak tersedia.</div>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    jsonData.forEach(element => {
        htmlHelper += `
                <div class="col s12 m6">
                    <a href="#tim/detail?id=${element.teamId}">
                        <div><span class="new badge pink" data-badge-caption="Favorit"></span></div>
                        <div class="card-panel">
                            <div class="row">
                                <div class="col s4">
                                    <img class="small-team-image" src="${element.image}" onerror="this.onerror=null;this.src='${nullImage}';console.log('Gambar ini diganti karena 404 not found.'); alt="Team Image" class="circle responsive-img">
                                </div>
                                <div class="col s8" style="padding:0;margin:0;">
                                    <span class="card-title black-text truncate" style="padding:0;margin:0;">${element.nama}</span>
                                    <p class="cut-text" style="padding:0;margin:0;">${element.area}</p>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
        `;
    });
    htmlHelper += `</div>`;
    parent.innerHTML = htmlHelper;
}

export default generateFavoriteTimContent;