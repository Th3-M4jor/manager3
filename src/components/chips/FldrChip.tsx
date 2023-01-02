import m, { CVnode } from "mithril";
import { MitrhilTsxComponent } from "../../JsxNamespace";

import { BattleChip } from "../../library/battlechip";
import { ChipLibrary } from "../../library/library";

export interface FolderChipProps {
    chip: BattleChip,
    folderIndex: number,
    used: boolean,
    displayIndex: number,
    groupFolder?: boolean,
    onmouseover: (e: MouseEvent) => void,
    returnToPack?: (e: MouseEvent) => void,
}

export class FolderChip extends MitrhilTsxComponent<FolderChipProps> {

    private makeInputDiv(vnode: CVnode<FolderChipProps>): JSX.Element {
        if (!vnode.attrs.groupFolder) {
            return (
                <div class="w-2/24 sm:w-2/24 px-0 whitespace-nowrap select-none" ondblclick={(e: MouseEvent) => { e.stopPropagation() }}>
                    <input
                        name="chipUsed"
                        type="checkbox"
                        checked={vnode.attrs.used}
                        onclick={(e: MouseEvent) => {
                            ChipLibrary.ActiveFolder[vnode.attrs.folderIndex][1] = !vnode.attrs.used;
                            ChipLibrary.folderUpdated();
                            (e.currentTarget as HTMLInputElement)?.blur();
                        }}
                    />
                </div>
            );
        }

        return (
            <div class="w-2/24 sm:w-2/24 px-0 whitespace-nowrap select-none">
                <input
                    name="chipUsed"
                    type="checkbox"
                    checked={vnode.attrs.used}
                    disabled
                />
            </div>
        );

    }


    view(vnode: CVnode<FolderChipProps>): JSX.Element {
        const chipCss = vnode.attrs.used ? "UsedChip" : vnode.attrs.chip.classCss;
        //const idVal = "F_" + vnode.attrs.folderIndex;
        return (
            <div
                class={"select-none chip-row " + chipCss}
                data-index={vnode.attrs.folderIndex}
                data-id={vnode.attrs.chip.id}
                onmouseover={vnode.attrs.onmouseover} ondblclick={vnode.attrs.returnToPack}
            >
                <div class="w-1/24 sm:w-1/24 px-0 whitespace-nowrap select-none">
                    {vnode.attrs.displayIndex + 1}
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
                {this.makeInputDiv(vnode)}
            </div>
        );
    }
}