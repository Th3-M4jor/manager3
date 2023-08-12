import { Component, JSX } from "preact";
import { signal } from "@preact/signals";
import { makeTaggedUnion, none, MemberType } from "safety-match";

import { BattleChip, diceToStr } from "../library/battlechip";
import { ChipLibrary } from "../library/library";
import { elementToCssClass } from "../library/elements";

export const ChipDescDisplay = makeTaggedUnion({
    None: none,
    ChipId: (id: number) => id,
    GlossaryItem: (name: string, backgroundCss: string, text: string) => ({ name, backgroundCss, text }),
});

export type ChipDescDisplay = MemberType<typeof ChipDescDisplay>;

const activeDisplayItem = signal<ChipDescDisplay>(ChipDescDisplay.None);

export function setActiveDisplayItem(item: ChipDescDisplay) {
    activeDisplayItem.value = item;
}

// callback function for the scroll interval
function scrollInterval() {
    requestAnimationFrame(() => {
        const div = document.getElementById("ScrollTextDiv");
        if (!div) return;
        const clientHeight = div.clientHeight;
        const totalHeight = div.scrollHeight;
        const scrollPos = div.scrollTop;

        const maxScroll = totalHeight - clientHeight;

        if (maxScroll - 10 <= 0) return;

        if (scrollPos >= maxScroll) {
            clearInterval(ChipDesc.intervalHandle);
            ChipDesc.intervalHandle = undefined;
            ChipDesc.fadeOutHandle = setTimeout(fadeOut, 2000);
        }

        div.scrollTop = scrollPos + 1;
    });
}

function fadeOut() {
    ChipDesc.fadeOutHandle = undefined;
    const div = document.getElementById("ScrollTextDiv");
    if (!div) return;
    div.classList.add("chipDescFadeOut");
    div.addEventListener("animationend", fadeIn);
}

function fadeIn(e: AnimationEvent) {
    if (e.animationName !== "chip-fade-out") return;
    (e.target as HTMLDivElement).classList.replace("chipDescFadeOut", "chipDescFadeIn");
    (e.target as HTMLDivElement).scrollTop = 0;
    e.target?.removeEventListener("animationend", fadeIn as EventListener);
    ChipDesc.startScrollHandle = setTimeout(startInterval, 1000);
}

function startInterval() {
    // remove the fade in class if it exists
    document.getElementById("ScrollTextDiv")?.classList.remove("chipDescFadeIn");
    ChipDesc.startScrollHandle = undefined;
    if (!ChipDesc.intervalHandle) {
        ChipDesc.intervalHandle = setInterval(scrollInterval, 75);
    }
}

function descMouseOverHandler() {
    clearInterval(ChipDesc.intervalHandle);
    ChipDesc.intervalHandle = undefined;
    clearTimeout(ChipDesc.startScrollHandle);
    ChipDesc.startScrollHandle = undefined;
    clearTimeout(ChipDesc.fadeOutHandle);
    ChipDesc.fadeOutHandle = undefined;
}

function descMouseLeaveHandler() {
    if (!ChipDesc.intervalHandle && !ChipDesc.startScrollHandle) {
        ChipDesc.startScrollHandle = setTimeout(startInterval, 1000);
    }
}


export class ChipDesc extends Component {

    private animationCounter: number;
    private currentDisplay: ChipDescDisplay;
    public static intervalHandle: number | undefined;
    public static startScrollHandle: number | undefined;
    public static fadeOutHandle: number | undefined;

    constructor() {
        super();
        this.animationCounter = 0;
        this.currentDisplay = activeDisplayItem.peek();
    }

    shouldComponentUpdate(): boolean {
        const newVal = activeDisplayItem.peek().match({
            None: () => null,
            ChipId: (id) => id,
            GlossaryItem: ({ name: name }) => name,
        })

        const oldVal = this.currentDisplay.match({
            None: () => null,
            ChipId: (id) => id,
            GlossaryItem: ({ name: name }) => name,
        })

        if (newVal !== oldVal) {
            this.currentDisplay = activeDisplayItem.peek();
            return true;
        }

        return false;
    }

