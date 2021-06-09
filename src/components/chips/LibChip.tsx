import m, { CVnode, Vnode } from "mithril";
import stream from "mithril/stream";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "../../JsxNamespace";

import {BattleChip} from "../../library/battlechip";
import {ChipLibrary} from "../../library/library";

import * as top from "../../TopLvlMsg";

export interface LibChipProps {
    chip: BattleChip,
}


function mouseHandler(e: Event) {
    console.log("event emitted");
    let id = +(e.currentTarget as HTMLDivElement).id.substr(2);
    top.getTopStream()(top.TopLvlMsg.ChangeChipDesc(id));
}

export class LibraryChip extends MitrhilTsxComponent<LibChipProps> {
    view(vnode: CVnode<LibChipProps>): JSX.Element {
        let chipCss = vnode.attrs.chip.classCss;
        let idVal = "L_" + vnode.attrs.chip.id;
        return (
            <div class={"select-none chip-row " + chipCss} id={idVal} onmouseover={mouseHandler}>
                <div class="w-4/10 px-0 whitespace-nowrap select-none debug">
                    {vnode.attrs.chip.name}
                </div>
                <div class="w-2/10 px-0 whitespace-nowrap select-none debug">
                    {vnode.attrs.chip.SkillAbv}
                </div>
                <div class="w-2/10 px-0 whitespace-nowrap select-none debug">
                    {vnode.attrs.chip.damage}
                </div>
                <div class="w-2/10 px-0 whitespace-nowrap select-none debug">
                    {vnode.attrs.chip.renderElements()}
                </div>
            </div>
        );
    }
}

