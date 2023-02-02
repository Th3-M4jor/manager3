import { RenderableProps } from "preact";

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

function groupFolderInputDiv(props: RenderableProps<FolderChipProps>) {
    return (
        <div class="w-2/24 sm:w-2/24 px-0 whitespace-nowrap select-none">
            <input
                name="chipUsed"
                type="checkbox"
                class="cursor-not-allowed"
                checked={props.used}
                disabled
            />
        </div>
    );
}

function folderInputDiv(props: RenderableProps<FolderChipProps>) {
    return (
        <div class="w-2/24 sm:w-2/24 px-0 whitespace-nowrap select-none" onDblClick={(e) => { e.stopPropagation() }}>
            <input
                name="chipUsed"
                type="checkbox"
                class="cursor-pointer"
                checked={props.used}
                onClick={(e) => {
                    ChipLibrary.ActiveFolder[props.folderIndex][1].value = !props.used;
                    ChipLibrary.folderUpdated();
                    e.currentTarget.blur();
                }}
            />
        </div>
    );
}

export function FolderChip(props: RenderableProps<FolderChipProps>) {
    const chipCss = props.used ? "UsedChip" : props.chip.classCss;
    
    return (
        <div
            class={"select-none chip-row " + chipCss}
            data-index={props.folderIndex}
            data-id={props.chip.id}
            onMouseOver={props.onmouseover} onDblClick={props.returnToPack}
        >
            <div class="w-1/24 sm:w-1/24 px-0 whitespace-nowrap select-none">
                {props.displayIndex + 1}
            </div>
            <div class="w-6/24 sm:w-5/24 px-0 whitespace-nowrap select-none">
                {props.chip.name}
            </div>
            <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                {props.chip.SkillAbv}
            </div>
            <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                {props.chip.RangeAbv}
            </div>
            <div class="w-3/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                {props.chip.dmgStr}
            </div>
            <div class="hidden sm:block sm:w-3/24 px-0 whitespace-nowrap select-none">
                {props.chip.KindAbv}
            </div>
            <div class="w-4/24 sm:w-4/24 px-0 whitespace-nowrap select-none">
                {props.chip.renderElements()}
            </div>
            {props.groupFolder ? groupFolderInputDiv(props) : folderInputDiv(props)}
        </div>
    );
}
