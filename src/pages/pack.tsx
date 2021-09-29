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

async function loadFile(e: Event) {
    const file = (e.target as HTMLInputElement)?.files?.item(0);
    const msg = "Are you sure you want to load this file? All current data will be lost";

    if (!file || !window.confirm(msg)) {
        return;
    }

    const data = await file.text();

    try {
        ChipLibrary.importJson(data);
    } catch (e) {
        if (e instanceof TypeError) {
            alert(e.message);
        } else if (e instanceof SyntaxError) {
            alert("JSON file was malformed");
        } else {
            throw e;
        }
    }

}

export class Pack extends MitrhilTsxComponent {
    private sortMethod: sort.SortOption;
    private activeChipId: number | null;
    private chipMouseoverHandler: (e: Event) => void;
    private addToFolderHandler: (e: Event) => void;
    private contextMenuX: number | null = null;
    private contextMenuY: number | null = null;
    private contextMenuSelectedId: number | null = null;
    private closeMenu: (e: MouseEvent) => void;

    constructor(attrs: m.CVnode) {
        super(attrs);
        this.sortMethod = sort.SortOption.Name;
        this.activeChipId = null;
        this.chipMouseoverHandler = (e: Event) => {
            const id = +(e.currentTarget as HTMLDivElement).id.substr(2);
            this.activeChipId = id;
        }

        this.closeMenu = (_e: MouseEvent) => {
            this.hideContextMenu();
        }

        this.addToFolderHandler = (e: Event) => {
            const id = +(e.currentTarget as HTMLDivElement).id.substr(2);
            const name = ChipLibrary.addToFolder(id);
            if (name) {
                top.setTopMsg(`A copy of ${name} has been added to your folder`);
            }
        }

    }

    private openContextMenu(e: MouseEvent) {

        const target = document.querySelector(".chip-row:hover");
        if (!target) {
            return;
        }
        e.preventDefault();
        this.contextMenuX = e.clientX;
        this.contextMenuY = e.clientY;
        this.contextMenuSelectedId = +(target as HTMLDivElement).id.substr(2);
        window.addEventListener("click", this.closeMenu, { once: true });
    }

    private hideContextMenu() {
        this.contextMenuX = null;
        this.contextMenuY = null;
        this.contextMenuSelectedId = null;
        window.removeEventListener("click", this.closeMenu);
    }

    onremove(_: m.CVnode): void {
        this.hideContextMenu();
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


        return chips.map(packChip => <PackChip
            chip={packChip.chip}
            onmouseover={this.chipMouseoverHandler}
            addToFolder={this.addToFolderHandler}
            owned={packChip.owned}
            used={packChip.used}
        />);
    }

    view(_: CVnode): JSX.Element {
        return (
            <>
                <div class="col-span-3 sm:col-span-4 md:col-span-5 px-0 z-10">
                    <div class="Folder activeFolder" oncontextmenu={(e: MouseEvent) => { this.openContextMenu(e) }}>
                        {this.viewTopRow()}
                        {this.renderChips()}
                    </div>
                </div>
                <div class="col-span-1 flex flex-col px-0 max-h-full">
                    <ChipDesc displayChip={this.activeChipId} />
                    <DropMenu class="dropbtn">
                        <button class="dropmenu-btn" onclick={ChipLibrary.eraseData}>
                            ERASE DATA
                        </button>
                        <button class="dropmenu-btn" onclick={jackOutClicked}>
                            JACK OUT
                        </button>
                        <button class="dropmenu-btn" onclick={() => {
                            document.getElementById("jsonFile")?.click();
                        }}>
                            IMPORT JSON
                        </button>
                        <button class="dropmenu-btn" onclick={() => {
                            ChipLibrary.exportJSON();
                        }}>
                            EXPORT JSON
                        </button>
                    </DropMenu>
                    <sort.SortBox currentMethod={this.sortMethod} includeOwned onChange={(e) => {
                        this.sortMethod = sort.SortOptFromStr((e.target as HTMLSelectElement).value);
                        (e.target as HTMLSelectElement).blur(); //unfocus element automatically after changing sort method
                    }} />
                </div>
                {this.genContextMenu()}
                <input id="jsonFile" type="file" class="hidden" accept=".json" onchange={loadFile} />
            </>
        );
    }

    private genContextMenu(): JSX.Element {
        if (!this.contextMenuX || !this.contextMenuY) {
            return <></>;
        }

        const style = "left: " + this.contextMenuX + "px; top: " + this.contextMenuY + "px;";

        return (
            <div class="menu" style={style}>
                <ul class="menu-options">
                    <li class="menu-option select-none" onclick={() => {
                        if (this.contextMenuSelectedId != null) {
                            ChipLibrary.removeChipFromPack(this.contextMenuSelectedId);
                            const name = ChipLibrary.getChip(this.contextMenuSelectedId).name;
                            const msg = "Removed a copy of " + name + " from your pack";
                            top.setTopMsg(msg);
                        }
                        this.hideContextMenu();
                    }}>Remove from pack</li>
                    <li class="menu-option select-none" onclick={() => {
                        if (this.contextMenuSelectedId != null) {
                            ChipLibrary.markChipUnused(this.contextMenuSelectedId);
                        }
                        this.hideContextMenu();
                    }}>Mark copy unused</li>
                </ul>
            </div>
        )
    }
}