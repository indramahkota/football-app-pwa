import { getAllFavoriteTeamData } from "./app-db-operation.js";

const generateTimContent = (parent, jsonData) => {
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
                    <a href="#timdetail?teamId=${element.teamId}">
                        <div><span class="new badge pink" data-badge-caption="Favorit"></span></div>
                        <div class="card-panel">
                            <div class="row">
                                <div class="col s4">
                                    <img class="small-team-image" src="${element.image}" alt="Team Image" class="circle responsive-img">
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

const setTimFavoritPage = () => {
    let parent = document.querySelector("#pageContent");

    getAllFavoriteTeamData()
        .then(data => generateTimContent(parent, data))
        .catch(error => {
            console.log(error.message);
            parent.innerHTML = `
                <div class="row">
                    <div class="col s12">
                        <div class="card card-content padding-10">
                            <div class="card-title" style="padding: 0px 8px 12px;">Mohon maaf, data yang Anda minta tidak tersedia.</div>
                        </div>
                    </div>
                </div>
            `;
        });
}

export default setTimFavoritPage;