import m, { CVnode } from "mithril";
import { MitrhilTsxComponent } from "../JsxNamespace";

import { BattleChip } from "../library/battlechip";
import { ChipLibrary, FolderChipTuple } from "../library/library";

import * as sort from "../components/sortbox";
import { ChipDesc } from "../components/chipdesc";
import { FolderChip } from "../components/chips/FldrChip";

interface FolderChipWithBChip {
    chip: BattleChip,
    index: number,
    used: boolean,
}

function sortByName(a: FolderChipWithBChip, b: FolderChipWithBChip) {
    return sort.sortBattleChipByName(a.chip, b.chip);
}

export class GroupFolder extends MitrhilTsxComponent {
    private chipMouseoverHandler: (e: MouseEvent) => void;
    private activeChipId: number | null;

    constructor(attrs: CVnode) {
        super(attrs);
        this.chipMouseoverHandler = (e: MouseEvent) => {
            const idx = (e.currentTarget as HTMLDivElement)?.id.substr(2);
            if (idx) {
                const name = ChipLibrary.Folder[+idx][0];
                this.activeChipId = ChipLibrary.getChip(name).id;
            }
        }
        this.activeChipId = null;
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

    private sortChips(playerFolder: FolderChipTuple[]): FolderChipWithBChip[] {

        return playerFolder.map(([name, used], idx) => {
            const chip = ChipLibrary.getChip(name);
            return { chip, index: idx, used };
        }).sort(sortByName);

    }

    private renderChips(): JSX.Element[] | JSX.Element {
        const playerName = m.route.param("playerName");
        const folders = ChipLibrary.GroupFolders;

        if (!folders) {
            m.route.set("/Library");
            return [];
        }

        const playerFolder = folders.find(f => f[0] === playerName);

        if (!playerFolder) {
            m.route.set("/Library");
            return [];
        }

        const chips = this.sortChips(playerFolder[1]);

        if (!chips.length) {
            return (
                <span class="select-none Chip">
                    This Folder is Empty!
                </span>
            );
        }

        return chips.map((c, idx) =>
            <FolderChip chip={c.chip}
                folderIndex={c.index}
                used={c.used}
                displayIndex={idx}
                key={c.chip.name + "_F"}
                onmouseover={this.chipMouseoverHandler}
                groupFolder
            />
        );

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
                <div class="col-span-1 flex flex-col px-0 max-h-full">
                    <ChipDesc displayChip={this.activeChipId} />
                </div>
            </>
        );
    }

}