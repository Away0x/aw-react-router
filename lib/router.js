"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
var DEFAULT_NOT_FOUND_ROUTE_NAME = '404';
var DEFAULT_NOT_FOUND_ROUTE_PATH = '/404';
var AWRouter = /** @class */ (function () {
    function AWRouter() {
        /** mode */
        this.mode = 'hash';
        /** 存储路由配置 */
        this.routes = [];
        /** 路由信息表 */
        this.routeInfos = [];
        /** 当前路由的状态 */
        this.routeState = null;
        /** 存储全局中间件 */
        this.middlewares = [];
        /** 路由未找到时 redirect 去的地方 */
        this.notFoundRouteName = DEFAULT_NOT_FOUND_ROUTE_NAME;
    }
    AWRouter.instance = function () {
        if (this._instance === null) {
            this._instance = new this();
        }
        return this._instance;
    };
    /** 需要被缓存的路由 name */
    // private cachedRouteNameList: string[] = [];
    /** 加载路由 */
    AWRouter.prototype.load = function (routes, options) {
        if (options === void 0) { options = {}; }
        if (this.routes.length) {
            throw new Error('AWRouter load error: 路由已经加载过了');
        }
        this.mode = options.mode || 'hash';
        this.middlewares = options.middlewares || [];
        this.notFoundRouteName = options.notFoundRouteName || DEFAULT_NOT_FOUND_ROUTE_NAME;
        this.routes = routes;
        this.setRouteInfos(routes);
    };
    /** 渲染 routes */
    AWRouter.prototype.render = function (name) {
        var renderView = this.renderView.bind(this);
        var find = this.find.bind(this);
        var notFoundRouteName = this.notFoundRouteName;
        var groupPath = '';
        var isRootRoute = !name; // 是顶层路由
        var routes;
        if (isRootRoute) {
            routes = this.routes; // 顶层路由
        }
        else {
            var node = this.findNode(name, this.routes);
            if (!node) {
                throw new Error('AWRouter render error: route not found');
            }
            groupPath = find(node.name).fullPath;
            routes = node.children || [];
        }
        return function (_a) {
            // this.cachedRouteNameList = cache || []; // 需要被缓存的路由 name
            var cache = (_a === void 0 ? {} : _a).cache;
            var defaultRoute = null;
            var views = routes.map(function (route) {
                var exact = true;
                // exact (有子视图的父视图 exact 不能为 true)
                if (route.children && route.children.length) {
                    exact = false;
                }
                var fullPath = find(route.name).fullPath;
                // 默认路由 (如果是父路由的默认路由且配置了 path，那么生成一个父路由的 Route，避免匹配不到)
                if (route.default && route.path) {
                    defaultRoute = react_1.default.createElement(react_router_dom_1.Route, { exact: exact, key: route.name, path: groupPath, render: function (props) { return renderView(fullPath, route, props); } });
                }
                return react_1.default.createElement(react_router_dom_1.Route, { exact: exact, key: route.name, path: fullPath, render: function (props) { return renderView(fullPath, route, props); } });
            });
            if (defaultRoute) {
                views.unshift(defaultRoute);
            }
            // not found redirect
            if (views.length) {
                var notFoundRoute = find(notFoundRouteName);
                var nofFoundRoutePath = (notFoundRoute || {}).fullPath;
                if (!notFoundRoute || !nofFoundRoutePath) {
                    views.push(react_1.default.createElement(react_router_dom_1.Route, { exact: true, key: (name || 'root') + "NotFound", path: DEFAULT_NOT_FOUND_ROUTE_PATH, render: function (_) { return react_1.default.createElement("div", null, "ROUTE NOT FOUND"); } }));
                    views.push(react_1.default.createElement(react_router_dom_1.Redirect, { key: (name || 'root') + "NotFoundRedirect", to: DEFAULT_NOT_FOUND_ROUTE_PATH }));
                }
                else {
                    views.push(react_1.default.createElement(react_router_dom_1.Redirect, { key: (name || 'root') + "NotFoundRedirect", to: nofFoundRoutePath }));
                }
            }
            // 子路由包装 switch
            return react_1.default.createElement(react_router_dom_1.Switch, null, views);
        };
    };
    /** render view 方法 */
    AWRouter.prototype.renderView = function (fullPath, route, routeProps) {
        var routeViewFunc = this.render(route.name);
        var state = {
            name: route.name,
            fullPath: fullPath,
            route: routeProps,
            meta: route.meta || {},
        };
        // 执行中间件
        var view = this.applyMiddleware(state, this.middlewares.concat(route.middlewares || []));
        if (view) {
            return view;
        }
        // 存储路由状态
        this.setCurrentState(state);
        var Com = route.component;
        return (react_1.default.createElement(Com, __assign({ key: route.name }, routeProps, { routerView: routeViewFunc })));
    };
    /** 渲染根路由 */
    AWRouter.prototype.renderRootRoute = function () {
        var routes = this.render()();
        if (this.mode === 'hash') {
            return (react_1.default.createElement(react_router_dom_1.HashRouter, null, routes));
        }
        return (react_1.default.createElement(react_router_dom_1.BrowserRouter, null, routes));
    };
    /** 存储当前路由的状态 */
    AWRouter.prototype.setCurrentState = function (state) {
        this.routeState = state;
    };
    /** 获取当前路由的状态 */
    AWRouter.prototype.getCurrentState = function () {
        return this.routeState || null;
    };
    /** 获取路由信息表 */
    AWRouter.prototype.getRouteInfos = function () {
        return this.routeInfos || [];
    };
    /** 根据路由 name 查找路由信息 */
    AWRouter.prototype.find = function (name) {
        var r = this.getRouteInfos().find(function (c) { return c.name === name; });
        if (!r || !r.fullPath) {
            return null;
        }
        return r;
    };
    /** 根据路由 name 查找路由信息 */
    AWRouter.prototype.findMap = function (names) {
        var routeInfos = {};
        this.getRouteInfos().forEach(function (r) {
            if (names.indexOf(r.name) !== -1) {
                routeInfos[r.name] = r;
            }
        });
        return routeInfos;
    };
    /** 获取 404 的 path */
    AWRouter.prototype.getNotFoundRoutePath = function () {
        var notFoundPath = DEFAULT_NOT_FOUND_ROUTE_PATH;
        var notFoundPRoute = this.find(this.notFoundRouteName);
        if (notFoundPRoute && notFoundPRoute.fullPath) {
            notFoundPath = notFoundPRoute.fullPath;
        }
        return notFoundPath;
    };
    /** 根据路由 name 查找路由 fullpath */
    AWRouter.prototype.mustFindPath = function (name) {
        var resultRoute = this.find(name);
        if (!resultRoute || !resultRoute.fullPath) {
            return null;
        }
        return resultRoute.fullPath;
    };
    /** 根据路由 name 查找路由 fullpath */
    AWRouter.prototype.findPath = function (name, defaultPath) {
        if (defaultPath === void 0) { defaultPath = ''; }
        var dp = defaultPath || this.getNotFoundRoutePath();
        var resultPath = this.mustFindPath(name);
        return resultPath || dp;
    };
    /** 存储路由信息表 */
    AWRouter.prototype.setRouteInfos = function (routes) {
        var result = [];
        var fn = function (c, groupPath) {
            if (groupPath === void 0) { groupPath = ''; }
            var has = result.find(function (r) { return r.name === c.name; });
            if (has) {
                throw new Error('AWRouter error: duplicate route name');
            }
            // 不是默认视图又没配置 path 报错
            if (!c.default && !c.path) {
                throw new Error("AWRouter error: " + c.name + " route path missing");
            }
            var info = {
                fullPath: groupPath + (c.path || ''),
                name: c.name,
                meta: c.meta || {},
            };
            if (c.default) {
                info.default = true;
            }
            result.push(info);
            if (c.children && c.children.length) {
                var path_1 = (c.default && !c.path) ? groupPath : c.path;
                c.children.forEach(function (cc) { return fn(cc, path_1); });
            }
        };
        routes.forEach(function (c) { return fn(c); });
        this.routeInfos = result;
    };
    /** 查找 route 配置项 */
    AWRouter.prototype.findNode = function (name, routes) {
        var result = null;
        var fn = function (r) {
            if (result) {
                return;
            }
            if (r.name === name) {
                result = r;
                return;
            }
            if (r.children && r.children.length) {
                r.children.forEach(function (rr) { return fn(rr); });
            }
        };
        routes.forEach(function (r) { return fn(r); });
        return result;
    };
    /** 执行中间件 */
    AWRouter.prototype.applyMiddleware = function (state, middlewares) {
        for (var i = 0; i < middlewares.length; i++) {
            var view = middlewares[i](state);
            if (view) {
                return view;
            }
        }
        return null;
    };
    /** 根据 name 获取 path */
    AWRouter.prototype.getPathByName = function (name) {
        var route = this.find(name);
        if (!route || !route.fullPath) {
            var notFoundPRoute = this.find(this.notFoundRouteName);
            if (!notFoundPRoute) {
                return '';
            }
            return notFoundPRoute.fullPath || '';
        }
        return route.fullPath || '';
    };
    AWRouter._instance = null;
    return AWRouter;
}());
exports.default = AWRouter;
