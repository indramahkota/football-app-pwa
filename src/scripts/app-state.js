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

const setTabsActive = id => {
    document.querySelectorAll("#team-tabs a").forEach(element => {
        const elemParent = element.parentElement;
        elemParent.classList.remove("deep-purple");
        elemParent.classList.remove("lighten-5");
        
        element.classList.remove("active");
        element.classList.remove("red-text");
        element.className += " grey-text";

    });
    const reference = document.querySelector(`#${id}`);
    reference.classList.remove("grey-text");
    reference.className += " red-text";
    reference.className += " active";

    const parent = reference.parentElement;
    parent.className += " deep-purple";
    parent.className += " lighten-5";
};

const setTitleForActivePage = page => {
    document.title = `Football App | ${page}`;
}

export { setButtonActive, setTabsActive, setTitleForActivePage };