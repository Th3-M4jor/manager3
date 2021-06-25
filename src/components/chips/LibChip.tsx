import m, { CVnode } from "mithril";
import { MitrhilTsxComponent } from "../../JsxNamespace";

import {BattleChip} from "../../library/battlechip";

export interface LibChipProps {
    chip: BattleChip,
    onmouseover: (e: Event) => void;
    ondoubleclick: (e: Event) => void;
}

export class LibraryChip extends MitrhilTsxComponent<LibChipProps> {
    view(vnode: CVnode<LibChipProps>): JSX.Element {
        const chipCss = vnode.attrs.chip.classCss;
        const idVal = "L_" + vnode.attrs.chip.id;
        return (
            <div class={"select-none chip-row " + chipCss} id={idVal} onmouseover={vnode.attrs.onmouseover} ondblclick={vnode.attrs.ondoubleclick}>
                <div class="w-7/24 sm:w-5/24 px-0 mx-0 whitespace-nowrap select-none">
                    {vnode.attrs.chip.name}
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.chip.SkillAbv}
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.chip.RangeAbv}
                </div>
                <div class="w-4/24 sm:w-4/24 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.chip.dmgStr}
                </div>
                <div class="hidden sm:block sm:w-4/24 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.chip.KindAbv}
                </div>
                <div class="w-5/24 sm:w-4/24 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.chip.renderElements()}
                </div>
            </div>
        );
    }
}

