/**
 * repositories
 */

/* Node modules */
import fs from 'fs-extra';
import path from 'path';

/* Third-party modules */
import { remote } from 'electron';
import request from 'request-promise-native';
import Vue from 'vue/dist/vue.min';
import xmlParser from 'xml2js';

/* Files */

/**
 * To Lower Case
 *
 * Converts the input to lower case
 *
 * @param {string} str
 * @returns {string}
 */
const toLowerCase = str => str.toLowerCase();

const config = {
  dataPath: path.join(remote.app.getPath('userData'), 'repos'),
  dataFile: 'repos.json',
};

export default {

  actions: {

    getSettings () {
      return Promise.resolve()
        .then(() => {

          try {
            /* Return the data */
            // eslint-disable-next-line global-require, import/no-dynamic-require
            return require(path.join(config.dataPath, config.dataFile));
          } catch (err) {
            /* Create the data path */
            return fs.mkdirp(config.dataPath);
          }
        });
    },

    loadLatestStatus ({ commit, dispatch }) {
      return dispatch('getSettings')
        .then((settings) => {
          /* Build task list */
          const tasks = settings.map(item => request(item.url)
            .catch((err) => {
              /* There was a problem connecting to this endpoint */
              console.log(err);
              return null;
            })
            .then(xml => new Promise((resolve) => {
              /* Lower case the tag for easy traversing */
              const opts = {
                tagNameProcessors: [
                  toLowerCase,
                ],
              };

              /* Do we get everything we can? */
              const getAll = item.all !== false;

              xmlParser.parseString(xml, opts, (err, parsedXml) => {
                if (err) {
                  /* Cannot parse the XML - return empty array */
                  resolve([]);
                  return;
                }

                try {
                  const out = parsedXml.projects.project.reduce((result, { $ }) => {
                    /* These are the required parts */
                    const project = {
                      name: $.name,
                      activity: $.activity,
                      lastBuildStatus: $.lastBuildStatus,
                      lastBuildLabel: $.lastBuildLabel || null,
                      lastBuildTime: $.lastBuildTime,
                      nextBuildTime: $.nextBuildTime || null,
                      webUrl: $.webUrl,
                    };

                    /* Convert the times to Date objects */
                    const dates = [
                      'lastBuildTime',
                      'nextBuildTime',
                    ];

                    dates.forEach((key) => {
                      if (project[key] !== null) {
                        project[key] = new Date(project[key]);
                      }
                    });

                    const includeProject = () => item.repos
                      .find(repo => repo.name === project.name);

                    if (getAll || includeProject()) {
                      result.push(project);
                    }

                    return result;
                  }, []);

                  resolve(out);
                } catch (xmlErr) {
                  /* Wrong format - return empty array */
                  resolve([]);
                }
              });
            }))
            .then((repos) => {
              /* Add in the latest repo version */
              item.repos = repos;

              return item;
            }));

          return Promise.all(tasks);
        })
        .then((data) => {
          /* Update the state with the new data */
          commit('updateRepos', data);

          /* Return the state */
          return data;
        });
    },

  },

  getters: {

    repos: state => state.repos,

  },

  mutations: {

    updateRepos (state, newState) {
      Vue.set(state, 'repos', newState);
    },

  },

  state: {
    repos: [],
  },

};
