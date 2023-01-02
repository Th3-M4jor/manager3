import m, { CVnode } from "mithril";

import { MitrhilTsxComponent } from "../JsxNamespace";
import { BattleChip, diceToStr } from "../library/battlechip";
import { ChipLibrary } from "../library/library";
import { elementToCssClass } from "../library/elements";

export interface chipDescProps {
    displayChip: number | null;
}

// callback function for the scroll interval
function scrollInterval() {
    const div = document.getElementById("ScrollTextDiv");
    if (!div) return;
    const clientHeight = div.clientHeight;
    const totalHeight = div.scrollHeight;
    const scrollPos = div.scrollTop;

    const maxScroll = totalHeight - clientHeight;

    if (maxScroll - 10 <= 0) return;

    div.scrollTop = scrollPos + 1;
}

export class ChipDesc extends MitrhilTsxComponent<chipDescProps> {

    private animationCounter: number;
    private intervalHandle: number | null;
    private mouseOverHandler: (e: MouseEvent) => void;
    private mouseLeaveHandler: (e: MouseEvent) => void;

    constructor(vnode: CVnode<chipDescProps>) {
        super(vnode);
        this.animationCounter = 0;
        this.intervalHandle = null;

        // memoize callbacks
        this.mouseOverHandler = (e: MouseEvent) => {
            // tell mithril not to redraw
            //@ts-ignore
            e.redraw = false;
            if (this.intervalHandle) {
                clearInterval(this.intervalHandle);
                this.intervalHandle = null;
            }
        };

        this.mouseLeaveHandler = (e: MouseEvent) => {
            // tell mithril not to redraw
            //@ts-ignore
            e.redraw = false;
            if (!this.intervalHandle) {
                this.intervalHandle = setInterval(scrollInterval, 75);
            }
        };
    }

    // set the scroll interval when the component is created
    // to every 75ms
    oncreate(_vnode: CVnode<chipDescProps>): void {
        this.intervalHandle = setInterval(scrollInterval, 75);
    }

    // when the component is updated, reset the scroll position
    onupdate(_vnode: CVnode<chipDescProps>): void {
        const div = document.getElementById("ScrollTextDiv");
        if (div) div.scrollTop = 0;
    }

    // remove the scroll interval when the component is removed
    onremove(_vnode: CVnode<chipDescProps>): void {
        if (this.intervalHandle) clearInterval(this.intervalHandle);
    }

    private crRow(chip: BattleChip): JSX.Element {
        if (chip.class.variant === "Standard" && chip.cr > 0) {
            return (
                <>
                    <div class="chipDescLeft">
                        cr:
                    </div>
                    <div class="chipDescRight">
                        {chip.cr}
                    </div>
                </>
            );
        }
        return (
            <></>
        );
    }

    private elemClassRows(chip: BattleChip): JSX.Element {

        // If is not a standard or support chip, then show the class
        // helps the colorblind
        if (["Standard", "Support"].includes(chip.class.variant)) {
            // css class for the first row needs to be different
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

        return (
            <>
                <div class="col-span-1 border-r border-black text-left">
                    class:
                </div>
                <div class="col-span-1">
                    {chip.class.variant}
                </div>
                <div class="chipDescLeft">
                    elem:
                </div>
                <div class="chipDescRight">
                    {chip.renderElements()}
                </div>
            </>
        )
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

        if (chip.Skill.variant == "None") {
            return (
                <>
                </>
            );
        }

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
        }

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

    private targetsRow(chip: BattleChip): JSX.Element {

        if (!chip.targets || chip.targets === "0") {
            return (
                <>
                </>
            );
        }

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

    private blightRows(chip: BattleChip): JSX.Element {
        if (!chip.blight) {
            return (<></>);
        }

        const elemClass = elementToCssClass(chip.blight.elem);

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
                    {diceToStr(chip.blight.dmg)}
                </div>
                <div class="chipDescLeft">
                    bdur:
                </div>
                <div class="chipDescRight">
                    {diceToStr(chip.blight.duration)}
                </div>
            </>
        );

    }

    private viewWithChip(chipId: number): JSX.Element {

        const chip = ChipLibrary.getChip(chipId)

        const background = "h-3/4 " + chip.backgroundCss;

        const chipAnimClass = (this.animationCounter & 1) ? "chipWindowOne" : "chipWindowTwo";

        let fontSizeStyle = "font-size: 14px";

        if (chip.description.length > 700) {
            fontSizeStyle = "font-size: 12px";
        }

        const outerChipClass = "chipDescText chipDescPadding max-h-full flex flex-col " + chipAnimClass;

        return (
            <div class={background} style="max-height: 65vh" onmouseenter={this.mouseOverHandler} onmouseleave={this.mouseLeaveHandler}>
                <div class={outerChipClass} style="padding: 3px; font-size: 14px; height: 100%">
                    <div class="border-b border-black">{chip.name}</div>
                    <div class="grid grid-cols-2 gap-0">
                        {this.elemClassRows(chip)}
                        {this.crRow(chip)}
                        {this.dmgRow(chip)}
                        {this.kindRow(chip)}
                        {this.skillRow(chip)}
                        {this.rangeRow(chip)}
                        {this.hitsRow(chip)}
                        {this.targetsRow(chip)}
                        {this.blightRows(chip)}
                    </div>
                    <div class="border-t border-black overflow-y-scroll hideScrollBar m-0"
                        style={fontSizeStyle} id="ScrollTextDiv">
                        {chip.description}
                    </div>
                    <div class="flex-none" style="height: 12%" />
                </div>
            </div>
        );
    }

    private viewNoChip(): JSX.Element {
        return <div class="h-3/4 chipDescBackgroundStd" style="max-height: 65vh" />
    }

    // leverage mithril's onbeforeupdate to only redraw when the chip changes
    // and ensure that the animation is triggered
    onbeforeupdate(vnode: CVnode<chipDescProps>, old: CVnode<chipDescProps>): boolean {

        if (vnode.attrs.displayChip != old.attrs.displayChip) {
            this.animationCounter = (this.animationCounter + 1) | 0; //coerce to signed int
            return true;
        }

        return false;
    }

    view(vnode: CVnode<chipDescProps>): JSX.Element {

        //if(displayChip) return viewWithChip(displayChip) else return viewNoChip();
        return vnode.attrs.displayChip ? this.viewWithChip(vnode.attrs.displayChip) : this.viewNoChip();

    }
}