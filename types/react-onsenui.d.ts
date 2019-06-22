/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export type HTMLAttributes<K extends keyof React.HTMLAttributes<{}>> = Partial<
  Pick<React.HTMLAttributes<{}>, K>
>;
export type InputHTMLAttributes<
  K extends keyof React.InputHTMLAttributes<{}>
> = Partial<Pick<React.InputHTMLAttributes<{}>, K>>;

export class Component<P = {}, S = {}> extends React.Component<
  HTMLAttributes<'id' | 'className' | 'style'> & P,
  S
> {}

export class Page extends Component<
  {
    contentStyle?: any;
    modifier?: string;
    renderModal?(): void;
    renderToolbar?(): void;
    renderBottomToolbar?(): void;
    renderFixed?(): void;
    onInit?(): void;
    onShow?(): void;
    onHide?(): void;
  },
  any
> {}

export class Fab extends Component<
  {
    modifier?: string;
    ripple?: boolean;
    position?: string;
    disabled?: boolean;
    onClick?(e?: React.MouseEvent<HTMLElement>): void;
    name?: string;
  },
  any
> {}

export class Range extends Component<
  {
    modifier?: string;
    onChange?(e: Event): void;
    value?: number;
    disabled?: boolean;
    max?: number;
    min?: number;
    step?: number;
  },
  any
> {}
