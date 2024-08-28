import { PubSub } from 'pubsub-js';

export class ClientPubSubEvent {
    clientName: string
    type: ClientPubSubEventType
    data: string

    constructor(clientName: string, type: ClientPubSubEventType, data: string) {
        this.clientName = clientName;
        this.type = type;
        this.data = data;
    }
}

export enum ClientPubSubEventType {
    MenuItemPick,
    MenuItemUnpick
}

const clientEventsTopic = "client_events"

export class PubSubService {

    // @ts-ignore
    subscribeForClientEvents(clientName: string, sub: (topicName, msg: ClientPubSubEvent) => {}) {
        return PubSub.subscribe(clientEventsTopic, sub)
    }

    unsubscribe(token) {
        PubSub.unsubscribe(token)
    }

    clientPickedMenuItem(clientName: string, menuItem: string) {
        PubSub.publish(
            clientEventsTopic,
            new ClientPubSubEvent(clientName, ClientPubSubEventType.MenuItemPick, menuItem),
        )
    }
}

export const pubSubService = new PubSubService()
