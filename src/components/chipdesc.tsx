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

export class ChipDesc extends MitrhilTsxComponent<chipDescProps> {

    private animationCounter: number;

    constructor(vnode: CVnode<chipDescProps>) {
        super(vnode);
        this.animationCounter = 0;
    }

    private genHitsDiv(chip: BattleChip): JSX.Element | null {
        let hits = isnumeric(chip.hits) ? +chip.hits : -1;

        //if hits is non-zero
        return hits ? <div class="w-1/3" style="boder-left: 1px solid black">{chip.hits}</div> : null;

    }

    private chipDescTopRow(chip: BattleChip): JSX.Element {
        let hitsDiv = this.genHitsDiv(chip);

        return hitsDiv ? (
            <div class="flex">
                <div class="w-1/3" style="border-right: 1px solid black">{chip.KindAbv}</div>
                <div class="w-1/3">{chip.RangeAbv}</div>
                {hitsDiv}
            </div>
        ) : (
            <div>
                <div class="w-1/2" style="border-right: 1px solid black">{chip.KindAbv}</div>
                <div class="w-1/2">{chip.RangeAbv}</div>
            </div>
        );

    }

    viewWithChip(chipId: number): JSX.Element {
        
        let chip = ChipLibrary.getChip(chipId)

        let background = "hidden sm:block sm:col-span-1 debug " + chip.backgroundCss;
        
        let chipAnimClass = (this.animationCounter & 1) ? "chipWindowOne" : "chipWindowTwo";

        let fontStyle: string;

        if (chip.description.length > 700) {
            fontStyle = "chipDecSm";
        } else if (chip.description.length > 450) {
            fontStyle = "chipDescMd";
        } else {
            fontStyle = "chipDescLg";
        }

        let outerChipClass = "chipDescText chipDescPadding " + chipAnimClass;
        let innerChipClass = fontStyle + " chipDescDiv";

        return (
            <div class={background}>
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
        return <div class="hidden sm:block sm:col-span-1 chipDescBackgroundStd debug"/>
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
}