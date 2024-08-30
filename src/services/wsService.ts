import {ReadyOrderItem} from "../model/model";
import {pubSubService} from "./pubSubService";

const go2ManagerUrl = "localhost:9010"

enum WsMessageType {
    WsMessageTypeString = "string",
    WsMessageTypeLogin = "login",
    WsMessageTypeReadyOrderItem = "readyOrderItem"
}

class WsMessageLogin {
    username: string
    password: string

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}

class WsMessage {
    type: WsMessageType
    payload: string

    constructor(type: WsMessageType = WsMessageType.WsMessageTypeString, payload: string = "") {
        this.type = type;
        this.payload = payload;
    }
}

export class WsService {

    clientIdToWsManager = {}
    clientIdToWsWaiter = {}

    connectToManager(clientId: string) {
        const ws = new WebSocket(`ws://${go2ManagerUrl}/ws`);
        this.clientIdToWsManager[clientId] = ws

        const loginMsg = JSON.stringify(new WsMessageLogin(clientId, ""))

        ws.onopen = function(event) {
            console.log(`on open ws for ${clientId}`)
            ws.send(JSON.stringify(new WsMessage(WsMessageType.WsMessageTypeLogin, loginMsg)));
            ws.send(JSON.stringify(new WsMessage(WsMessageType.WsMessageTypeString, "Hello world!")));
        }

        ws.onmessage = function(msgEvent) {
            console.log(`${clientId} received ws from manager: %s`, msgEvent);
            onMsgFromManager(clientId, msgEvent)
        }

        ws.onclose = (event) => {
            console.log(`on close ws for ${clientId}`)
            delete this.clientIdToWsManager[clientId]
        }
    }

    connectToWaiter(clientId: string, waiterWsUrl: string) {
        const ws = new WebSocket(waiterWsUrl);
        this.clientIdToWsWaiter[clientId] = ws

        const loginMsg = JSON.stringify(new WsMessageLogin(clientId, ""))

        ws.onopen = function(event) {
            console.log(`on open ws for ${clientId}`)
            ws.send(JSON.stringify(new WsMessage(WsMessageType.WsMessageTypeLogin, loginMsg)));
            ws.send(JSON.stringify(new WsMessage(WsMessageType.WsMessageTypeString, "Hello world!")));
        }

        ws.onmessage = function(msgEvent) {
            console.log('received: %s', msgEvent);
            onMsgFromWaiter(clientId, msgEvent)
        }

        ws.onclose = (event) => {
            console.log(`on close ws for ${clientId}`)
            delete this.clientIdToWsWaiter[clientId]
        }
    }

    closeWsManager(clientId: string) {
       this.closeWs(clientId, this.clientIdToWsManager)
    }

    closeWsWaiter(clientId: string) {
        this.closeWs(clientId, this.clientIdToWsWaiter)
    }

    private closeWs(clientId: string, clientIdToWs: object) {
        const ws = clientIdToWs[clientId]
        if (!ws) {
            console.warn(`ws not found for client ${clientId}`)
            return
        }
        console.log(`close ws for ${clientId}`)
        try {
            ws.close()
        } catch (ex) {
            console.warn(`can't close ${clientId} ws because ${ex}`)
        }
        delete clientIdToWs[clientId]
    }
}

function onMsgFromManager(clientId: string, msgEvent: MessageEvent) {
    const msg: WsMessage = Object.assign(new WsMessage, JSON.parse(msgEvent.data))
    switch (msg.type) {
        case WsMessageType.WsMessageTypeString:
            wsService.connectToWaiter(clientId, msg.payload)
            break
        default:
            console.warn(`${clientId} ws received unexpected msg from manager - ${msgEvent.data}`)
    }
}

function onMsgFromWaiter(clientId: string, msgEvent: MessageEvent) {
    const msg: WsMessage = Object.assign(new WsMessage, JSON.parse(msgEvent.data))
    switch (msg.type) {
        case WsMessageType.WsMessageTypeReadyOrderItem:
            const item = Object.assign(new ReadyOrderItem, JSON.parse(msg.payload))
            pubSubService.clientReceivedReadyOrderItem(clientId, item)
            break
        default:
            console.warn(`${clientId} ws received unexpected msg from manager - ${msgEvent.data}`)
    }
}

export const wsService = new WsService()
