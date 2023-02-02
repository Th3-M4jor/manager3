const FireBlight = "When you make damage rolls, the rolled result and maximum result of each die is reduced by 1.";
const AquaBlight = "Your AC is decreased by one until the start of your next turn each time you come into contact with Ice or Sea terrain.";
const ElecBlight = "Take this Blight's damage when you make Move Actions or get pushed or pulled from one panel to another instead of at the start of your turn.";
const WoodBlight = "When you take damage from this Blight, an equal amount of HP is restored to the one who inflicted the Blight upon you.";
const WindBlight = "Your maximum number of Move Actions is cut in half. (minimum 1)";
const SwordBlight = "When you make attacks against targets in Close range, they may each make one free attack against you per round.";
const BreakBlight = "Damage you take bypasses the effects of any Shield, Barrier, Aura, Holy terrain, or other source of damage reduction you use";
const CursorBlight = "You may only make Near attacks at Close range. Far attacks have their range limited to Near.";
const RecovBlight = "You are unable to heal from any source";
const InvisBlight = "You are unable to inflict Statuses on any target or grant them to allies";
const ObjectBlight = "You must make all attack rolls with disadvantage";

export interface BlightObject {
    text: string;
    imgCss: string;
}

export const Blights: Record<string, BlightObject> = {
    fire: {
        text: FireBlight,
        imgCss: "fireChip"
    },
    aqua: {
        text: AquaBlight,
        imgCss: "aquaChip"
    },
    elec: {
        text: ElecBlight,
        imgCss: "elecChip"
    },
    wood: {
        text: WoodBlight,
        imgCss: "woodChip"
    },
    wind: {
        text: WindBlight,
        imgCss: "windChip"
    },
    sword: {
        text: SwordBlight,
        imgCss: "swordChip"
    },
    break: {
        text: BreakBlight,
        imgCss: "breakChip"
    },
    cursor: {
        text: CursorBlight,
        imgCss: "cursorChip"
    },
    recov: {
        text: RecovBlight,
        imgCss: "recovChip"
    },
    invis: {
        text: InvisBlight,
        imgCss: "invisChip"
    },
    object: {
        text: ObjectBlight,
        imgCss: "objectChip"
    }
}

export type Blight = keyof typeof Blights;
