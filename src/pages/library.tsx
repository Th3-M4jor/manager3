import m, { CVnode } from "mithril";

import { MitrhilTsxComponent } from "../JsxNamespace";

import { BattleChip } from "../library/battlechip";
import { ChipLibrary } from "../library/library";

import * as sort from "../components/sortbox";

import * as top from "../TopLvlMsg";

import { ChipDesc, ChipDescDisplay } from "../components/chipdesc";

import { LibraryChip } from "../components/chips/LibChip";

export class Library extends MitrhilTsxComponent {
    private chips: BattleChip[];
    private filterby: string;
    private activeChipId: number | null;
    private chipMouseoverHandler: (e: Event) => void;
    private doubleClickHandler: (e: Event) => void;

    protected static librarySortMethod = sort.SortOption.Name;
    protected static librarySortDescending = false;
    protected static libraryScrollPos = 0;

    constructor(attrs: m.CVnode) {
        super(attrs);
        this.chips = ChipLibrary.array();
        this.filterby = "";
        this.activeChipId = null;
        this.chipMouseoverHandler = (e: Event) => {
            const data = (e.currentTarget as HTMLDivElement).dataset;
            if (!data?.id) {
                return;
            }
            const id = +data.id;
            this.activeChipId = id;
        };

        this.doubleClickHandler = (e: Event) => {
            //console.log("Chip added to pack");
            const data = (e.currentTarget as HTMLDivElement).dataset;
            if (!data?.id) {
                return;
            }
            const id = +data.id;
            const [count, name] = ChipLibrary.addChipToPack(id);
            top.setTopMsg(`You now own ${count} ${count == 1 ? "copy" : "copies"} of ${name}`);
        };

        this.sortChips();
    }

    private sortChips() {
        const sortFunc: (a: BattleChip, b: BattleChip) => number = Library.librarySortMethod.match({
            AverageDamage: () => Library.librarySortDescending ? sort.sortBattleChipByAvgDmgDesc : sort.sortBattleChipByAvgDmg,
            Element: () => Library.librarySortDescending ? sort.sortBattleChipByElementDesc : sort.sortBattleChipByElement,
            Kind: () => Library.librarySortDescending ? sort.sortBattleChipByKindDesc : sort.sortBattleChipByKind,
            MaxDamage: () => Library.librarySortDescending ? sort.sortBattleChipByMaxDmgDesc : sort.sortBattleChipByMaxDmg,
            Name: () => Library.librarySortDescending ? sort.sortBattleChipByNameDesc : sort.sortBattleChipByName,
            Owned: () => { throw new TypeError("Invalid sort method") },
            Range: () => Library.librarySortDescending ? sort.sortBattleChipByRangeDesc : sort.sortBattleChipByRange,
            Skill: () => Library.librarySortDescending ? sort.sortBattleChipBySkillDesc : sort.sortBattleChipBySkill,
            Cr: () => Library.librarySortDescending ? sort.sortBattleChipByCrDesc : sort.sortBattleChipByCr,
        });

        this.chips.sort(sortFunc);
    }

    private viewTopRow(): JSX.Element {

        return (
            <div class="chip-top-row Chip z-20">
                <div class="w-7/24 sm:w-5/24 px-0 whitespace-nowrap select-none">
                    NAME
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 select-none">
                    SKILL
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                    RANGE
                </div>
                <div class="w-4/24 sm:w-4/24 px-0 whitespace-nowrap select-none">
                    DMG
                </div>
                <div class="hidden sm:block sm:w-4/24 whitespace-nowrap select-none">
                    KIND
                </div>
                <div class="w-5/24 sm:w-4/24 px-0 whitespace-nowrap select-none">
                    ELEM
                </div>
            </div>
        );
    }

    private buildSearchBox(): JSX.Element {
        return (
            <>
                <label for="chip_search_box" class="Chip select-none">Search</label>
                <input type="text" placeholder="ChipName" id="chip_search_box" class="chip-search-input" value={this.filterby} oninput={(e: InputEvent) => {
                    const val = (e.target as HTMLInputElement).value.toLowerCase();
                    this.filterby = val;
                }} />
            </>
        )
    }

    private renderChips(): JSX.Element[] | JSX.Element {

        if (!this.filterby) {
            return this.chips.map((c) => <LibraryChip chip={c} key={c.name + "_L"} onmouseover={this.chipMouseoverHandler} ondoubleclick={this.doubleClickHandler} />);
        }

        const chips = this.chips.reduce((filtered: JSX.Element[], c) => {
            if (c.name.toLowerCase().startsWith(this.filterby)) {
                filtered.push(<LibraryChip chip={c} key={c.name + "_L"} onmouseover={this.chipMouseoverHandler} ondoubleclick={this.doubleClickHandler} />);
            }
            return filtered;
        }, []);

        if (!chips.length) {
            return (
                <span class="select-none Chip">
                    Nothing matched your search
                </span>
            );
        }

        return chips;
    }

    oncreate(_: CVnode) {
        const libBox = document.querySelector(".Folder");
        if (libBox) {
            libBox.scrollTop = Library.libraryScrollPos;
        }
    }

    onbeforeremove(_: CVnode) {
        Library.libraryScrollPos = document.querySelector(".Folder")?.scrollTop ?? 0;
    }

    view(_: CVnode): JSX.Element {

        let chipDescItem: ChipDescDisplay;

        if (this.activeChipId) {
            chipDescItem = ChipDescDisplay.ChipId(this.activeChipId);
        } else {
            chipDescItem = ChipDescDisplay.None;
        }

        return (
            <>

                <div class="col-span-3 sm:col-span-4 md:col-span-5 px-0 z-10">
                    <div class="Folder activeFolder">
                        {this.viewTopRow()}
                        {this.renderChips()}
                    </div>
                </div>
                <div class="col-span-1 flex flex-col px-0 max-h-full">
                    <ChipDesc item={chipDescItem} />
                    <sort.SortBox currentMethod={Library.librarySortMethod} onSortChange={(e) => {
                        Library.librarySortMethod = sort.SortOptFromStr((e.target as HTMLSelectElement).value);
                        this.sortChips();
                        (e.target as HTMLSelectElement).blur(); //unfocus element automatically after changing sort method
                    }}
                        descending={Library.librarySortDescending} onDescendingChange={(e) => {
                            Library.librarySortDescending = (e.target as HTMLInputElement).checked;
                            this.sortChips();
                            (e.target as HTMLInputElement).blur(); //unfocus element automatically after changing sort method
                        }} />
                    {this.buildSearchBox()}
                </div>
            </>
        );

    }

}