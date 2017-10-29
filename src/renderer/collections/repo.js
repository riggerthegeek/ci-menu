/**
 * repo
 */

/* Node modules */

/* Third-party modules */
import { Collection } from '@steeplejack/data';

/* Files */
import RepoModel from '../models/repo';

export default class RepoCollection extends Collection {
  _model () {
    return RepoModel;
  }
}
