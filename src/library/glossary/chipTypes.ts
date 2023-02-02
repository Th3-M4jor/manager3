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
but they still consume an attack action to use.";

export interface ChipTypeObject {
    text: string;
    bgCss: string;
    fgCss: string;
    abbr: string;
}

export const ChipTypes: Record<string, ChipTypeObject> = {
    burst: {
        text: Burst,
        bgCss: "chipDescBackgroundStd",
        fgCss: "Chip",
        abbr: "BST"
    },
    construct: {
        text: Construct,
        bgCss: "chipDescBackgroundSupprt",
        fgCss: "SupportChip",
        abbr: "CNS"
    },
    melee: {
        text: Melee,
        bgCss: "chipDescBackgroundStd",
        fgCss: "Chip",
        abbr: "MLE",
    },
    projectile: {
        text: Projectile,
        bgCss: "chipDescBackgroundStd",
        fgCss: "Chip",
        abbr: "PRJ"
    },
    wave: {
        text: Wave,
        bgCss: "chipDescBackgroundStd",
        fgCss: "Chip",
        abbr: "WVE"
    },
    recovery: {
        text: Recovery,
        bgCss: "chipDescBackgroundStd",
        fgCss: "Chip",
        abbr: "RCV"
    },
    summon: {
        text: Summon,
        bgCss: "chipDescBackgroundSupprt",
        fgCss: "SupportChip",
        abbr: "SUM"
    },
    support: {
        text: Support,
        bgCss: "chipDescBackgroundSupprt",
        fgCss: "SupportChip",
        abbr: "SPT"
    },
    trap: {
        text: Trap,
        bgCss: "chipDescBackgroundStd",
        fgCss: "Chip",
        abbr: "TRP"
    }
};

export type ChipType = keyof typeof ChipTypes;