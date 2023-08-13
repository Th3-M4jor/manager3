import { batch, Signal, signal } from "@preact/signals";
import { makeTaggedUnion, none, MemberType } from "safety-match";

import { storageAvailable } from "../util/storageavailable";
import { BattleChip, ChipData } from "./battlechip";
import { throwExpression } from "../util/throwExpression";

export interface FolderChip {
  name: string;
  used: boolean;
}

export type chipName = string;
export type chipUsed = boolean;

export type FolderChipTuple = [Signal<chipName>, Signal<chipUsed>];
export type GroupFolderChipTuple = [chipName, chipUsed];

export const ActiveFolder = makeTaggedUnion({
  Folder1: none,
  Folder2: none,
});

export type ActiveFolder = MemberType<typeof ActiveFolder>;

interface SignaledPackChip {
  owned: Signal<number>;
  used: Signal<number>;
}

interface PackChip {
  owned: number;
  used: number;
}

type PackDict = { [index: string]: PackChip };

interface importedData {
  Folder: FolderChip[];
  Folder2?: FolderChip[];
  Pack: PackDict;
  Limit: number;
}

export class ChipLibrary {
  private static readonly instance = new ChipLibrary();

  private static groupWorker: Signal<Worker | null> = signal(null);

  private static readonly groupFolders: Signal<
    [string, GroupFolderChipTuple[]][] | null
  > = signal(null);

  private canSave = true;

  /**
   * A map of all chips by the name
   */
  private chips: Map<string, BattleChip> = new Map();

  /**
   * A map of all chip IDs to their name
   */
  private idMap: Map<number, string> = new Map();

  /**
   * The contents of your pack
   */
  private pack: Map<string, SignaledPackChip> = new Map();

  /**
   * An array that holds all chips in your folder
   */
  private folder: FolderChipTuple[] = [];

  private folder2: FolderChipTuple[] = [];

  /**
   * The max number of chips allowed in a folder
   */
  private readonly folderSize = signal(12);

  private changeSinceLastSave = false;

  private activeFolder: Signal<ActiveFolder> = signal(ActiveFolder.Folder1);

  public static initFromChips(data: BattleChip[]): number {
    ChipLibrary.instance.chips.clear();
    ChipLibrary.instance.idMap.clear();

    for (const chip of data) {
      ChipLibrary.instance.idMap.set(chip.id, chip.name);
      ChipLibrary.instance.chips.set(chip.name, chip);
    }

    ChipLibrary.loadSaveData();

    return ChipLibrary.instance.chips.size;
  }

  public static init(data: ChipData[]): number {
    ChipLibrary.instance.chips.clear();
    ChipLibrary.instance.idMap.clear();

    data.forEach((chipData) => {
      const chip = new BattleChip(chipData);
      ChipLibrary.instance.idMap.set(chip.id, chip.name);
      ChipLibrary.instance.chips.set(chip.name, chip);
    });

    ChipLibrary.loadSaveData();

    return ChipLibrary.instance.chips.size;
  }

  private static loadSaveData() {
    if (storageAvailable("localStorage")) {
      try {
        ChipLibrary.instance.loadFolder();
        ChipLibrary.instance.loadFolder2();
        ChipLibrary.instance.loadPack();
      } catch (e) {
        alert(
          `There was an error loading your save data ${
            (e as Error).message
          }, clearing data`,
        );
        localStorage.removeItem("folder");
        localStorage.removeItem("folder2");
        localStorage.removeItem("activeFolder");
        localStorage.removeItem("pack");
        localStorage.removeItem("chipLimit");
        ChipLibrary.instance.folder = [];
        ChipLibrary.instance.folder2 = [];
        ChipLibrary.instance.folderSize.value = 12;
        ChipLibrary.instance.pack = new Map();
      }

      //save chips every 5 minutes
      setInterval(
        () => {
          ChipLibrary.saveData();
        },
        5 * 60 * 1000,
      );
    } else {
      alert(
        "Local storage is not available, it is used to backup your folder and pack periodically",
      );
      ChipLibrary.instance.canSave = false;
    }
  }

  private validateFolderChip(chip: FolderChip): FolderChipTuple {
    if (typeof chip?.name !== "string" || typeof chip?.used !== "boolean") {
      throw new Error(`Found an invalid folderchip`);
    }

    return [signal(chip.name), signal(chip.used)];
  }

