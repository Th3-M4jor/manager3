import { storageAvailable } from "../util/storageavailable";
import { BattleChip, ChipData } from "./battlechip";
import { saveAs } from "file-saver";

import m from "mithril";

import { throwExpression } from "../util/throwExpression";
export interface FolderChip {
    name: string,
    used: boolean,
}

export type chipName = string;
export type chipUsed = boolean;

export type FolderChipTuple = [chipName, chipUsed];
interface PackChip {
    owned: number,
    used: number,
}

type PackDict = { [index: string]: PackChip };

interface importedData {
    Folder: FolderChip[],
    Pack: PackDict,
    Limit: number
}

export class ChipLibrary {
    public static readonly instance = new ChipLibrary();

    private static groupWorker: Worker | null = null;

    private static groupFolders: [string, FolderChipTuple[]][] | null = null ;

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
    private pack: Map<string, PackChip> = new Map();

    /**
     * An array that holds all chips in your folder
     */
    private folder: FolderChipTuple[] = [];

    /**
     * The max number of chips allowed in a folder
     */
    private folderSize = 12;

    private changeSinceLastSave = false;

    public static initFromChips(data: BattleChip[]): number {
        ChipLibrary.instance.chips.clear();
        ChipLibrary.instance.idMap.clear();

        data.forEach((chip) => {
            ChipLibrary.instance.idMap.set(chip.id, chip.name);
            ChipLibrary.instance.chips.set(chip.name, chip);
        });

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
        if (storageAvailable('localStorage')) {

            try {
                ChipLibrary.instance.loadFolder();
                ChipLibrary.instance.loadPack();
                //console.log(`Folder: ${ChipLibrary.instance.folder.length}\nPack: ${ChipLibrary.instance.pack.size}`);
            } catch (e) {
                alert(`There was an error loading your save data ${(e as Error).message}, clearing data`);
                window.localStorage.removeItem('folder');
                window.localStorage.removeItem('pack');
                window.localStorage.removeItem('chipLimit');
                ChipLibrary.instance.folder = [];
                ChipLibrary.instance.folderSize = 12;
                ChipLibrary.instance.pack = new Map();
            }

            //save chips every 5 minutes
            setInterval(() => {
                ChipLibrary.saveData();
            }, 5 * 60 * 1000);

        } else {
            alert("Local storage is not available, it is used to backup your folder and pack periodically");
        }
    }

    private validateFolderChipAndPush(chip: FolderChip) {
        if (typeof (chip?.name) !== "string" || typeof (chip?.used) !== "boolean") {
            throw new Error(`Found an invalid folderchip`);
        }

        const fldrChip: FolderChipTuple = [chip.name, chip.used];

        this.folder.push(fldrChip);

    }

    private loadFolder(): number {

        const folder = window.localStorage.getItem('folder');
        const chipLimit = window.localStorage.getItem('chipLimit');
        if (chipLimit && +chipLimit > 0) {
            this.folderSize = +chipLimit;
        }

        if (!folder) {
            return 0;
        }

        const oldFolder: FolderChip[] = JSON.parse(folder);

        if (!Array.isArray(oldFolder)) {
            throw new TypeError(`Expected array, found ${typeof (oldFolder)}`);
        }

        for (const chip of oldFolder) {
            if (this.chips.has(chip?.name)) {
                this.validateFolderChipAndPush(chip);
            } else {
                alert(`The chip ${chip?.name} no longer exists in the library, cannot add it to your folder, you had it marked as ${chip?.used ? "used" : "unused"}`);
            }
        }

        if (this.folder.length > this.folderSize) {
            throw new Error("Folder too big");
        }

        return this.folder.length;
    }

    /**
     * 
     * @param {string} name assumed to already be a valid name for a chip
     * @param {PackChip} chip
     * 
     * @throws if the shape of `chip` is incorrect
     */
    private validateAndAddToPack(name: string, chip: PackChip) {

        if (typeof (chip?.owned) !== "number" || typeof (chip?.used) !== "number" || chip.owned < chip.used) {
            throw new TypeError(`Found an invalid pack chip, ${name}`);
        }

        const data = {
            owned: chip.owned,
            used: chip.used,
        };

        this.pack.set(name, data);

    }

