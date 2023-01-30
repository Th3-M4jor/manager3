import { Component, createRef } from "preact";
import { Signal, signal } from "@preact/signals";

import { BattleChip } from "../library/battlechip";
import { ChipLibrary } from "../library/library";

import * as sort from "../components/sortbox";
import { DropMenu } from "../components/dropmenu";
import { ChipDesc, ChipDescDisplay } from "../components/chipdesc";
import { PackChip } from "../components/chips/PackChip";


import * as top from "../TopLvlMsg";

import { cmpN } from "../util/cmp";

interface PackChipWithBChip {
    chip: BattleChip,
    owned: Signal<number>,
    used: Signal<number>,
}

//#region PackSortOpts
function sortByName(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByName(a.chip, b.chip);
}

function sortByNameDesc(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByNameDesc(a.chip, b.chip);
}

function sortByOwned(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return cmpN(b.owned.value, a.owned.value) || sort.sortBattleChipByName(a.chip, b.chip);
}

function sortByOwnedDesc(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return cmpN(a.owned.value, b.owned.value) || sort.sortBattleChipByName(a.chip, b.chip);
}

function sortByAvgDmg(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByAvgDmg(a.chip, b.chip);
}

function sortByAvgDmgDesc(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByAvgDmgDesc(a.chip, b.chip);
}

function sortByElem(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByElement(a.chip, b.chip);
}

function sortByElemDesc(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByElementDesc(a.chip, b.chip);
}

function sortByKind(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByKind(a.chip, b.chip);
}

function sortByKindDesc(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByKindDesc(a.chip, b.chip);
}

function sortByMaxDmg(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByMaxDmg(a.chip, b.chip);
}

function sortByMaxDmgDesc(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByMaxDmgDesc(a.chip, b.chip);
}

function sortByRange(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByRange(a.chip, b.chip);
}

function sortByRangeDesc(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByRangeDesc(a.chip, b.chip);
}

function sortBySkill(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipBySkill(a.chip, b.chip);
}

function sortBySkillDesc(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipBySkillDesc(a.chip, b.chip);
}

function sortByCr(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByCr(a.chip, b.chip);
}

