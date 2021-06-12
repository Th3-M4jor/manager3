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
    switch(val) {
        case "Perception":
        case "PER":
            return Skill.Perception;
        case "Info":
        case "INF":
            return Skill.Info;
        case "Tech":
        case "TCH":
            return Skill.Tech;
        case "Strength":
        case "STR":
            return Skill.Strength;
        case "Agility":
        case "AGI":
            return Skill.Agility;
        case "Endurance":
        case "END":
            return Skill.Endurance;
        case "Charm":
        case "CHM":
            return Skill.Charm;
        case "Valor":
        case "VLR":
            return Skill.Valor;
        case "Affinity":
        case "AFF":
            return Skill.Affinity;
        case "None":
        case "--":
            return Skill.None;
        case "Varies":
        case "VAR":
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