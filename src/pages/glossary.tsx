import m, { CVnode } from "mithril";

import { makeTaggedUnion, MemberType, none } from "safety-match";

import { MitrhilTsxComponent } from "../JsxNamespace";

import { ChipDesc, ChipDescDisplay } from "../components/chipdesc";

import { Statuses, statusFromName } from "../library/glossary/statuses";

import { Blights, blightFromName, blightSort } from "../library/glossary/blights";

import { Panels, terrainFromName } from "../library/glossary/terrain";

import { ChipTypes, chipTypeFromName, chipTypeBgCss, chipTypeFgCss, chipTypeToShortStr, chipTypeSortFunc } from "../library/glossary/chipTypes";

const ActiveGlossaryItem = makeTaggedUnion({
    Status: (name: string) => name,
    Blight: (name: string) => name,
    Terrain: (name: string) => name,
    ChipType: (name: string) => name,
    None: none,
});

type ActiveGlossaryItem = MemberType<typeof ActiveGlossaryItem>;

export class Glossary extends MitrhilTsxComponent {
    private statusMouseoverHandler: (e: MouseEvent) => void;
    private blightMouseoverHandler: (e: MouseEvent) => void;
    private terrainMouseoverHandler: (e: MouseEvent) => void;
    private chipTypeMouseoverHandler: (e: MouseEvent) => void;
    private activeItem: ActiveGlossaryItem = ActiveGlossaryItem.None;

    constructor(attrs: CVnode) {
        super(attrs);
        this.statusMouseoverHandler = (e: MouseEvent) => {
            const data = (e.currentTarget as HTMLDivElement).dataset;
            if (!data || !data.name) {
                return;
            }

            this.activeItem = ActiveGlossaryItem.Status(data.name);
        }

        this.blightMouseoverHandler = (e: MouseEvent) => {
            const data = (e.currentTarget as HTMLDivElement).dataset;
            if (!data || !data.name) {
                return;
            }

            this.activeItem = ActiveGlossaryItem.Blight(data.name);

        }
        this.terrainMouseoverHandler = (e: MouseEvent) => {
            const data = (e.currentTarget as HTMLDivElement).dataset;
            if (!data || !data.name) {
                return;
            }

            this.activeItem = ActiveGlossaryItem.Terrain(data.name);
        }
        this.chipTypeMouseoverHandler = (e: MouseEvent) => {
            const data = (e.currentTarget as HTMLDivElement).dataset;
            if (!data || !data.name) {
                return;
            }

            this.activeItem = ActiveGlossaryItem.ChipType(data.name);
        }
    }

    private viewTopRow(): JSX.Element {
        return (
            <div class="chip-top-row Chip z-20">
                <div class="w-8/24 sm:w-6/24 px-0 whitespace-nowrap select-none">
                    NAME
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 select-none">
                    ABBR
                </div>
            </div>
        );
    }

    private renderStatuses(): JSX.Element[] {
        return Object.keys(Statuses).map((status) => (
            <div class="select-none chip-row Mega" data-name={status} onmouseover={this.statusMouseoverHandler}>
                <div class="w-8/24 sm:w-6/24 px-0 mx-0 whitespace-nowrap select-none">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                    --
                </div>
            </div>
        ));
    }

    private renderBlights(): JSX.Element[] {
        return Object.keys(Blights).sort(blightSort).map((blight) => (
            <div class="select-none chip-row Giga" data-name={blight} onmouseover={this.blightMouseoverHandler}>
                <div class="w-8/24 sm:w-6/24 px-0 mx-0 whitespace-nowrap select-none">
                    Blight ({blight.charAt(0).toUpperCase() + blight.slice(1)})
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                    --
                </div>
            </div>
        ));
    }

    private renderPanels(): JSX.Element[] {
        return Object.keys(Panels).map((panel) => (
            <div class="select-none chip-row Chip" data-name={panel} onmouseover={this.terrainMouseoverHandler}>
                <div class="w-8/24 sm:w-6/24 px-0 mx-0 whitespace-nowrap select-none">
                    {panel.charAt(0).toUpperCase() + panel.slice(1)}
                </div>
                <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                    --
                </div>
            </div>
        ));
    }

    private renderChipTypes(): JSX.Element[] {
        return Object.keys(ChipTypes).sort(chipTypeSortFunc).map((chipType) => {
            const typeCss = chipTypeFgCss(chipType);
            const typeAbbr = chipTypeToShortStr(chipType);

            return (
                <div class={"select-none chip-row " + typeCss} data-name={chipType} onmouseover={this.chipTypeMouseoverHandler}>
                    <div class="w-8/24 sm:w-6/24 px-0 mx-0 whitespace-nowrap select-none">
                        {chipType.charAt(0).toUpperCase() + chipType.slice(1)}
                    </div>
                    <div class="w-4/24 sm:w-3/24 px-0 whitespace-nowrap select-none">
                        {typeAbbr}
                    </div>
                </div>
            );
        }
        );
    }


    private getActiveItemData(): ChipDescDisplay {

        if (this.activeItem.variant === "None") {
            return ChipDescDisplay.None;
        }

        const [name, text, css] = this.activeItem.match({
            Status: (name) => [`${name.charAt(0).toUpperCase()}${name.slice(1)}`, statusFromName(name), "chipDescBackgroundMega"],
            Terrain: (name) => [`${name.charAt(0).toUpperCase()}${name.slice(1)}`, terrainFromName(name), "chipDescBackgroundStd"],
            ChipType: (name) => [`${name.charAt(0).toUpperCase()}${name.slice(1)}`, chipTypeFromName(name), chipTypeBgCss(name)],
            Blight: (name) => [
                `Blight (${name.charAt(0).toUpperCase()}${name.slice(1)})`, blightFromName(name), "chipDescBackgroundGiga"
            ],
            _: () => { throw new TypeError("inconceivable!!") },
        });

        return ChipDescDisplay.GlossaryItem(name, css, text)
    }

    view(_: CVnode): JSX.Element {
        const activeItemData = this.getActiveItemData();

        return (
            <>
                <div class="col-span-3 sm:col-span-4 md:col-span-5 px-0 z-10">
                    <div class="Folder activeFolder">
                        {this.viewTopRow()}
                        {this.renderChipTypes()}
                        {this.renderPanels()}
                        {this.renderStatuses()}
                        {this.renderBlights()}
                    </div>
                </div>
                <div class="col-span-1 flex flex-col px-0 max-h-full">
                    <ChipDesc item={activeItemData} />
                </div>
            </>
        )
    }
}