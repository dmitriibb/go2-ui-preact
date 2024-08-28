import {Attributes, Component, ComponentChild, ComponentChildren, Ref} from "preact";
import {Client, Menu} from "../model/model";
import {managerService} from "../services/managerService";
import {MenuComponent} from "./Menu";
import "./clientStyles.css"
import {ClientPubSubEvent, ClientPubSubEventType, pubSubService} from "../services/pubSubService";

class ClientComponentState {
    client: Client
    menu: Menu
}

export class ClientComponent extends Component<ClientComponentState, any> {
    client: Client
    menu: Menu
    pubsubToken: any
    constructor(props: ClientComponentState) {
        super(props);
        this.client = props.client ? this.props.client : new Client("Dima")
        this.state = {
            client: this.client,
            menu: this.menu
        }
    }

    updateClientState = () => {
        this.setState({
            client: this.client,
            menu: this.menu
        })
    }

    componentWillMount() {
        console.log(`${this.client.name} subscribe for client events`)
        this.pubsubToken = pubSubService.subscribeForClientEvents(this.client.name, (_, msg) => {
            this.menuSelectEvent(msg)
        })
    }

    menuSelectEvent(event: ClientPubSubEvent) {
        if (event.clientName != this.client.name) {
            console.warn(`${this.client.name} received event for ${event.clientName}`)
            return
        }
        switch (event.type) {
            case ClientPubSubEventType.MenuItemPick:
                console.log(`${this.client.name} pick ${event.data}`)
                this.client.orderedItems.push(event.data)
                this.updateClientState()
                break
            case ClientPubSubEventType.MenuItemUnpick:
                console.log(`${this.client.name} unpick ${event.data}`)
                const indx = this.client.orderedItems.indexOf(event.data)
                if (indx > -1) {
                    this.client.orderedItems.splice(indx, 1)
                    this.updateClientState()
                }
                break
        }
    }

    componentWillUnmount() {
        console.log(`${this.client.name} unsubscribe from client events`)
        pubSubService.unsubscribe(this.pubsubToken)
    }

    manuallyUnsubscribe = () => {
        this.componentWillUnmount()
    }

    enterRestaurant = () => {
        managerService.enterRestaurant(this.state.client.name)
            .then(result => {
                console.log(result)
                this.client.id = result.clientId
                this.client.tableNumber = result.tableNumber
                this.client.enteredRestaurant = true
                // this.setState({client: this.client})
                this.updateClientState()
            }).catch(error => {
                console.error(`can't enterRestaurant because ${error}`)
            })
    }

    askForMenu = () => {
        managerService.getMenu()
            .then(result => {
                console.log(result)
                this.menu = result
                this.updateClientState()
            }).catch(error => {
            console.error(`can't get menu ${error}`)
        })
    }

    render(props?: Readonly<ClientComponentState>, state?: Readonly<ClientComponentState>, context?: any): ComponentChild {
        let menuFragment = state.menu
            ? <MenuComponent menu={state.menu} clientName={props.client.name}/>
            : 'no menu'
        return (
            <div class="clientDiv col">
                <div class="row">
                    {/*client props*/}
                    <div className="col 3">
                        <ul className="clientPropsList">
                            <li className="clientPropsListItem">id: {props.client.id}</li>
                            <li className="clientPropsListItem">name: {props.client.name}</li>
                            <li className="clientPropsListItem">table: {props.client.tableNumber}</li>
                            <li className="clientPropsListItem">items: [{props.client.orderedItems.join(", ")}]</li>
                        </ul>
                        <div className="row">
                            <button onClick={this.enterRestaurant} disabled={props.client.enteredRestaurant}>
                                enter restaurant
                            </button>
                        </div>
                        <div className="row">
                            <button onClick={this.askForMenu} disabled={!props.client.enteredRestaurant}>ask menu
                            </button>
                        </div>
                        <div className="row">
                            <button onClick={this.manuallyUnsubscribe}>unsubscribe from events</button>
                        </div>
                    </div>
                    {menuFragment}
                </div>
            </div>
        )
    }
}