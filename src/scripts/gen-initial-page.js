const generateInitialPage = parent => {
    const htmlHelper = `
        <div id="select-content" class="row"></div>
        <div id="page-content" class="row"></div>
        <div class="container center-align" id="page-preloader">
            <div class="preloader-wrapper big active">
                <div class="spinner-layer spinner-blue-only">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div>
                    <div class="gap-patch">
                        <div class="circle"></div>
                    </div>
                    <div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    parent.innerHTML = htmlHelper;
}

export default generateInitialPage;