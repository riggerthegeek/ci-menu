/**
 * settings
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';
import { remote } from 'electron';
import Vue from 'vue/dist/vue.min';

/* Files */

const logger = remote.app.logger;

const storageKey = 'ci-menu-settings';

let stateData = {};

try {
  stateData = JSON.parse(localStorage[storageKey]);
} catch (err) {
  /* Use default */
}

export default {

  actions: {

    saveSettings ({ commit }, { updateInterval }) {
      const data = {
        updateInterval,
      };

      logger.trigger('debug', 'Saving settings', {
        data,
        storageKey,
      });

      /* Save to local storage */
      localStorage[storageKey] = JSON.stringify(data);

      /* Update the state */
      commit('updateSettings', data);

      return data;
    },

  },

  getters: {

    minTimeout: state => state.settings.minTimeout,

    updateInterval: state => state.settings.updateInterval,

  },

  mutations: {

    updateSettings (state, data) {
      logger.trigger('trace', 'Updating settings state', data);

      Vue.set(state, 'settings', data);
    },

  },

  state: {
    settings: _.defaults(stateData, {
      minTimeout: 5000,
      updateInterval: 5000,
    }),
  },

};
