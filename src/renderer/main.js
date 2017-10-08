/**
 * main
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import Vuetify from 'vuetify';

/* Files */
import App from './components/app.vue';
import router from './lib/router';
import store from './store';

Vue.use(Vuetify);

const app = new Vue({
  components: {
    App,
  },
  // i18n,
  router,
  store,
  template: '<App />',
}).$mount('#app');

let gettingStatus = false;

function getRepoStatus () {
  /* Check if we're currently getting the status - don't duplicate */
  if (gettingStatus) {
    return Promise.resolve(app.$store.getters.repos);
  }

  gettingStatus = true;

  return app.$store.dispatch('loadLatestStatus')
    .then(() => {
      gettingStatus = false;

      return app.$store.getters.repos;
    })
    .catch((err) => {
      gettingStatus = false;

      return Promise.reject(err);
    });
}

/* Run a background task to get the repo statuses */
getRepoStatus();

setInterval(() => {
  getRepoStatus();
}, 10000);
