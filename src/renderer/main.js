/**
 * main
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';

/* Files */
import App from './components/app.vue';
import router from './lib/router';

// eslint-disable-next-line no-new
new Vue({
  components: {
    App,
  },
  // i18n,
  router,
  template: '<App />',
}).$mount('#app');