    private loadPack(): number {
        const pack = window.localStorage.getItem('pack');
        if (!pack) {
            return 0;
        }

        const oldPack: PackDict = JSON.parse(pack);

        if (typeof (oldPack) !== "object") {
            throw new TypeError(`Expected object, found ${typeof (oldPack)}`);
        }

        for (const k in oldPack) {
            if (this.chips.has(k)) {
                this.validateAndAddToPack(k, oldPack[k]);
            } else {
                alert(`The chip ${k} no longer exists in the library, cannot add it to your pack. You owned ${oldPack[k]?.owned}, of which ${oldPack[k]?.used} were marked as used`);
            }
        }
        return this.pack.size;
    }

    private addToPack(chipName: string, used = false): number {
        const packChip = this.pack.get(chipName);

        if (packChip) {
            packChip.owned += 1;
            packChip.used += (used ? 1 : 0);
            return packChip.owned;
        } else {
            const chip = {
                owned: 1,
                used: (used ? 1 : 0),
            }
            this.pack.set(chipName, chip);
            return 1;
        }

    }

    public static addToFolder(chip: string | number): string | null {
        const chipName = typeof (chip) === "string" ? chip : ChipLibrary.instance.idMap.get(chip);
        if (!chipName) throw new Error("Inconcievable!");

        const packChip = ChipLibrary.instance.pack.get(chipName) ?? throwExpression("Inconcievable!");

        const libChip = ChipLibrary.instance.chips.get(chipName) ?? throwExpression("Inconcievable!");

        const copyCt = ChipLibrary.Folder.reduce((ct, [name, _]) => {
            if (name === chipName) {
                return ct + 1;
            }
            return ct;
        }, 0);

        const maxInFolder = libChip.MaxInFldr;

        if (copyCt >= maxInFolder) {
            alert(`You already have ${maxInFolder} ${maxInFolder == 1 ? "copy" : "copies"} of ${chipName} in your folder`);
        }

        if (packChip.used >= packChip.owned) {
            alert(`You have already used all of your ${chipName} chips`);
            return null;
        }

        if (packChip.owned == 1) {
            ChipLibrary.instance.pack.delete(chipName);
            ChipLibrary.Folder.push([chipName, false]);
        } else {
            packChip.owned -= 1;
            ChipLibrary.Folder.push([chipName, false]);
        }

        ChipLibrary.folderUpdated();

        return chipName;
    }

