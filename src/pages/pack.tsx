import m, { CVnode } from "mithril";

import { MitrhilTsxComponent } from "../JsxNamespace";

import { BattleChip } from "../library/battlechip";
import { ChipLibrary } from "../library/library";

import * as sort from "../components/sortbox";
import { DropMenu } from "../components/dropmenu";
import { ChipDesc } from "../components/chipdesc";
import { PackChip } from "../components/chips/PackChip";


import * as top from "../TopLvlMsg";

import { cmpN } from "../util/cmp";

interface PackChipWithBChip {
    chip: BattleChip,
    owned: number,
    used: number,
}

//#region PackSortOpts
function sortByName(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByName(a.chip, b.chip);
}

function sortByOwned(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return cmpN(b.owned, a.owned) || sort.sortBattleChipByName(a.chip, b.chip);
}

function sortByAvgDmg(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByAvgDmg(a.chip, b.chip);
}

function sortByElem(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByElement(a.chip, b.chip);
}

function sortByKind(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByKind(a.chip, b.chip);
}

function sortByMaxDmg(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByMaxDmg(a.chip, b.chip);
}

function sortByRange(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByRange(a.chip, b.chip);
}

function sortBySkill(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipBySkill(a.chip, b.chip);
}
//#endregion PackSortOpts 


function jackOutClicked() {
    const count = ChipLibrary.jackOut();

    const msg = `${count} ${count == 1 ? "chip has" : "chips have"} has been marked as unused`;
    
    top.setTopMsg(msg);
}

export class Pack extends MitrhilTsxComponent {
    private sortMethod: sort.SortOption;
    private activeChipId: number | null;
    private chipMouseoverHandler: (e: Event) => void;

    constructor(attrs: m.CVnode) {
        super(attrs);
        this.sortMethod = sort.SortOption.Name;
        this.activeChipId = null;
        this.chipMouseoverHandler = (e: Event) => {
            const id = +(e.currentTarget as HTMLDivElement).id.substr(2);
            this.activeChipId = id;
        }
    }

    private getSortedChips(): PackChipWithBChip[] {
        const pack: PackChipWithBChip[] = ChipLibrary.Pack.map(([name, data]) => {
            const chip = ChipLibrary.getChip(name);
            return {
                chip: chip,
                owned: data.owned,
                used: data.used,
            }
        });

        const sortFunc: (a: PackChipWithBChip, b: PackChipWithBChip) => number = this.sortMethod.match({
            AverageDamage: () => sortByAvgDmg,
            Element: () => sortByElem,
            Kind: () => sortByKind,
            MaxDamage: () => sortByMaxDmg,
            Name: () => sortByName,
            Owned: () => sortByOwned,
            Range: () => sortByRange,
            Skill: () => sortBySkill,
        });

        return pack.sort(sortFunc);

    }

    private viewTopRow(): JSX.Element {
        return (
            <div class="chip-top-row Chip z-20">
                <div class="w-6/24 sm:w-5/24 px-0 whitespace-nowrap select-none">
                    NAME
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 select-none">
                    SKILL
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                    RANGE
                </div>
                <div class="w-3/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                    DMG
                </div>
                <div class="hidden sm:block sm:w-3/24 whitespace-nowrap select-none">
                    KIND
                </div>
                <div class="w-3/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                    ELEM
                </div>
                <div class="w-2/24 sm:w-2/24 px-0 whitespace-nowrap select-none">
                    O
                </div>
                <div class="w-2/24 sm:w-2/24 px-0 whitespace-nowrap select-none">
                    U
                </div>
            </div>
        );
    }

    private renderChips(): JSX.Element[] | JSX.Element {
        if (!ChipLibrary.PackLength) {
            return (
                <span class="select-none Chip">
                    Your Pack is Empty!
                </span>
            );
        }

        const chips = this.getSortedChips();

        /*
        return chips.map(packChip => <PackChip chip={packChip.chip} key={packChip.chip + "_P"} onmouseover={this.chipMouseoverHandler} owned={packChip.owned} used={packChip.used} />);
        */
       const packChip = chips[0];

       const pack: JSX.Element[] = [];
       pack.length = 100;

       pack.fill(<PackChip chip={packChip.chip} onmouseover={this.chipMouseoverHandler} owned={packChip.owned} used={packChip.used}/>);

       return pack;
    }

    view(_: CVnode): JSX.Element {
        return (
            <>
                <div class="col-span-3 sm:col-span-4 md:col-span-5 px-0 z-10">
                    <div class="Folder activeFolder">
                        {this.viewTopRow()}
                        {this.renderChips()}
                    </div>
                </div>
                <div class="col-span-1 flex flex-col px-0">
                    <ChipDesc displayChip={this.activeChipId} />
                    <DropMenu class="dropbtn">
                        <button class="dropmenu-btn" onclick={ChipLibrary.eraseData}>
                            ERASE DATA
                        </button>
                        <button class="dropmenu-btn" onclick={jackOutClicked}>
                            JACK OUT
                        </button>
                    </DropMenu>
                    <sort.SortBox currentMethod={this.sortMethod} includeOwned onChange={(e) => {
                        this.sortMethod = sort.SortOptFromStr((e.target as HTMLSelectElement).value);
                        (e.target as HTMLSelectElement).blur(); //unfocus element automatically after changing sort method
                    }} />
                </div>
            </>
        );
    }
}