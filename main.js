import Vue from "vue";
import App from "./App";
import store from "./store";
import { httpRequest } from "@/utils/adapter";
import moment from 'moment';

Vue.config.productionTip = false;

App.mpType = "app";

Vue.prototype.$store = store;
Vue.prototype.$request = httpRequest;
Vue.prototype.$moment = moment;//赋值使用

const app = new Vue(App);
app.$mount();
