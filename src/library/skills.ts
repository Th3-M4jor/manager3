import { makeTaggedUnion, none, MemberType } from "safety-match";

export const Skill = makeTaggedUnion({
  Perception: none,
  Info: none,
  Tech: none,
  Strength: none,
  Agility: none,
  Endurance: none,
  Charm: none,
  Valor: none,
  Affinity: none,
  Varies: none,
  None: none,
});

export type Skill = MemberType<typeof Skill>;

export function skillFromStr(val: string): Skill {
  val = val.toLowerCase();
  switch (val) {
    case "perception":
    case "per":
      return Skill.Perception;
    case "info":
    case "inf":
      return Skill.Info;
    case "tech":
    case "tch":
      return Skill.Tech;
    case "strength":
    case "str":
      return Skill.Strength;
    case "agility":
    case "agi":
      return Skill.Agility;
    case "endurance":
    case "end":
      return Skill.Endurance;
    case "charm":
    case "chm":
      return Skill.Charm;
    case "valor":
    case "vlr":
      return Skill.Valor;
    case "affinity":
    case "aff":
      return Skill.Affinity;
    case "none":
    case "--":
      return Skill.None;
    case "varies":
    case "var":
      return Skill.Varies;
    default:
      throw new TypeError("Bad Skill Name");
  }
}

const skillToShortStrMatcher = {
  Perception: () => "PER",
  Info: () => "INF",
  Tech: () => "TCH",
  Strength: () => "STR",
  Agility: () => "AGI",
  Endurance: () => "END",
  Charm: () => "CHM",
  Valor: () => "VLR",
  Affinity: () => "AFF",
  Varies: () => "VAR",
  None: () => "--",
};

export function skillToShortStr(val: Skill): string {
  return val.match(skillToShortStrMatcher);
}

const skillSortNumMatcher = {
  Perception: () => 0,
  Info: () => 1,
  Tech: () => 2,
  Strength: () => 3,
  Agility: () => 4,
  Endurance: () => 5,
  Charm: () => 6,
  Valor: () => 7,
  Affinity: () => 8,
  Varies: () => 9,
  None: () => 10,
};

export function skillToSortNum(val: Skill): number {
  return val.match(skillSortNumMatcher);
}
