import {Element, elementFromStr} from "./elements";
import {Range, rangeFromStr} from "./ranges";
import {ChipClass, ChipType, chipClassFromStr, chipTypeFromStr} from "./chipkind";
import {Skill, skillFromStr} from "./skills";

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


export class BattleChip {

    public readonly name: string;
    public readonly element: Element[];
    public readonly range: Range;
    public readonly class: ChipClass;
    public readonly kind: ChipType;
    public readonly hits: string;
    public readonly description: string;
    public readonly damage: string;
    public readonly skills: Skill[];

    get skill(): Skill {
        return this.skills.length == 1 ? this.skills[0] : Skill.Varies;
    }

    constructor(data: ChipData) {
        this.name = data.Name;
        this.element = data.Element.map(e => elementFromStr(e));
        this.skills = data.Skills.map(e => skillFromStr(e));
        this.range = rangeFromStr(data.Range);
        this.class = chipClassFromStr(data.Class);
        this.kind = chipTypeFromStr(data.Type);
        this.hits = data.Hits;
        this.description = data.Description;
        this.damage = data.Damage;
    }
}