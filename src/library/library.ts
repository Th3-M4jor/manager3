import { BattleChip, ChipData } from "./battlechip";
import { storageAvailable } from "../util/storageavailable";
interface FolderChip {
    name: string,
    used: boolean,
}
interface PackChip {
    owned: number,
    used: number,
}



export class ChipLibrary {
    public static readonly instance = new ChipLibrary();
    private chips: Map<string, BattleChip> = new Map();
    private idMap: Map<number, string> = new Map();
    private pack: Map<string, PackChip> = new Map();
    private folder: FolderChip[] = [];
    private folderSize: number = 12;

    public static init(data: ChipData[]): number {
        ChipLibrary.instance.chips.clear();
        ChipLibrary.instance.idMap.clear();

        data.forEach((chipData, idx) => {
            //increment so that id's start at 1
            let chip = new BattleChip(idx + 1, chipData);
            ChipLibrary.instance.idMap.set(idx + 1, chip.name);
            ChipLibrary.instance.chips.set(chip.name, chip);
        });

        if (storageAvailable('localStorage')) {

            try {
                ChipLibrary.instance.loadFolder();
                ChipLibrary.instance.loadPack();
            } catch (e) {
                alert("There was an error loading your save data, clearing data");
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

        return ChipLibrary.instance.chips.size;
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
        for (let chip of oldFolder) {
            if (this.chips.has(chip.name)) {
                this.folder.push(chip);
            } else {
                alert(`The chip ${chip.name} no longer exists in the library, cannot add it to your folder, you had it marked as ${chip.used ? "used" : "unused"}`);
            }
        }

        if (this.folder.length >= this.folderSize) {
            throw new Error("Folder too big");
        }

        return this.folder.length;
    }

    private loadPack(): number {
        let pack = window.localStorage.getItem('pack');
        if (!pack) {
            return 0;
        }
        let oldPack = JSON.parse(pack);
        if (typeof (oldPack) !== "object") {
            throw new TypeError(`Expected object, found ${typeof(oldPack)}`);
        }

        for(let k in oldPack) {
            if(this.chips.has(k)) {
                this.pack.set(k, {owned: oldPack[k].owned, used: oldPack[k].used});
            } else {
                alert(`The chip ${k} no longer exists in the library, cannot add it to your pack. You owned ${oldPack[k].owned}, of which ${oldPack[k].used} were marked as used`);
            }
        }
        return this.pack.size;
    }

    public static getChip(toGet: string | number): BattleChip {

        if (typeof (toGet) == "number") {
            let name = this.instance.idMap.get(toGet)!;
            return this.instance.chips.get(name)!;
        } else {
            return this.instance.chips.get(toGet)!;
        }

    }

    public static idToName(toGet: number): string {
        return this.instance.idMap.get(toGet)!;
    }

    public static values() {
        return this.instance.chips.values();
    }

    public static iter() {
        return this.instance.chips.entries();
    }

    public static array(): BattleChip[] {
        return [...this.instance.chips.values()];
    }

    public static get size() {
        return this.instance.chips.size;
    }

}