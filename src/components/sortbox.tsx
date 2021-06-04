import {makeTaggedUnion, none, MemberType} from "safety-match";
import {BattleChip} from "../library/battlechip";
import {elementToSortNum} from "../library/elements";
import {skillToSortNum} from "../library/skills";
import {rangeToSortNum} from "../library/ranges";
import {cmp} from "../util/cmp";
import {arrCmp} from "../util/arraycmp";

export const SortOption = makeTaggedUnion({
    Name: none,
    Element: none,
    MaxDmg: none,
    AvgDmg: none,
    Skill: none,
    Kind: none,
    Range: none,
    Owned: none,
});

export type SortOption = MemberType<typeof SortOption>;

export function sortBattleChipByName(a: BattleChip, b: BattleChip): number {
    return cmp(a.classSortPos, b.classSortPos) || cmp(a.name, b.name);
}

export function sortBattleChipByElement(a: BattleChip, b: BattleChip): number {
    return arrCmp(a.element, b.element, elementToSortNum) || cmp(a.classSortPos, b.classSortPos) || cmp(a.name, b.name);
}

export function sortBattleChipByMaxDmg(a: BattleChip, b: BattleChip): number {
    return (-cmp(a.MaxDmg, b.MaxDmg)) || cmp(a.name, b.name);
}

export function sortBattleChipByAvgDmg(a: BattleChip, b:BattleChip): number {
    return (-cmp(a.AvgDmg, b.AvgDmg)) || cmp(a.name, b.name);
}

export function sortBattleChipBySkill(a: BattleChip, b: BattleChip): number {
    return arrCmp(a.skills, b.skills, skillToSortNum) || cmp(a.classSortPos, b.classSortPos) || cmp(a.name, b.name);
}

export function sortBattleChipByKind(a: BattleChip, b:BattleChip): number {
    return cmp(a.kindSortPos, b.kindSortPos) || cmp(a.classSortPos, b.classSortPos) || cmp(a.name, b.name);
}

export function sortBattleChipByRange(a: BattleChip, b:BattleChip): number {
    return cmp(rangeToSortNum(a.range), rangeToSortNum(b.range)) || cmp(a.classSortPos, b.classSortPos) || cmp(a.name, b.name);
}