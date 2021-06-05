import m, { CVnode, Vnode } from "mithril";
import stream from "mithril/stream";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "../JsxNamespace";

import { BattleChip } from "../library/battlechip";
import { ChipLibrary } from "../library/library";
import * as sort from "./sortbox";

import * as top from "../TopLvlMsg";

import {LibraryChip} from "./chips/LibChip";

import { SortOption } from "./sortbox";
export interface libraryProps {
    active: boolean;
}

export class Library extends MitrhilTsxComponent<libraryProps> {

    private sortMethod: SortOption;
    private chips: BattleChip[];

    constructor(attrs: m.CVnode<libraryProps>) {
        super(attrs);
        this.sortMethod = SortOption.Name;
        this.chips = ChipLibrary.array();
        this.sortChips();
    }

    private sortChips() {
        let sortFunc: (a: BattleChip, b: BattleChip) => number = this.sortMethod.match({
            AvgDmg: () => sort.sortBattleChipByAvgDmg,
            Element: () => sort.sortBattleChipByElement,
            Kind: () => sort.sortBattleChipByKind,
            MaxDmg: () => sort.sortBattleChipByMaxDmg,
            Name: () => sort.sortBattleChipByName,
            Owned: () => { throw new TypeError("Invalid sort method") },
            Range: () => sort.sortBattleChipByRange,
            Skill: () => sort.sortBattleChipBySkill,
        });

        this.chips.sort(sortFunc);
    }

    private viewTopRow(): JSX.Element {
        
        return (
            <>
                <div class="chip-top-row col-span-8 Chip px-0 whitespace-nowrap debug">
                    {"NAME"}
                </div>
                <div class="chip-top-row col-span-3 Chip px-0 debug">
                    {"SKILL"}
                </div>
                <div class="chip-top-row col-span-3 Chip px-0 whitespace-nowrap debug">
                    {"DMG"}
                </div>
                <div class="chip-top-row col-span-4 Chip px-0 whitespace-nowrap debug">
                    {"ELEM"}
                </div>
            </>
        );
    }

    private renderChips(): JSX.Element[] {
        return this.chips.map((c) => <LibraryChip chip={c} key={c.name + "_L"}/>);
    }

    onbeforeupdate(vnode: CVnode<libraryProps>, old: CVnode<libraryProps>): boolean {

        return !(vnode.attrs.active == false && old.attrs.active == false);
        //don't update if component is hidden
    }

    view(vnode: CVnode<libraryProps>): JSX.Element {


        let [col1CSS, col2CSS, libContainerCss] = vnode.attrs.active ? ["col-span-1 px-0", "col-span-3 px-0", "grid grid-cols-24 Folder activeFolder"] : ["hidden", "hidden", "grid grid-cols-24 Folder"];

        return (
            <>
                <div class={col1CSS}>

                </div>
                <div class={col2CSS}>
                    <div class={libContainerCss}>
                        {this.viewTopRow()}
                        {this.renderChips()}
                    </div>
                </div>
            </>
        );

    }
}