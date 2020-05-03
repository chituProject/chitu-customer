import Vue from 'vue';
import { formatPrice } from '@/utils/index';
import App from './App';
import store from './store';

Vue.config.productionTip = false;

App.mpType = 'app';

Vue.prototype.$store = store;

Vue.filter('formatPrice', (val) => {
  return formatPrice(val);
});

const app = new Vue(App);
app.$mount();
