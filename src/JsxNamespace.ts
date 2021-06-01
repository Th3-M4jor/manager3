import m from "mithril";

export abstract class MitrhilTsxComponent<A = {}>
  implements m.ClassComponent<A> {
  private __props: A & { key?: string | number };

  constructor({ attrs }: m.CVnode<A>) {
    this.__props = attrs;
  }

  abstract view(vnode: m.CVnode<A>): m.Children | null | void;

  oninit?(vnode: m.CVnode<A>): void;

  oncreate?(vnode: m.CVnode<A>): void;

  onupdate?(vnode: m.CVnode<A>): void;

  onbeforeremove?(vnode: m.CVnode<A>): void | Promise<void>;

  onremove?(vnode: m.CVnode<A>): void;

  onbeforeupdate?(vnode: m.CVnode<A>): boolean;

}

declare global {
  namespace JSX {
    interface Element extends m.Vnode<any, any> {}
    // // interface Element<A = {}, B = {}> extends m.Vnode<A, B> {}
    interface IntrinsicElements {
      [key: string]: any;
    }
    interface IntrinsicAttributes {
      [key: string]: any;
    }
    interface ElementAttributesProperty {
      __props: any;
    }
  }
}