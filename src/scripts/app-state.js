const setButtonActive = id => {
    document.querySelectorAll(".sidenav li, .topnav li").forEach(element => {
        /* check if element has id and includes menu-... */
        if(element.id.includes("menu")) {
            element.classList.remove("active");
        }
    });

    /* remove all active and return */
    if(id === null || id === "") return;

    /* set active only for given id */
    document.querySelectorAll(`#${id}`).forEach(element => {
        element.className += " active";
    });
};

const setTitleForActivePage = page => {
    document.title = `Football App | ${page}`;
}

export {setButtonActive, setTitleForActivePage};