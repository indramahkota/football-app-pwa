const generateClassementContent = (parent, jsonData) => {
    document.querySelector("#page-preloader").style.display = "none";
    let htmlHelper = "";
    if(jsonData.table.length === 0) {
        parent.innerHTML = `
            <div class="col s12">
                <div class="card card-content padding-10">
                    <div class="card-title" style="padding: 0px 8px 12px;">Mohon maaf, data yang Anda minta tidak tersedia.</div>
                </div>
            </div>
        `;
        return;
    }
    htmlHelper += `
        <div class="col s12" style="overflow-x:auto;">
            <table>
                <thead>
                    <tr>
                        <th>Club</th>
                        <th>MP</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GF</th>
                        <th>GA</th>
                        <th>GD</th>
                        <th>Pts</th>
                    </tr>
                </thead>
                <tbody>
    `;
    jsonData.table.forEach(element => {
        htmlHelper += `
                    <tr>
                        <td>${element.team.name}</td>
                        <td>${element.playedGames}</td>
                        <td>${element.won}</td>
                        <td>${element.draw}</td>
                        <td>${element.lost}</td>
                        <td>${element.goalsFor}</td>
                        <td>${element.goalsAgainst}</td>
                        <td>${element.goalDifference}</td>
                        <td>${element.points}</td>
                    </tr>
        `;
    });
    htmlHelper += `
                </tbody>
            </table>
        </div>
    `;
    parent.innerHTML = htmlHelper;
}

export default generateClassementContent;