  private loadFolder(): number {
    const folder = localStorage.getItem("folder");
    const chipLimit = localStorage.getItem("chipLimit");
    const activeFolder = localStorage.getItem("activeFolder");
    if (chipLimit !== null && +chipLimit > 0) {
      this.folderSize.value = +chipLimit;
    }

    if (!folder) {
      return 0;
    }

    if (activeFolder === "2") {
      this.activeFolder.value = ActiveFolder.Folder2;
      // else leave as folder 1, the default
    }

    const oldFolder: FolderChip[] = JSON.parse(folder);

    if (!Array.isArray(oldFolder)) {
      throw new TypeError(`Expected array, found ${typeof oldFolder}`);
    }

    const folderArry = [];

    for (const chip of oldFolder) {
      if (this.chips.has(chip?.name)) {
        const fldrChip = this.validateFolderChip(chip);
        folderArry.push(fldrChip);
      } else {
        alert(
          `The chip ${chip?.name} no longer exists in the library, cannot add it to your folder, you had it marked as ${
            chip?.used ? "used" : "unused"
          }`,
        );
      }
    }

    if (folderArry.length > this.folderSize.value) {
      throw new Error("Folder too big");
    }

    this.folder = folderArry;
    return this.folder.length;
  }

  private loadFolder2(): number {
    const folder = localStorage.getItem("folder2");

    if (!folder) {
      return 0;
    }

    const oldFolder: FolderChip[] = JSON.parse(folder);

    if (!Array.isArray(oldFolder)) {
      throw new TypeError(`Expected array, found ${typeof oldFolder}`);
    }

    const folderArry = [];

    for (const chip of oldFolder) {
      if (this.chips.has(chip?.name)) {
        const fldrChip = this.validateFolderChip(chip);
        folderArry.push(fldrChip);
      } else {
        alert(
          `The chip ${chip?.name} no longer exists in the library, cannot add it to folder2, you had it marked as ${
            chip?.used ? "used" : "unused"
          }`,
        );
      }
    }

    if (folderArry.length > this.folderSize.value) {
      throw new Error("Folder2 too big");
    }

    this.folder2 = folderArry;
    return this.folder2.length;
  }

  /**
   *
   * @param {string} name assumed to already be a valid name for a chip
   * @param {PackChip} chip
   *
   * @throws if the shape of `chip` is incorrect
   */
  private validateAndAddToPack(name: string, chip: PackChip) {
    if (
      typeof chip?.owned !== "number" ||
      typeof chip?.used !== "number" ||
      chip.owned < chip.used
    ) {
      throw new TypeError(`Found an invalid pack chip, ${name}`);
    }

    const data = {
      owned: signal(chip.owned),
      used: signal(chip.used),
    };

    this.pack.set(name, data);
  }

  private loadPack(): number {
    const pack = localStorage.getItem("pack");
    if (!pack) {
      return 0;
    }

    const oldPack: PackDict = JSON.parse(pack);

    if (typeof oldPack !== "object") {
      throw new TypeError(`Expected object, found ${typeof oldPack}`);
    }

    for (const k in oldPack) {
      if (this.chips.has(k)) {
        this.validateAndAddToPack(k, oldPack[k]);
      } else {
        alert(
          `The chip ${k} no longer exists in the library, cannot add it to your pack. You owned ${oldPack[k]?.owned}, of which ${oldPack[k]?.used} were marked as used`,
        );
      }
    }
    return this.pack.size;
  }

  private addToPack(chipName: string, used = false): number {
    const packChip = this.pack.get(chipName);

    if (packChip) {
      packChip.owned.value += 1;
      packChip.used.value += used ? 1 : 0;
      return packChip.owned.value;
    }

    const chip = {
      owned: signal(1),
      used: signal(used ? 1 : 0),
    };
    this.pack.set(chipName, chip);
    return 1;
  }

