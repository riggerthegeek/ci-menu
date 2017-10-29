/**
 * store
 */

/* Node modules */

/* Third-party modules */
import { Model } from '@steeplejack/data';

/* Files */
import RepoCollection from '../collections/repo';

export default class StoreModel extends Model {
  _schema () {
    return {
      url: {
        type: 'string',
        validation: [{
          rule: 'required',
        }],
      },

      all: {
        type: 'boolean',
        default: true,
      },

      ignore: {
        type: 'array',
        default: [],
      },

      repos: {
        type: RepoCollection,
        default: new RepoCollection(),
      },
    };
  }
}
