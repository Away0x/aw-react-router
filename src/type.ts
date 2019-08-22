import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

/** 渲染 react-router Route 组件 */
export type AWRouteViewFunc = () => JSX.Element[] | JSX.Element;

/**
 * 中间件函数
 * 返回值不为 null 时，中断中间件，渲染 view
 */
export type AWMiddlewareFunc<Meta = {}> = (params: AWRouteState<Meta>) => null | JSX.Element;

/** 路由渲染的 view */
export type AWRouteLayout<T = {}> = React.ComponentType<RouteComponentProps & LayoutProps & T>
export type AWRouteComponent = AWRouteLayout

/** layout props */
export interface LayoutProps {
  routerView: AWRouteViewFunc
}

/** 路由配置 */
export interface AWRouteConfig<Meta = {}> {
  name: string
  component: AWRouteComponent

  path?: string
  children?: AWRouteConfig<Meta>[]
  // 其是父视图的默认子视图
  // ture: 时可不配置 path，那么进入父路由 path 时会渲染该默认子路由
  // 如 true 时配置了 path，则会生成一个匹配父路由 path 的 exact 子路由，渲染的时该默认子路由的 component
  default?: boolean

  middlewares?: AWMiddlewareFunc<Meta>[] // 路由中间件
  meta?: Meta
}

/** 路由信息 */
export interface AWRouteInfo<Meta = {}> {
  readonly fullPath: string
  readonly name: string
  default?: boolean // 默认子路由
  readonly meta: Readonly<Meta>
}

/** 路由状态 */
export interface AWRouteState<Meta = {}> {
  readonly fullPath: string
  readonly name: string
  readonly meta: Readonly<Meta>
  readonly route: Readonly<RouteComponentProps>
}

/** AWRouter 的配置参数 */
export interface AWRouterOptions {
  mode?: 'hash' | 'history'
  middlewares?: AWMiddlewareFunc[]
  notFoundRouteName?: string // 404 路由的 name
}

/** router view 的配置 */
export interface RouteViewFuncOptions {
  cache: string[] // 需要缓存的路由 name 数组
}