  public static addToFolder(chip: string | number): string | null {
    if (
      ChipLibrary.ActiveFolder.length >= ChipLibrary.instance.folderSize.value
    ) {
      alert(
        `You have reached the maximum number of chips in your folder (${ChipLibrary.instance.folderSize}), please remove some to add more`,
      );
      return null;
    }

    const chipName =
      typeof chip === "string" ? chip : ChipLibrary.instance.idMap.get(chip);
    if (!chipName) throw new Error("Inconcievable!");

    const packChip =
      ChipLibrary.instance.pack.get(chipName) ??
      throwExpression("Inconcievable!");

    const libChip =
      ChipLibrary.instance.chips.get(chipName) ??
      throwExpression("Inconcievable!");

    const copyCt = ChipLibrary.ActiveFolder.reduce((ct, [name, _]) => {
      if (name.peek() === chipName) {
        return ct + 1;
      }
      return ct;
    }, 0);

    const maxInFolder = libChip.MaxInFldr;

    if (copyCt >= maxInFolder) {
      alert(
        `You already have ${maxInFolder} ${
          maxInFolder == 1 ? "copy" : "copies"
        } of ${chipName} in your folder`,
      );
      return null;
    }

    if (packChip.used.peek() >= packChip.owned.peek()) {
      alert(`You have already used all of your ${chipName} chips`);
      return null;
    }

    if (packChip.owned.peek() == 1) {
      ChipLibrary.instance.pack.delete(chipName);
      ChipLibrary.ActiveFolder.push([signal(chipName), signal(false)]);
    } else {
      packChip.owned.value -= 1;
      ChipLibrary.ActiveFolder.push([signal(chipName), signal(false)]);
    }

    ChipLibrary.instance.changeSinceLastSave = true;

    ChipLibrary.folderUpdated();

    return chipName;
  }

  public static swapFolder(): void {
    ChipLibrary.instance.activeFolder.value.match({
      Folder1: () => {
        ChipLibrary.instance.activeFolder.value = ActiveFolder.Folder2;
      },
      Folder2: () => {
        ChipLibrary.instance.activeFolder.value = ActiveFolder.Folder1;
      },
    });

    ChipLibrary.folderUpdated();
    ChipLibrary.instance.changeSinceLastSave = true;
  }

  public static saveData(): void {
    if (
      !ChipLibrary.instance.canSave &&
      !ChipLibrary.instance.changeSinceLastSave
    )
      return;

    const packObj = Array.from(ChipLibrary.instance.pack).reduce(
      (obj: PackDict, [key, value]) => {
        obj[key] = {
          owned: value.owned.value,
          used: value.used.value,
        };
        return obj;
      },
      {},
    );

    const packString = JSON.stringify(packObj);
    const folderString = JSON.stringify(
      ChipLibrary.convertFolderToObjArr(ChipLibrary.instance.folder),
    );
    const folder2String = JSON.stringify(
      ChipLibrary.convertFolderToObjArr(ChipLibrary.instance.folder2),
    );

    const folderSizeStr = ChipLibrary.FolderSize + "";
    const activeFolderStr = ChipLibrary.instance.activeFolder.value.match({
      Folder1: () => "1",
      Folder2: () => "2",
    });

    localStorage.setItem("folder", folderString);
    localStorage.setItem("folder2", folder2String);
    localStorage.setItem("activeFolder", activeFolderStr);
    localStorage.setItem("pack", packString);
    localStorage.setItem("chipLimit", folderSizeStr);

    ChipLibrary.instance.changeSinceLastSave = false;
  }

  public static convertFolderToObjArr(folder: FolderChipTuple[]): FolderChip[] {
    return folder.map(([name, used]) => {
      return {
        name: name.peek(),
        used: used.peek(),
      };
    });
  }

