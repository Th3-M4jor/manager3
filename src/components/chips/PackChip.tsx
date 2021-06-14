import m, { CVnode, Vnode } from "mithril";
import stream from "mithril/stream";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "../../JsxNamespace";

import {BattleChip} from "../../library/battlechip";
import {ChipLibrary} from "../../library/library";

import * as top from "../../TopLvlMsg";

export interface PackChipProps {
    chip: BattleChip,
    owned: number,
    used: number,
    onmouseover: (e: Event) => void;
}

export class PackChip extends MitrhilTsxComponent<PackChipProps> {
    view(vnode: CVnode<PackChipProps>): JSX.Element {
        let chipCss = vnode.attrs.owned >= vnode.attrs.used ? "UsedChip" : vnode.attrs.chip.classCss;
        let idVal = "P_" + vnode.attrs.chip.id;

        return (
            <div class={"select-none chip-row " + chipCss} id={idVal} onmouseover={vnode.attrs.onmouseover}>
                <div class="w-7/24 sm:w-5/24 px-0 whitespace-nowrap select-none debug">
                    {vnode.attrs.chip.name}
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none debug">
                    {vnode.attrs.chip.SkillAbv}
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none debug">
                    {vnode.attrs.chip.RangeAbv}
                </div>
                <div class="w-4/24 sm:w-4/24 px-0 whitespace-nowrap select-none debug">
                    {vnode.attrs.chip.dmgStr}
                </div>
                <div class="hidden sm:block sm:w-4/24 px-0 whitespace-nowrap select-none debug">
                    {vnode.attrs.chip.KindAbv}
                </div>
                <div class="w-5/24 sm:w-4/24 px-0 whitespace-nowrap select-none debug">
                    {vnode.attrs.chip.renderElements()}
                </div>
            </div>
        );

    }
}

