import {EnterRestaurantResponse, Menu, MenuItem} from "../model/model"

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
}

export const managerService = new ManagerService()
