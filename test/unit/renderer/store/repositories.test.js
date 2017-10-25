/**
 * repositories.test
 */

/* Node modules */

/* Third-party modules */

/* Files */
import { expect, proxyquire, sinon } from '../../../helpers/configure';

describe('repositories store test', function () {

  beforeEach(function () {
    this.getPath = sinon.stub()
      .withArgs('userPath')
      .returns('app.userPath');

    this.logger = {
      trigger: sinon.spy(),
    };

    this.axios = {
      get: sinon.stub(),
    };

    this.electron = {
      remote: {
        app: {
          getPath: this.getPath,
          logger: this.logger,
        },
      },
    };

    this.fs = {
      mkdirp: sinon.stub(),
      readFile: sinon.stub(),
    };

    this.xml2js = {
      parseString: sinon.stub(),
    };

    this.repositories = proxyquire('../../src/renderer/store/repositories', {
      axios: this.axios,
      electron: this.electron,
      'fs-extra': this.fs,
      xml2js: this.xml2js,
    }).default;
  });

  describe('actions', function () {

    describe('#getSettings', function () {

      it('should create the directories when it cannot read the settings file', function () {
        this.fs.readFile.yields({
          code: 'ENOENT',
        });
        this.fs.mkdirp.resolves('some data');

        return this.repositories.actions.getSettings()
          .then((res) => {
            expect(res).to.be.null;

            const filePath = 'app.userPath/ci-menu/repos/repos.json';

            expect(this.fs.readFile).to.be.calledOnce
              .calledWith(filePath, 'utf8');

            expect(this.fs.mkdirp).to.be.calledOnce
              .calledWithExactly('app.userPath/ci-menu/repos');

            expect(this.logger.trigger).to.be.calledTwice
              .calledWithExactly('trace', 'repo store getSettings', {
                filePath,
              })
              .calledWithExactly('trace', 'repo store getSettings file doesn\'t exist', {
                filePath,
              });
          });
      });

      it('should fail to parse the config file as JSON string', function () {
        this.fs.readFile.yields(null, 'invalid JSON');

        return this.repositories.actions.getSettings()
          .then(() => {
            throw new Error('invalid');
          })
          .catch((err) => {
            expect(err).to.be.instanceof(SyntaxError);
            expect(err.message).to.contain('JSON');

            const filePath = 'app.userPath/ci-menu/repos/repos.json';

            expect(this.fs.readFile).to.be.calledOnce
              .calledWith(filePath, 'utf8');

            expect(this.fs.mkdirp).to.not.be.called;

            expect(this.logger.trigger).to.be.calledTwice
              .calledWithExactly('trace', 'repo store getSettings', {
                filePath,
              })
              .calledWithExactly('error', 'repo store getSettings error', {
                err,
                filePath,
              });
          });
      });

      it('should return the parsed XML object', function () {
        this.fs.readFile.yields(null, '{ "hello": "world" }');

        return this.repositories.actions.getSettings()
          .then((settings) => {
            expect(settings).to.be.eql({
              hello: 'world',
            });

            const filePath = 'app.userPath/ci-menu/repos/repos.json';

            expect(this.fs.readFile).to.be.calledOnce
              .calledWith(filePath, 'utf8');

            expect(this.fs.mkdirp).to.not.be.called;

            expect(this.logger.trigger).to.be.calledOnce
              .calledWithExactly('trace', 'repo store getSettings', {
                filePath,
              });
          });
      });

    });

    describe('#loadLatestStatus', function () {

      beforeEach(function () {
        this.commit = sinon.spy();
        this.dispatch = sinon.stub();
      });

    });

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
        error: false,
        history: {},
        repos: [],
        updated: false,
      });

    });

  });

});
