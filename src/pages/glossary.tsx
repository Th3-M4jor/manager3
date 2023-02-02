import { Component } from "preact";

import { ChipDesc, ChipDescDisplay, setActiveDisplayItem } from "../components/chipdesc";

import { Statuses } from "../library/glossary/statuses";

import { Blights } from "../library/glossary/blights";

import { Panels } from "../library/glossary/terrain";

import { ChipTypes } from "../library/glossary/chipTypes";

import { Skills } from "../library/glossary/skills";

export default class Glossary extends Component {
    private statusMouseoverHandler: (e: MouseEvent) => void;
    private blightMouseoverHandler: (e: MouseEvent) => void;
    private terrainMouseoverHandler: (e: MouseEvent) => void;
    private chipTypeMouseoverHandler: (e: MouseEvent) => void;
    private skillMouseoverHandler: (e: MouseEvent) => void;

    constructor() {
        super();

        this.skillMouseoverHandler = (e: MouseEvent) => {
            const data = (e.currentTarget as HTMLDivElement).dataset;
            if (!data?.name) {
                return;
            }

            const item = ChipDescDisplay.GlossaryItem(
                `${data.name.charAt(0).toUpperCase()}${data.name.slice(1)}`,
                "chipDescBackgroundStd",
                Skills[data.name].text
            );

            setActiveDisplayItem(item);
        }

        this.statusMouseoverHandler = (e: MouseEvent) => {
            const data = (e.currentTarget as HTMLDivElement).dataset;
            if (!data?.name) {
                return;
            }

            const item = ChipDescDisplay.GlossaryItem(
                `${data.name.charAt(0).toUpperCase()}${data.name.slice(1)}`,
                "chipDescBackgroundMega",
                Statuses[data.name]
            );

            setActiveDisplayItem(item);
        }

        this.blightMouseoverHandler = (e: MouseEvent) => {
            const data = (e.currentTarget as HTMLDivElement).dataset;
            if (!data?.name) {
                return;
            }

            const item = ChipDescDisplay.GlossaryItem(
                `Blight (${data.name.charAt(0).toUpperCase()}${data.name.slice(1)})`,
                "chipDescBackgroundGiga",
                Blights[data.name].text
            );
            setActiveDisplayItem(item);
        }
        this.terrainMouseoverHandler = (e: MouseEvent) => {
            const data = (e.currentTarget as HTMLDivElement).dataset;
            if (!data?.name) {
                return;
            }

            const item = ChipDescDisplay.GlossaryItem(
                `${data.name.charAt(0).toUpperCase()}${data.name.slice(1)}`,
                "chipDescBackgroundStd",
                Panels[data.name]
            );
            setActiveDisplayItem(item);
        }
        this.chipTypeMouseoverHandler = (e: MouseEvent) => {
            const data = (e.currentTarget as HTMLDivElement).dataset;
            if (!data?.name) {
                return;
            }

            const chipType = ChipTypes[data.name];

            const item = ChipDescDisplay.GlossaryItem(
                `${data.name.charAt(0).toUpperCase()}${data.name.slice(1)}`,
                chipType.bgCss,
                chipType.text
            );
            setActiveDisplayItem(item);
        }
    }

    private viewTopRow() {
        return (
            <div class="chip-top-row Chip z-20">
                <div class="w-8/24 sm:w-6/24 px-0 whitespace-nowrap select-none">
                    NAME
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 select-none">
                    ABBR
                </div>
                <div class="w-5/24 sm:w-4/24 px-0 select-none">
                    KIND
                </div>
            </div>
        );
    }

    private renderSkills() {
        // Observe that on modern browsers, Object.keys() returns keys in insertion order.
        return Object.keys(Skills).map((skill) => (
            <div class="select-none chip-row Chip" data-name={skill} onMouseOver={this.skillMouseoverHandler}>
                <div class="w-8/24 sm:w-6/24 px-0 mx-0 whitespace-nowrap select-none">
                    {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                    {Skills[skill].abbr}
                </div>
                <div class="w-5/24 sm:w-4/24 px-0 select-none whitespace-nowrap">
                    Skill
                </div>
            </div>
        ));
    }

    private renderStatuses() {
        return Object.keys(Statuses).map((status) => (
            <div class="select-none chip-row Mega" data-name={status} onMouseOver={this.statusMouseoverHandler}>
                <div class="w-8/24 sm:w-6/24 px-0 mx-0 whitespace-nowrap select-none">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                    --
                </div>
                <div class="w-5/24 sm:w-4/24 px-0 select-none whitespace-nowrap">
                    Status
                </div>
            </div>
        ));
    }

    private renderBlights() {
        // Observe that on modern browsers, Object.keys() returns the keys in the order in which they were inserted.
        return Object.keys(Blights).map(blight => (
            <div class="select-none chip-row Giga" data-name={blight} onMouseOver={this.blightMouseoverHandler}>
                <div class="w-8/24 sm:w-6/24 px-0 mx-0 whitespace-nowrap select-none">
                    {blight.charAt(0).toUpperCase() + blight.slice(1)}
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                    <span class="chipImgBox">
                        <span class={Blights[blight].imgCss} />
                    </span>
                </div>
                <div class="w-5/24 sm:w-4/24 px-0 select-none whitespace-nowrap">
                    Blight
                </div>
            </div>
        ));
    }

    private renderPanels() {
        return Object.keys(Panels).map((panel) => (
            <div class="select-none chip-row Chip" data-name={panel} onMouseOver={this.terrainMouseoverHandler}>
                <div class="w-8/24 sm:w-6/24 px-0 mx-0 whitespace-nowrap select-none">
                    {panel.charAt(0).toUpperCase() + panel.slice(1)}
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                    --
                </div>
                <div class="w-5/24 sm:w-4/24 px-0 select-none whitespace-nowrap">
                    Terrain
                </div>
            </div>
        ));
    }

    private renderChipTypes() {
        return Object.keys(ChipTypes).map((chipType) => {
            const typeData = ChipTypes[chipType];
            const typeCss = typeData.fgCss;
            const typeAbbr = typeData.abbr;

            return (
                <div class={"select-none chip-row " + typeCss} data-name={chipType} onMouseOver={this.chipTypeMouseoverHandler}>
                    <div class="w-8/24 sm:w-6/24 px-0 mx-0 whitespace-nowrap select-none">
                        {chipType.charAt(0).toUpperCase() + chipType.slice(1)}
                    </div>
                    <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                        {typeAbbr}
                    </div>
                    <div class="w-5/24 sm:w-4/24 px-0 select-none whitespace-nowrap">
                        ChipType
                    </div>
                </div>
            );
        });
    }

    private linebreak() {
        return (
            <div class="select-none justify-center flex flex-row mx-0 UsedChip">
                <div class="w-21/24 px-0 mx-0 whitespace-nowrap select-none overflow-hidden shadow-none">
                {"- ".repeat(50)}
                </div>
            </div>
        );
    }

    render() {

        return (
            <>
                <div class="col-span-3 sm:col-span-4 md:col-span-5 px-0 z-10">
                    <div class="Folder activeFolder">
                        {this.viewTopRow()}
                        {this.renderSkills()}
                        {this.linebreak()}
                        {this.renderChipTypes()}
                        {this.linebreak()}
                        {this.renderPanels()}
                        {this.linebreak()}
                        {this.renderStatuses()}
                        {this.linebreak()}
                        {this.renderBlights()}
                    </div>
                </div>
                <div class="col-span-1 flex flex-col px-0 max-h-full">
                    <ChipDesc />
                </div>
            </>
        )
    }
}