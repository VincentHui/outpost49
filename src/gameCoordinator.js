import { SubscribeEvent, FireEvent, ClearEvent } from "./eventTable"



export const initCoordinator =()=>{
    SubscribeEvent('PLANET_HIT', ()=>{
        console.log('planet hit!')
    })
}