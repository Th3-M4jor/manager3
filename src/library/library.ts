import { storageAvailable } from "../util/storageavailable";
import { BattleChip, ChipData } from "./battlechip";

import {throwExpression} from "../util/throwExpression";
interface FolderChip {
    name: string,
    used: boolean,
}
interface PackChip {
    owned: number,
    used: number,
}

type PackDict = { [index: string]: PackChip };


export class ChipLibrary {
    public static readonly instance = new ChipLibrary();

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
    private folder: FolderChip[] = [];

    /**
     * The max number of chips allowed in a folder
     */
    private folderSize: number = 12;

    public static initFromChips(data: BattleChip[]): number {
        ChipLibrary.instance.chips.clear();
        ChipLibrary.instance.idMap.clear();

        data.forEach((chip) => {
            ChipLibrary.instance.idMap.set(chip.id, chip.name);
            ChipLibrary.instance.chips.set(chip.name, chip);
        });

        this.loadSaveData();

        return ChipLibrary.instance.chips.size;
    }

    public static init(data: ChipData[]): number {
        ChipLibrary.instance.chips.clear();
        ChipLibrary.instance.idMap.clear();

        data.forEach((chipData) => {
            let chip = new BattleChip(chipData);
            ChipLibrary.instance.idMap.set(chip.id, chip.name);
            ChipLibrary.instance.chips.set(chip.name, chip);
        });

        this.loadSaveData();

        return ChipLibrary.instance.chips.size;
    }

    private static loadSaveData() {
        if (storageAvailable('localStorage')) {

            try {
                ChipLibrary.instance.loadFolder();
                ChipLibrary.instance.loadPack();
                console.log(`Folder: ${ChipLibrary.instance.folder.length}\nPack: ${ChipLibrary.instance.pack.size}`);
            } catch (e) {
                alert(`There was an error loading your save data ${(e as Error).message}, clearing data`);
                window.localStorage.removeItem('folder');
                window.localStorage.removeItem('pack');
                window.localStorage.removeItem('chipLimit');
                ChipLibrary.instance.folder = [];
                ChipLibrary.instance.folderSize = 12;
                ChipLibrary.instance.pack = new Map();
            }

        } else {
            alert("Local storage is not available, it is used to backup your folder and pack periodically");
        }
    }

    private validateFolderChipAndPush(chip: FolderChip) {
        if(typeof(chip?.name) !== "string" || typeof(chip?.used) !== "boolean") {
            throw new Error(`Found an invalid folderchip`);
        }

        let fldrChip: FolderChip = {
            name: chip.name,
            used: chip.used,
        }

        this.folder.push(fldrChip);

    }

