/* Shift + F12 to Find All References */
const errorPopUpHandler = (message, recommendation, tombol = "Ya") => {
    const sidenav = document.querySelector(".sidenav");
    const sidenavInstance = M.Sidenav.getInstance(sidenav)

    if(sidenavInstance.isOpen) sidenavInstance.close();

    const modal = document.querySelector("#error-modal");
    modal.querySelector("#error-modal-message").textContent = message;
    modal.querySelector("#error-modal-recommendation").textContent = recommendation;
    modal.querySelector('#error-modal-button').textContent = tombol;

    M.Modal.getInstance(modal).open();
}

export default errorPopUpHandler;