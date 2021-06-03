import m, { CVnode, Vnode } from "mithril";
import stream from "mithril/stream";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "../JsxNamespace";

import * as top from "../TopLvlMsg";

export interface chipDescProps {
    displayChip: number | undefined;
}

export class ChipDesc extends MitrhilTsxComponent<chipDescProps> {
    
    onbeforeupdate(vnode: CVnode<chipDescProps>, old: CVnode<chipDescProps>): boolean {
        return (vnode.attrs.displayChip != old.attrs.displayChip);
    }
    
    view(vnode: CVnode<chipDescProps>): JSX.Element {
        return (
            <>
            </>
        );
    }
}