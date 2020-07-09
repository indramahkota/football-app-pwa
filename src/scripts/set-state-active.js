const setButtonActive = id => {
    /* return if no id reference === null */
    if(id === null) return;

    document.querySelectorAll(".sidenav li, .topnav li").forEach(element => {
        /* check if element has id and includes menu-... */
        if(element.id.includes("menu")) {
            element.classList.remove("active");
        }
    });

    /* set active onlu for given id */
    document.querySelectorAll(`#${id}`).forEach(element => {
        element.className += " active";
    });
};

export default setButtonActive;