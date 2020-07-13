import {setButtonActive, setTitleForActivePage} from "./app-state.js";
import setPertandinganPage from "./page-pertandingan.js";
import setKlasemenPage from "./page-klasemen.js";
import setTimPage from "./page-tim.js";

let currentController = new AbortController();
let currentSignal = currentController.signal;

const setCurrentControllerSignal = () => {
    currentController.abort();
    const newController = new AbortController();
    currentController = newController;
    currentSignal = currentController.signal;
}

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
        let page = location.hash.substr(1);
        if (page === "") page = "pertandingan";

        setCurrentControllerSignal();

        switch (page) {
            case "pertandingan":
                setPertandinganPage(currentSignal);
                setTitleForActivePage("Pertandingan");
                setButtonActive("menu-pertandingan");
                break;

            case "klasemen":
                setKlasemenPage(currentSignal);
                setTitleForActivePage("Klasemen");
                setButtonActive("menu-klasemen");
                break;

            case "tim":
                setTimPage(currentSignal);
                setTitleForActivePage("Tim");
                setButtonActive("menu-tim");
                break;
            
            case "keluar":
                const modal = document.querySelector("#keluar-modal");
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