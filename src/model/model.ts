
export class Client {
    name: string
    id: string
    tableNumber: number
    orderedItems: [string]

    constructor(name: string) {
        this.name = name;
    }
}

export class EnterRestaurantResponse {
    clientId: string
    message: string
    status: string
    tableNumber: number
}