import {makeTaggedUnion, none, MemberType} from "safety-match";
import {BattleChip} from "../library/battlechip";
import {elementToSortNum} from "../library/elements";
import {skillToSortNum} from "../library/skills";
import {rangeToSortNum} from "../library/ranges";
import {cmpN, cmpS} from "../util/cmp";
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
    return cmpN(a.classSortPos, b.classSortPos) || cmpS(a.name, b.name);
}

export function sortBattleChipByElement(a: BattleChip, b: BattleChip): number {
    return arrCmp(a.element, b.element, elementToSortNum) || cmpN(a.classSortPos, b.classSortPos) || cmpS(a.name, b.name);
}

export function sortBattleChipByMaxDmg(a: BattleChip, b: BattleChip): number {
    return (-cmpN(a.MaxDmg, b.MaxDmg)) || cmpS(a.name, b.name);
}

export function sortBattleChipByAvgDmg(a: BattleChip, b:BattleChip): number {
    return (-cmpN(a.AvgDmg, b.AvgDmg)) || cmpS(a.name, b.name);
}

export function sortBattleChipBySkill(a: BattleChip, b: BattleChip): number {
    return arrCmp(a.skills, b.skills, skillToSortNum) || cmpN(a.classSortPos, b.classSortPos) || cmpS(a.name, b.name);
}

export function sortBattleChipByKind(a: BattleChip, b:BattleChip): number {
    return cmpN(a.kindSortPos, b.kindSortPos) || cmpN(a.classSortPos, b.classSortPos) || cmpS(a.name, b.name);
}

export function sortBattleChipByRange(a: BattleChip, b:BattleChip): number {
    return cmpN(rangeToSortNum(a.range), rangeToSortNum(b.range)) || cmpN(a.classSortPos, b.classSortPos) || cmpS(a.name, b.name);
}