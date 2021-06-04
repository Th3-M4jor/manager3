import m, { CVnode, Vnode } from "mithril";
import stream from "mithril/stream";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "../JsxNamespace";

import * as top from "../TopLvlMsg";

export interface chipDescProps {
    displayChip: number | undefined;
}

export class ChipDesc extends MitrhilTsxComponent<chipDescProps> {

    viewWithChip(chipId: number): JSX.Element {
        return (
            <>
            </>
        );
    }


    onbeforeupdate(vnode: CVnode<chipDescProps>, old: CVnode<chipDescProps>): boolean {
        return (vnode.attrs.displayChip != old.attrs.displayChip);
    }
    
    view(vnode: CVnode<chipDescProps>): JSX.Element {
        
        if(!vnode.attrs.displayChip) {
            return (
                <div class="hidden sm:block sm:col-span-2 chipDescBackgroundStd"/>
            );
        } else {
            return this.viewWithChip(vnode.attrs.displayChip);
        }
        
    }
}