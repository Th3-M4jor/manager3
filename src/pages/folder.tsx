import { Component, createRef } from "preact";

import { BattleChip } from "../library/battlechip";
import { ChipLibrary } from "../library/library";

import * as sort from "../components/sortbox";
import { DropMenu } from "../components/dropmenu";
import { ChipDesc, ChipDescDisplay } from "../components/chipdesc";
import { FolderChip } from "../components/chips/FldrChip";

import * as top from "../TopLvlMsg";

export interface FolderChipWithBChip {
    chip: BattleChip,
    index: number,
    used: boolean,
}

//#region FolderSortOpts
export function sortByName(a: FolderChipWithBChip, b: FolderChipWithBChip): number {
    return sort.sortBattleChipByName(a.chip, b.chip);
}

function sortByAvgDmg(a: FolderChipWithBChip, b: FolderChipWithBChip): number {
    return sort.sortBattleChipByAvgDmg(a.chip, b.chip);
}

function sortByElem(a: FolderChipWithBChip, b: FolderChipWithBChip): number {
    return sort.sortBattleChipByElement(a.chip, b.chip);
}


function sortByKind(a: FolderChipWithBChip, b: FolderChipWithBChip): number {
    return sort.sortBattleChipByKind(a.chip, b.chip);
}


function sortByMaxDmg(a: FolderChipWithBChip, b: FolderChipWithBChip): number {
    return sort.sortBattleChipByMaxDmg(a.chip, b.chip);
}


function sortByRange(a: FolderChipWithBChip, b: FolderChipWithBChip): number {
    return sort.sortBattleChipByRange(a.chip, b.chip);
}


function sortBySkill(a: FolderChipWithBChip, b: FolderChipWithBChip): number {
    return sort.sortBattleChipBySkill(a.chip, b.chip);
}


function sortByCr(a: FolderChipWithBChip, b: FolderChipWithBChip): number {
    return sort.sortBattleChipByCr(a.chip, b.chip);
}
//#endregion FolderSortOpts

