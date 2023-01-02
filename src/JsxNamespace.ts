import m from "mithril";

export abstract class MitrhilTsxComponent<A = Record<string, never>>
  implements m.ClassComponent<A> {
  private __props: A

  constructor({ attrs }: m.CVnode<A>) {
    this.__props = attrs;
  }

  abstract view(vnode: m.CVnode<A>): m.Children | null | void;

  oninit?(vnode: m.CVnode<A>): void;

  oncreate?(vnode: m.CVnode<A>): void;

  onupdate?(vnode: m.CVnode<A>): void;

  onbeforeremove?(vnode: m.CVnode<A>): void | Promise<void>;

  onremove?(vnode: m.CVnode<A>): void;

  onbeforeupdate?(vnode: m.CVnode<A>, old: m.CVnode<A>): boolean;

}

declare global {
  namespace JSX {
    interface Element extends m.Vnode<unknown, unknown> {}

    interface IntrinsicElements {
      [key: string]: unknown;
    }

    interface IntrinsicAttributes {
      [key: string]: unknown;
    }

    interface ElementAttributesProperty {
      __props: unknown;
    }
  }
}