    public static saveData(): void {
        if (!storageAvailable('localStorage') || !ChipLibrary.instance.changeSinceLastSave) return;

        const packObj = Array.from(ChipLibrary.instance.pack).reduce((obj: PackDict, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {})

        const packString = JSON.stringify(packObj);
        const folderString = JSON.stringify(ChipLibrary.convertFolderToObjArr());
        const folderSizeStr = ChipLibrary.FolderSize + "";


        window.localStorage.setItem('folder', folderString);
        window.localStorage.setItem('pack', packString);
        window.localStorage.setItem('chipLimit', folderSizeStr);

        ChipLibrary.instance.changeSinceLastSave = false;

    }

    public static convertFolderToObjArr(): FolderChip[] {
        return ChipLibrary.instance.folder.map((fldrChip) => {
            return {
                name: fldrChip[0],
                used: fldrChip[1],
            }
        });
    }

    public static exportJSON(): void {
        const packObj = Array.from(ChipLibrary.instance.pack).reduce((obj: PackDict, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});

        const toSave: importedData = {
            Folder: ChipLibrary.convertFolderToObjArr(),
            Pack: packObj,
            Limit: ChipLibrary.FolderSize,
        }

        const json = JSON.stringify(toSave, null, 4);

        const blob = new Blob([json], { type: "application/json;charset=utf-8" });

        saveAs(blob, "pack.json");
    }

    public static removeChipFromPack(chip: string | number): number {

        const name = typeof (chip) == "number" ? ChipLibrary.idToName(chip) : chip;

        const packChip = ChipLibrary.instance.pack.get(name) ?? throwExpression("Unreachable!");
        packChip.owned -= 1;

        if (packChip.used > 0) {
            packChip.used -= 1;
        }

        if (packChip.owned <= 0) {
            ChipLibrary.instance.pack.delete(name);
        }

        ChipLibrary.instance.changeSinceLastSave = true;

        return packChip.owned;
    }

    public static removeChipFromFolder(index: number): FolderChipTuple {
        const [chip] = ChipLibrary.instance.folder.splice(index, 1);
        ChipLibrary.instance.addToPack(chip[0], chip[1]);

        ChipLibrary.instance.changeSinceLastSave = true;

        return chip;
    }

    public static clearFolder(): number {
        const len = ChipLibrary.instance.folder.length;
        ChipLibrary.instance.folder.forEach(([name, used]) => {
            ChipLibrary.instance.addToPack(name, used);
        });
        ChipLibrary.instance.folder = [];
        ChipLibrary.instance.changeSinceLastSave = true;
        ChipLibrary.folderUpdated();
        return len;
    }

    public static getChip(toGet: string | number): BattleChip {
        const name = typeof (toGet) == "number" ? ChipLibrary.idToName(toGet) : toGet;
        return ChipLibrary.instance.chips.get(name) ?? throwExpression("Unreachable!");
    }

    public static eraseData(confirm = true): void {

        if (confirm && !window.confirm("Are you sure you want to erase all data?")) {
            return;
        }

        ChipLibrary.instance.folder = [];
        ChipLibrary.instance.pack.clear();
        ChipLibrary.instance.folderSize = 12;

        if (storageAvailable('localStorage')) {
            window.localStorage.removeItem('folder');
            window.localStorage.removeItem('pack');
            window.localStorage.removeItem('chipLimit');
        }

        ChipLibrary.instance.changeSinceLastSave = false;
        ChipLibrary.folderUpdated();

    }

    public static importJson(json: string): void {
        const data: importedData = JSON.parse(json);

        if (typeof (data) !== "object") {
            throw new TypeError(`Expected object, found ${typeof (data)}`);
        }

        if (!Array.isArray(data.Folder)) {
            throw new TypeError(`Expected array, found ${typeof (data.Folder)}`);
        }

        if (typeof (data.Pack) !== "object") {
            throw new TypeError(`Expected object, found ${typeof (data.Pack)}`);
        }

        if (typeof (data.Limit) !== "number") {
            throw new TypeError(`Expected number, found ${typeof (data.Limit)}`);
        }

        ChipLibrary.eraseData(false);

        data.Folder.forEach(chip => {
            if (typeof (chip.name) !== "string") {
                throw new TypeError(`Expected string, found ${typeof (chip.name)}`);
            }

            if (typeof (chip.used) !== "boolean") {
                throw new TypeError(`Expected boolean, found ${typeof (chip.used)}`);
            }

            if (!ChipLibrary.instance.chips.has(chip.name)) {
                alert(`${chip.name} no longer exists, you had it marked as ${chip.used ? "used" : "unused"}`);
            } else {
                ChipLibrary.instance.folder.push([chip.name, chip.used]);
            }
        });

        ChipLibrary.instance.folderSize = data.Limit;

        Object.entries(data.Pack).forEach(([chipname, chip]) => {
            if (!ChipLibrary.instance.chips.has(chipname)) {
                alert(`${chipname} no longer exists, you owned ${chip.owned} of which you used ${chip.used}`);
                return;
            }

            if (typeof (chip.owned) !== "number") {
                throw new TypeError(`Expected number, found ${typeof (chip.owned)}`);
            }

            if (typeof (chip.used) !== "number") {
                throw new TypeError(`Expected number, found ${typeof (chip.used)}`);
            }

            ChipLibrary.instance.pack.set(chipname, chip);
        });

        ChipLibrary.instance.changeSinceLastSave = true;

        ChipLibrary.saveData();
        ChipLibrary.folderUpdated();
    }

    /**
     * marks all chips as unused
     * 
     * @returns {number} number of chips that have been marked as unused
     */
    public static jackOut(): number {
        let usedCt = 0;

        for (const chip of ChipLibrary.instance.folder) {
            usedCt += chip[1] ? 1 : 0;
            chip[1] = false;
        }

        for (const [_, chip] of ChipLibrary.instance.pack) {
            usedCt += chip.used;
            chip.used = 0;
        }

        ChipLibrary.instance.changeSinceLastSave = true;
        ChipLibrary.folderUpdated();

        return usedCt;
    }

    public static joinGroup(group: string, name: string): void {
        ChipLibrary.groupWorker = new Worker(new URL('../groups/folderGroups.ts', import.meta.url), { type: 'module' });
        ChipLibrary.groupWorker.onmessage = (e) => {

            const [msg, data] = e.data;

            switch (msg) {
                case "error":
                    ChipLibrary.groupWorker?.terminate();
                    ChipLibrary.groupWorker = null;
                    ChipLibrary.groupFolders = null;
                    m.redraw();
                    throw new Error(data);
                case "ready":
                    ChipLibrary.groupWorker?.postMessage(["ready", ChipLibrary.Folder]);
                    break;
                case "updated":

                    // eslint-disable-next-line
                    console.debug(`${data.length} chips updated`);

                    ChipLibrary.groupFolders = data;
                    m.redraw();
                    break;
                case "closed":
                    ChipLibrary.groupWorker?.terminate();
                    ChipLibrary.groupWorker = null;
                    ChipLibrary.groupFolders = null;
                    m.redraw();
            }
        }
        ChipLibrary.groupWorker.postMessage(["connect", { group: group, name: name }]);
    }

    public static leaveGroup(): void {
        ChipLibrary.groupWorker?.postMessage(["disconnect"]);
    }

    public static folderUpdated(): void {
        if (!ChipLibrary.groupWorker) {
            return;
        }
        ChipLibrary.groupWorker.postMessage(["update", ChipLibrary.Folder]);
    }

    /**
     * 
     * @param {string | number} chip the name or id of the chip to add
     * 
     * @returns the number of copies of the chip you now have in your pack, and the name of the chip
     */
    public static addChipToPack(chip: string | number, used = false): [number, string] {
        const chipName = typeof (chip) == "string" ? chip : ChipLibrary.idToName(chip);

        ChipLibrary.instance.changeSinceLastSave = true;

        return [ChipLibrary.instance.addToPack(chipName, used), chipName];
    }

    public static markChipUnused(chip: string | number): void {
        const chipName = typeof (chip) == "string" ? chip : ChipLibrary.idToName(chip);
        const chipData = ChipLibrary.instance.pack.get(chipName);
        if (chipData && chipData.used > 0) {
            chipData.used -= 1;
        }
    }

    public static idToName(toGet: number): string {
        return ChipLibrary.instance.idMap.get(toGet) ?? throwExpression("No chip with that ID");
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

    public static get Pack(): [string, PackChip][] {
        return [...ChipLibrary.instance.pack.entries()]
    }

    public static get PackLength(): number {
        return ChipLibrary.instance.pack.size;
    }

    public static get Folder(): FolderChipTuple[] {
        return ChipLibrary.instance.folder;
    }

    public static get FolderSize(): number {
        return ChipLibrary.instance.folderSize;
    }

    /**
     * Will not go below 12 or above 30, and will not go below the current folder size
     */
    public static set FolderSize(val: number) {
        if (val < ChipLibrary.Folder.length) {
            return;
        } else if (val < 12) {
            ChipLibrary.instance.folderSize = 12;
        } else if (val > 30) {
            ChipLibrary.instance.folderSize = 30;
        } else {
            ChipLibrary.instance.folderSize = val;
        }

        ChipLibrary.instance.changeSinceLastSave = true;
    }

    public static get InGroup(): boolean {
        return !!ChipLibrary.groupWorker;
    }

    public static get GroupFolders(): [string, FolderChipTuple[]][] | null {
        return ChipLibrary.groupFolders;
    }

}