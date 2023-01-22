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

export const Blights = {
    fire: FireBlight,
    aqua: AquaBlight,
    elec: ElecBlight,
    wood: WoodBlight,
    wind: WindBlight,
    sword: SwordBlight,
    break: BreakBlight,
    cursor: CursorBlight,
    recov: RecovBlight,
    invis: InvisBlight,
    object: ObjectBlight,
}

export type Blight = keyof typeof Blights;

export function blightFromName(name: string): string {
    if (!(name in Blights)) {
        throw new Error(`Invalid blight name: ${name}`);
    }

    return Blights[name as Blight];
}

function blightToSortNum(name: string): number {
    switch(name) {
        case "fire":
            return 0;
        case "aqua":
            return 1;
        case "elec":
            return 2;
        case "wood":
            return 3;
        case "wind":
            return 4;
        case "sword":
            return 5;
        case "break":
            return 6;
        case "cursor":
            return 7;
        case "recov":
            return 8;
        case "invis":
            return 9;
        case "object":
            return 10;
        default:
            throw new Error(`Invalid blight name: ${name}`);
    }
}

export function blightSort(a: string, b: string): number {
    return Math.sign(blightToSortNum(a) - blightToSortNum(b));
}
