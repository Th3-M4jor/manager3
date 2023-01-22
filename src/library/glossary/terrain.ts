const Cracked = "Cracked terrain forces anything attempting to step \
off of it to make an Endurance check or become Staggered.";

const Grass = "Wood Navis and Viruses regain HP equal to their \
Endurance whenever they end their turn while occupying this \
terrain. However, attacks that deal Fire damage have this damage \
increased by half their regular damage dice.";

const Holy = "Any damage that a target takes while standing on this terrain is reduced by half.";

const Ice = "Should a target use a Move Action to enter a space of this type, \
they will immediately slide forward one space in the direction they stepped \
in. This effect does not apply to Aqua Element targets. \
Elec attacks deal one and a half times their regular \
damage to targets standing on Ice terrain regardless of this.";

const Lava = "Any target save those of the Fire Element that steps on \
a space of this type immediately takes damage equal to a roll of one \
of their HP dice and reverts the terrain to normal. Wood Navis and \
Viruses take twice this damage. If an Aqua attack passes over these \
spaces, they are reverted to normal terrain.";

const Magnet = "Any target save those of the Elec Element are propelled \
in a direction determined by a roll of 1d6 and interpreted by the GM \
when they step on these spaces. Wood attacks that pass over these \
spaces immediately revert the terrain to normal.";

const Metal = "These spaces are immune to becoming Cracked \
by any sort of attack, and targets that stand on them have \
their AC increased by 2";

const Poison = "Targets standing on Poison terrain immediately \
suffer Blight (Recovery) and take 1d4 damage upon moving into \
it. For each Attack Action made on Poison terrain, an \
additional 1d4 Recovery damage is taken. Blight (Recovery) \
ends when the target starts their turn on a space that does \
not contain Poison terrain.";

const Sand = "Targets stepping onto terrain of this type \
expend two Move Actions instead of one. If the target \
does not have two Move Actions remaining, they cannot \
step on these panels unless their maximum number of \
Move Actions is less than 2 to begin with. Wind attacks \
gain additional damage dice equal to half their regular \
value and immediately remove the terrain from these \
spaces when targeting them.";

const Sea = "Terrain of this type forces targets \
that can make more than one Move Action to consume \
two of them each time they move away from it. \
Should these targets not have two remaining Move \
Actions after stepping onto this terrain, they cannot \
move away from it. Further, targets standing on this \
terrain that take Elec damage have the damage increased \
by half the attack's damage dice."

export const Panels = {
    cracked: Cracked,
    grass: Grass,
    holy: Holy,
    ice: Ice,
    lava: Lava,
    magnet: Magnet,
    metal: Metal,
    poison: Poison,
    sand: Sand,
    sea: Sea,
};

export type Terrain = keyof typeof Panels;

export function terrainFromName(name: string): string {
    if (!(name in Panels)) {
        throw new Error(`Unknown terrain: ${name}`);
    }
    return Panels[name as Terrain];
}