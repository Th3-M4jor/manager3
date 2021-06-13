import m, { CVnode, Vnode } from "mithril";
import stream from "mithril/stream";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "../JsxNamespace";

import { BattleChip } from "../library/battlechip";
import { ChipLibrary } from "../library/library";
import * as sort from "./sortbox";

import * as top from "../TopLvlMsg";

import { ChipDesc } from "./chipdesc";
import { LibraryChip } from "./chips/LibChip";
export interface libraryProps {
    active: boolean;
}

export class Library extends MitrhilTsxComponent<libraryProps> {

    private sortMethod: sort.SortOption;
    private chips: BattleChip[];
    private filterby: string;
    private activeChipId: number | null;
    private chipMouseoverHandler: (e: Event) => void;

    constructor(attrs: m.CVnode<libraryProps>) {
        super(attrs);
        this.sortMethod = sort.SortOption.Name;
        this.chips = ChipLibrary.array();
        this.filterby = "";
        this.activeChipId = null;
        this.chipMouseoverHandler = (e: Event) => {
            let id = +(e.currentTarget as HTMLDivElement).id.substr(2);
            this.activeChipId = id;
        };
        this.sortChips();
    }

    private sortChips() {
        let sortFunc: (a: BattleChip, b: BattleChip) => number = this.sortMethod.match({
            AverageDamage: () => sort.sortBattleChipByAvgDmg,
            Element: () => sort.sortBattleChipByElement,
            Kind: () => sort.sortBattleChipByKind,
            MaxDamage: () => sort.sortBattleChipByMaxDmg,
            Name: () => sort.sortBattleChipByName,
            Owned: () => { throw new TypeError("Invalid sort method") },
            Range: () => sort.sortBattleChipByRange,
            Skill: () => sort.sortBattleChipBySkill,
        });

        this.chips.sort(sortFunc);
    }

    private viewTopRow(): JSX.Element {

        return (
            <div class="chip-top-row Chip z-20">
                <div class="w-4/12 md:w-4/12 px-0 whitespace-nowrap select-none">
                    {"NAME"}
                </div>
                <div class="w-2/12 md:w-2/12 px-0 select-none">
                    {"SKILL"}
                </div>
                <div class="w-2/12 md:w-2/12 px-0 whitespace-nowrap select-none">
                    {"RANGE"}
                </div>
                <div class="w-2/12 md:w-2/12 px-0 whitespace-nowrap select-none">
                    {"DMG"}
                </div>
                <div class="w-2/12 md:w-2/12 px-0 whitespace-nowrap select-none">
                    {"ELEM"}
                </div>
            </div>
        );
    }

    private buildSearchBox(): JSX.Element {
        return (
            <>
                <br />
                <span class="Chip select-none">Search</span>
                <input type="text" class="chip-search-input" value={this.filterby} oninput={(e: InputEvent) => {
                    let val = (e.target as HTMLInputElement).value.toLowerCase();
                    this.filterby = val;
                }} />
            </>
        )
    }

    private renderChips(): JSX.Element[] | JSX.Element {

        if (!this.filterby) {
            return this.chips.map((c) => <LibraryChip chip={c} key={c.name + "_L"} onmouseover={this.chipMouseoverHandler}/>);
        } else {
            let chips = this.chips.reduce((filtered: JSX.Element[], c) => {
                if (c.name.toLowerCase().startsWith(this.filterby)) {
                    filtered.push(<LibraryChip chip={c} key={c.name + "_L"} onmouseover={this.chipMouseoverHandler}/>);
                }
                return filtered;
            }, []);

            if (!chips.length) {
                return (
                    <span class="select-none Chip">
                        Nothing matched your search
                    </span>
                );
            } else {
                return chips;
            }

        }
    }

    onbeforeupdate(vnode: CVnode<libraryProps>, old: CVnode<libraryProps>): boolean {

        if(vnode.attrs.active == false && old.attrs.active == true) {
            this.activeChipId = null;
        }

        return !(vnode.attrs.active == false && old.attrs.active == false);
        //don't update if component is hidden
    }

    view(vnode: CVnode<libraryProps>): JSX.Element {


        //let [col1CSS, col2CSS, libContainerCss] = vnode.attrs.active ? ["hidden sm:block col-span-1 px-0", "col-span-3 px-0 z-10", "Folder activeFolder"] : ["hidden", "hidden", "Folder"];

        let [col1CSS, col2CSS, libContainerCss] = vnode.attrs.active ? ["col-span-3 sm:col-span-4 md:col-span-5 px-0 z-10", "col-span-1 flex flex-col px-0", "Folder activeFolder"] : ["hidden", "hidden", "Folder"];

        return (
            <>
                <div class={col1CSS}>
                    <div class={libContainerCss}>
                        {this.viewTopRow()}
                        {this.renderChips()}
                    </div>
                </div>
                <div class={col2CSS}>
                    <ChipDesc displayChip={this.activeChipId}/>
                    <sort.SortBox currentMethod={this.sortMethod} onChange={(e) => {
                        this.sortMethod = sort.SortOptFromStr((e.target as HTMLSelectElement).value);
                        this.sortChips();
                        (e.target as HTMLSelectElement).blur(); //unfocus element automatically after changing sort method
                    }} />
                    {this.buildSearchBox()}
                </div>
            </>
        );

    }
}

// <ChipDesc displayChip={this.chipDescId}/>