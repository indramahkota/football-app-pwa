// const files = require.context('../assets/icons/favicons/', true);
// const getFiles = name => files(name).default;

require.context("./assets/icons/favicons/", true);
require.context("./assets/icons/maskicon/", true);
require.context("./assets/icons/msicon/", true);

import "materialize-css/dist/css/materialize.min.css";
import "material-icons/iconfont/material-icons.css";
import "./styles/styles.css";

import "./scripts/app-main.js";
import "./scripts/app-notification.js";