import { Component, RenderableProps, createRef } from "preact";
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

export interface chipDescProps {
    item: ChipDescDisplay;
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

function startInterval() {
    ChipDesc.startScrollHandle = null;
    if (!ChipDesc.intervalHandle) {
        ChipDesc.intervalHandle = setInterval(scrollInterval, 75);
    }
}
export class ChipDesc extends Component<chipDescProps> {

    private animationCounter: number;
    private currentDisplay: ChipDescDisplay;
    public static intervalHandle: number | null = null;
    public static startScrollHandle: number | null = null;
    private mouseOverHandler: (e: MouseEvent) => void;
    private mouseLeaveHandler: (e: MouseEvent) => void;
    private animationDiv = createRef<HTMLDivElement>();

    constructor(vnode: chipDescProps) {
        super(vnode);
        this.animationCounter = 0;
        this.currentDisplay = vnode.item

        // memoize callbacks
        this.mouseOverHandler = (_e: MouseEvent) => {
            if (ChipDesc.intervalHandle) {
                clearInterval(ChipDesc.intervalHandle);
                ChipDesc.intervalHandle = null;
            }

            if (ChipDesc.startScrollHandle) {
                clearTimeout(ChipDesc.startScrollHandle);
                ChipDesc.startScrollHandle = null;
            }

        };

        this.mouseLeaveHandler = (_e: MouseEvent) => {
            if (!ChipDesc.intervalHandle && !ChipDesc.startScrollHandle) {
                ChipDesc.startScrollHandle = setTimeout(startInterval, 1000);
            }
        };
    }

