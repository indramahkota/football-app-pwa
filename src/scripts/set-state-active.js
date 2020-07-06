const setButtonActive = id => {
    document.querySelectorAll(".sidenav li, .topnav li").forEach(elm => {
        elm.classList.remove("active");
    });
    document.querySelectorAll(`#${id}`).forEach(elm => {
        elm.className += " active";
    });
};

export default setButtonActive;