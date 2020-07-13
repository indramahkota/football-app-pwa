const fetchErrorHandler = () => {
    const sidenav = document.querySelector(".sidenav");
    const sidenavInstance = M.Sidenav.getInstance(sidenav)

    if(sidenavInstance.isOpen) {
        sidenavInstance.close();
    }

    const modal = document.querySelector("#error-modal");
    M.Modal.getInstance(modal).open();
}

export default fetchErrorHandler;