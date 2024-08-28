
export class Client {
    name: string
    id: string
    tableNumber: number
    orderedItems: [string]
    enteredRestaurant = false

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
    ingredients: [string]
}

export class Menu {
    items: [MenuItem]
}