import React from 'react';
import AWRouter, { AWRouteConfig } from '../../lib';

interface RouteMeta {
  title: string
}

const configs: AWRouteConfig<RouteMeta>[] = [
  {
    name: 'home',
    path: '/',
    component: () => <div>home</div>
  },
  {
    name: 'login',
    path: '/login',
    component: () => <div>login</div>,
  },
  {
    name: 'a',
    path: '/a',
    component: () => <div>a</div>,
  },
];

const awRouter = AWRouter.instance<RouteMeta>().load(configs, {
  mode: 'hash',
  notFoundRouteName: '404',
});

export const routes = awRouter.renderRootRoute();

export default awRouter;

(window as any).__awRouter__ = awRouter;
