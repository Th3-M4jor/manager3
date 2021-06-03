import m, { CVnode, Vnode } from "mithril";
import stream from "mithril/stream";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "../JsxNamespace";

import * as top from "../TopLvlMsg";

export interface folderProps {
    active: boolean;
    inFolderGroup: boolean;
}

export class Folder extends MitrhilTsxComponent<folderProps> {
    
    onbeforeupdate(vnode: CVnode<folderProps>, old: CVnode<folderProps>): boolean {
        if (vnode.attrs.active == false && old.attrs.active == false) {
            return false; //component is hidden
        } else {
            return true;
        }
    }
    
    view(vnode: CVnode<folderProps>): JSX.Element {
        return (
            <>
            </>
        );
    }
}