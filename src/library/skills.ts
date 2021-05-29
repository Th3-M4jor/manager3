import { $enum } from "ts-enum-util";

export enum Skill {
    Perception,
    Info,
    Tech,
    Strength,
    Agility,
    Endurance,
    Charm,
    Valor,
    Affinity,
    None,
    Varies,
}

const wrappedSkills = $enum(Skill);

export function skillFromStr(val: string): Skill {
    return wrappedSkills.getValueOrThrow(val);
}

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