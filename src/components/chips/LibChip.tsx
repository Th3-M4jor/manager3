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

export class LibraryChip extends MitrhilTsxComponent<LibChipProps> {
    view(vnode: CVnode<LibChipProps>): JSX.Element {
        let chipCss = vnode.attrs.chip.classCss;
        let idVal = "L_" + vnode.attrs.chip.id;
        return (
            <div class={"contents select-none chip-row chipHover " + chipCss} id={idVal} onmouseover={() => {console.log(idVal)}}>
                <div class="col-span-4 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.chip.name}
                </div>
                <div class="col-span-2 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.chip.SkillAbv}
                </div>
                <div class="col-span-2 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.chip.damage}
                </div>
                <div class="col-span-2 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.chip.renderElements()}
                </div>
            </div>
        );
    }
}

