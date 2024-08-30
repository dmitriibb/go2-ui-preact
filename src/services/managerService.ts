import {ClientOrder, ClientOrderResponse, EnterRestaurantResponse, Menu, MenuItem, OrderItem} from "../model/model"

const go2ManagerUrl = "localhost:9010"

class ManagerService {
    enterRestaurant(clientName: string, clientId: string = null): Promise<EnterRestaurantResponse> {
        const body = {
            clientName: clientName,
            clientId: clientId
        }
        return fetch(`http://${go2ManagerUrl}/hostes/enter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(body)
        }).then(response => response.json())
            .then(res => Object.assign(new EnterRestaurantResponse, res))
    }

    getMenu(): Promise<Menu> {
        return fetch(`http://${go2ManagerUrl}/menu`, {
            method: 'GET',
        }).then(response => response.json())
            .then(res => Object.assign(new Menu, res))
    }

    makeAnOrder(clientId: string, items: string[]): Promise<ClientOrderResponse> {
        const orderItems = items.map(i => new OrderItem(i))
        return fetch(`http://${go2ManagerUrl}/client-orders`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(new ClientOrder(clientId, orderItems))
        }).then(response => response.json())
            .then(res => Object.assign(new ClientOrderResponse, res))
    }
}

export const managerService = new ManagerService()
