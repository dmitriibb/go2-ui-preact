import {Attributes, Component, ComponentChild, ComponentChildren, Ref} from "preact";
import {Client, Menu, ReadyOrderItem} from "../model/model";
import {managerService} from "../services/managerService";
import {MenuComponent} from "./Menu";
import "./clientStyles.css"
import {ClientPubSubEvent, ClientPubSubEventType, pubSubService} from "../services/pubSubService";
import {wsService} from "../services/wsService";
import {ClientTableComponent} from "./ClientTable";

class ClientComponentProps {
    client: Client
}

class ClientComponentState {
    client: Client
    menu: Menu
    readyOrderItems: ReadyOrderItem[]
}

export class ClientComponent extends Component<ClientComponentProps, any> {
    client: Client
    menu: Menu
    readyOrderItems: ReadyOrderItem[] = []
    pubsubToken: any
    constructor(props: ClientComponentState) {
        super(props);
        this.client = props.client ? this.props.client : new Client("Dima")
        this.state = {
            client: this.client,
            menu: this.menu,
            readyOrderItems: this.readyOrderItems
        }
    }

    updateClientState = () => {
        this.setState({
            client: this.client,
            menu: this.menu
        })
    }

    clientEventListen(event: ClientPubSubEvent) {
        if (event.clientId != this.client.id) {
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
            case ClientPubSubEventType.OrderItemReadyReceived:
                const item: ReadyOrderItem = event.dataObj
                console.log("%s received ready order item %s", this.client.name, item.dishName)
                this.readyOrderItems.push(item)
                this.updateClientState()
                break
        }
    }

    componentWillUnmount() {
        this.unsubscribeFromClientEvents()
        wsService.closeWsManager(this.client.id)
        wsService.closeWsWaiter(this.client.id)
    }

    makeAnOrder = () => {
        managerService.makeAnOrder(this.client.id, this.client.orderedItems)
            .then(res => {
                console.log(res)
                wsService.connectToManager(this.client.id)
            })
            .catch(err => console.error(err))
    }

    enterRestaurant = () => {
        managerService.enterRestaurant(this.state.client.name)
            .then(result => {
                console.log(result)
                this.client.id = result.clientId
                this.client.tableNumber = result.tableNumber
                this.client.enteredRestaurant = true
                // this.setState({client: this.client})
                this.subscribeForClientEvents()
                this.updateClientState()
            }).catch(error => {
                console.error(`can't enterRestaurant because ${error}`)
            })
    }

    unsubscribeFromClientEvents = () => {
        console.log(`${this.client.name} unsubscribe from client events`)
        pubSubService.unsubscribe(this.pubsubToken)
        this.pubsubToken = null
    }

    subscribeForClientEvents = () => {
        if (this.pubsubToken) {
            console.warn(`${this.client.id} can't subscribe for event because already subscribed`)
            return
        }
        console.log(`${this.client.name} subscribe for client events`)
        this.pubsubToken = pubSubService.subscribeForClientEvents(this.client.name, (_, msg) => {
            this.clientEventListen(msg)
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

    render(props?: Readonly<ClientComponentProps>, state?: Readonly<ClientComponentState>, context?: any): ComponentChild {
        let menuFragment = state.menu
            ? <MenuComponent menu={state.menu} clientId={props.client.id}/>
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
                            <button onClick={this.makeAnOrder}>order</button>
                        </div>
                    </div>
                    {menuFragment}
                </div>
                {/*food items*/}
                <div class="row">
                    <div class="col-12">
                        <ClientTableComponent items={state.readyOrderItems}/>
                    </div>
                </div>
                {/*buttons*/}
                <div class="row">
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
                        <button onClick={this.makeAnOrder}>order</button>
                    </div>
                </div>
            </div>
        )
    }
}