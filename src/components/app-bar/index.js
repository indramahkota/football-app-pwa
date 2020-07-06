import materializecss from "materialize-css/dist/css/materialize.min.css";
import materialiconscss from "material-icons/iconfont/material-icons.css";

const images = require.context("../../assets/images", true);
const imagePath = name => images(name, true);

import appBarTemplate from "./template.html";

const template = document.createElement("template");
template.innerHTML = `
    <style>${materializecss}</style>
    <style>${materialiconscss}</style>
    ${appBarTemplate}
`;

class AppBar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.render();
    }

    render() {
        this.shadowRoot.querySelector("#app-logo").textContent = "Football App";
        this.shadowRoot.querySelector("#user-photo").setAttribute("src", imagePath("./indra.webp").default);
    }
}

customElements.define("app-bar", AppBar);