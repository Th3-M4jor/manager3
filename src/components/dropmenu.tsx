import m from "mithril";

import { MitrhilTsxComponent } from "../JsxNamespace";

export interface DropMenuProps {
    /**
     * Applied to the element that opens the menu on hover
     */
    class?: string,

    /**
     * The dropdown menu text, defaults to "Menu"
     */
    text?: string,
}

export class DropMenu extends MitrhilTsxComponent<DropMenuProps> {

    view(vnode: m.CVnode<DropMenuProps>): JSX.Element {
        return (
            <div class="dropdown">
                <button class={vnode.attrs.class}>{vnode.attrs.text ? vnode.attrs.text : "Menu"}</button>
                <div class="dropdown-content">
                    {vnode.children}
                </div>
            </div>
        );
    }
}