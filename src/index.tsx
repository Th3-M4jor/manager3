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
}

main()