    private loadFolder(): number {

        let folder = window.localStorage.getItem('folder');
        let chipLimit = window.localStorage.getItem('chipLimit');
        if (chipLimit && +chipLimit > 0) {
            this.folderSize = +chipLimit;
        }

        if (!folder) {
            return 0;
        }

        let oldFolder: FolderChip[] = JSON.parse(folder);

        if(!Array.isArray(oldFolder)) {
            throw new TypeError(`Expected array, found ${typeof (oldFolder)}`);
        }

        for (let chip of oldFolder) {
            if (this.chips.has(chip?.name)) {
                this.validateFolderChipAndPush(chip);
            } else {
                alert(`The chip ${chip?.name} no longer exists in the library, cannot add it to your folder, you had it marked as ${chip?.used ? "used" : "unused"}`);
            }
        }

        if (this.folder.length >= this.folderSize) {
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

        if(typeof (chip?.owned) !== "number" || typeof (chip?.used) !== "number" || chip.owned < chip.used) {
            throw new TypeError(`Found an invalid pack chip, ${name}`);
        }

        let data = {
            owned: chip.owned,
            used: chip.used,
        };

        this.pack.set(name, data);

    }

    private loadPack(): number {
        let pack = window.localStorage.getItem('pack');
        if (!pack) {
            return 0;
        }
        
        let oldPack: PackDict = JSON.parse(pack);
        
        if (typeof (oldPack) !== "object") {
            throw new TypeError(`Expected object, found ${typeof (oldPack)}`);
        }

        for (let k in oldPack) {
            if (this.chips.has(k)) {
                this.validateAndAddToPack(k, oldPack[k]);
            } else {
                alert(`The chip ${k} no longer exists in the library, cannot add it to your pack. You owned ${oldPack[k]?.owned}, of which ${oldPack[k]?.used} were marked as used`);
            }
        }
        return this.pack.size;
    }

    private addToPack(chipName: string, used: boolean = false): number {
        let packChip = this.pack.get(chipName);

        if(packChip) {
            packChip.owned += 1;
            packChip.used += (used ? 1 : 0);
            return packChip.owned;
        } else {
            let chip = {
                owned: 1,
                used: (used ? 1 : 0),
            }
            this.pack.set(chipName, chip);
            return 1;
        }

    }

    public static saveData() {
        if(!storageAvailable('localStorage')) return;

        let packObj = Array.from(ChipLibrary.instance.pack).reduce((obj: PackDict, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {})

        let packString = JSON.stringify(packObj);
        let folderString = JSON.stringify(ChipLibrary.instance.folder);
        let folderSizeStr = this.FolderSize + "";

        
        window.localStorage.setItem('folder', folderString);
        window.localStorage.setItem('pack', packString);
        window.localStorage.setItem('chipLimit', folderSizeStr);

    }

    public static removeChipFromPack(chip: string | number): number {

        let name = typeof(chip) == "number" ? this.idToName(chip) : chip;

        let packChip = ChipLibrary.instance.pack.get(name) ?? throwExpression("Unreachable!");
        packChip.owned -= 1;

        if(packChip.used > 0) {
            packChip.used -= 1;
        }

        if(packChip.owned <= 0) {
            ChipLibrary.instance.pack.delete(name);
        }

        return packChip.owned;
    }

    public static getChip(toGet: string | number): BattleChip {
        let name = typeof(toGet) == "number" ? this.idToName(toGet) : toGet;
        return ChipLibrary.instance.chips.get(name) ?? throwExpression("Unreachable!");
    }

    public static eraseData() {
        ChipLibrary.instance.folder = [];
        ChipLibrary.instance.pack.clear();
        ChipLibrary.instance.folderSize = 12;

        if(storageAvailable('localStorage')) {
            window.localStorage.removeItem('folder');
            window.localStorage.removeItem('pack');
            window.localStorage.removeItem('chipLimit');
        }

    }

    /**
     * marks all chips as unused
     * 
     * @returns {number} number of chips that have been marked as unused
     */
    public static jackOut(): number {
        let usedCt = 0;
        
        for(let chip of ChipLibrary.instance.folder) {
            usedCt += chip.used ? 1 : 0;
            chip.used = false;
        }

        for(let [_, chip] of ChipLibrary.instance.pack) {
            usedCt += chip.used;
            chip.used = 0;
        }

        return usedCt;
    }

    /**
     * 
     * @param {string | number} chip the name or id of the chip to add
     * 
     * @returns the number of copies of the chip you now have in your pack, and the name of the chip
     */
    public static addChipToPack(chip: string | number, used: boolean = false): [number, string] {
        let chipName = typeof(chip) == "string" ? chip : this.idToName(chip);
        return [ChipLibrary.instance.addToPack(chipName, used), chipName];
    }

    public static idToName(toGet: number): string {
        return ChipLibrary.instance.idMap.get(toGet) ?? throwExpression("No chip with that ID");
    }

    public static values() {
        return ChipLibrary.instance.chips.values();
    }

    public static iter() {
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

    public static get Folder(): FolderChip[] {
        return ChipLibrary.instance.folder;
    }

    public static get FolderSize() {
        return ChipLibrary.instance.folderSize;
    }

    /**
     * Will not go below 12 or above 30
     */
    public static set FolderSize(val: number) {
        if(val < 12) {
            ChipLibrary.instance.folderSize = 12;
        } else if(val > 30) {
            ChipLibrary.instance.folderSize = 30;
        } else {
            ChipLibrary.instance.folderSize = val;
        }
    }

}