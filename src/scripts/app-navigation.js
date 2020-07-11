import setButtonActive from "./button-state.js";
import setPertandinganPage from "./page-pertandingan.js";
import setKlasemenPage from "./page-klasemen.js";
import setTeamPage from "./page-team.js";

const navigationApp = () => {
    const sidenav = document.querySelector(".sidenav");
    setButtonActive("menu-pertandingan");

    document.querySelectorAll(".sidenav a, .topnav a").forEach(element => {
        const parent = element.parentElement;

        /* return if the parent <a> element doesn't have menu text in the id */
        if(!parent.id.includes("menu")) return;

        /* add event listener on each <a> element in topnav and sidenav */
        /* only id with menu-... */
        element.addEventListener("click", () => {
            M.Sidenav.getInstance(sidenav).close();
            /* set parent <a> element, "li" for active state */
            /* this step will reload/change the page */
            setButtonActive(parent.getAttribute("id"));
        });
    });

    const initPage = () => {
        let page = window.location.hash.substr(1);
        if (page === "") page = "pertandingan";

        switch (page) {
            case "pertandingan":
                setPertandinganPage();
                setButtonActive("menu-pertandingan");
                break;

            case "klasemen":
                setKlasemenPage();
                setButtonActive("menu-klasemen");
                break;

            case "team":
                setTeamPage();
                setButtonActive("menu-team");
                break;
            
            case "keluar":
                let modal = document.querySelector("#keluar-modal");
                M.Sidenav.getInstance(sidenav).close();
                M.Modal.getInstance(modal).open();
                break;

            default :
                break;
        
        }
    }
    initPage();

    window.onhashchange = () => {
        initPage();
    }
}

export default navigationApp;