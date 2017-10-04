/**
 * router
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import VueRouter from 'vue-router';

/* Files */
import layout from '../components/layout.vue';
import projects from '../components/projects.vue';

Vue.use(VueRouter);

const routes = [{
  path: '/',
  component: layout,
  children: [{
    path: 'projects',
    name: 'projects',
    component: projects,
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
