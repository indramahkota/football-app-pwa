const generateSelectCompetition = (parent, jsonData, competitionId) => {
    const compId = Number(competitionId);
    let htmlHelper = `
        <div class="input-field col s12">
            <select id="select-competition">
    `;
    jsonData.forEach(element => {
        if(element.id === compId) {
            htmlHelper += `<option selected value="${element.id}">${element.name}</option>`;
        } else {
            htmlHelper += `<option value="${element.id}">${element.name}</option>`;
        } 
    });
    htmlHelper += `
            </select>
            <label>Pilih Kompetisi</label>
        </div>
    `;
    parent.innerHTML = htmlHelper;
}

export default generateSelectCompetition;