import { RenderableProps } from "preact";

import { BattleChip } from "../../library/battlechip";

export interface LibChipProps {
    chip: BattleChip,
    onmouseover: (e: Event) => void;
    ondoubleclick: (e: Event) => void;
}

export function LibraryChip(props: RenderableProps<LibChipProps>) {
    const chipCss = props.chip.classCss;
    //const idVal = "L_" + vnode.attrs.chip.id;
    return (
        <div class={"select-none chip-row " + chipCss} data-id={props.chip.id} onMouseOver={props.onmouseover} onDblClick={props.ondoubleclick}>
            <div class="w-7/24 sm:w-5/24 px-0 mx-0 whitespace-nowrap select-none">
                {props.chip.name}
            </div>
            <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                {props.chip.SkillAbv}
            </div>
            <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                {props.chip.RangeAbv}
            </div>
            <div class="w-4/24 sm:w-4/24 px-0 whitespace-nowrap select-none">
                {props.chip.dmgStr}
            </div>
            <div class="hidden sm:block sm:w-4/24 px-0 whitespace-nowrap select-none">
                {props.chip.KindAbv}
            </div>
            <div class="w-5/24 sm:w-4/24 px-0 whitespace-nowrap select-none">
                {props.chip.renderElements()}
            </div>
        </div>
    );
}