    // set the scroll interval when the component is created
    // to every 75ms
    componentDidMount(): void {
        ChipDesc.startScrollHandle = setTimeout(startInterval, 1000);
    }

    // when the component is updated, reset the scroll position
    componentDidUpdate(): void {
        this.animationCounter++;

        const div = document.getElementById("ScrollTextDiv");
        if (div) {
            div.scrollTop = 0;
        }

        clearInterval(ChipDesc.intervalHandle);
        ChipDesc.intervalHandle = undefined;

        clearTimeout(ChipDesc.startScrollHandle);
        ChipDesc.startScrollHandle = undefined;

        clearTimeout(ChipDesc.fadeOutHandle);
        ChipDesc.fadeOutHandle = undefined;

        ChipDesc.startScrollHandle = setTimeout(startInterval, 1000);
    }

    // remove the scroll interval when the component is removed
    componentWillUnmount(): void {
        clearInterval(ChipDesc.intervalHandle);
        ChipDesc.intervalHandle = undefined;
        clearTimeout(ChipDesc.startScrollHandle);
        ChipDesc.startScrollHandle = undefined;
        clearTimeout(ChipDesc.fadeOutHandle);
        ChipDesc.fadeOutHandle = undefined;
    }

    private elemRow(chip: BattleChip) {
        return (
            <>
                <div class="chipDescLeft chipBasicInfo">
                    elem:
                </div>
                <div class="chipDescRight chipBasicInfo">
                    {chip.renderElements()}
                </div>
            </>
        );
    }

    private classRow(chip: BattleChip) {

        return ["Standard", "Support"].includes(chip.class.variant) ? null : (
            <>
                <div class="chipDescLeft chipBasicInfo">
                    class:
                </div>
                <div class="chipDescRight chipBasicInfo">
                    {chip.class.variant}
                </div>
            </>
        );
    }

    private crRow(chip: BattleChip) {
        return ["Standard", "Support"].includes(chip.class.variant) && chip.cr > 0 ? (
            <>
                <div class="chipDescLeft chipBasicInfo">
                    cr:
                </div>
                <div class="chipDescRight chipBasicInfo">
                    {chip.cr}
                </div>
            </>
        ) : null;
    }

    private dmgRow(chip: BattleChip) {
        return chip.damage ? (
            <>
                <div class="chipDescLeft chipBasicInfo">
                    dmg:
                </div>
                <div class="chipDescRight chipBasicInfo">
                    {chip.dmgStr}
                </div>
            </>
        ) : null;
    }

    private kindRow(chip: BattleChip) {
        return (
            <>
                <div class="chipDescLeft chipBasicInfo">
                    kind:
                </div>
                <div class="chipDescRight chipBasicInfo">
                    {chip.KindAbv}
                </div>
            </>
        );
    }

    private skillRow(chip: BattleChip) {
        return chip.Skill.variant != "None" ? (
            <>
                <div class="chipDescLeft chipBasicInfo">
                    skill:
                </div>
                <div class="chipDescRight chipBasicInfo">
                    {chip.SkillAbv}
                </div>
            </>
        ) : null;
    }

    private rangeRow(chip: BattleChip) {
        return (
            <>
                <div class="chipDescLeft chipBasicInfo">
                    range:
                </div>
                <div class="chipDescRight chipBasicInfo">
                    {chip.RangeAbv}
                </div>
            </>
        );
    }

    private hitsRow(chip: BattleChip) {
        return chip.hits !== "0" ? (
            <>
                <div class="chipDescLeft chipBasicInfo">
                    hits:
                </div>
                <div class="chipDescRight chipBasicInfo">
                    {chip.hits}
                </div>
            </>
        ) : null;
    }

    private targetsRow(chip: BattleChip) {
        return chip.targets && chip.targets !== "0" ? (
            <>
                <div class="chipDescLeft chipBasicInfo">
                    trgts:
                </div>
                <div class="chipDescRight chipBasicInfo">
                    {chip.targets}
                </div>
            </>
        ) : null;
    }

