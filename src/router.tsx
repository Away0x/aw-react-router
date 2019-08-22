import React from 'react';
import { RouteComponentProps, Route, Redirect, Switch, HashRouter, BrowserRouter } from 'react-router-dom';
import {
  AWRouteConfig,
  AWRouteInfo,
  AWRouteState,
  AWRouteViewFunc,
  AWMiddlewareFunc,
  AWRouterOptions,
  RouteViewFuncOptions,
} from './type';

const DEFAULT_NOT_FOUND_ROUTE_NAME = '404';
const DEFAULT_NOT_FOUND_ROUTE_PATH = '/404';

class AWRouter {
  private static _instance: AWRouter | null = null;

  public static instance(): AWRouter {
    if (this._instance === null) {
      this._instance = new this();
    }

    return this._instance!;
  }

  /** mode */
  private mode: 'hash' | 'history' = 'hash';
  /** 存储路由配置 */
  private routes: AWRouteConfig[] = [];
  /** 路由信息表 */
  private routeInfos: AWRouteInfo[] = [];
  /** 当前路由的状态 */
  private routeState: AWRouteState | null = null;
  /** 存储全局中间件 */
  private middlewares: AWMiddlewareFunc[] = [];
  /** 路由未找到时 redirect 去的地方 */
  private notFoundRouteName = DEFAULT_NOT_FOUND_ROUTE_NAME;
  /** 顶层路由时，是否渲染 switch 组件，不渲染的话，自己就可以定义更多 Route(比较方便定制) */
  private hasSwitch = true;
  /** 需要被缓存的路由 name */
  // private cachedRouteNameList: string[] = [];

  /** 加载路由 */
  public load(routes: AWRouteConfig[], options: AWRouterOptions = {}) {
    if (this.routes.length) {
      throw new Error('AWRouter load error: 路由已经加载过了');
    }
    this.mode = options.mode || 'hash';
    this.middlewares = options.middlewares || [];
    this.notFoundRouteName = options.notFoundRouteName || DEFAULT_NOT_FOUND_ROUTE_NAME;
    this.hasSwitch = options.hasSwitch === undefined ? true : options.hasSwitch;

    this.routes = routes;
    this.setRouteInfos(routes);
  }

  /** 渲染 routes */
  public render(name?: string): AWRouteViewFunc {
    const renderView = this.renderView.bind(this);
    const find = this.find.bind(this);
    const notFoundRouteName = this.notFoundRouteName;
    const hasSwitch = this.hasSwitch;
    let groupPath = '';

    const isRootRoute = !name; // 是顶层路由
    let routes: AWRouteConfig[];

    if (isRootRoute) {
      routes = this.routes; // 顶层路由
    } else {
      const node = this.findNode(name!, this.routes);
      if (!node) {
        throw new Error('AWRouter render error: route not found');
      }
      groupPath = (find(node.name) as AWRouteInfo).fullPath;
      routes = node.children || [];
    }

    return ({ cache }: Partial<RouteViewFuncOptions> = {}) => {
      // this.cachedRouteNameList = cache || []; // 需要被缓存的路由 name

      let defaultRoute: JSX.Element | null = null;
      const views = routes.map((route) => {
        let exact = true;

        // exact (有子视图的父视图 exact 不能为 true)
        if (route.children && route.children.length) { exact = false; }

        const fullPath = (find(route.name) as AWRouteInfo).fullPath;

        // 默认路由 (如果是父路由的默认路由且配置了 path，那么生成一个父路由的 Route，避免匹配不到)
        if (route.default && route.path) {
          defaultRoute = <Route
            exact={exact}
            key={route.name}
            path={groupPath}
            render={(props) => renderView(fullPath, route, props)} />
        }

        return <Route
          exact={exact}
          key={route.name}
          path={fullPath}
          render={(props) => renderView(fullPath, route, props)} />
      });

      if (defaultRoute) {
        views.unshift(defaultRoute);
      }

      // not found redirect
      if (views.length) {
        const notFoundRoute = find(notFoundRouteName) as AWRouteInfo;
        const nofFoundRoutePath = (notFoundRoute || {}).fullPath;
        if (!notFoundRoute || !nofFoundRoutePath) {
          views.push(
            <Route exact={true}
              key={`${name || 'root'}NotFound`}
              path={DEFAULT_NOT_FOUND_ROUTE_PATH}
              render={_ => <div>ROUTE NOT FOUND</div>}
            />
          );

          views.push(<Redirect key={`${name || 'root'}NotFoundRedirect`} to={DEFAULT_NOT_FOUND_ROUTE_PATH} />)
        } else {
          views.push(<Redirect key={`${name || 'root'}NotFoundRedirect`} to={nofFoundRoutePath} />)
        }
      }

      // switch
      if (isRootRoute) {
        if (hasSwitch) {
          return <Switch>{views}</Switch>;
        }
        return views;
      }

      // 子路由包装 switch
      return <Switch>{views}</Switch>;
    }
  }

