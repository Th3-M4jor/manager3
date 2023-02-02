import { RenderableProps } from "preact";

export interface DropMenuProps {
    /**
     * Applied to the element that opens the menu on hover
     */
    class?: string,

    /**
     * The dropdown menu text, defaults to "Menu"
     */
    text?: string,
}

export function DropMenu(props: RenderableProps<DropMenuProps>) {
    return (
        <div class="dropdown">
            <button class={props.class}>{props.text ? props.text : "Menu"}</button>
            <div class="dropdown-content">
                {props.children}
            </div>
        </div>
    );
}
