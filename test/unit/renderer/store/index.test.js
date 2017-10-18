/**
 * index.test
 */

/* Node modules */

/* Third-party modules */

/* Files */
import { expect, proxyquire, sinon } from '../../../helpers/configure';

describe('store tests', function () {

  it('should configure the store', function () {

    const Vue = {
      use: sinon.spy(),
    };

    const vuexInst = {};

    const Vuex = {
      Store: sinon.stub()
        .returns(vuexInst),
    };
    const repositories = 'repos';
    const settings = 'settings';

    const store = proxyquire('../../src/renderer/store', {
      'vue/dist/vue.min': Vue,
      'vuex/dist/vuex': Vuex,
      './repositories': repositories,
      './settings': settings,
    });

    expect(Vue.use).to.be.calledOnce
      .calledWithExactly(Vuex);

    expect(store).to.have.keys([
      'default',
    ]);

    expect(store.default).to.be.equal(vuexInst);

    expect(Vuex.Store).to.be.calledOnce
      .calledWithNew
      .calledWithExactly({
        modules: {
          repositories,
          settings,
        },
        strict: false,
      });

  });

});
