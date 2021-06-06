import {Element, elementFromStr, elementArrToHtml} from "./elements";
import {Range, rangeFromStr} from "./ranges";
import {ChipClass, ChipType, chipClassFromStr, chipTypeFromStr, chipClassToSortNum, chipTypeToSortNum, chipTypeToShortStr, chipClassMaxInFolder, chipClassToCss, chipClassToBackgroundCss} from "./chipkind";
import {Skill, skillFromStr, skillToShortStr} from "./skills";

export interface ChipData {
    Name: string,
    Element: string[],
    Range: string,
    Damage: string,
    Class: string,
    Type: string,
    Hits: string,
    Description: string,
    Skills: string[],
}

const damageRegex = /(\d+)d(\d+)/;

export class BattleChip {

    public readonly name: string;
    public readonly id: number;
    public readonly element: Element[];
    public readonly range: Range;
    public readonly class: ChipClass;
    public readonly classSortPos: number;
    public readonly kind: ChipType;
    public readonly kindSortPos: number;
    public readonly hits: string;
    public readonly description: string;
    public readonly damage: string;
    public readonly skills: Skill[];
    private avgDmg: number | undefined;
    private maxDmg: number | undefined;

    constructor(id: number, data: ChipData) {
        this.id = id | 0; //or with zero to ensure it's an int, not a number
        this.name = data.Name;
        this.element = data.Element.map(e => elementFromStr(e));
        this.skills = data.Skills.map(e => skillFromStr(e));
        this.range = rangeFromStr(data.Range);
        this.class = chipClassFromStr(data.Class);
        this.kind = chipTypeFromStr(data.Type);
        this.classSortPos = chipClassToSortNum(this.class);
        this.kindSortPos = chipTypeToSortNum(this.kind);
        this.hits = data.Hits;
        this.description = data.Description;
        this.damage = data.Damage;
    }

    get Skill(): Skill {
        return this.skills.length == 1 ? this.skills[0] : Skill.Varies;
    }

    get SkillAbv(): string {
        return skillToShortStr(this.skills[0]);
    }

    get RangeAbv(): string {
        return this.range.variant;
    }

    get classCss(): string {
        return chipClassToCss(this.class);
    }

    get backgroundCss(): string {
        return chipClassToBackgroundCss(this.class);
    }

    get AvgDmg(): number {
        return this.avgDmg ?? this.calcDmgVals()[1];
    }

    get MaxDmg(): number {
        return this.maxDmg ?? this.calcDmgVals()[0];
    }

    renderElements() : JSX.Element {
        return elementArrToHtml(this.element);
    }

    /**
     * First number returned is max damage, second is average damage
     */
    private calcDmgVals(): [number, number] {
        let dice = damageRegex.exec(this.damage);
        if(!dice) {
            this.avgDmg = 0;
            this.maxDmg = 0;
            return [0, 0];
        }

        this.avgDmg = Math.floor(((+dice[2] / 2) + 0.5) * (+dice[1]));
        this.maxDmg = +dice[2] * +dice[1];
        return [this.maxDmg, this.avgDmg];
    }
}