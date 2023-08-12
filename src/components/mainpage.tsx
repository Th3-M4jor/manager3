import * as top from "../TopLvlMsg";
import { TopBar } from "../components/topbar";
import { NavTabs } from "../components/navtabs";

import { Library } from "../pages/library";
import { Pack } from "../pages/pack";
import { Folder } from "../pages/folder";
import { GroupFolder } from "../pages/groupFolder";

let Glossary: typeof import("../pages/glossary").Glossary | undefined;

export function MainPage() {
    const subPage = top.getActiveTab().match({
        Folder: () => <Folder />,
        Library: () => <Library />,
        Pack: () => <Pack />,
        Glossary: () => {
            Glossary ??= top.getGlossary();

            return <Glossary />
    },
        GroupFolder: (_) => <GroupFolder />
    });

    return (
        <div class="outermostDiv">
            <TopBar />
            <div style="background-color: #4abdb5" class="p-2.5">
                <div class="grid gap-0 grid-cols-4 sm:grid-cols-5 md:grid-cols-6">
                    <NavTabs />
                    {subPage}
                </div>
            </div>
        </div>
    );
}
