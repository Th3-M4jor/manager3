import m from "mithril";

import { MitrhilTsxComponent } from "../JsxNamespace";
export interface TopBarProps {
    msg?: string,
    tabName: string,
}

export class TopBar extends MitrhilTsxComponent<TopBarProps> {
    view(vnode: m.CVnode<TopBarProps>): JSX.Element {
        return (
            <div class="topStatusBar">
                <span /*style="padding-left: 5px"*/ class="pl-1">
                    {vnode.attrs.tabName}
                </span>
                <span /*style="float: right; color: red"*/ class="topMsgSpan">
                    {vnode.attrs.msg ?? ""}
                </span>
            </div>
        );
    }
}