import m, { CVnode } from "mithril";
import { MitrhilTsxComponent } from "../JsxNamespace";

import { ChipLibrary, FolderChipTuple } from "../library/library";

import { FolderChipWithBChip, sortByName, folderTopRow } from "./folder";

import { ChipDesc } from "../components/chipdesc";
import { FolderChip } from "../components/chips/FldrChip";

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
                        {folderTopRow()}
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