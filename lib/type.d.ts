import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
/** 渲染 react-router Route 组件 */
export declare type AWRouteViewFunc = () => JSX.Element[] | JSX.Element;
/**
 * 中间件函数
 * 返回值不为 null 时，中断中间件，渲染 view
 */
export declare type AWMiddlewareFunc<Meta = {}> = (params: AWRouteState<Meta>) => null | JSX.Element;
/** 路由渲染的 view */
export declare type AWRouteLayout<T = {}> = React.ComponentType<RouteComponentProps & LayoutProps & T>;
export declare type AWRouteComponent = AWRouteLayout;
/** layout props */
export interface LayoutProps {
    routerView: AWRouteViewFunc;
}
/** 路由配置 */
export interface AWRouteConfig<Meta = {}> {
    name: string;
    component: AWRouteComponent;
    path?: string;
    children?: AWRouteConfig<Meta>[];
    default?: boolean;
    middlewares?: AWMiddlewareFunc<Meta>[];
    meta?: Meta;
}
/** 路由信息 */
export interface AWRouteInfo<Meta = {}> {
    readonly fullPath: string;
    readonly name: string;
    default?: boolean;
    readonly meta: Readonly<Meta>;
}
/** 路由状态 */
export interface AWRouteState<Meta = {}> {
    readonly fullPath: string;
    readonly name: string;
    readonly meta: Readonly<Meta>;
    readonly route: Readonly<RouteComponentProps>;
}
/** AWRouter 的配置参数 */
export interface AWRouterOptions<Meta = {}> {
    mode?: 'hash' | 'history';
    middlewares?: AWMiddlewareFunc<Meta>[];
    notFoundRouteName?: string;
}
/** router view 的配置 */
export interface RouteViewFuncOptions {
    cache: string[];
}
