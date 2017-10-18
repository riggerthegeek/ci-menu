/**
 * settings.test
 */

/* Node modules */

/* Third-party modules */

/* Files */
import { expect } from '../../../helpers/configure';
import settings from '../../../../src/renderer/store/settings';

describe('settings store tests', function () {

  describe('getters', function () {

    describe('#updateInterval', function () {

      it('should return the state updateInterval', function () {

        const state = {
          updateInterval: 5042,
        };

        expect(settings.getters.updateInterval(state)).to.be.equal(5042);

      });

    });

  });

  describe('state', function () {

    it('should return the default state object', function () {

      expect(settings.state).to.be.eql({
        updateInterval: 5000,
      });

    });

  });

});
