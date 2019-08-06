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
var index_1 = __importDefault(require("./index"));
// 可通过该方法获取到 layout 的 routerView 和一些路由信息
function withAWRouter(Component) {
    var displayName = "withAWRouter(" + (Component.displayName || Component.name) + ")";
    var Router = react_router_dom_1.withRouter(Component);
    var aw = index_1.default.instance();
    var currentState = aw.getCurrentState();
    if (!currentState) {
        return Router;
    }
    var routerView = index_1.default.instance().render(currentState.name);
    var C = function (props) {
        return react_1.default.createElement(Router, __assign({}, props, { routerView: routerView }));
    };
    C.displayName = displayName;
    return C;
}
exports.withAWRouter = withAWRouter;
