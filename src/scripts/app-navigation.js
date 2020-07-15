import { setButtonActive, setTitleForActivePage } from "./app-state.js";
import setPertandinganPage from "./page-pertandingan.js";
import setKlasemenPage from "./page-klasemen.js";
import setTimPage from "./page-tim.js";
import setTimFavoritPage from "./page-timfavorit.js";
import { getCompetitionId } from "./app-utilities.js";

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
        if(page === "") page = "pertandingan";

        setCurrentControllerSignal();

        if(page.includes("pertandingan?competitionId=")) {
            setPertandinganPage(currentSignal,
                getCompetitionId(page.replace("pertandingan", "")));
            setTitleForActivePage("Pertandingan");
            setButtonActive("menu-pertandingan");
            return;
        }

        if(page.includes("klasemen?competitionId=")) {
            setKlasemenPage(currentSignal,
                getCompetitionId(page.replace("klasemen", "")));
            setTitleForActivePage("Klasemen");
            setButtonActive("menu-klasemen");
            return;
        }

        if(page.includes("tim?competitionId=")) {
            setTimPage(currentSignal,
                getCompetitionId(page.replace("tim", "")));
            setTitleForActivePage("Tim");
            setButtonActive("menu-tim");
            return;
        }

        switch (page) {
            case "pertandingan":
                setPertandinganPage(currentSignal, -9999);
                setTitleForActivePage("Pertandingan");
                setButtonActive("menu-pertandingan");
                break;

            case "klasemen":
                setKlasemenPage(currentSignal, -9999);
                setTitleForActivePage("Klasemen");
                setButtonActive("menu-klasemen");
                break;

            case "tim":
                setTimPage(currentSignal, -9999);
                setTitleForActivePage("Tim");
                setButtonActive("menu-tim");
                break;

            case "timfavorit":
                setTimFavoritPage(currentSignal, -9999);
                setTitleForActivePage("Tim Favorite");
                setButtonActive("");

                const sidenavInstance = M.Sidenav.getInstance(sidenav);
                if(sidenavInstance.isOpen) sidenavInstance.close();

                break;
            
            case "keluar":
                const modal = document.querySelector("#keluar-modal");
                modal.querySelector("#logout-button").addEventListener("click", () => {
                    location = "./";
                });
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