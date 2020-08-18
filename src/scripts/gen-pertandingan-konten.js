import { getFormattedDate } from "./app-utilities";

const generateMatchContent = (parent, jsonData) => {
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
        const badgeColor = () => element.status === "FINISHED" ? "" : "red";
        const badgeText = () => element.status === "FINISHED" ? "Selesai" : "Belum Selesai";
        htmlHelper += `
            <div class="col s12 m6">
                <div class="card card-content padding-10">
                    <div class="row">
                        <div class="card-title" style="padding: 0px 8px 12px;">${getFormattedDate(element.utcDate)}</div>
                        <div style="padding-left:8px">Status<span class="new badge ${badgeColor()}" data-badge-caption="${badgeText()}"></span></div>
                        <div class="divider"></div>
                    </div>
                    <div class="row" style="padding-top:12px">
                        <div class="col center side-percentage">
                            <div class="cut-text min-height-45">
                                ${element.homeTeam.name}
                            </div>
                        </div>
                        <div class="col center mid-percentage">
                            <div class="cut-text">vs</div>
                        </div>
                        <div class="col center side-percentage">
                            <div class="cut-text min-height-45">
                                ${element.awayTeam.name}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col center side-percentage">
                            <div>
                                ${element.score.fullTime.homeTeam != null ? element.score.fullTime.homeTeam : "~"}
                            </div>
                        </div>
                        <div class="col center mid-percentage">
                            <div>:</div>
                        </div>
                        <div class="col center side-percentage">
                            <div>
                                ${element.score.fullTime.awayTeam != null ? element.score.fullTime.awayTeam : "~"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    parent.innerHTML = htmlHelper;
}

export default generateMatchContent;