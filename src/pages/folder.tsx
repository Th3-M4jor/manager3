import m, { CVnode } from "mithril";
import { MitrhilTsxComponent } from "../JsxNamespace";

import { BattleChip } from "../library/battlechip";
import { ChipLibrary } from "../library/library";

import * as sort from "../components/sortbox";
import { DropMenu } from "../components/dropmenu";
import { ChipDesc } from "../components/chipdesc";
import { FolderChip } from "../components/chips/FldrChip";

import * as top from "../TopLvlMsg";

interface FolderChipWithBChip {
    chip: BattleChip,
    index: number,
    used: boolean,
}

//#region FolderSortOpts
function sortByName(a: FolderChipWithBChip, b: FolderChipWithBChip) {
    return sort.sortBattleChipByName(a.chip, b.chip);
}

function sortByAvgDmg(a: FolderChipWithBChip, b: FolderChipWithBChip) {
    return sort.sortBattleChipByAvgDmg(a.chip, b.chip);
}

function sortByElem(a: FolderChipWithBChip, b: FolderChipWithBChip) {
    return sort.sortBattleChipByElement(a.chip, b.chip);
}

function sortByKind(a: FolderChipWithBChip, b: FolderChipWithBChip) {
    return sort.sortBattleChipByKind(a.chip, b.chip);
}

function sortByMaxDmg(a: FolderChipWithBChip, b: FolderChipWithBChip) {
    return sort.sortBattleChipByMaxDmg(a.chip, b.chip);
}

function sortByRange(a: FolderChipWithBChip, b: FolderChipWithBChip) {
    return sort.sortBattleChipByRange(a.chip, b.chip);
}

function sortBySkill(a: FolderChipWithBChip, b: FolderChipWithBChip) {
    return sort.sortBattleChipBySkill(a.chip, b.chip);
}
//#endregion FolderSortOpts

function jackOutClicked() {
    const count = ChipLibrary.jackOut();

    const msg = `${count} ${count == 1 ? "chip has" : "chips have"} has been marked as unused`;

    top.setTopMsg(msg);
}

export class Folder extends MitrhilTsxComponent {
    private sortMethod: sort.SortOption;
    private activeChipId: number | null;
    private chipMouseoverHandler: (e: MouseEvent) => void;
    private returnToPack: (e: MouseEvent) => void;

    constructor(attrs: m.CVnode) {
        super(attrs);
        this.sortMethod = sort.SortOption.Name;
        this.activeChipId = null;
        this.chipMouseoverHandler = (e: MouseEvent) => {
            const idx = (e.currentTarget as HTMLDivElement)?.id.substr(2);
            if (idx) {
                const name = ChipLibrary.Folder[+idx][0];
                this.activeChipId = ChipLibrary.getChip(name).id;
            }
        }
        this.returnToPack = (e: MouseEvent) => {
            const id = (e.currentTarget as HTMLDivElement)?.id.substr(2);
            if (id) {
                const [name, used] = ChipLibrary.removeChipFromFolder(+id);
                if (used) {
                    top.setTopMsg(`A used copy of ${name} has been returned to your pack`);
                } else {
                    top.setTopMsg(`A copy of ${name} has been returned to your pack`);
                }
            }
        }
    }

    private viewTopRow(): JSX.Element {
        return (
            <div class="chip-top-row Chip z-20">
                <div class="w-1/24 sm:w-1/24 px-0 whitespace-nowrap select-none">
                    #
                </div>
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
                <div class="w-4/24 sm:w-4/24 px-0 whitespace-nowrap select-none">
                    ELEM
                </div>
                <div class="w-2/24 sm:w-2/24 px-0 whitespace-nowrap select-none">
                    U
                </div>
            </div>
        );
    }

    private getSortedChips(): FolderChipWithBChip[] {
        const folder: FolderChipWithBChip[] = ChipLibrary.Folder.map(([name, used], idx) => ({
            chip: ChipLibrary.getChip(name),
            index: idx,
            used,
        }));

        const sortFunc: (a: FolderChipWithBChip, b: FolderChipWithBChip) => number =
            this.sortMethod.match({
                AverageDamage: () => sortByAvgDmg,
                Element: () => sortByElem,
                Kind: () => sortByKind,
                MaxDamage: () => sortByMaxDmg,
                Name: () => sortByName,
                Range: () => sortByRange,
                Skill: () => sortBySkill,
                _: () => { throw new Error("Invalid sort method") },
            });

        return folder.sort(sortFunc);
    }

    private renderChips(): JSX.Element[] | JSX.Element {
        if (!ChipLibrary.Folder.length) {
            return (
                <span class="select-none Chip">
                    Your Folder is Empty!
                </span>
            );
        }

        const chips = this.getSortedChips();
        return chips.map((c, idx) =>
            <FolderChip chip={c.chip}
                folderIndex={c.index}
                used={c.used}
                displayIndex={idx}
                key={c.chip.name + "_F"}
                onmouseover={this.chipMouseoverHandler}
                returnToPack={this.returnToPack}
            />
        );

    }

    private renderGroupBtn(): JSX.Element {
        if (ChipLibrary.InGroup) {
            return (
                <button class="dropmenu-btn" onclick={() => ChipLibrary.leaveGroup()}>
                    LEAVE GROUP
                </button>
            );
        } else {
            return (
                <button class="dropmenu-btn" onclick={() => ChipLibrary.joinGroup("test", "major")}>
                    JOIN GROUP
                </button>
            );
        }
    }

    view(_: CVnode): JSX.Element {
        const minFldrSize = ChipLibrary.Folder.length + "";
        const chipLimit = ChipLibrary.FolderSize + "";
        return (
            <>
                <div class="col-span-3 sm:col-span-4 md:col-span-5 px-0 z-10">
                    <div class="Folder activeFolder">
                        {this.viewTopRow()}
                        {this.renderChips()}
                    </div>
                </div>
                <div class="col-span-1 flex flex-col px-0 max-h-full">
                    <ChipDesc displayChip={this.activeChipId} />
                    <DropMenu class="dropbtn">
                        <button class="dropmenu-btn" onclick={() => {
                            const len = ChipLibrary.clearFolder();
                            top.setTopMsg(`${len} ${len == 1 ? "chip has" : "chips have"} been returned to your pack`);
                        }}>
                            CLEAR FOLDER
                        </button>
                        <button class="dropmenu-btn" onclick={jackOutClicked}>
                            JACK OUT
                        </button>
                        {this.renderGroupBtn()}
                    </DropMenu>
                    <sort.SortBox currentMethod={this.sortMethod} onChange={(e) => {
                        this.sortMethod = sort.SortOptFromStr((e.target as HTMLSelectElement).value);
                        (e.target as HTMLSelectElement).blur(); //unfocus element automatically after changing sort method
                    }} />
                    <span class="Chip select-none cursor-pointer">Folder Size</span>
                    <input type="number"
                        class="chip-search-input"
                        min={minFldrSize}
                        value={chipLimit}
                        max="30"
                        onchange={(e: Event) => {
                            const val = +(e.target as HTMLInputElement).value;
                            ChipLibrary.FolderSize = val;
                        }}
                    />
                </div>
            </>
        );
    }
}