    shouldComponentUpdate(nextProps: Readonly<chipDescProps>): boolean {
        const newVal = nextProps.item.match({
            None: () => null,
            ChipId: (id) => id,
            GlossaryItem: ({name: name}) => name,
        })

        const oldVal = this.currentDisplay.match({
            None: () => null,
            ChipId: (id) => id,
            GlossaryItem: ({name: name}) => name,
        })

        if (newVal !== oldVal) {
            this.currentDisplay = nextProps.item;
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
        const div = document.getElementById("ScrollTextDiv");
        if (div) div.scrollTop = 0;

        if (ChipDesc.intervalHandle) {
            clearInterval(ChipDesc.intervalHandle);
            ChipDesc.intervalHandle = null;
        }

        if (ChipDesc.startScrollHandle) {
            clearTimeout(ChipDesc.startScrollHandle);
            ChipDesc.startScrollHandle = null;
        }

        ChipDesc.startScrollHandle = setTimeout(startInterval, 1000);

        // Need to set animation class to the new one after requestAnimationFrame
        // to avoid stuttering on potato computers
        const newChipAnimClass = (this.animationCounter & 1) ? "chipWindowOne" : "chipWindowTwo";
        const oldChipAnimClass = (this.animationCounter & 1) ? "chipWindowTwo" : "chipWindowOne";
        
        requestAnimationFrame(() => {
            const div = this.animationDiv.current;
            if (div) {
                div.classList.remove(oldChipAnimClass);
                div.classList.add(newChipAnimClass);
            }
        });

        this.animationCounter++;
    }

    // remove the scroll interval when the component is removed
    componentWillUnmount(): void {
        if (ChipDesc.intervalHandle) clearInterval(ChipDesc.intervalHandle);
        if (ChipDesc.startScrollHandle) clearTimeout(ChipDesc.startScrollHandle);
    }

    private elemClassRows(chip: BattleChip) {

        // If is not a standard or support chip, then show the class
        // helps the colorblind
        if (["Standard", "Support"].includes(chip.class.variant)) {
            // css class for the first row needs to be different
            return (
                <>
                    <div class="col-span-1 border-r border-black text-left chipBasicInfo">
                        elem:
                    </div>
                    <div class="col-span-1 chipBasicInfo">
                        {chip.renderElements()}
                    </div>
                </>
            );
        }

        return (
            <>
                <div class="col-span-1 border-r border-black text-left chipBasicInfo">
                    class:
                </div>
                <div class="col-span-1 chipBasicInfo">
                    {chip.class.variant}
                </div>
                <div class="chipDescLeft chipBasicInfo">
                    elem:
                </div>
                <div class="chipDescRight chipBasicInfo">
                    {chip.renderElements()}
                </div>
            </>
        )
    }

    private crRow(chip: BattleChip) {
        if (chip.class.variant === "Standard" && chip.cr > 0) {
            return (
                <>
                    <div class="chipDescLeft chipBasicInfo">
                        cr:
                    </div>
                    <div class="chipDescRight chipBasicInfo">
                        {chip.cr}
                    </div>
                </>
            );
        }
        return (
            <></>
        );
    }

    private dmgRow(chip: BattleChip) {

        if (chip.damage) {
            return (
                <>
                    <div class="chipDescLeft chipBasicInfo">
                        dmg:
                    </div>
                    <div class="chipDescRight chipBasicInfo">
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

        if (chip.Skill.variant == "None") {
            return (
                <>
                </>
            );
        }

        return (
            <>
                <div class="chipDescLeft chipBasicInfo">
                    skill:
                </div>
                <div class="chipDescRight chipBasicInfo">
                    {chip.SkillAbv}
                </div>
            </>
        );
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
        if (chip.hits === "0") {
            return (
                <>
                </>
            );
        }

        return (
            <>
                <div class="chipDescLeft chipBasicInfo">
                    hits:
                </div>
                <div class="chipDescRight chipBasicInfo">
                    {chip.hits}
                </div>
            </>
        );
    }

    private targetsRow(chip: BattleChip) {

        if (!chip.targets || chip.targets === "0") {
            return (
                <>
                </>
            );
        }

        return (
            <>
                <div class="chipDescLeft chipBasicInfo">
                    trgts:
                </div>
                <div class="chipDescRight chipBasicInfo">
                    {chip.targets}
                </div>
            </>
        );
    }

    private blightRows(chip: BattleChip) {
        if (!chip.blight) {
            return (<></>);
        }

        const elemClass = elementToCssClass(chip.blight.elem);

        return (
            <>
                <div class="chipDescLeft chipBasicInfo">
                    blight:
                </div>
                <div class="chipDescRight chipBasicInfo">
                    <span class="chipImgBox"><span class={elemClass} /></span>
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
        );

    }

    private viewWithChip(chipId: number) {

        const chip = ChipLibrary.getChip(chipId)

        const background = "h-3/4 " + chip.backgroundCss;

        let fontSizeStyle = "font-size: 1rem";

        if (chip.description.length > 500) {
            fontSizeStyle = "font-size: 0.875rem";
        }

        const outerChipClass = "chipDescText chipDescPadding max-h-full flex flex-col";

        return (
            <div class={background} style="max-height: 65vh" onMouseEnter={this.mouseOverHandler} onMouseLeave={this.mouseLeaveHandler}>
                <div class={outerChipClass} style="padding: 3px; height: 100%" ref={this.animationDiv}>
                    <div class="border-b border-black chipName">{chip.name}</div>
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

    private glossaryItem(name: string, backgroundCss: string, text: string) {
        const background = "h-3/4 " + backgroundCss;

        const chipAnimClass = (this.animationCounter & 1) ? "chipWindowOne" : "chipWindowTwo";

        const outerChipClass = "chipDescText chipDescPadding max-h-full flex flex-col " + chipAnimClass;

        let fontSizeStyle = "font-size: 1rem";

        if (text.length > 500) {
            fontSizeStyle = "font-size: 0.875rem";
        }

        return (
            <div class={background} style="max-height: 65vh" onMouseEnter={this.mouseOverHandler} onMouseLeave={this.mouseLeaveHandler}>
                <div class={outerChipClass} style="padding: 3px; height: 100%">
                    <div class="border-b border-black chipName">{name}</div>
                    <div class="border-t border-black overflow-y-scroll hideScrollBar m-0"
                        style={fontSizeStyle} id="ScrollTextDiv">
                        {text}
                    </div>
                    <div class="flex-none" style="height: 12%" />
                </div>
            </div>
        );
    }

    private viewNoChip() {
        return <div class="h-3/4 chipDescBackgroundStd" style="max-height: 65vh" />
    }

    render(props: RenderableProps<chipDescProps>) {
        return props.item.match({
            None: () => this.viewNoChip(),
            ChipId: (id) => this.viewWithChip(id),
            GlossaryItem: ({name, backgroundCss, text}) => this.glossaryItem(name, backgroundCss, text),
        });
    }
}
