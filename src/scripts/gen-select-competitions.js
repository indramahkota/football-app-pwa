const generateSelectCompetition = (parent, jsonData) => {
    let htmlHelper = `
        <div class="input-field col s12">
            <select id="select-competition">
    `;
    jsonData.forEach(element => {
        htmlHelper += `
                <option value="${element.id}">${element.name}</option>
        `;
    });
    htmlHelper += `
            </select>
            <label>Pilih Kompetisi</label>
        </div>
    `;
    parent.innerHTML = htmlHelper;
}

export default generateSelectCompetition;