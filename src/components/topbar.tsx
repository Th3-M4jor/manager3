import * as top from "../TopLvlMsg";
import { ChipLibrary } from "../library/library";

export function TopBar() {

    const tabname = top.getActiveTab().match({
        Folder: () => { return ChipLibrary.FolderName },
        Library: () => { return "Library" },
        Pack: () => { return "Pack" },
        Glossary: () => { return "Glossary" },
        GroupFolder: (name) => {
            return (name.length > 15 ? name.substring(0, 12) : name) + "'s Folder";
        }
    });

    const topMsg = top.getTopMsg();

    return (
        <div class="topStatusBar">
            <span class="pl-1">
                {tabname}
            </span>
            <span class="topMsgSpan">
                {topMsg}
            </span>
        </div>
    );
}