function sortByCrDesc(a: PackChipWithBChip, b: PackChipWithBChip): number {
    return sort.sortBattleChipByCrDesc(a.chip, b.chip);
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

interface PackState {
    activeChipId: number | null;
    contextMenuX: number | null;
    contextMenuY: number | null;
    contextMenuSelectedId: number | null;
}

export class Pack extends Component<Record<string, never>, PackState> {
    private static sortMethod: Signal<sort.SortOption> = signal(sort.SortOption.Name);
    private static sortDescending = signal(false);
    private static scrollPos = 0;
    private chipMouseoverHandler: (e: Event) => void;
    private addToFolderHandler: (e: Event) => void;
    private closeMenu: (e: MouseEvent) => void;
    private packDivRef = createRef<HTMLDivElement>();
    private jsonInputRef = createRef<HTMLInputElement>();

    constructor() {
        super();

        this.state = {
            activeChipId: null,
            contextMenuX: null,
            contextMenuY: null,
            contextMenuSelectedId: null,
        }

        this.chipMouseoverHandler = (e: Event) => {
            const data = (e.currentTarget as HTMLDivElement).dataset;
            if (!data || !data.id) {
                return;
            }
            const id = +data.id;
            this.setState({ activeChipId: id });
        }

        this.closeMenu = (_e: MouseEvent) => {
            this.hideContextMenu();
        }

        this.addToFolderHandler = (e: Event) => {
            const data = (e.currentTarget as HTMLDivElement).dataset;
            if (!data || !data.id) {
                return;
            }
            const id = +data.id;
            const name = ChipLibrary.addToFolder(id);
            if (name) {
                top.setTopMsg(`A copy of ${name} has been added to ${ChipLibrary.FolderName}`);
            }
            this.forceUpdate()
        }
    }

    private openContextMenu(e: MouseEvent) {

        const target = document.querySelector<HTMLElement>(".chip-row:hover");
        if (!target) {
            return;
        }
        const data = target.dataset;
        if (!data || !data.id) {
            return;
        }
        e.preventDefault();

        this.setState({ contextMenuX: e.clientX, contextMenuY: e.clientY, contextMenuSelectedId: +data.id });

        window.addEventListener("click", this.closeMenu, { once: true });
    }

    private hideContextMenu(): void {
        
        this.setState({ contextMenuX: null, contextMenuY: null, contextMenuSelectedId: null });
        window.removeEventListener("click", this.closeMenu);
    }

    componentWillUnmount(): void {
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

        const sortFunc: (a: PackChipWithBChip, b: PackChipWithBChip) => number = Pack.sortMethod.value.match({
            AverageDamage: () => Pack.sortDescending.value ? sortByAvgDmgDesc : sortByAvgDmg,
            Element: () => Pack.sortDescending.value ? sortByElemDesc : sortByElem,
            Kind: () => Pack.sortDescending.value ? sortByKindDesc : sortByKind,
            MaxDamage: () => Pack.sortDescending.value ? sortByMaxDmgDesc : sortByMaxDmg,
            Name: () => Pack.sortDescending.value ? sortByNameDesc : sortByName,
            Owned: () => Pack.sortDescending.value ? sortByOwnedDesc : sortByOwned,
            Range: () => Pack.sortDescending.value ? sortByRangeDesc : sortByRange,
            Skill: () => Pack.sortDescending.value ? sortBySkillDesc : sortBySkill,
            Cr: () => Pack.sortDescending.value ? sortByCrDesc : sortByCr,
        });

        return pack.sort(sortFunc);

    }

    private viewTopRow() {
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

    private renderChips() {
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

    private dropMenu() {
        return (
            <DropMenu class="dropbtn">
                <button class="dropmenu-btn" onClick={() => {
                    ChipLibrary.swapFolder();
                    const fldrName = ChipLibrary.FolderName;
                    top.setTopMsg(`Swiched to ${fldrName}`);
                }}>
                    SWAP FOLDER
                </button>
                <button class="dropmenu-btn" onClick={() => {
                    ChipLibrary.eraseData();
                    this.forceUpdate();
                }}>
                    ERASE DATA
                </button>
                <button class="dropmenu-btn" onClick={jackOutClicked}>
                    JACK OUT
                </button>
                <button class="dropmenu-btn" onClick={() => {
                    this.jsonInputRef.current?.click();
                }}>
                    IMPORT JSON
                </button>
                <button class="dropmenu-btn" onClick={() => {
                    ChipLibrary.exportJSON();
                }}>
                    EXPORT JSON
                </button>
            </DropMenu>
        );
    }

    componentDidMount() {
        if (this.packDivRef.current) {
            this.packDivRef.current.scrollTop = Pack.scrollPos;
        }
    }

    componentWillUnMount() {
        Pack.scrollPos = this.packDivRef.current?.scrollTop ?? 0;
    }

    render() {

        let chipDescItem: ChipDescDisplay;

        if (this.state.activeChipId) {
            chipDescItem = ChipDescDisplay.ChipId(this.state.activeChipId);
        } else {
            chipDescItem = ChipDescDisplay.None;
        }

        return (
            <>
                <div class="col-span-3 sm:col-span-4 md:col-span-5 px-0 z-10">
                    <div class="Folder activeFolder" onContextMenu={(e) => { this.openContextMenu(e) }}>
                        {this.viewTopRow()}
                        {this.renderChips()}
                    </div>
                </div>
                <div class="col-span-1 flex flex-col px-0 max-h-full">
                    <ChipDesc item={chipDescItem} />
                    {this.dropMenu()}
                    <sort.SortBox currentMethod={Pack.sortMethod.value} includeOwned onSortChange={(e) => {
                        Pack.sortMethod.value = sort.SortOptFromStr((e.target as HTMLSelectElement).value);
                        (e.target as HTMLSelectElement).blur(); //unfocus element automatically after changing sort method
                    }}
                        descending={Pack.sortDescending.value} onDescendingChange={(e) => {
                            Pack.sortDescending.value = (e.target as HTMLInputElement).checked;
                            (e.target as HTMLInputElement).blur();
                        }}
                    />
                </div>
                {this.genContextMenu()}
                <input id="jsonFile" type="file" class="hidden" accept=".json" onChange={ async (e) => {
                    await loadFile(e);
                    this.forceUpdate();
                }} ref={this.jsonInputRef} />
            </>
        );
    }

    private genContextMenu() {
        if (!this.state.contextMenuX || !this.state.contextMenuY) {
            return <></>;
        }

        const style = `left: ${this.state.contextMenuX}px; top: ${this.state.contextMenuY}px;`;

        return (
            <div class="menu" style={style}>
                <ul class="menu-options">
                    <li class="menu-option select-none" onClick={() => {
                        if (this.state.contextMenuSelectedId != null) {
                            ChipLibrary.removeChipFromPack(this.state.contextMenuSelectedId);
                            const name = ChipLibrary.getChip(this.state.contextMenuSelectedId).name;
                            const msg = "Removed a copy of " + name + " from your pack";
                            top.setTopMsg(msg);
                        }
                        this.hideContextMenu();
                    }}>Remove from pack</li>
                    <li class="menu-option select-none" onClick={() => {
                        if (this.state.contextMenuSelectedId != null) {
                            ChipLibrary.markChipUnused(this.state.contextMenuSelectedId);
                        }
                        this.hideContextMenu();
                    }}>Mark copy unused</li>
                </ul>
            </div>
        )
    }
}