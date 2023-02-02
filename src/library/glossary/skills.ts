const Affinity = "For Operators, Affinity is a mark of how closely bonded to your Navi you are. \
It increases as you spend time with him and enter Full Synchro in combat. \
For Navis, Affinity is a benchmark of how attuned with their Element they are. \
It can be used to clear hazards involving their element, navigating terrain \
overcome by it, or anything else involving the manipulation of your element.";

const Agility = "For both Operators and Navis, Agility is your swiftness of movement. \
Covering long distances in short periods of time, quickly inputting a series of \
commands you've memorized, or dodging incoming hazards are all things that require Agility. \
For Navis specifically, it even controls the number of times you can move in combat.";

const Charm = "For both Operators and Navis, Charm is used to garner the \
favor of the people around you. It could be used to haggle for a better \
deal from a shop owner, get away with some otherwise poorly received \
behavior, or successfully deceive people.";

const Endurance = "For both Operators and Navis, Endurance is used to \
endure harsh environments, suffer through prolonged stress, and build \
a more durable body. It also increases both your Navi and Operator's max HP.";

const Info = "For Operators, Info is used to discern information about \
the real world, remember trivia, or even augment the effects of certain \
Battlechips. For Navis, Info can be used to look up information on \
and about the Net. They may also need it to analyze the \
characteristics of Viruses and other Navis.";

const Perception = "For both Operators and Navis, Perception is the skill \
used to perceive the world around you. Spotting things at far distances, \
making quick judgement calls in tense situations, and precision \
all require a good amount of Perception. Characters with higher Perception \
also have a higher bonus to Initiative in combat.";

const Tech = "For Operators, Tech can be used to write programs that do specific \
things - anything from Navi Customizer Parts to Security Cubes. For Navis, \
Tech is used to hack into secured areas of the Net. It can also be leveraged \
to disable traps or remove negative status effects outside of combat.";

const Strength = "For both Operators and Navis, Strength is \
your physical ability. It can be used to jump over \
obstacles, lift heavy objects, climb, or carry burdens across distances."

const Valor = "For both Operators and Navis, Valor is a \
measure of the force of their personalities as well as \
their courage. It can be used to swallow fears or intimidate adversaries.";

export interface SkillObject {
    text: string;
    abbr: string;
}

export const Skills: Record<string, SkillObject> = {
    perception: {
        text: Perception,
        abbr: "PER"
    },
    info: {
        text: Info,
        abbr: "INF"
    },
    tech: {
        text: Tech,
        abbr: "TCH"
    },
    strength: {
        text: Strength,
        abbr: "STR"
    },
    agility: {
        text: Agility,
        abbr: "AGI"
    },
    endurance: {
        text: Endurance,
        abbr: "END"
    },
    charm: {
        text: Charm,
        abbr: "CHM"
    },
    valor: {
        text: Valor,
        abbr: "VLR"
    },
    affinity: {
        text: Affinity,
        abbr: "AFF"
    }
};

export type Skill = keyof typeof Skills;