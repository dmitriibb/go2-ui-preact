
export class Client {
    name: string
    id: string
    tableNumber: number
    orderedItems: string[]
    enteredRestaurant = false
    connectedToWsManager = false
    connectedToWsWaiter = false

    constructor(name: string) {
        this.name = name;
        this.orderedItems = []
    }
}

export class EnterRestaurantResponse {
    clientId: string
    message: string
    status: string
    tableNumber: number
}

export class MenuItem {
    name: string
    price: number
    description: string
    ingredients: string[]
}

export class Menu {
    items: MenuItem[]
}

export class OrderItem {
    dishName: string
    quantity: number
    comment: string

    constructor(dishName: string) {
        this.dishName = dishName;
        this.quantity = 1
    }
}

export class ClientOrder {
    clientId: string
    items: OrderItem[]

    constructor(clientId: string, items: OrderItem[]) {
        this.clientId = clientId;
        this.items = items;
    }
}

export class ClientOrderResponse {
    comment: string
}

export class ReadyOrderItem {
    orderId: number
    itemId: number
    dishName: string
    comment: string
    payload: string
}