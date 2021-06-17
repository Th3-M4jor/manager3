import m, { CVnode, Vnode } from "mithril";

import { MitrhilTsxComponent } from "../JsxNamespace";
import { BattleChip } from "../library/battlechip";
import { ChipLibrary } from "../library/library";
import { chipEffectToShortStr } from "../library/chipeffect";
import { elementToCssClass } from "../library/elements";

export interface chipDescProps {
    displayChip: number | null;
}

export class ChipDesc extends MitrhilTsxComponent<chipDescProps> {

    private animationCounter: number;

    constructor(vnode: CVnode<chipDescProps>) {
        super(vnode);
        this.animationCounter = 0;
    }

    /*
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
    */

    private elemRow(chip: BattleChip): JSX.Element {
        return (
            <>
                <div class="col-span-1 border-r border-black text-left">
                    elem:
                </div>
                <div class="col-span-1">
                    {chip.renderElements()}
                </div>
            </>
        );
    }

    private dmgRow(chip: BattleChip): JSX.Element {

        if (chip.damage) {
            return (
                <>
                    <div class="chipDescLeft">
                        dmg:
                    </div>
                    <div class="chipDescRight">
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

    private kindRow(chip: BattleChip): JSX.Element {
        return (
            <>
                <div class="chipDescLeft">
                    kind:
                </div>
                <div class="chipDescRight">
                    {chip.KindAbv}
                </div>
            </>
        );
    }

    private skillRow(chip: BattleChip): JSX.Element {

        let skill = chip.Skill;

        if (skill.variant == "None") {
            return (
                <>
                </>
            );
        } else {
            return (
                <>
                    <div class="chipDescLeft">
                        skill:
                    </div>
                    <div class="chipDescRight">
                        {chip.SkillAbv}
                    </div>
                </>
            );
        }
    }

    private rangeRow(chip: BattleChip): JSX.Element {
        return (
            <>
                <div class="chipDescLeft">
                    range:
                </div>
                <div class="chipDescRight">
                    {chip.RangeAbv}
                </div>
            </>
        );
    }

    private hitsRow(chip: BattleChip): JSX.Element {
        if (chip.hits === "0") {
            return (
                <>
                </>
            );
        } else {
            return (
                <>
                    <div class="chipDescLeft">
                        hits:
                    </div>
                    <div class="chipDescRight">
                        {chip.hits}
                    </div>
                </>
            );
        }
    }

    private targetsRow(chip: BattleChip): JSX.Element {
        return (
            <>
                <div class="chipDescLeft">
                    trgts:
                </div>
                <div class="chipDescRight">
                    {chip.targets}
                </div>
            </>
        );
    }

    private effectsRows(chip: BattleChip): JSX.Element {
        if (chip.effect.length == 0) return (
            <></>
        );

        let effects = chip.effect.map((e) => {
            return (
                <>
                    <div class="chipDescLeft">
                        effect:
                    </div>
                    <div class="chipDescRight">
                        {chipEffectToShortStr(e)}
                    </div>
                </>
            );
        })

        return (
            <>
                {effects}
                <div class="chipDescLeft">
                    effdur:
                </div>
                <div class="chipDescRight">
                    {chip.effduration}
                </div>
            </>
        );


    }

    private blightRows(chip: BattleChip): JSX.Element {
        if (!chip.blight) {
            return (<></>);
        }

        let elemClass = elementToCssClass(chip.blight.elem);

        return (
            <>
                <div class="chipDescLeft">
                    blight:
                </div>
                <div class="chipDescRight">
                    <span class="chipImgBox"><span class={elemClass} /></span>
                </div>
                <div class="chipDescLeft">
                    bdmg:
                </div>
                <div class="chipDescRight">
                    {`${chip.blight.dmg.dienum}d${chip.blight.dmg.dietype}`}
                </div>
                <div class="chipDescLeft">
                    bdur:
                </div>
                <div class="chipDescRight">
                    {`${chip.blight.duration.dienum}d${chip.blight.duration.dietype}`}
                </div>
            </>
        );

    }


    viewWithChip(chipId: number): JSX.Element {

        let chip = ChipLibrary.getChip(chipId)

        let background = "h-3/4 " + chip.backgroundCss;

        let chipAnimClass = (this.animationCounter & 1) ? "chipWindowOne" : "chipWindowTwo";

        /*
        let fontStyle: string;

        if (chip.description.length > 700) {
            fontStyle = "text-xs md:text-sm lg:text-base" //"chipDescSm";
        } else if (chip.description.length > 450) {
            fontStyle = "text-sm md:text-base";
        } else {
            fontStyle = "text-base";
        }
        */

        let outerChipClass = "chipDescText chipDescPadding debug " + chipAnimClass;

        return (
            <div class={background}>
                <div class={outerChipClass} style="padding: 3px; font-size: 14px;">
                    <div class="border-b border-black" >{chip.name}</div>
                    <div class="grid grid-cols-2 gap-0">
                        {this.elemRow(chip)}
                        {this.dmgRow(chip)}
                        {this.kindRow(chip)}
                        {this.skillRow(chip)}
                        {this.rangeRow(chip)}
                        {this.hitsRow(chip)}
                        {this.targetsRow(chip)}
                        {this.effectsRows(chip)}
                        {this.blightRows(chip)}
                    </div>
                    <div class="border-t border-black">
                        {chip.description}
                    </div>
                </div>
            </div>
        );
    }

    viewNoChip(): JSX.Element {
        return <div class="h-3/4 chipDescBackgroundStd" />
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