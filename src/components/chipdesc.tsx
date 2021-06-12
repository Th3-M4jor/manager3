import m, { CVnode, Vnode } from "mithril";
import stream from "mithril/stream";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "../JsxNamespace";
import { BattleChip } from "../library/battlechip";
import { ChipLibrary } from "../library/library";

import * as top from "../TopLvlMsg";
import { isnumeric } from "../util/isnumeric";

export interface chipDescProps {
    displayChip: number | null;
}

export class ChipDesc extends MitrhilTsxComponent<chipDescProps> {

    private animationCounter: number;

    constructor(vnode: CVnode<chipDescProps>) {
        super(vnode);
        this.animationCounter = 0;
    }

    private genHitsDiv(chip: BattleChip): JSX.Element | null {
        let hits = isnumeric(chip.hits) ? +chip.hits : -1;

        //if hits is non-zero
        return hits ? <div class="w-3/10" style="border-left: 1px solid black">{chip.hits}</div> : null;

    }

    private chipDescTopRow(chip: BattleChip): JSX.Element {
        let hitsDiv = this.genHitsDiv(chip);

        return hitsDiv ? (
            <div class="flex">
                <div class="w-3/10" style="border-right: 1px solid black">{chip.KindAbv}</div>
                <div class="w-4/10">{chip.RangeAbv}</div>
                {hitsDiv}
            </div>
        ) : (
            <div class="flex">
                <div class="w-1/2" style="border-right: 1px solid black">{chip.KindAbv}</div>
                <div class="w-1/2">{chip.RangeAbv}</div>
            </div>
        );

    }

    private elemRow(chip: BattleChip): JSX.Element {
        return (
            <>
                <div class="debug col-span-1 text-left">
                    elem:
                </div>
                <div class="debug col-span-1">
                    {chip.renderElements()}
                </div>
            </>
        );
    }

    private dmgRow(chip: BattleChip): JSX.Element {

        if (chip.damage) {
            return (
                <>
                    <div class="debug col-span-1 text-left">
                        dmg:
                    </div>
                    <div class="debug col-span-1">
                        {chip.dmgStr}
                    </div>
                </>
            );
        }
        return (
            <>
            </>    
        );
    }


    viewWithChip(chipId: number): JSX.Element {

        let chip = ChipLibrary.getChip(chipId)

        let background = "h-1/2 debug " + chip.backgroundCss;

        let chipAnimClass = (this.animationCounter & 1) ? "chipWindowOne" : "chipWindowTwo";

        let fontStyle: string;

        if (chip.description.length > 700) {
            fontStyle = "text-xs md:text-sm lg:text-base" //"chipDescSm";
        } else if (chip.description.length > 450) {
            fontStyle = "text-sm md:text-base";
        } else {
            fontStyle = "text-base";
        }

        let outerChipClass = "chipDescText chipDescPadding " + chipAnimClass;

        return (
            <div class={background}>
                <div class={outerChipClass} style="padding: 3px; font-size: 14px;">
                    <div class="border-b border-black" >{chip.name}</div>
                    <div class="grid grid-cols-2 gap-0">
                        {this.elemRow(chip)}
                        {this.dmgRow(chip)}
                    </div>
                </div>
            </div>
        );
    }

    viewNoChip(): JSX.Element {
        return <div class="h-1/2 chipDescBackgroundStd debug" />
    }


    onbeforeupdate(vnode: CVnode<chipDescProps>, old: CVnode<chipDescProps>): boolean {

        if (vnode.attrs.displayChip != old.attrs.displayChip) {
            this.animationCounter = (this.animationCounter + 1) | 0; //coerce to signed int
            return true;
        } else {
            return false;
        }
    }

    view(vnode: CVnode<chipDescProps>): JSX.Element {

        //if(displayChip) return viewWithChip(displayChip) else return viewNoChip();

        return vnode.attrs.displayChip ? this.viewWithChip(vnode.attrs.displayChip) : this.viewNoChip();

    }
}