/**
 * store
 */

/* Node modules */

/* Third-party modules */
import { Collection } from '@steeplejack/data';

/* Files */
import StoreModel from '../models/store';

export default class StoreCollection extends Collection {
  _model () {
    return StoreModel;
  }
}
