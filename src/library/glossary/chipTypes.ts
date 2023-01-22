const Burst = "Chips of the burst type have their damage \
immediately paint the area they affect. They have \
no line of fire.";

const Construct = "Chips of the construct type create an \
Object on the field. Their HP and any special effects \
they may have are listed in their description. Using \
them does not consume an attack action.";

const Melee = "Chips of the melee type exclusively \
affect targets in the user's Close range.";

const Projectile = "Chips of the projectile type have a \
line of fire and will affect the first target they \
run into along it unless they have the Cursor Element.";

const Wave = "Chips of the wave type have a line of fire \
and are able to pass through all targets along it until \
they reach their maximum range.";

const Recovery = "Chips of the recovery type are used to \
restore a certain amount of your Navi's HP."

const Summon = "Chips of the summon type allow \
you to place a Virus on the field for a \
certain number of rounds. Their HP, AC, \
Stats, and Skills all match what is listed \
on their stat block in the Virus Compendium. \
Using them does not consume an attack action.";

const Support = "Chips of the support type carry \
various effects that will be listed in their \
description, and will not usually deal any \
damage. Using them does not consume an \
attack action.";

const Trap = " Chips of the trap type will usually set \
some condition to be activated before the end of combat. \
When this condition is met, their attacks trigger. They \
may not always require you to make an attack roll, \
but they still consume and attack action to use.";

export const ChipTypes = {
    burst: Burst,
    construct: Construct,
    melee: Melee,
    projectile: Projectile,
    wave: Wave,
    recovery: Recovery,
    summon: Summon,
    support: Support,
    trap: Trap
}

export type ChipType = keyof typeof ChipTypes;

export function chipTypeFromName(name: string): string {
    if(!(name in ChipTypes)) {
        throw new TypeError("Bad chiptype name");
    }

    return ChipTypes[name as ChipType];
}

export function chipTypeBgCss(name: string): string {
    if(["construct", "summon", "support"].includes(name)) {
        return "chipDescBackgroundSupprt";
    }

    return "chipDescBackgroundStd";
}

export function chipTypeFgCss(name: string): string {
    if(["construct", "summon", "support"].includes(name)) {
        return "SupportChip";
    }

    return "Chip";
}

function chipTypeToSortNum(name: string): number {
    switch(name) {
        case "burst":
            return 0;
        case "construct":
            return 1;
        case "melee":
            return 2;
        case "projectile":
            return 3;
        case "wave":
            return 4;
        case "recovery":
            return 5;
        case "summon":
            return 6;
        case "support":
            return 7;
        case "trap":
            return 8;
        default:
            throw new TypeError("Bad chiptype name");
    }
}

export function chipTypeSortFunc(a: string, b: string): number {
    return Math.sign(chipTypeToSortNum(a) - chipTypeToSortNum(b));
}

export function chipTypeToShortStr(name: string): string {
    switch(name) {
        case "burst":
            return "BST";
        case "construct":
            return "CNS";
        case "melee":
            return "MLE";
        case "projectile":
            return "PRJ";
        case "wave":
            return "WVE";
        case "recovery":
            return "RCV";
        case "summon":
            return "SUM";
        case "support":
            return "SPT";
        case "trap":
            return "TRP";
        default:
            throw new TypeError("Bad chiptype name");
    }
}