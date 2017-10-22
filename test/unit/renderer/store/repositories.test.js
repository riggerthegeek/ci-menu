/**
 * repositories.test
 */

/* Node modules */

/* Third-party modules */

/* Files */
import { expect, proxyquire, sinon } from '../../../helpers/configure';

describe('repositories store test', function () {

  beforeEach(function () {
    const getPath = sinon.stub()
      .withArgs('userPath')
      .returns('app.userPath');

    const logger = {
      trigger: sinon.spy(),
    };

    this.electron = {
      remote: {
        app: {
          getPath,
          logger,
        },
      },
    };

    this.repositories = proxyquire('../../src/renderer/store/repositories', {
      electron: this.electron,
    }).default;
  });

  describe('getters', function () {

    describe('#repos', function () {

      it('should get the repo state', function () {

        expect(this.repositories.getters.repos({
          repos: 'repoState',
        })).to.be.equal('repoState');

      });

    });

    describe('#updated', function () {

      it('should get the updated state', function () {

        expect(this.repositories.getters.updated({
          updated: 'updatedState',
        })).to.be.equal('updatedState');

      });

    });

  });

  describe('state', function () {

    it('should get the default state data', function () {

      expect(this.repositories.state).to.be.eql({
        repos: [],
        updated: false,
      });

    });

  });

});
