import m, { CVnode, Vnode } from "mithril";
import stream from "mithril/stream";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "../JsxNamespace";

import * as top from "../TopLvlMsg";

export interface packProps {
    active: boolean;
}

export class Pack extends MitrhilTsxComponent<packProps> {
    
    onbeforeupdate(vnode: CVnode<packProps>, old: CVnode<packProps>): boolean {
        if (vnode.attrs.active == false && old.attrs.active == false) {
            return false; //component is hidden
        } else {
            return true;
        }
    }
    
    view(vnode: CVnode<packProps>): JSX.Element {
        return (
            <>
            </>
        );
    }
}