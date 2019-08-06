import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
/** 渲染 react-router Route 组件 */
export declare type AWRouteViewFunc = () => JSX.Element[] | JSX.Element;
/**
 * 中间件函数
 * 返回值不为 null 时，中断中间件，渲染 view
 */
export declare type AWMiddlewareFunc = (params: AWRouteState<any>) => null | JSX.Element;
/** 路由渲染的 view */
export declare type AWRouteLayout<T = {}> = React.ComponentType<RouteComponentProps & LayoutProps & T>;
export declare type AWRouteComponent = AWRouteLayout;
/** layout props */
export interface LayoutProps {
    routerView: AWRouteViewFunc;
}
/** 路由配置 */
export interface AWRouteConfig<Meta = any> {
    name: string;
    component: AWRouteComponent;
    path?: string;
    children?: AWRouteConfig<Meta>[];
    default?: boolean;
    middlewares?: AWMiddlewareFunc[];
    meta?: Meta;
}
/** 路由信息 */
export interface AWRouteInfo<Meta = any> {
    readonly fullPath: string;
    readonly name: string;
    default?: boolean;
    readonly meta: Readonly<Meta>;
}
/** 路由状态 */
export interface AWRouteState<Meta = any> {
    readonly fullPath: string;
    readonly name: string;
    readonly meta: Readonly<Meta>;
    readonly route: Readonly<RouteComponentProps>;
}
/** AWRouter 的配置参数 */
export interface AWRouterOptions {
    mode?: 'hash' | 'history';
    middlewares?: AWMiddlewareFunc[];
    notFoundRouteName?: string;
    hasSwitch?: boolean;
}
/** 操作 history 的参数 */
export interface HistoryOptions {
    replace?: boolean;
}
/** router view 的配置 */
export interface RouteViewFuncOptions {
    cache: string[];
}
