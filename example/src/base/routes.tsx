import React from 'react';
import AWRouter, { AWRouteConfig, Link } from '../../../lib';

const configs: AWRouteConfig[] = [
  {
    name: 'home',
    path: '/',
    component: (props) => {
      return (
        <>
          <div>
            <Link to={awRouter.findPath('homea')}>A</Link>
            <Link to={awRouter.findPath('homeb')}>B</Link>
          </div>
          <div>
            {
              props.routerView()
            }
          </div>
        </>
      );
    },
    children: [
      {
        name: 'homea',
        path: 'a',
        default: true,
        component: () => <div>homea</div>
      },
      {
        name: 'homeb',
        path: 'b',
        component: () => <div>homeb</div>
      },
    ],
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

const awRouter = AWRouter.instance().load(configs, {
  mode: 'hash',
  notFoundRouteName: '404',
  middlewares: [
    (_) => {
      console.log(awRouter.getCurrentState());
      return null;
    }
  ],
});

export const routes = awRouter.renderRootRoute();

export default awRouter;

(window as any).__awRouter__ = awRouter;
