import m, { CVnode, Vnode } from "mithril";
import stream from "mithril/stream";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "../JsxNamespace";

import * as top from "../TopLvlMsg";

export interface folderProps {
    inFolderGroup: boolean;
}

export class Folder extends MitrhilTsxComponent<folderProps> {
    
    view(vnode: CVnode<folderProps>): JSX.Element {
        return (
            <>
            </>
        );
    }
}