import m, { CVnode, Vnode } from "mithril";
import stream from "mithril/stream";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "../JsxNamespace";

import {BattleChip} from "../library/battlechip";
import {ChipLibrary} from "../library/library";
import * as sort from "./sortbox";

import * as top from "../TopLvlMsg";

import {SortOption} from "./sortbox";
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
    }

    private sortChips() {
        let sortFunc: (a: BattleChip, b: BattleChip) => number = this.sortMethod.match({
            AvgDmg: () => sort.sortBattleChipByAvgDmg,
            Element: () => sort.sortBattleChipByElement,
            Kind: () => sort.sortBattleChipByKind,
            MaxDmg: () => sort.sortBattleChipByMaxDmg,
            Name: () => sort.sortBattleChipByName,
            Owned: () => {throw new TypeError("Invalid sort method")},
            Range: () => sort.sortBattleChipByRange,
            Skill: () => sort.sortBattleChipBySkill,
        });

        this.chips.sort(sortFunc);
    }

    private viewTopRow() : JSX.Element {
        return (
            <>
            </>
        );
    }

    onbeforeupdate(vnode: CVnode<libraryProps>, old: CVnode<libraryProps>): boolean {
        
        return !(vnode.attrs.active == false && old.attrs.active == false);
        //don't update if component is hidden
    }
    
    view(vnode: CVnode<libraryProps>): JSX.Element {
        
        return (
            <>

            </>
        );

    }
}