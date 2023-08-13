import { Component } from "preact";

import { ChipLibrary, GroupFolderChipTuple } from "../library/library";
import * as top from "../TopLvlMsg";

import { FolderChipWithBChip, sortByName, folderTopRow } from "./folder";

import {
  ChipDesc,
  ChipDescDisplay,
  setActiveDisplayItem,
} from "../components/chipdesc";
import { FolderChip } from "../components/chips/FldrChip";

export class GroupFolder extends Component {
  private chipMouseoverHandler: (e: MouseEvent) => void;

  constructor() {
    super();

    this.chipMouseoverHandler = (e: MouseEvent) => {
      const data = (e.currentTarget as HTMLDivElement).dataset;
      if (!data?.id) {
        return;
      }
      const id = +data.id;
      setActiveDisplayItem(ChipDescDisplay.ChipId(id));
    };
  }

  private sortChips(
    playerFolder: GroupFolderChipTuple[],
  ): FolderChipWithBChip[] {
    return playerFolder
      .map(([name, used], idx) => {
        const chip = ChipLibrary.getChip(name);
        return { chip, index: idx, used };
      })
      .sort(sortByName);
  }

  private renderChips() {
    const playerName = top.getActiveTab().match({
      GroupFolder: (name) => name,
      _: () => {
        top.setActiveTab(top.Tabs.Library);
        return "";
      },
    });
    const folders = ChipLibrary.GroupFolders;

    if (!folders) {
      top.setActiveTab(top.Tabs.Library);
      return [];
    }

    const playerFolder = folders.find((f) => f[0] === playerName);

    if (!playerFolder) {
      top.setActiveTab(top.Tabs.Library);
      return [];
    }

    const chips = this.sortChips(playerFolder[1]);

    if (!chips.length) {
      return <span class="select-none Chip">This Folder is Empty!</span>;
    }

    return chips.map((c, idx) => (
      <FolderChip
        chip={c.chip}
        folderIndex={c.index}
        used={c.used}
        displayIndex={idx}
        onmouseover={this.chipMouseoverHandler}
        groupFolder={true}
        key={`FG_${c.chip.name}-${c.index}`}
      />
    ));
  }

  render() {
    return (
      <>
        <div class="col-span-3 sm:col-span-4 md:col-span-5 px-0 z-10">
          <div class="Folder activeFolder">
            {folderTopRow()}
            {this.renderChips()}
          </div>
        </div>
        <div class="col-span-1 flex flex-col px-0 max-h-full">
          <ChipDesc />
        </div>
      </>
    );
  }
}
