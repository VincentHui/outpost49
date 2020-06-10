import { SubscribeEvent, FireEvent, ClearEvent } from "./eventTable"

let lives = 3;
export const GameEnum = {"paused":1, "menu":2, "playing":3, "gameOver":4}
export var currentState = GameEnum.menu

export const initCoordinator =()=>{
    SubscribeEvent('GAME_START', ()=>{
        currentState = GameEnum.playing
    })

    SubscribeEvent('GAME_REPLAY', ()=>{
        currentState = GameEnum.playing
        lives = 3
    })

    
    SubscribeEvent('PLANET_HIT', ()=>{
        lives--
        if (lives <=0 ){
            console.log('NO LIVES LEFT!')
            FireEvent('GAME_OVER')
            return
        }
        console.log('planet hit! ' + lives + ' lives left!')
    })
    SubscribeEvent('GAME_OVER',()=>{
        currentState = GameEnum.gameOver
        // console.log('game over!')
    })
}