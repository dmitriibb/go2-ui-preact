import {Attributes, Component, ComponentChild, ComponentChildren, Ref} from "preact";
import {Menu, MenuItem} from "../model/model";
import "./menuStyles.css"
import {pubSubService} from "../services/pubSubService";

class MenuComponentProps {
    clientId: string
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
            <div>
                Menu:
                {props.menu.items.map(menuItem =>
                    <MenuItemComponent key={menuItem.name} item={menuItem} clientId={props.clientId}/>
                )}
            </div>
        )
    }

}

class MenuItemComponentProps {
    clientId: string
    item: MenuItem
}

class MenuItemComponentState {
    clientId: string
    item: MenuItem
    picked: boolean
}

export class MenuItemComponent extends Component<MenuItemComponentProps, any> {
    menuItem: MenuItem
    picked = false
    clientId: string
    constructor(props) {
        super(props);
        this.menuItem = props.item
        this.clientId = props.clientId
        this.state = {
            item: this.menuItem,
            picked: this.picked
        }
    }
    select = (event) => {
        this.picked = event.currentTarget.checked
        if (this.picked) {
            console.log(`select ${this.menuItem.name}`)
            pubSubService.clientPickedMenuItem(this.clientId, this.menuItem.name)
        } else  {
            console.log(`unselect ${this.menuItem.name}`)
            pubSubService.clientUnpickedMenuItem(this.clientId, this.menuItem.name)
        }

    }

    render(props?: Readonly<MenuItemComponentProps>, state?: Readonly<MenuItemComponentState>, context?: any): ComponentChild {
        return (
            <div class="menuItem">
                <div className="row">
                    <div className="col-3">{props.item.name}</div>
                    <div className="col-3">{props.item.price}</div>
                    <div className="col-3">
                        <input type="checkbox" onChange={this.select}/>
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