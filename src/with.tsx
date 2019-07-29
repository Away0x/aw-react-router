import React from 'react';
import { withRouter } from 'react-router';

import AWRouter, { AWRouteLayout } from './index';

// 可通过该方法获取到 layout 的 routerView 和一些路由信息
export function withAWRouter(Component: AWRouteLayout) {
  const displayName = `withAWRouter(${Component.displayName || Component.name})`;
  const Router = withRouter(Component);

  const aw = AWRouter.instance();
  const currentState = aw.getCurrentState();
  if (!currentState) {
    return Router;
  }
  const routerView= AWRouter.instance().render(currentState.name);

  const C: React.FC = props => {
    return <Router {...props} routerView={routerView} />
  }

  C.displayName = displayName;
  return C;
}
