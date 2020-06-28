import "materialize-css/dist/css/materialize.min.css";
import "material-icons/iconfont/material-icons.css";
import "./assets/css/styles.css";

import M from "materialize-css/dist/js/materialize.min.js";
import initNav from "./assets/js/navigation.js";

M.AutoInit();

document.addEventListener("DOMContentLoaded", function () {
   initNav();
});