import React, { Suspense, lazy, FC, ReactNode } from 'react';
import { RouteComponentProps, matchPath, match } from 'react-router'
import PminDelay from 'p-min-delay';

import { LayoutProps, AWRouteLayout } from './type';

export type AWSuspenseLoad = Promise<{ default: AWRouteLayout }>
export type AWSuspenseProps = SuspenseProp & RouteComponentProps & LayoutProps;

interface SuspenseProp {
  load: AWSuspenseLoad                      // 异步加载的 promise component
  fallback?: NonNullable<ReactNode> | null  // 加载时显示的 loading
  delay?: number                            // 延迟 delay 秒显示 load 加载到的组件，避免加载太快的闪现
}

export const createSuspense = ({
  defaultLoading = <div>loading...</div>,
  defaultDelay = 0,
}) => {
  const AWSuspense: FC<AWSuspenseProps> = ({ fallback, load, delay, ...rest }) => {
    let LazyCom: AWRouteLayout;
    if (delay) {
      LazyCom = lazy(() => PminDelay(load, delay));
    } else {
      LazyCom = lazy(() => load);
    }

    return (
      <Suspense fallback={fallback!}>
        <LazyCom {...rest} />
      </Suspense>
    );
  }

  AWSuspense.defaultProps = {
    fallback: defaultLoading,
    delay: defaultDelay,
  };

  return AWSuspense;
};

interface CacheSwitchProps {
  include: string[] // 需要缓存的路由的 path array
}

interface CacheMap {
  [k: string]: {
    match: match,
    show: boolean
  }
}

export class CacheSwitch extends React.Component<CacheSwitchProps> {
  // 缓存已加载过的组件
  cache: CacheMap = {};

  render() {
    const { children, include = [] } = this.props;

    return React.Children.map(children, child => {
      // 验证是否为是react element
      if (React.isValidElement(child)) {
        const { path } = child.props;
        const match = matchPath(location.pathname, { ...child.props, path });

        if (match && include.includes(path)) {
          // 如果匹配，则将对应 path 的 computedMatch 属性加入 cache 对象里
          this.cache[path] = {
            match: match,
            show: true,
          };
        } else {
          if (this.cache[path]) {
            this.cache[path].show = false;
          }
        }

        return (
          <div style={{ display: match ? 'block' : 'none' }}>
            {React.cloneElement(child, { computedMatch: this.cache[path] })}
          </div>
        );
      }

      return null;
    });
  }
}
