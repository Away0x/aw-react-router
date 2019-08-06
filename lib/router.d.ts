/// <reference types="react" />
import { AWRouteConfig, AWRouteInfo, AWRouteState, AWRouteViewFunc, AWRouterOptions, HistoryOptions } from './type';
declare class AWRouter {
    private static _instance;
    static instance(): AWRouter;
    /** mode */
    private mode;
    /** 存储路由配置 */
    private routes;
    /** 路由信息表 */
    private routeInfos;
    /** 当前路由的状态 */
    private routeState;
    /** 存储全局中间件 */
    private middlewares;
    /** 路由未找到时 redirect 去的地方 */
    private notFoundRouteName;
    /** 顶层路由时，是否渲染 switch 组件，不渲染的话，自己就可以定义更多 Route(比较方便定制) */
    private hasSwitch;
    /** history */
    private history;
    /** 需要被缓存的路由 name */
    /** 加载路由 */
    load(routes: AWRouteConfig[], options?: AWRouterOptions): void;
    /** 渲染 routes */
    render(name?: string): AWRouteViewFunc;
    /** render view 方法 */
    private renderView;
    /** 渲染根路由 */
    renderRootRoute(): JSX.Element;
    /** 存储当前路由的状态 */
    setCurrentState(state: AWRouteState): void;
    /** 获取当前路由的状态 */
    getCurrentState(): AWRouteState | null;
    /** 获取路由信息表 */
    getRouteInfos(): AWRouteInfo[];
    /** 根据路由 name 查找路由信息 */
    find(name: string): AWRouteInfo | null;
    /** 根据路由 name 查找路由信息 */
    findMap(names: string[]): {
        [k: string]: AWRouteInfo<any>;
    };
    /** 存储路由信息表 */
    private setRouteInfos;
    /** 查找 route 配置项 */
    private findNode;
    /** 执行中间件 */
    private applyMiddleware;
    /** 根据 name 获取 path */
    getPathByName(name: string): string;
    push(path: string, options?: HistoryOptions): void;
    pushByName(name: string, options?: HistoryOptions): void;
}
export default AWRouter;
