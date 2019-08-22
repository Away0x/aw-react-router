/// <reference types="react" />
import { AWRouteConfig, AWRouteInfo, AWRouteState, AWRouteViewFunc, AWRouterOptions } from './type';
declare class AWRouter<Meta = {}> {
    private static _instance;
    static instance<M = {}>(): AWRouter<M>;
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
    /** 需要被缓存的路由 name */
    /** 加载路由 */
    load(routes: AWRouteConfig<Meta>[], options?: AWRouterOptions): AWRouter<Meta>;
    /** 渲染 routes */
    render(name?: string): AWRouteViewFunc;
    /** render view 方法 */
    private renderView;
    /** 渲染根路由 */
    renderRootRoute(): JSX.Element;
    /** 存储当前路由的状态 */
    setCurrentState(state: AWRouteState): void;
    /** 获取当前路由的状态 */
    getCurrentState(): AWRouteState<Meta> | null;
    /** 获取路由信息表 */
    getRouteInfos(): AWRouteInfo<Meta>[];
    /** 根据路由 name 查找路由信息 */
    find(name: string): AWRouteInfo<Meta> | null;
    /** 根据路由 name 查找路由信息 */
    findMap(names: string[]): {
        [k: string]: AWRouteInfo<Meta>;
    };
    /** 获取 404 的 path */
    getNotFoundRoutePath(): string;
    /** 根据路由 name 查找路由 fullpath */
    mustFindPath(name: string): string | null;
    /** 根据路由 name 查找路由 fullpath */
    findPath(name: string, defaultPath?: string): string;
    /** 存储路由信息表 */
    private setRouteInfos;
    /** 查找 route 配置项 */
    private findNode;
    /** 执行中间件 */
    private applyMiddleware;
    /** 根据 name 获取 path */
    getPathByName(name: string): string;
}
export default AWRouter;
