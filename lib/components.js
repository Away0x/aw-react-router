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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
// import {
//   RouteComponentProps,
//   // matchPath,
//   // match,
// } from 'react-router-dom';
var p_min_delay_1 = __importDefault(require("p-min-delay"));
exports.createSuspense = function (_a) {
    var _b = _a.defaultLoading, defaultLoading = _b === void 0 ? react_1.default.createElement("div", null, "loading...") : _b, _c = _a.defaultDelay, defaultDelay = _c === void 0 ? 0 : _c;
    var AWSuspense = function (_a) {
        var fallback = _a.fallback, load = _a.load, delay = _a.delay, rest = __rest(_a, ["fallback", "load", "delay"]);
        var LazyCom;
        if (delay) {
            LazyCom = react_1.lazy(function () { return p_min_delay_1.default(load, delay); });
        }
        else {
            LazyCom = react_1.lazy(function () { return load; });
        }
        return (react_1.default.createElement(react_1.Suspense, { fallback: fallback },
            react_1.default.createElement(LazyCom, __assign({}, rest))));
    };
    AWSuspense.defaultProps = {
        fallback: defaultLoading,
        delay: defaultDelay,
    };
    return AWSuspense;
};
// interface CacheSwitchProps {
//   include: string[] // 需要缓存的路由的 path array
// }
// interface CacheMap {
//   [k: string]: {
//     match: match,
//     show: boolean
//   }
// }
// export class CacheSwitch extends React.Component<CacheSwitchProps> {
//   // 缓存已加载过的组件
//   cache: CacheMap = {};
//   render() {
//     const { children, include = [] } = this.props;
//     return React.Children.map(children, child => {
//       // 验证是否为是react element
//       if (React.isValidElement(child)) {
//         const { path } = child.props;
//         const match = matchPath(location.pathname, { ...child.props, path });
//         if (match && include.includes(path)) {
//           // 如果匹配，则将对应 path 的 computedMatch 属性加入 cache 对象里
//           this.cache[path] = {
//             match: match,
//             show: true,
//           };
//         } else {
//           if (this.cache[path]) {
//             this.cache[path].show = false;
//           }
//         }
//         return (
//           <div style={{ display: match ? 'block' : 'none' }}>
//             {React.cloneElement(child, { computedMatch: this.cache[path] })}
//           </div>
//         );
//       }
//       return null;
//     });
//   }
// }
