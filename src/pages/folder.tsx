import m, { CVnode } from "mithril";
import { MitrhilTsxComponent } from "../JsxNamespace";

export interface folderProps {
    inFolderGroup: boolean;
}

export class Folder extends MitrhilTsxComponent<folderProps> {
    
    view(_: CVnode<folderProps>): JSX.Element {
        return (
            <>
            </>
        );
    }
}