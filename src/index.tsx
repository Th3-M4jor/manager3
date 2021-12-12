import m from "mithril";

import "./fragment-polyfix";

import * as top from "./TopLvlMsg";

import { BattleChip } from "./library/battlechip";
import { ChipLibrary } from "./library/library";

import { MainPage } from "./components/mainpage";

import { Library } from "./pages/library";
import { Pack } from "./pages/pack";
import { Folder } from "./pages/folder";
import { GroupFolder } from "./pages/groupFolder";

import "../static/styles.pcss";

async function main() {

    const chips = await m.request<BattleChip[]>({
        method: "GET",
        url: process.env.BASE_URL + "fetch/chips",
        type: BattleChip
    });

    window.addEventListener("beforeunload", function (e) {
        const confirmationMessage = 'Progress might be lost if you leave without saving an export.';
        if (ChipLibrary.ChangeSinceLastSave) {
            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            ChipLibrary.saveData();
            return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.    
        }
    });

    ChipLibrary.initFromChips(chips);

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
}

main()