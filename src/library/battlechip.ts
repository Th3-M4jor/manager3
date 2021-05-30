import {Element, elementFromStr, elementArrToHtml} from "./elements";
import {Range, rangeFromStr, rangeToShortStr} from "./ranges";
import {ChipClass, ChipType, chipClassFromStr, chipTypeFromStr} from "./chipkind";
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


export class BattleChip {

    public readonly name: string;
    public readonly id: number;
    public readonly element: Element[];
    public readonly range: Range;
    public readonly class: ChipClass;
    public readonly kind: ChipType;
    public readonly hits: string;
    public readonly description: string;
    public readonly damage: string;
    public readonly skills: Skill[];

    constructor(id: number, data: ChipData) {
        this.id = id;
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

    get skill(): Skill {
        return this.skills.length == 1 ? this.skills[0] : Skill.Varies;
    }

    get skillAbv(): string {
        return skillToShortStr(this.skill);
    }

    get rangeAbv(): string {
        return rangeToShortStr(this.range);
    }

    renderElements() : JSX.Element {
        return elementArrToHtml(this.element);
    }
}