import m, { CVnode, Vnode } from "mithril";

import { MitrhilTsxComponent } from "../JsxNamespace";
import { BattleChip, ChipData } from "../library/battlechip";
import { ChipLibrary } from "../library/library";

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
                <span /*style="float: right; color: red"*/ class="float-right text-red-600">
                    {vnode.attrs.msg ?? ""}
                </span>
            </div>
        );
    }
}