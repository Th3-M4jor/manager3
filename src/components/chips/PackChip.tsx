import m, { CVnode } from "mithril";
import { MitrhilTsxComponent } from "../../JsxNamespace";

import {BattleChip} from "../../library/battlechip";


export interface PackChipProps {
    chip: BattleChip,
    owned: number,
    used: number,
    onmouseover: (e: Event) => void;
    addToFolder: (e: Event) => void;
}

export class PackChip extends MitrhilTsxComponent<PackChipProps> {
    view(vnode: CVnode<PackChipProps>): JSX.Element {
        const chipCss = vnode.attrs.owned <= vnode.attrs.used ? "UsedChip" : vnode.attrs.chip.classCss;
        //const idVal = "P_" + vnode.attrs.chip.id;

        return (
            <div class={"select-none chip-row " + chipCss} data-id={vnode.attrs.chip.id} onmouseover={vnode.attrs.onmouseover} ondblclick={vnode.attrs.addToFolder}>
                <div class="w-6/24 sm:w-5/24 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.chip.name}
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.chip.SkillAbv}
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.chip.RangeAbv}
                </div>
                <div class="w-3/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.chip.dmgStr}
                </div>
                <div class="hidden sm:block sm:w-3/24 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.chip.KindAbv}
                </div>
                <div class="w-3/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.chip.renderElements()}
                </div>
                <div class="w-2/24 sm:w-2/24 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.owned}
                </div>
                <div class="w-2/24 sm:w-2/24 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.used}
                </div>
            </div>
        );

    }
}