  public static async exportJSON(): Promise<void> {
    const packObj = Array.from(ChipLibrary.instance.pack).reduce(
      (obj: PackDict, [key, value]) => {
        obj[key] = {
          owned: value.owned.value,
          used: value.used.value,
        };
        return obj;
      },
      {},
    );

    const toSave: importedData = {
      Folder: ChipLibrary.convertFolderToObjArr(ChipLibrary.instance.folder),
      Folder2: ChipLibrary.convertFolderToObjArr(ChipLibrary.instance.folder2),
      Pack: packObj,
      Limit: ChipLibrary.FolderSize,
    };

    const json = JSON.stringify(toSave, null, 4);

    const blob = new Blob([json], { type: "application/json;charset=utf-8" });

    // fallback for browsers that don't support the file picker API
    if (!("showSaveFilePicker" in window)) {
      ChipLibrary.fallbackSaveData(blob);
      return;
    }

    try {
      // @ts-ignore
      const handle = await window.showSaveFilePicker({
        suggestedName: "pack.json",
        types: [
          {
            description: "JSON File",
            accept: { "application/json": [".json"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();

      // user might abort, so we do nothing on error
    } catch (e) {
      console.error(e);
      return;
    }
  }

  private static fallbackSaveData(blob: Blob) {
    const blobUrl = URL.createObjectURL(blob);

    // workaround for blocker that prevents the download from starting
    const a = document.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "a",
    ) as HTMLAnchorElement;
    a.download = "pack.json";
    a.href = blobUrl;
    a.rel = "noopener";

    setTimeout(() => URL.revokeObjectURL(blobUrl), 4e4); //40s
    setTimeout(() => a.click(), 0);
  }

  public static removeChipFromPack(chip: string | number): number {
    const name = typeof chip == "number" ? ChipLibrary.idToName(chip) : chip;

    const packChip =
      ChipLibrary.instance.pack.get(name) ?? throwExpression("Unreachable!");
    packChip.owned.value -= 1;

    if (packChip.used.value > 0) {
      packChip.used.value -= 1;
    }

    if (packChip.owned.value <= 0) {
      ChipLibrary.instance.pack.delete(name);
    }

    ChipLibrary.instance.changeSinceLastSave = true;

    return packChip.owned.value;
  }

  public static removeChipFromFolder(index: number): FolderChipTuple {
    const [[name, used]] = ChipLibrary.ActiveFolder.splice(index, 1);
    ChipLibrary.instance.addToPack(name.value, used.value);

    ChipLibrary.instance.changeSinceLastSave = true;

    return [name, used];
  }

  public static clearFolder(): number {
    const len = ChipLibrary.ActiveFolder.length;
    ChipLibrary.ActiveFolder.forEach(([name, used]) => {
      ChipLibrary.instance.addToPack(name.value, used.value);
    });
    ChipLibrary.ActiveFolder = [];
    ChipLibrary.instance.changeSinceLastSave = true;
    ChipLibrary.folderUpdated();
    return len;
  }

  public static getChip(toGet: string | number): BattleChip {
    const name = typeof toGet == "number" ? ChipLibrary.idToName(toGet) : toGet;
    return (
      ChipLibrary.instance.chips.get(name) ?? throwExpression("Unreachable!")
    );
  }

  public static eraseData(confirm: unknown = true): void {
    if (
      confirm &&
      !window.confirm("Are you sure you want to erase all data?")
    ) {
      return;
    }

    ChipLibrary.instance.folder = [];
    ChipLibrary.instance.folder2 = [];
    ChipLibrary.instance.pack.clear();
    ChipLibrary.instance.folderSize.value = 12;
    ChipLibrary.instance.activeFolder.value = ActiveFolder.Folder1;

    if (storageAvailable("localStorage")) {
      localStorage.removeItem("folder");
      localStorage.removeItem("folder2");
      localStorage.removeItem("activeFolder");
      localStorage.removeItem("pack");
      localStorage.removeItem("chipLimit");
    }

    ChipLibrary.instance.changeSinceLastSave = false;
    ChipLibrary.folderUpdated();
  }

  public static importJson(json: string): void {
    const data: importedData = JSON.parse(json);

    if (typeof data !== "object") {
      throw new TypeError(`Expected object, found ${typeof data}`);
    }

    if (!Array.isArray(data.Folder)) {
      throw new TypeError(`Expected array, found ${typeof data.Folder}`);
    }

    if (data.Folder2 != null && !Array.isArray(data.Folder2)) {
      throw new TypeError(`Expected array, found ${typeof data.Folder2}`);
    }

    if (typeof data.Pack !== "object") {
      throw new TypeError(`Expected object, found ${typeof data.Pack}`);
    }

    if (typeof data.Limit !== "number") {
      throw new TypeError(`Expected number, found ${typeof data.Limit}`);
    }

    ChipLibrary.eraseData(false);

    this.importFolder(data.Folder);

    if (data.Folder2 != null) {
      this.importFolder2(data.Folder2);
    }

    ChipLibrary.instance.folderSize.value = data.Limit;

    this.importPack(data.Pack);

    ChipLibrary.instance.changeSinceLastSave = true;

    ChipLibrary.saveData();
    ChipLibrary.folderUpdated();
  }

  private static importFolder(folder: FolderChip[]): void {
    const folderArr: FolderChipTuple[] = [];

    for (const chip of folder) {
      if (typeof chip.name !== "string") {
        throw new TypeError(`Expected string, found ${typeof chip.name}`);
      }

      if (typeof chip.used !== "boolean") {
        throw new TypeError(`Expected boolean, found ${typeof chip.used}`);
      }

      if (!ChipLibrary.instance.chips.has(chip.name)) {
        alert(
          `${chip.name} no longer exists, you had it marked as ${
            chip.used ? "used" : "unused"
          }`,
        );
      } else {
        folderArr.push([signal(chip.name), signal(chip.used)]);
      }
    }

    ChipLibrary.instance.folder = folderArr;
  }

  private static importFolder2(folder: FolderChip[]): void {
    const folderArr: FolderChipTuple[] = [];

    for (const chip of folder) {
      if (typeof chip.name !== "string") {
        throw new TypeError(`Expected string, found ${typeof chip.name}`);
      }

      if (typeof chip.used !== "boolean") {
        throw new TypeError(`Expected boolean, found ${typeof chip.used}`);
      }

      if (!ChipLibrary.instance.chips.has(chip.name)) {
        alert(
          `${chip.name} no longer exists, you had it marked as ${
            chip.used ? "used" : "unused"
          }`,
        );
      } else {
        folderArr.push([signal(chip.name), signal(chip.used)]);
      }
    }

    ChipLibrary.instance.folder2 = folderArr;
  }

  private static importPack(pack: PackDict): void {
    for (const [chipname, chip] of Object.entries(pack)) {
      if (!ChipLibrary.instance.chips.has(chipname)) {
        alert(
          `${chipname} no longer exists, you owned ${chip.owned} of which you used ${chip.used}`,
        );
        return;
      }

      if (typeof chip.owned !== "number") {
        throw new TypeError(`Expected number, found ${typeof chip.owned}`);
      }

      if (typeof chip.used !== "number") {
        throw new TypeError(`Expected number, found ${typeof chip.used}`);
      }

      ChipLibrary.instance.pack.set(chipname, {
        owned: signal(chip.owned),
        used: signal(chip.used),
      });
    }
  }

  /**
   * marks all chips as unused
   *
   * @returns {number} number of chips that have been marked as unused
   */
  public static jackOut(): number {
    let usedCt = 0;

    batch(() => {
      for (const chip of ChipLibrary.instance.folder) {
        usedCt += chip[1].value ? 1 : 0;
        chip[1].value = false;
      }

      for (const chip of ChipLibrary.instance.folder2) {
        usedCt += chip[1].value ? 1 : 0;
        chip[1].value = false;
      }

      for (const [_, chip] of ChipLibrary.instance.pack) {
        usedCt += chip.used.value;
        chip.used.value = 0;
      }

      ChipLibrary.instance.changeSinceLastSave = true;
      ChipLibrary.folderUpdated();
    });

    return usedCt;
  }

  private static ActiveFolderAsGroupTuple(): GroupFolderChipTuple[] {
    return ChipLibrary.instance.folder.map((chip) => [
      chip[0].peek(),
      chip[1].peek(),
    ]);
  }

  public static joinGroup(group: string, name: string, spectate = false): void {
    ChipLibrary.groupWorker.value = new Worker(
      new URL("../groups/folderGroups.ts", import.meta.url),
      { type: "module" },
    );

    const eventKind = spectate ? "spectate" : "ready";

    type ReadyMsg = ["ready"];
    type UpdatedMsg = ["updated", [string, GroupFolderChipTuple[]][]];
    type ErrorMsg = ["error", string];
    type ClosedMsg = ["closed"];

    type Msg = ReadyMsg | UpdatedMsg | ErrorMsg | ClosedMsg;

    ChipLibrary.groupWorker.value.onmessage = (e: MessageEvent<Msg>) => {
      switch (e.data[0]) {
        case "error":
          ChipLibrary.groupWorker.value?.terminate();
          ChipLibrary.groupWorker.value = null;
          ChipLibrary.groupFolders.value = null;
          throw new Error(e.data[1]);
        case "ready":
          ChipLibrary.groupWorker.value?.postMessage([
            eventKind,
            ChipLibrary.ActiveFolderAsGroupTuple(),
          ]);
          break;
        case "updated":
          if (import.meta.env.DEV) {
            console.debug(`${e.data[1].length} chips updated`);
          }

          ChipLibrary.groupFolders.value = e.data[1];
          break;
        case "closed":
          ChipLibrary.groupWorker.value?.terminate();
          ChipLibrary.groupWorker.value = null;
          ChipLibrary.groupFolders.value = null;
      }
    };
    ChipLibrary.groupWorker.value.postMessage([
      "connect",
      { group: group, name: name },
    ]);
  }

  public static leaveGroup(): void {
    ChipLibrary.groupWorker.value?.postMessage(["disconnect"]);
  }

  public static folderUpdated(): void {
    ChipLibrary.instance.changeSinceLastSave = true;
    if (!ChipLibrary.groupWorker) {
      return;
    }
    ChipLibrary.groupWorker.value?.postMessage([
      "update",
      ChipLibrary.ActiveFolderAsGroupTuple(),
    ]);
  }

  /**
   *
   * @param {string | number} chip the name or id of the chip to add
   *
   * @returns the number of copies of the chip you now have in your pack, and the name of the chip
   */
  public static addChipToPack(
    chip: string | number,
    used = false,
  ): [number, string] {
    const chipName =
      typeof chip == "string" ? chip : ChipLibrary.idToName(chip);

    ChipLibrary.instance.changeSinceLastSave = true;

    return [ChipLibrary.instance.addToPack(chipName, used), chipName];
  }

  public static markChipUnused(chip: string | number): void {
    const chipName =
      typeof chip == "string" ? chip : ChipLibrary.idToName(chip);
    const chipData = ChipLibrary.instance.pack.get(chipName);
    if (chipData && chipData.used.value > 0) {
      chipData.used.value -= 1;
    }
  }

  public static idToName(toGet: number): string {
    return (
      ChipLibrary.instance.idMap.get(toGet) ??
      throwExpression("No chip with that ID")
    );
  }

  public static values(): IterableIterator<BattleChip> {
    return ChipLibrary.instance.chips.values();
  }

  public static iter(): IterableIterator<[string, BattleChip]> {
    return ChipLibrary.instance.chips.entries();
  }

  public static array(): BattleChip[] {
    return [...ChipLibrary.instance.chips.values()];
  }

  public static get Size(): number {
    return ChipLibrary.instance.chips.size;
  }

  public static get Pack(): [string, SignaledPackChip][] {
    return [...ChipLibrary.instance.pack.entries()];
  }

  public static get PackLength(): number {
    return ChipLibrary.instance.pack.size;
  }

  public static get Folder(): FolderChipTuple[] {
    return ChipLibrary.instance.folder;
  }

  public static get Folder2(): FolderChipTuple[] {
    return ChipLibrary.instance.folder2;
  }

  public static get ActiveFolder(): FolderChipTuple[] {
    return ChipLibrary.instance.activeFolder.value.match({
      Folder1: () => ChipLibrary.instance.folder,
      Folder2: () => ChipLibrary.instance.folder2,
    });
  }

  private static set ActiveFolder(val: FolderChipTuple[]) {
    ChipLibrary.instance.activeFolder.value.match({
      Folder1: () => (ChipLibrary.instance.folder = val),
      Folder2: () => (ChipLibrary.instance.folder2 = val),
    });
  }

  public static get FolderName(): "Folder1" | "Folder2" {
    return ChipLibrary.instance.activeFolder.value.variant;
  }

  public static get FolderSize(): number {
    return ChipLibrary.instance.folderSize.value;
  }

  /**
   * Will not go below 12 or above 30, and will not go below the current folder size
   */
  public static set FolderSize(val: number) {
    if (val < ChipLibrary.Folder.length || val < ChipLibrary.Folder2.length) {
      return;
    } else if (val < 12) {
      ChipLibrary.instance.folderSize.value = 12;
    } else if (val > 30) {
      ChipLibrary.instance.folderSize.value = 30;
    } else {
      ChipLibrary.instance.folderSize.value = val;
    }

    ChipLibrary.instance.changeSinceLastSave = true;
  }

  public static get MinFolderSize(): number {
    return Math.max(ChipLibrary.Folder.length, ChipLibrary.Folder2.length);
  }

  public static get InGroup(): boolean {
    return !!ChipLibrary.groupWorker.value;
  }

  public static get GroupFolders(): ReadonlyArray<
    [string, GroupFolderChipTuple[]]
  > | null {
    return ChipLibrary.groupFolders.value;
  }

  public static get ChangeSinceLastSave(): boolean {
    return ChipLibrary.instance.changeSinceLastSave;
  }
}