  /** render view 方法 */
  private renderView(fullPath: string, route: AWRouteConfig, routeProps: RouteComponentProps) {
    const routeViewFunc = this.render(route.name);
    const state: AWRouteState = {
      name: route.name,
      fullPath,
      route: routeProps,
      meta: route.meta || {},
    };

    // 执行中间件
    const view = this.applyMiddleware(state, this.middlewares.concat(route.middlewares || []));
    if (view) {
      return view;
    }

    // 存储路由状态
    this.setCurrentState(state);

    const Com = route.component as React.ComponentType<any>
    return (
      <Com key={route.name} {...routeProps} routerView={routeViewFunc} />
    );
  }

  /** 渲染根路由 */
  public renderRootRoute() {
    const routes = this.render()();

    if (this.mode === 'hash') {
      return (
        <HashRouter>
          {routes}
        </HashRouter>
      );
    }

    return (
      <BrowserRouter>
        {routes}
      </BrowserRouter>
    );
  }

  /** 存储当前路由的状态 */
  public setCurrentState(state: AWRouteState) {
    this.routeState = state;
  }

  /** 获取当前路由的状态 */
  public getCurrentState(): AWRouteState | null {
    return this.routeState || null;
  }

  /** 获取路由信息表 */
  public getRouteInfos(): AWRouteInfo[] {
    return this.routeInfos || [];
  }

  /** 根据路由 name 查找路由信息 */
  public find(name: string): AWRouteInfo | null {
    const r = this.getRouteInfos().find((c) => c.name === name);
    if (!r || !r.fullPath) {
      return null;
    }

    return r;
  }

  /** 根据路由 name 查找路由信息 */
  public findMap(names: string[]): { [k: string]: AWRouteInfo<any> } {
    const routeInfos: { [k: string]: AWRouteInfo } = {};
    this.getRouteInfos().forEach(r => {
      if (names.indexOf(r.name) !== -1) {
        routeInfos[r.name] = r;
      }
    });

    return routeInfos;
  }

  /** 获取 404 的 path */
  public getNotFoundRoutePath(): string {
    let notFoundPath = DEFAULT_NOT_FOUND_ROUTE_PATH
    const notFoundPRoute = this.find(this.notFoundRouteName);
    if (notFoundPRoute && notFoundPRoute.fullPath) {
      notFoundPath = notFoundPRoute.fullPath;
    }

    return notFoundPath;
  }

  /** 根据路由 name 查找路由 fullpath */
  public mustFindPath(name: string): string | null {
    const resultRoute = this.find(name);
    if (!resultRoute || !resultRoute.fullPath) {
      return null;
    }

    return resultRoute.fullPath;
  }

  /** 根据路由 name 查找路由 fullpath */
  public findPath(name: string, defaultPath = ''): string {
    const dp = defaultPath || this.getNotFoundRoutePath();
    const resultPath = this.mustFindPath(name);

    return resultPath || dp;
  }

  /** 存储路由信息表 */
  private setRouteInfos(routes: AWRouteConfig[]) {
    const result: AWRouteInfo[] = [];
    const fn = (c: AWRouteConfig, groupPath = '') => {
      const has = result.find((r) => r.name === c.name);
      if (has) {
        throw new Error('AWRouter error: duplicate route name');
      }
      // 不是默认视图又没配置 path 报错
      if (!c.default && !c.path) {
        throw new Error(`AWRouter error: ${c.name} route path missing`);
      }

      const info: AWRouteInfo = {
        fullPath: groupPath + (c.path || ''),
        name: c.name,
        meta: c.meta || {},
      };

      if (c.default) {
        info.default = true;
      }

      result.push(info);

      if (c.children && c.children.length) {
        const path = (c.default && !c.path) ? groupPath : c.path;
        c.children.forEach((cc) => fn(cc, path));
      }
    }
    routes.forEach((c) => fn(c));

    this.routeInfos = result;
  }

  /** 查找 route 配置项 */
  private findNode(name: string, routes: AWRouteConfig[]): AWRouteConfig | null {
    let result: AWRouteConfig | null = null;
    const fn = (r: AWRouteConfig) => {
      if (result) {
        return;
      }

      if (r.name === name) {
        result = r;
        return;
      }

      if (r.children && r.children.length) {
        r.children.forEach((rr) => fn(rr));
      }
    }
    routes.forEach((r) => fn(r));

    return result;
  }

  /** 执行中间件 */
  private applyMiddleware(state: AWRouteState, middlewares: AWMiddlewareFunc[]) {
    for (let i = 0; i < middlewares.length; i++) {
      const view = middlewares[i](state);
      if (view) {
        return view;
      }
    }

    return null;
  }

  /** 根据 name 获取 path */
  public getPathByName(name: string): string {
    const route = this.find(name);
    if (!route || !route.fullPath) {
      const notFoundPRoute = this.find(this.notFoundRouteName);
      if (!notFoundPRoute) { return ''; }

      return notFoundPRoute.fullPath || '';
    }

    return route.fullPath || '';
  }
}

export default AWRouter;
