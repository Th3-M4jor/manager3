import m, { CVnode, Vnode } from "mithril";
import stream from "mithril/stream";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "../../JsxNamespace";

import {BattleChip} from "../../library/battlechip";
import {ChipLibrary} from "../../library/library";

import * as top from "../../TopLvlMsg";

export interface LibChipProps {
    chip: BattleChip,
    onmouseover: (e: Event) => void;
}

export class LibraryChip extends MitrhilTsxComponent<LibChipProps> {
    view(vnode: CVnode<LibChipProps>): JSX.Element {
        let chipCss = vnode.attrs.chip.classCss;
        let idVal = "L_" + vnode.attrs.chip.id;
        return (
            <div class={"select-none chip-row " + chipCss} id={idVal} onmouseover={vnode.attrs.onmouseover}>
                <div class="w-4/12 md:w-4/12 px-0 whitespace-nowrap select-none debug">
                    {vnode.attrs.chip.name}
                </div>
                <div class="w-2/12 md:w-2/12 px-0 whitespace-nowrap select-none debug">
                    {vnode.attrs.chip.SkillAbv}
                </div>
                <div class="w-2/12 md:w-2/12 px-0 whitespace-nowrap select-none debug">
                    {vnode.attrs.chip.RangeAbv}
                </div>
                <div class="w-2/12 md:w-2/12 px-0 whitespace-nowrap select-none debug">
                    {vnode.attrs.chip.dmgStr}
                </div>
                <div class="w-2/12 md:w-2/12 px-0 whitespace-nowrap select-none debug">
                    {vnode.attrs.chip.renderElements()}
                </div>
            </div>
        );
    }
}

