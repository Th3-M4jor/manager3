import m, { CVnode, Vnode } from "mithril";
import stream from "mithril/stream";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "../JsxNamespace";

import * as top from "../TopLvlMsg";

export interface libraryProps {
    active: boolean;
}

export class Folder extends MitrhilTsxComponent<libraryProps> {
    
    onbeforeupdate(vnode: CVnode<libraryProps>, old: CVnode<libraryProps>): boolean {
        if (vnode.attrs.active == false && old.attrs.active == false) {
            return false; //component is hidden
        } else {
            return true;
        }
    }
    
    view(vnode: CVnode<libraryProps>): JSX.Element {
        return (
            <>
            </>
        );
    }
}