import { setButtonActive, setTitleForActivePage } from "./app-state.js";
import { getCompetitionId, getTeamId,
  showOfflineToast, dismissOfflineToast } from "./app-utilities.js";

import setPertandinganPage from "./page-pertandingan.js";
import setKlasemenPage from "./page-klasemen.js";
import setTimPage from "./page-tim.js";
import setTimDetailPage from "./page-tim-detail.js";
import setTimFavoritPage from "./page-tim-favorit.js";

let currentController = new AbortController();
let currentSignal = currentController.signal;

const setCurrentControllerSignal = () => {
    currentController.abort();
    const newController = new AbortController();
    currentController = newController;
    currentSignal = newController.signal;
}

const navigate = () => {
    let page = location.hash.substr(1);
    if(page === "") page = "pertandingan";

    setCurrentControllerSignal();

    if(page.includes("pertandingan?competition=")) {
        setPertandinganPage(currentSignal,
            getCompetitionId(page.replace("pertandingan", "")));
        setTitleForActivePage("Pertandingan");
        setButtonActive("menu-pertandingan");
        return;
    }

    if(page.includes("klasemen?competition=")) {
        setKlasemenPage(currentSignal,
            getCompetitionId(page.replace("klasemen", "")));
        setTitleForActivePage("Klasemen");
        setButtonActive("menu-klasemen");
        return;
    }

    if(page.includes("tim?competition=")) {
        setTimPage(currentSignal,
            getCompetitionId(page.replace("tim", "")));
        setTitleForActivePage("Tim");
        setButtonActive("menu-tim");
        return;
    }

    if(page.includes("tim/detail?id=")) {
        setTimDetailPage(currentSignal,
            getTeamId(page.replace("tim/detail", "")));
        setTitleForActivePage("Tim Detail");
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

        case "tim/favorit":
            setTimFavoritPage(currentSignal, -9999);
            setTitleForActivePage("Tim Favorite");
            setButtonActive("");
            M.Sidenav.getInstance(document.querySelector(".sidenav")).close();
            break;

        default :
            break;
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const sidenav = document.querySelectorAll(".sidenav");
    M.Sidenav.init(sidenav);

    const dropdown = document.querySelectorAll(".dropdown-trigger");
    M.Dropdown.init(dropdown, {
        coverTrigger: false,
    });

    const modal = document.querySelectorAll(".modal");
    M.Modal.init(modal);

    document.querySelectorAll(".sidenav a, .topnav a").forEach(element => {
        const parent = element.parentElement;
        if(!parent.id.includes("menu")) return;
        element.addEventListener("click", () => {
            M.Sidenav.getInstance(document.querySelector(".sidenav")).close();
            if(parent.id === "menu-keluar") {
                document.querySelector("#logout-button").addEventListener("click", () => {
                    location = "./";
                });
                M.Modal.getInstance(document.querySelector("#keluar-modal")).open();
                return;
            }
            setButtonActive(parent.getAttribute("id"));
        });
    });

    document.querySelector("#button-offline").addEventListener("click", () => {
        M.Sidenav.getInstance(document.querySelector(".sidenav")).close();
    });

    document.querySelector("#topnavexitbtn").addEventListener("click", () => {
        document.querySelector("#logout-button").addEventListener("click", () => {
            location = "./";
        });
        M.Modal.getInstance(document.querySelector("#keluar-modal")).open();
    });

    navigate();      
});

window.addEventListener("online",  () => dismissOfflineToast());
window.addEventListener("offline", () => showOfflineToast());
window.addEventListener("hashchange", () => navigate());
