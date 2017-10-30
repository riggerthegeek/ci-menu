/**
 * notifications
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';
import { remote } from 'electron';
import Vue from 'vue/dist/vue.min';

/* Files */

const logger = remote.app.logger;

const storageKey = 'ci-menu-notifications';

let stateData = {};

try {
  stateData = JSON.parse(localStorage[storageKey]);
} catch (err) {
  /* Use default */
}

export default {

  actions: {

    notify ({ getters, state }, { i18n, newState, oldState }) {
      /* Default to always notify */
      let toNotify = true;

      const buildLabel = newState.id;
      const newStatus = newState.status;
      const oldStatus = oldState.status;
      const build = buildLabel ? `#${buildLabel}` : '';

      switch (state.notify) {
        case 'change':
          toNotify = newStatus !== oldStatus;
          break;

        case 'fail':
          toNotify = newStatus !== 'success';
          break;

        default:
          /* Never notify */
          toNotify = false;
          break;
      }

      const msg = i18n.t(`notifications:${newStatus.toUpperCase()}`, {
        build,
        name: newState.title,
      });

      if (toNotify && !getters.doNotDisturb()) {
        return new Notification(msg, {
          tag: build,
        });
      }

      return false;
    },

    saveNotification ({ commit }, { dnd, dndEnd, dndStart, notify }) {
      const data = {
        dnd,
        dndEnd,
        dndStart,
        notify,
      };

      /* Save to local storage */
      localStorage[storageKey] = JSON.stringify(data);

      /* Update the state */
      commit('updateNotification', data);

      return data;
    },

  },

  getters: {

    /**
     * Do Not Disturb
     *
     * Are we in a do not disturb
     * period?
     *
     * @param {*} state
     * @returns {boolean}
     */
    doNotDisturb: state => () => {
      if (state.dnd) {
        /*
        const dndStart = state.dndStart.split(':');
        const dndEnd = state.dndEnd.split(':');

        const dates = [];

        const startTime = moment()
          .hour(dndStart[0])
          .minute(dndStart[1])
          .seconds(0)
          .milliseconds(0);

        const endTime = moment()
          .hour(dndEnd[0])
          .minute(dndEnd[1])
          .seconds(0)
          .milliseconds(0);
          */

        return true;
      }

      /* Nope */
      return false;
    },

    notify: state => ({
      dnd: state.dnd,
      dndEnd: state.dndEnd,
      dndStart: state.dndStart,
      notify: state.notify,
    }),

    notifyOpts: () => [
      'all', // Notify whenever a build has finished
      'change', // Notify when a change is detected
      'fail', // Notify when new status is not 'Success'
      'never',
    ],

  },

  mutations: {

    updateNotification (state, data) {
      logger.trigger('trace', 'Updating repo state');

      Vue.set(state, 'repos', data);
    },

  },

  state: _.defaults(stateData, {
    dnd: false,
    dndEnd: '08:00',
    dndStart: '22:00',
    notify: 'change',
  }),

};
