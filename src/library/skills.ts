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
            return Skill.Perception;
        case "Info":
            return Skill.Info;
        case "Tech":
            return Skill.Tech;
        case "Strength":
            return Skill.Strength;
        case "Agility":
            return Skill.Agility;
        case "Endurance":
            return Skill.Endurance;
        case "Charm":
            return Skill.Charm;
        case "Valor":
            return Skill.Valor;
        case "Affinity":
            return Skill.Affinity;
        case "None":
            return Skill.None;
        case "Varies":
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

/*
export function skillToShortStr(val: Skill): string {
    switch (val) {
        case Skill.Perception:
            return "PER";
        case Skill.Info:
            return "INF";
        case Skill.Tech:
            return "TCH";
        case Skill.Strength:
            return "STR";
        case Skill.Agility:
            return "AGI";
        case Skill.Endurance:
            return "END";
        case Skill.Charm:
            return "CHM";
        case Skill.Valor:
            return "VLR";
        case Skill.Affinity:
            return "AFF";
        case Skill.None:
            return "--";
        case Skill.Varies:
            return "VAR";
    }
}
*/