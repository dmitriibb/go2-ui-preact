import { PubSub } from 'pubsub-js';
import {ReadyOrderItem} from "../model/model";

export class ClientPubSubEvent {
    clientId: string
    type: ClientPubSubEventType
    data: string
    dataObj: any

    constructor(clientId: string, type: ClientPubSubEventType, data: string) {
        this.clientId = clientId;
        this.type = type;
        this.data = data;
    }
}

export enum ClientPubSubEventType {
    MenuItemPick,
    MenuItemUnpick,
    OrderItemReadyReceived

}

const clientEventsTopic = "client_events"

export class PubSubService {

    // @ts-ignore
    subscribeForClientEvents(clientName: string, sub: (topicName, msg: ClientPubSubEvent) => {}) {
        // every client subscribes to all clients' event. then just ignores others'
        return PubSub.subscribe(clientEventsTopic, sub)
    }

    unsubscribe(token) {
        PubSub.unsubscribe(token)
    }

    clientPickedMenuItem(clientId: string, menuItem: string) {
        PubSub.publish(
            clientEventsTopic,
            new ClientPubSubEvent(clientId, ClientPubSubEventType.MenuItemPick, menuItem),
        )
    }
    clientUnpickedMenuItem(clientId: string, menuItem: string) {
        PubSub.publish(
            clientEventsTopic,
            new ClientPubSubEvent(clientId, ClientPubSubEventType.MenuItemUnpick, menuItem),
        )
    }
    clientReceivedReadyOrderItem(clientId: string, readyOrderItem: ReadyOrderItem) {
        const event = new ClientPubSubEvent(clientId, ClientPubSubEventType.OrderItemReadyReceived, "")
        event.dataObj = readyOrderItem
        PubSub.publish(clientEventsTopic, event)
    }
}

export const pubSubService = new PubSubService()