    private blightRows(chip: BattleChip) {
        return chip.blight ? (
            <>
                <div class="chipDescLeft chipBasicInfo">
                    blight:
                </div>
                <div class="chipDescRight chipBasicInfo">
                    <span class="chipImgBox"><span class={elementToCssClass(chip.blight.elem)} /></span>
                </div>
                <div class="chipDescLeft chipBasicInfo">
                    bdmg:
                </div>
                <div class="chipDescRight chipBasicInfo">
                    {diceToStr(chip.blight.dmg)}
                </div>
                <div class="chipDescLeft chipBasicInfo">
                    bdur:
                </div>
                <div class="chipDescRight chipBasicInfo">
                    {diceToStr(chip.blight.duration)}
                </div>
            </>
        ) : null;
    }

    private viewGlossary(name: string, backgroundCss: string, description: string): JSX.Element {
        let fontSizeStyle = "font-size: 1rem";

        if (description.length > 700) {
            fontSizeStyle = "font-size: 0.875rem";
        }

        const background = "h-full " + backgroundCss;

        const chipAnimClass = (this.animationCounter & 1) ? "chipWindowOne" : "chipWindowTwo";

        const outerChipClass = "chipDescText chipDescPadding max-h-full flex flex-col " + chipAnimClass;

        return (
            <div class={background} style="max-height: 85vh" onMouseEnter={descMouseOverHandler} onMouseLeave={descMouseLeaveHandler}>
                <div class={outerChipClass} style="padding: 3px; height: 100%">
                    <div class="border-b border-black chipName">{name}</div>
                    <div class="grid grid-cols-2 gap-0">
                    </div>
                    <div class="overflow-y-scroll hideScrollBar m-0" style={fontSizeStyle} id="ScrollTextDiv">
                        {description}
                    </div>
                    <div class="flex-none" style="height: 12%" />
                </div>
            </div>
        );
    }

    private viewChip(chipId: number): JSX.Element {
        const chip = ChipLibrary.getChip(chipId);
        const background = "h-3/4 " + chip.backgroundCss;

        let fontSizeStyle = "font-size: 1rem";

        if (chip.description.length > 500) {
            fontSizeStyle = "font-size: 0.875rem";
        }

        const chipAnimClass = (this.animationCounter & 1) ? "chipWindowOne" : "chipWindowTwo";

        const outerChipClass = "chipDescText chipDescPadding max-h-full flex flex-col " + chipAnimClass;

        return (
            <div class={background} style="max-height: 65vh" onMouseEnter={descMouseOverHandler} onMouseLeave={descMouseLeaveHandler}>
                <div class={outerChipClass} style="padding: 3px; height: 100%">
                    <div class="border-b border-black chipName">{chip.name}</div>
                    <div class="grid grid-cols-2 gap-0">
                        {
                            [
                                this.classRow(chip!),
                                this.elemRow(chip!),
                                this.crRow(chip!),
                                this.dmgRow(chip!),
                                this.kindRow(chip!),
                                this.skillRow(chip!),
                                this.rangeRow(chip!),
                                this.hitsRow(chip!),
                                this.targetsRow(chip!),
                                this.blightRows(chip!)
                            ]
                        }
                    </div>
                    <div class="overflow-y-scroll hideScrollBar m-0" style={fontSizeStyle} id="ScrollTextDiv">
                        {chip.description}
                    </div>
                    <div class="flex-none" style="height: 12%" />
                </div>
            </div>
        );
    }

    private viewNoChip() {
        return <div class="h-3/4 chipDescBackgroundStd" style="max-height: 65vh" />
    }

    render() {
        return activeDisplayItem.value.match({
            None: () => this.viewNoChip(),
            ChipId: (id) => this.viewChip(id),
            GlossaryItem: ({ name, backgroundCss, text }) => this.viewGlossary(name, backgroundCss, text)
        });
    }
}
