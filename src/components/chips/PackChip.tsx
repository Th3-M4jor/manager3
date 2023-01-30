import { RenderableProps } from "preact";

import {BattleChip} from "../../library/battlechip";

export interface PackChipProps {
    chip: BattleChip,
    owned: number,
    used: number,
    onmouseover: (e: Event) => void;
    addToFolder: (e: Event) => void;
}

export function PackChip(props: RenderableProps<PackChipProps>) {
    const chipCss = props.owned <= props.used ? "UsedChip" : props.chip.classCss;

    return (
        <div class={"select-none chip-row " + chipCss} data-id={props.chip.id} onMouseOver={props.onmouseover} onDblClick={props.addToFolder}>
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
            <div class="w-3/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                {props.chip.renderElements()}
            </div>
            <div class="w-2/24 sm:w-2/24 px-0 whitespace-nowrap select-none">
                {props.owned}
            </div>
            <div class="w-2/24 sm:w-2/24 px-0 whitespace-nowrap select-none">
                {props.used}
            </div>
        </div>
    );
}