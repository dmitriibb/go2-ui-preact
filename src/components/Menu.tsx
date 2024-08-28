import {Attributes, Component, ComponentChild, ComponentChildren, Ref} from "preact";
import {Menu, MenuItem} from "../model/model";
import "./menuStyles.css"
import {pubSubService} from "../services/pubSubService";

class MenuComponentProps {
    clientName: string
    menu: Menu
}

export class MenuComponent extends Component<MenuComponentProps, any> {
    menu: Menu
    constructor(props) {
        super(props);
        this.menu = props.menu
        this.state = {
            menu: this.menu
        }
    }

    render(props?: Readonly<MenuComponentProps>, state?: Readonly<MenuComponentProps>, context?: any): ComponentChild {
        return (
            <div class="menu col-7">
                Menu:
                {props.menu.items.map(menuItem =>
                    <MenuItemComponent key={menuItem.name} item={menuItem} clientName={props.clientName}/>
                )}
            </div>
        )
    }

}

class MenuItemComponentProps {
    clientName: string
    item: MenuItem
}

export class MenuItemComponent extends Component<MenuItemComponentProps, any> {
    menuItem: MenuItem
    clientName: string
    constructor(props) {
        super(props);
        this.menuItem = props.item
        this.clientName = props.clientName
        this.state = {
            item: this.menuItem
        }
    }
    select = () => {
        console.log(`select ${this.menuItem.name}`)
        pubSubService.clientPickedMenuItem(this.clientName, this.menuItem.name)
    }

    render(props?: Readonly<MenuItemComponentProps>, state?: Readonly<MenuItemComponentProps>, context?: any): ComponentChild {
        return (
            <div class="menuItem">
                <div className="row">
                    <div className="col-3">{props.item.name}</div>
                    <div className="col-3">{props.item.price}</div>
                    <div className="col-3">
                        <input type="checkbox" onInput={this.select}/>
                    </div>
                </div>
                <div className="row">
                <div className="col-8">{props.item.description}</div>
                </div>
                {props.item.ingredients.length
                    ? <>
                        <div className="row">
                            <div className="col-8">[{props.item.ingredients.join(", ")}]</div>
                        </div>
                        </>
                    : ''
                }
            </div>
        )
    }

}