import m, { CVnode, Vnode } from "mithril";
import stream from "mithril/stream";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "../JsxNamespace";
import { BattleChip } from "../library/battlechip";
import { ChipLibrary } from "../library/library";

import * as top from "../TopLvlMsg";
import { isnumeric } from "../util/isnumeric";

export interface chipDescProps {
    displayChip: number | undefined;
}


function scrollIntervalHandler() {
    let scrollDiv = document.getElementById("ScrollTextDiv");

    if(scrollDiv) {
        let clientHeight = scrollDiv.clientHeight;
        let totalHeight = scrollDiv.scrollHeight;
        let maxScroll = totalHeight = clientHeight;
        if (maxScroll - 10 <= 0) return;
        scrollDiv.scrollTop += 1;
    }

}

export class ChipDesc extends MitrhilTsxComponent<chipDescProps> {

    private animationCounter: number;
    private scrollIntervalHandle: number | undefined;

    constructor(vnode: CVnode<chipDescProps>) {
        super(vnode);
        this.animationCounter = 0;
        this.scrollIntervalHandle = undefined;
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

    private spawnScrollInterval() {
        this.scrollIntervalHandle = window.setInterval(scrollIntervalHandler, 75);
    }

    private stopScrollInterval() {
        window.clearInterval(this.scrollIntervalHandle);
        this.scrollIntervalHandle = undefined;
    }

    oncreate(_: CVnode<chipDescProps>) {
        this.spawnScrollInterval();
    }

    viewWithChip(chipId: number): JSX.Element {
        
        let chip = ChipLibrary.getChip(chipId)

        let background = "col-span-1 debug " + chip.backgroundCss;
        
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
        let innerChipClass = fontStyle + " chipDescDiv debug";

        return (
            <div class={background} onmouseover={(e: any) => { e.redraw = false; this.stopScrollInterval()}} onmouseout={(e: any) => { e.redraw = false; this.spawnScrollInterval()}}>
                <div class={outerChipClass} style="padding: 3px; font-size: 14px;">
                    {this.chipDescTopRow(chip)}
                    <div class={innerChipClass} id="ScrollTextDiv">
                        {chip.description}
                    </div>
                </div>
            </div>
        );
    }

    viewNoChip(): JSX.Element {
        return <div class="col-span-1 chipDescBackgroundStd debug"/>
    }


    onbeforeupdate(vnode: CVnode<chipDescProps>, old: CVnode<chipDescProps>): boolean {
        
        if(vnode.attrs.displayChip != old.attrs.displayChip) {
            this.animationCounter = (this.animationCounter + 1) | 0; //or with zero
            return true;
        } else {
            return false;
        }
    }
    
    view(vnode: CVnode<chipDescProps>): JSX.Element {
        
        //if(displayChip) return viewWithChip(displayChip) else return viewNoChip();

        return vnode.attrs.displayChip ? this.viewWithChip(vnode.attrs.displayChip) : this.viewNoChip();
        
    }

    onbeforeremove(_: CVnode<chipDescProps>) {
        this.stopScrollInterval();
    }
}