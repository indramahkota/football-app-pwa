const generateCompetition = (parent, jsonData, competitionId) => {
    const compId = Number(competitionId);
    let htmlHelper = `
        <label>
            Pilih Kompetisi
            <div class="input-field col s12" style="margin:0;padding:0;">
                <select id="select-competition">
    `;
    jsonData.forEach(element => {
        if(element.id === compId) {
            htmlHelper += `
                    <option selected value="${element.id}">${element.name}</option>
            `;
        } else {
            htmlHelper += `
                    <option value="${element.id}">${element.name}</option>
            `;
        } 
    });
    htmlHelper += `
                </select>
            </div>
        </label>
    `;
    parent.innerHTML = htmlHelper;
}

export default generateCompetition;