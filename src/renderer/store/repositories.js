/**
 * repositories
 */

/* Node modules */
import path from 'path';

/* Third-party modules */
import { _ } from 'lodash';
import axios from 'axios';
import fs from 'fs-extra';
import { remote } from 'electron';
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

const logger = remote.app.logger;

const config = {
  dataPath: path.join(remote.app.getPath('userData'), 'ci-menu', 'repos'),
  dataFile: 'repos.json',
};

export default {

  actions: {

    getSettings () {
      const filePath = path.join(config.dataPath, config.dataFile);

      return new Promise((resolve, reject) => {
        /* Return the data */
        logger.trigger('trace', 'repo store getSettings', {
          filePath,
        });

        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(data);
        });
      })
        /* Convert to JSON */
        .then(str => JSON.parse(str))
        .catch((err) => {
          if (err.code === 'ENOENT') {
            /* File not present - ensure path exists */
            logger.trigger('trace', 'repo store getSettings file doesn\'t exist', {
              filePath,
            });

            return fs.mkdirp(config.dataPath)
              .then(() => null);
          }

          logger.trigger('error', 'repo store getSettings error', {
            err,
            filePath,
          });

          /* Unknown error - just reject with error */
          return Promise.reject(err);
        });
    },

    loadLatestStatus ({ commit, dispatch }) {
      logger.trigger('trace', 'repo store loadLatestStatus');

      return dispatch('getSettings')
        .then((settings) => {
          /* Ensure the settings is an array */
          if (!Array.isArray(settings)) {
            settings = [];
          }

          /* Build a task list */
          const tasks = settings.map(item => dispatch('queryRepo', item));

          return Promise.all(tasks);
        })
        .then((data) => {
          /* Update the state with the new data */
          commit('updateRepos', data);

          /* Return the state */
          return data;
        })
        .catch((err) => {
          logger.trigger('error', 'Error getting latest repo status', {
            err,
          });

          return Promise.reject(err);
        });
    },

    /**
     * Parse XML
     *
     * Parses the XML into JSON format
     *
     * @param {*} store
     * @param {string} input
     * @param {{ all: boolean, ignore: string[], name: string, repos: [] }} repo
     * @returns {Promise.<*>}
     */
    parseXML (store, { input, repo }) {
      return new Promise((resolve) => {
        /* Lower case the tag for easy traversing */
        const opts = {
          tagNameProcessors: [
            toLowerCase,
          ],
        };

        /* Ensure the input is a string */
        if (_.isString(input) === false) {
          resolve([]);
          return;
        }

        xmlParser.parseString(input, opts, (err, parsedXml) => {
          if (err) {
            /* Cannot parse the XML - return empty array */
            logger.trigger('warn', 'Error parsing XML', {
              err,
              input,
            });

            resolve([]);
            return;
          }

          resolve(parsedXml);
        });
      }).then((parsedXml) => {
        /* Do we get everything we can? */
        const getAll = repo.all !== false;

        try {
          const data = parsedXml.projects.project.reduce((result, { $ }) => {
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
                let date = new Date(project[key]);

                if (isNaN(date.getTime())) {
                  /* Invalid date */
                  date = null;
                }

                project[key] = date;
              }
            });

            const includeProject = () => repo.repos
              .find(item => item.name === project.name);

            const ignoreProject = () => Array
              .isArray(repo.ignore) && repo.ignore.includes(project.name);

            if ((getAll || includeProject()) && !ignoreProject()) {
              result.push(project);
            }

            return result;
          }, []);

          logger.trigger('trace', 'Parsed XML to JSON successfully', {
            data,
          });

          return data;
        } catch (err) {
          /* Wrong format - return empty array */
          logger.trigger('warn', 'XML in wrong format', {
            err,
            data: parsedXml,
          });

          return [];
        }
      });
    },

    /**
     * Query Repo
     *
     * Queries the repository and gets the
     * status
     *
     * @param {*} dispatch
     * @param {*} repo
     * @returns {Promise.<*>}
     */
    queryRepo ({ dispatch }, repo) {
      const axiosConfig = {
        timeout: 10000,
      };

      return axios.get(repo.url, axiosConfig)
        .catch((err) => {
          /* There was a problem connecting to this endpoint */
          logger.trigger('warn', 'Error getting settings', {
            err,
            url: repo.url,
          });

          repo.err = err;
        })
        .then(({ data } = {}) => dispatch('parseXML', {
          input: data,
          repo,
        }))
        .then((repos) => {
          /* Add in the latest repo version */
          repo.repos = repos;

          return repo;
        });
    },

  },

  getters: {

    repos: state => state.repos,

    updated: state => state.updated,

  },

  mutations: {

    updateRepos (state, repos) {
      logger.trigger('trace', 'Updating repo state');

      Vue.set(state, 'repos', repos);

      Vue.set(state, 'updated', true);
    },

  },

  state: {
    repos: [],
    updated: false,
  },

};
