import Vue from "vue";
import App from "./App";
import store from "./store";
import { httpRequest } from "@/utils/adapter";

import "xe-utils";
// eslint-disable-next-line import/order
import VXETable from "vxe-table";
// import "vxe-table/lib/index.css";

Vue.use(VXETable);

Vue.config.productionTip = false;

App.mpType = "app";

Vue.prototype.$store = store;
Vue.prototype.$request = httpRequest;

const app = new Vue(App);
app.$mount();
