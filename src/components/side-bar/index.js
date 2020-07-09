import M from "materialize-css/dist/js/materialize.min.js";

import materializecss from "materialize-css/dist/css/materialize.min.css";
import materialiconscss from "material-icons/iconfont/material-icons.css";
import css from "./style.css";
import html from "./template.html";

const template = document.createElement("template");
template.innerHTML  = `
    <style>${materializecss}</style>
    <style>${materialiconscss}</style>
    <style>${css}</style>
    ${html}
`;

class SideBar extends HTMLElement {

    connectedCallback() {
        this.appendChild(template.content.cloneNode(true));
        this.render();
    }

    render() {
        let sidenav = this.querySelector(".sidenav");
        M.Sidenav.init(sidenav);
    }
}

customElements.define("side-bar", SideBar);