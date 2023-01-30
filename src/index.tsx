import { render } from "preact";

import { BattleChip, ChipData } from "./library/battlechip";
import { ChipLibrary } from "./library/library";

import { MainPage } from "./components/mainpage";

async function main() {

    const res = await fetch(
        //@ts-ignore
        process.env.BASE_URL + "fetch/chips"
        )

    const chips: BattleChip[] = (await res.json()).map((chip: ChipData) => new BattleChip(chip));

    window.addEventListener("beforeunload", function (e) {
        const confirmationMessage = 'Progress might be lost if you leave without saving an export.';
        if (ChipLibrary.ChangeSinceLastSave) {
            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            ChipLibrary.saveData();
            return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.    
        }
    });

    ChipLibrary.initFromChips(chips);

    render(<MainPage/>, document.body);

    /*
    m.route(document.body, "/Library", {
        "/Library": {
            render: function () {
                return (
                    <MainPage activeTab={top.Tabs.Library}>
                        <Library />
                    </MainPage>
                );
            }
        },
        "/Pack": {
            render: function () {
                return (
                    <MainPage activeTab={top.Tabs.Pack}>
                        <Pack />
                    </MainPage>
                );
            }
        },
        "/Folder": {
            render: function () {
                return (
                    <MainPage activeTab={top.Tabs.Folder}>
                        <Folder />
                    </MainPage>
                );
            }
        },
        "/Glossary": {
            render: function () {
                return (
                    <MainPage activeTab={top.Tabs.Glossary}>
                        <Glossary />
                    </MainPage>
                );
            }
        },
        "/Group/:playerName": {
            onmatch: function (args) {
                const folders = ChipLibrary.GroupFolders;
                if(!folders || !folders.some(f => f[0] == args.playerName)) {
                    //@ts-ignore
                    return m.route.SKIP;
                }
            },
            render: function () {
                return (
                    <MainPage activeTab={top.Tabs.GroupFolder(m.route.param("playerName"))}>
                        <GroupFolder />
                    </MainPage>
                );
            }
        }
    });
    */
}

main()