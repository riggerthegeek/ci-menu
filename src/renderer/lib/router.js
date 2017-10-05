/**
 * router
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import VueRouter from 'vue-router';

/* Files */
import alerts from '../components/alerts.vue';
import layout from '../components/layout.vue';
import projects from '../components/projects.vue';
import settings from '../components/settings.vue';

Vue.use(VueRouter);

const routes = [{
  path: '/_',
  component: layout,
  children: [{
    path: '/projects',
    name: 'projects',
    component: projects,
  }, {
    path: '/alerts',
    name: 'alerts',
    component: alerts,
  }, {
    path: '/settings',
    name: 'settings',
    component: settings,
  }],
}, {
  path: '*',
  redirect: {
    name: 'projects',
  },
}];

const router = new VueRouter({
  routes,
});

export default router;
