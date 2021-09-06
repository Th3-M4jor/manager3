import m, { CVnode } from "mithril";
import { MitrhilTsxComponent } from "../../JsxNamespace";

import {BattleChip} from "../../library/battlechip";
import { ChipLibrary } from "../../library/library";

export interface FolderChipProps {
    chip: BattleChip,
    folderIndex: number,
    used: boolean,
    onmouseover: (e: MouseEvent) => void,
    returnToPack: (e: MouseEvent) => void,
}

export class FolderChip extends MitrhilTsxComponent<FolderChipProps> {
    view(vnode: CVnode<FolderChipProps>): JSX.Element {
        const chipCss = vnode.attrs.used ? "UsedChip" : vnode.attrs.chip.classCss;
        const idVal = "F_" + vnode.attrs.folderIndex;
        return (
            <div class={"select-none chip-row " + chipCss} id={idVal} onmouseover={vnode.attrs.onmouseover} ondblclick={vnode.attrs.returnToPack}>
                <div class="w-1/24 sm:w-1/24 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.folderIndex + 1}
                </div>
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
                <div class="w-4/24 sm:w-4/24 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.chip.renderElements()}
                </div>
                <div class="w-2/24 sm:w-2/24 px-0 whitespace-nowrap select-none" ondblclick={(e: MouseEvent) => {e.stopPropagation()}}>
                    <input
                        name="chipUsed"
                        type="checkbox"
                        checked={vnode.attrs.used}
                        onclick={(e: MouseEvent) => {
                            ChipLibrary.Folder[vnode.attrs.folderIndex].used = !vnode.attrs.used;
                            (e.currentTarget as HTMLInputElement)?.blur();
                        }}
                    />
                </div>
            </div>
        );
    }
}