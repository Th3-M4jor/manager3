import m, { CVnode } from "mithril";

import { MitrhilTsxComponent } from "../JsxNamespace";

import * as top from "../TopLvlMsg";
import { TopBar } from "../components/topbar";
import { NavTabs } from "../components/navtabs";
import { ChipLibrary } from "../library/library";
interface MainPageProps {
    activeTab: top.TabName;
}

export class MainPage extends MitrhilTsxComponent<MainPageProps> {

    tabToString(tab: top.TabName): string {
        const val = tab.match({
            Folder: () => { return ChipLibrary.FolderName },
            Library: () => { return "Library" },
            Pack: () => { return "Pack" },
            GroupFolder: (name) => {
                return (name.length > 15 ? name.substring(0, 12) : name) + "'s Folder";
            }
        });
        return val;
    }

    view(vnode: CVnode<MainPageProps>): JSX.Element {
        return (
            <div class="outermostDiv">
                <TopBar tabName={this.tabToString(vnode.attrs.activeTab)} msg={top.getTopMsg()} />
                <div style="background-color: #4abdb5" class="p-2.5">
                    <div class="grid gap-0 grid-cols-4 sm:grid-cols-5 md:grid-cols-6">
                        <NavTabs activeTab={vnode.attrs.activeTab} />
                        {vnode.children}
                    </div>
                </div>
            </div>
        );
    }
}