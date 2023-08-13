import { RenderableProps } from "preact";

import { makeTaggedUnion, none, MemberType } from "safety-match";
import { BattleChip } from "../library/battlechip";
import { elementToSortNum } from "../library/elements";
import { skillToSortNum } from "../library/skills";
import { rangeToSortNum } from "../library/ranges";
import { cmpN, cmpS } from "../util/cmp";
import { arrCmp } from "../util/arraycmp";

export const SortOption = makeTaggedUnion({
  Name: none,
  Element: none,
  MaxDamage: none,
  AverageDamage: none,
  Skill: none,
  Kind: none,
  Range: none,
  Owned: none,
  Cr: none,
});

export type SortOption = MemberType<typeof SortOption>;

export function SortOptFromStr(val: string): SortOption {
  switch (val) {
    case "Name":
      return SortOption.Name;
    case "Element":
      return SortOption.Element;
    case "MaxDamage":
      return SortOption.MaxDamage;
    case "AverageDamage":
      return SortOption.AverageDamage;
    case "Skill":
      return SortOption.Skill;
    case "Kind":
      return SortOption.Kind;
    case "Range":
      return SortOption.Range;
    case "Cr":
      return SortOption.Cr;
    case "Owned":
      return SortOption.Owned;
    default:
      throw new TypeError("Impossible sort option");
  }
}

//#region sortFns
export function sortBattleChipByName(a: BattleChip, b: BattleChip): number {
  return cmpN(a.classSortPos, b.classSortPos) || cmpS(a.name, b.name);
}

export function sortBattleChipByNameDesc(a: BattleChip, b: BattleChip): number {
  return -sortBattleChipByName(a, b);
}

export function sortBattleChipByElement(a: BattleChip, b: BattleChip): number {
  return (
    arrCmp(a.element, b.element, elementToSortNum) ||
    cmpN(a.classSortPos, b.classSortPos) ||
    cmpS(a.name, b.name)
  );
}

export function sortBattleChipByElementDesc(
  a: BattleChip,
  b: BattleChip,
): number {
  return (
    -arrCmp(a.element, b.element, elementToSortNum) ||
    cmpN(a.classSortPos, b.classSortPos) ||
    cmpS(a.name, b.name)
  );
}

export function sortBattleChipByMaxDmg(a: BattleChip, b: BattleChip): number {
  return (
    -cmpN(a.maxDmg, b.maxDmg) ||
    cmpN(a.avgDmg, b.avgDmg) ||
    cmpS(a.name, b.name)
  );
}

export function sortBattleChipByMaxDmgDesc(
  a: BattleChip,
  b: BattleChip,
): number {
  return (
    cmpN(a.maxDmg, b.maxDmg) ||
    -cmpN(a.avgDmg, b.avgDmg) ||
    cmpS(a.name, b.name)
  );
}

export function sortBattleChipByAvgDmg(a: BattleChip, b: BattleChip): number {
  return -cmpN(a.avgDmg, b.avgDmg) || cmpS(a.name, b.name);
}

export function sortBattleChipByAvgDmgDesc(
  a: BattleChip,
  b: BattleChip,
): number {
  return cmpN(a.avgDmg, b.avgDmg) || cmpS(a.name, b.name);
}

export function sortBattleChipBySkill(a: BattleChip, b: BattleChip): number {
  return (
    arrCmp(a.skills, b.skills, skillToSortNum) ||
    cmpN(a.classSortPos, b.classSortPos) ||
    cmpS(a.name, b.name)
  );
}

export function sortBattleChipBySkillDesc(
  a: BattleChip,
  b: BattleChip,
): number {
  return (
    -arrCmp(a.skills, b.skills, skillToSortNum) ||
    cmpN(a.classSortPos, b.classSortPos) ||
    cmpS(a.name, b.name)
  );
}

export function sortBattleChipByKind(a: BattleChip, b: BattleChip): number {
  return (
    cmpN(a.kindSortPos, b.kindSortPos) ||
    cmpN(a.classSortPos, b.classSortPos) ||
    cmpS(a.name, b.name)
  );
}

export function sortBattleChipByKindDesc(a: BattleChip, b: BattleChip): number {
  return (
    -cmpN(a.kindSortPos, b.kindSortPos) ||
    cmpN(a.classSortPos, b.classSortPos) ||
    cmpS(a.name, b.name)
  );
}

export function sortBattleChipByRange(a: BattleChip, b: BattleChip): number {
  return (
    cmpN(rangeToSortNum(a.range), rangeToSortNum(b.range)) ||
    cmpN(a.classSortPos, b.classSortPos) ||
    cmpS(a.name, b.name)
  );
}

export function sortBattleChipByRangeDesc(
  a: BattleChip,
  b: BattleChip,
): number {
  return (
    -cmpN(rangeToSortNum(a.range), rangeToSortNum(b.range)) ||
    cmpN(a.classSortPos, b.classSortPos) ||
    cmpS(a.name, b.name)
  );
}

export function sortBattleChipByCr(a: BattleChip, b: BattleChip): number {
  return (
    cmpN(a.classSortPos, b.classSortPos) ||
    cmpN(a.cr, b.cr) ||
    cmpS(a.name, b.name)
  );
}

export function sortBattleChipByCrDesc(a: BattleChip, b: BattleChip): number {
  return (
    cmpN(a.classSortPos, b.classSortPos) ||
    -cmpN(a.cr, b.cr) ||
    cmpS(a.name, b.name)
  );
}
//#endregion sortFns

interface SortBoxProps {
  includeOwned?: boolean;
  currentMethod: SortOption;
  descending?: boolean;
  hideDesc?: boolean;
  onDescendingChange?: EventListener;
  onSortChange: EventListener;
}

function makeOptions(includeOwned: boolean | undefined) {
  const opts = [
    <option value="Name">Name</option>,
    <option value="Element">Element</option>,
    <option value="MaxDamage">MaxDamage</option>,
    <option value="AverageDamage">AverageDamage</option>,
    <option value="Skill">Skill</option>,
    <option value="Kind">Kind</option>,
    <option value="Range">Range</option>,
    <option value="Cr">CR</option>,
  ];

  if (includeOwned) {
    opts.push(<option value="Owned">Owned</option>);
  }

  return opts;
}

export function SortBox(props: RenderableProps<SortBoxProps>) {
  return (
    <>
      <label for="chip_sort_select" class="Chip select-none">
        Sort By
      </label>
      <select
        id="chip_sort_select"
        class="chip-sort-select cursor-pointer"
        onChange={props.onSortChange}
        value={props.currentMethod.variant}
      >
        {makeOptions(props.includeOwned)}
      </select>
      <DescendingBox {...props} />
    </>
  );
}

function DescendingBox(props: RenderableProps<SortBoxProps>) {
  return props.hideDesc ? null : (
    <span class="Chip select-none">
      <label for="descending_checkbox" class="m-0 sm:m-px md:m-0.5">
        Descending
      </label>
      <input
        id="descending_checkbox"
        name="descending"
        type="checkbox"
        class="cursor-pointer m-0 sm:m-px lg:m-0.5 xl:m-1"
        checked={props.descending}
        onClick={props.onDescendingChange}
      />
    </span>
  );
}
