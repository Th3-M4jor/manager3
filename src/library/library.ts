import {BattleChip, ChipData} from "./battlechip";


export class ChipLibrary {
    public static readonly instance = new ChipLibrary();
    private chips: Map<string, BattleChip> = new Map();
    private idMap: Map<number, string> = new Map();

    public static init(data: ChipData[]): number {
        ChipLibrary.instance.chips.clear();
        ChipLibrary.instance.idMap.clear();
        
        data.forEach((chipData, idx) => {
            let chip = new BattleChip(idx, chipData);
            ChipLibrary.instance.idMap.set(idx, chip.name);
            ChipLibrary.instance.chips.set(chip.name, chip);
        });

        return ChipLibrary.instance.chips.size;
    }

    public static getChip(toGet: string | number): BattleChip {
        
        if(typeof(toGet) == "number") {
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

    public static get size() {
        return this.instance.chips.size;
    }

}