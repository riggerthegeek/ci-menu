/**
 * repo
 */

/* Node modules */

/* Third-party modules */
import { Model } from '@steeplejack/data';

/* Files */

export default class RepoModel extends Model {
  _schema () {
    return {
      name: {
        type: 'string',
        validation: [{
          rule: 'required',
        }],
      },
    };
  }
}
