import { Element, elementFromStr, elementArrToHtml } from "./elements";
import { Range, rangeFromStr } from "./ranges";
import {
  ChipClass,
  ChipType,
  chipClassFromStr,
  chipTypeFromStr,
  chipClassToSortNum,
  chipTypeToSortNum,
  chipTypeToShortStr,
  chipClassMaxInFolder,
  chipClassToCss,
  chipClassToBackgroundCss,
  stdChipTypeToBgCss,
  chipTypeToCss,
} from "./chipkind";
import { Skill, skillFromStr, skillToShortStr } from "./skills";
import { ChipEffect, chipEffectFromStr } from "./chipeffect";

export interface Dice {
  dienum: number;
  dietype: number;
}

export interface BlightData {
  elem: string;
  dmg: Dice;
  duration: Dice;
}

export interface Blight {
  elem: Element;
  dmg: Dice;
  duration: Dice;
}

function blightDataToBlight(blight: BlightData): Blight {
  const element = elementFromStr(blight.elem);
  return {
    elem: element,
    dmg: blight.dmg,
    duration: blight.duration,
  };
}

export function diceToStr(dice: Dice): string {
  if (dice.dietype <= 1) {
    return dice.dienum + "";
  }
  return dice.dienum + "d" + dice.dietype;
}

export interface ChipData {
  id: number;
  name: string;
  cr: number;
  elem: string[];
  skill?: string[];
  range: string;
  hits?: string;
  targets?: string;
  description?: string;
  effect?: string[];
  effduration?: number;
  blight?: BlightData;
  damage?: Dice;
  kind: string;
  class: string;
}

/**
 * First number returned is max damage, second is average damage
 */
function calcDmgVals(damage: Dice | null): [number, number] {
  if (!damage) {
    return [0, 0];
  }

  const avgDmg = (damage.dietype / 2 + 0.5) * damage.dienum;
  const maxDmg = damage.dienum * damage.dietype;
  return [maxDmg, avgDmg];
}

export class BattleChip {
  public readonly id: number;
  public readonly name: string;
  public readonly cr: number;
  public readonly element: Element[];
  public readonly skills: Skill[];
  public readonly range: Range;
  public readonly hits: string;
  public readonly targets: string | null;
  public readonly description: string;
  public readonly effect: ChipEffect[];
  public readonly effduration: number | null;
  public readonly blight: Blight | null;
  public readonly damage: Dice | null;
  public readonly kind: ChipType;
  public readonly class: ChipClass;

  public readonly kindSortPos: number;
  public readonly classSortPos: number;

  public readonly avgDmg: number;
  public readonly maxDmg: number;
  public readonly dmgStr: string;

  constructor(data: ChipData) {
    this.id = data.id;
    this.name = data.name;
    this.cr = data.cr;
    this.element = data.elem.map((e) => elementFromStr(e));
    this.skills = data.skill?.map((e) => skillFromStr(e)) ?? [Skill.None];
    this.range = rangeFromStr(data.range);
    this.hits = data.hits ?? "0";
    this.targets = data.targets ?? null;
    this.description = data.description ?? "--";

    this.effect = data.effect?.map((e) => chipEffectFromStr(e)) ?? [];
    this.effduration = data.effduration ?? null;

    this.blight = data.blight ? blightDataToBlight(data.blight) : null;

    this.class = chipClassFromStr(data.class);
    this.kind = chipTypeFromStr(data.kind);
    this.classSortPos = chipClassToSortNum(this.class);
    this.kindSortPos = chipTypeToSortNum(this.kind);

    this.damage = data.damage ?? null;

    if (!this.damage) {
      this.dmgStr = "--";
    } else {
      this.dmgStr = diceToStr(this.damage);
    }

    [this.maxDmg, this.avgDmg] = calcDmgVals(this.damage);
  }

  get Skill(): Skill {
    return this.skills.length == 1 ? this.skills[0] : Skill.Varies;
  }

  get SkillAbv(): string {
    return skillToShortStr(this.Skill);
  }

  get RangeAbv(): string {
    return this.range.variant;
  }

  get KindAbv(): string {
    return chipTypeToShortStr(this.kind);
  }

  get MaxInFldr(): number {
    return chipClassMaxInFolder(this.class);
  }

  get classCss(): string {
    return this.class.variant == "Standard"
      ? chipTypeToCss(this.kind)
      : chipClassToCss(this.class);
  }

  get backgroundCss(): string {
    return this.class.variant == "Standard"
      ? stdChipTypeToBgCss(this.kind)
      : chipClassToBackgroundCss(this.class);
  }

  renderElements() {
    return elementArrToHtml(this.element);
  }
}
