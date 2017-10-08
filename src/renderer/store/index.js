/**
 * index
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import Vuex from 'vuex/dist/vuex';

/* Files */
import repositories from './repositories';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    repositories,
  },
  strict: false,
});