export function folderTopRow() {
    return (
        <div class="chip-top-row Chip z-20">
            <div class="w-1/24 sm:w-1/24 px-0 whitespace-nowrap select-none"/>
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

function jackOutClicked() {
    const count = ChipLibrary.jackOut();

    const msg = `${count} ${count == 1 ? "chip has" : "chips have"} has been marked as unused`;

    top.setTopMsg(msg);
}

interface FolderState {
    activeChipId: number | null;
    showJoinModal: boolean;
}

export class Folder extends Component<Record<string, never>, FolderState> {
    //private sortMethod: sort.SortOption;
    private static sortMethod: sort.SortOption = sort.SortOption.Name;
    private static scrollPos = 0;
    private chipMouseoverHandler: (e: MouseEvent) => void;
    private returnToPack: (e: MouseEvent) => void;
    private playerNameRef = createRef<HTMLInputElement>();
    private groupNameRef = createRef<HTMLInputElement>();
    private spectatorRef = createRef<HTMLInputElement>();
    private folderDivRef = createRef<HTMLDivElement>();

    constructor() {
        super();

        this.state = {
            activeChipId: null,
            showJoinModal: false,
        }

        this.chipMouseoverHandler = (e: MouseEvent) => {
            const data = (e.currentTarget as HTMLDivElement).dataset;
            if (!data?.id) {
                return;
            }
            const id = +data.id;
            this.setState({activeChipId: id});
        }
        this.returnToPack = (e: MouseEvent) => {

            const data = (e.currentTarget as HTMLDivElement).dataset;
            if (!data?.index) {
                return;
            }

            const index = +data.index;
            const [name, used] = ChipLibrary.removeChipFromFolder(index);
            if (used.value) {
                top.setTopMsg(`A used copy of ${name} has been returned to your pack`);
            } else {
                top.setTopMsg(`A copy of ${name} has been returned to your pack`);
            }
            this.forceUpdate();
        }
    }

    private generateModal() {
        if (!this.state.showJoinModal) {
            return <></>;
        }

        const cancelCallback = (_: MouseEvent) => {
            this.setState({showJoinModal: false});
        }

        const okCallback = (_: MouseEvent) => {
            this.setState({showJoinModal: false});

            const groupName = this.groupNameRef.current?.value.trim();
            const playerName = this.playerNameRef.current?.value.trim();
            const spectator = this.spectatorRef.current?.checked;

            if (groupName && playerName) {
                ChipLibrary.joinGroup(groupName, playerName, spectator);
            } else {
                top.setTopMsg("Please enter a group name and player name");
            }
        }

        return (
            <div class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>JOIN GROUP</h2>
                    </div>
                    <div class="modal-body">
                        <input type="text" placeholder="group name" id="groupName" ref={this.groupNameRef} />
                        <br />
                        <input type="text" placeholder="player name" id="playerName" ref={this.playerNameRef} />
                        <br />
                        <label for="spectator_checkbox">Join as spectator</label>
                        <input type="checkbox" id="spectator_checkbox" ref={this.spectatorRef}/>
                    </div>
                    <div class="modal-footer">
                        <span class="pl-1">
                            <button class="ok-button" onClick={okCallback}>Join</button>
                        </span>
                        <span class="float-right">
                            <button class="inactiveNavTab" onClick={cancelCallback}>Cancel</button>
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    private getSortedChips(): FolderChipWithBChip[] {
        const folder: FolderChipWithBChip[] = ChipLibrary.ActiveFolder.map(([name, used], idx) => ({
            chip: ChipLibrary.getChip(name.value),
            index: idx,
            used: used.value,
        }));

        const sortFunc: (a: FolderChipWithBChip, b: FolderChipWithBChip) => number =
            Folder.sortMethod.match({
                AverageDamage: () => sortByAvgDmg,
                Element: () => sortByElem,
                Kind: () => sortByKind,
                MaxDamage: () => sortByMaxDmg,
                Name: () => sortByName,
                Range: () => sortByRange,
                Skill: () => sortBySkill,
                Cr: () => sortByCr,
                _: () => { throw new Error("Invalid sort method") },
            });

        return folder.sort(sortFunc);
    }

    private renderChips() {
        if (!ChipLibrary.ActiveFolder.length) {
            return (
                <span class="select-none Chip">
                    {ChipLibrary.FolderName} is Empty!
                </span>
            );
        }

        const chips = this.getSortedChips();
        return chips.map((c, idx) =>
            <FolderChip chip={c.chip}
                folderIndex={c.index}
                used={c.used}
                displayIndex={idx}
                onmouseover={this.chipMouseoverHandler}
                returnToPack={this.returnToPack}
            />
        );

    }

    private renderGroupBtn() {
        if (ChipLibrary.InGroup) {
            return (
                <button class="dropmenu-btn" onClick={() => ChipLibrary.leaveGroup()}>
                    LEAVE GROUP
                </button>
            );
        }

        return (
            <button class="dropmenu-btn" onClick={() => this.setState({showJoinModal: true})}>
                JOIN GROUP
            </button>
        );

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
                    const len = ChipLibrary.clearFolder();
                    this.forceUpdate();
                    top.setTopMsg(`${len} ${len == 1 ? "chip has" : "chips have"} been returned to your pack`);
                }}>
                    CLEAR FOLDER
                </button>
                <button class="dropmenu-btn" onClick={jackOutClicked}>
                    JACK OUT
                </button>
                {this.renderGroupBtn()}
            </DropMenu>
        );
    }

    componentDidMount() {
        const folder = this.folderDivRef.current;
        if (folder) {
            folder.scrollTop = Folder.scrollPos;
        }
    }

    componentWillUnmount() {
        Folder.scrollPos = this.folderDivRef.current?.scrollTop ?? 0;
    }

    render(){
        const minFldrSize = ChipLibrary.MinFolderSize + "";
        const chipLimit = ChipLibrary.FolderSize + "";

        let chipDescItem: ChipDescDisplay;

        if (this.state.activeChipId) {
            chipDescItem = ChipDescDisplay.ChipId(this.state.activeChipId);
        } else {
            chipDescItem = ChipDescDisplay.None;
        }

        return (
            <>
                <div class="col-span-3 sm:col-span-4 md:col-span-5 px-0 z-10">
                    <div class="Folder activeFolder">
                        {folderTopRow()}
                        {this.renderChips()}
                    </div>
                </div>
                <div class="col-span-1 flex flex-col px-0 max-h-full">
                    <ChipDesc item={chipDescItem} />
                    {this.dropMenu()}
                    <sort.SortBox currentMethod={Folder.sortMethod} onSortChange={(e) => {
                        Folder.sortMethod = sort.SortOptFromStr((e.target as HTMLSelectElement).value);
                        (e.target as HTMLSelectElement).blur(); //unfocus element automatically after changing sort method
                    }}
                        hideDesc={true}
                    />
                    <span class="Chip select-none cursor-pointer">Folder Size</span>
                    <input type="number"
                        class="chip-search-input"
                        min={minFldrSize}
                        value={chipLimit}
                        max="30"
                        onChange={(e: Event) => {
                            const val = +(e.target as HTMLInputElement).value;
                            ChipLibrary.FolderSize = val;
                        }}
                    />
                </div>
                {this.generateModal()}
            </>
        );
    }
}