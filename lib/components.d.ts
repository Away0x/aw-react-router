import React, { ReactNode } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { LayoutProps, AWRouteLayout } from './type';
export declare type AWSuspenseLoad = Promise<{
    default: AWRouteLayout;
}>;
export declare type AWSuspenseProps = SuspenseProp & RouteComponentProps & LayoutProps;
interface SuspenseProp {
    load: AWSuspenseLoad;
    fallback?: NonNullable<ReactNode> | null;
    delay?: number;
}
export declare const createSuspense: ({ defaultLoading, defaultDelay, }: {
    defaultLoading?: JSX.Element | undefined;
    defaultDelay?: number | undefined;
}) => React.FunctionComponent<AWSuspenseProps>;
export {};
