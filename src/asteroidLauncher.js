import { planetOrigin } from './app'
import * as THREE from "three";
const asteroidOrigin = new THREE.Vector3().copy(planetOrigin).add(new THREE.Vector3(-400, 400, -200))
export var asteroids=[]
export const createCollidableAsteroid =(realScene)=>{
    var geometry = new THREE.BoxGeometry( 20, 20, 20 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var asteroid = new THREE.Mesh( geometry, material );
    asteroid.position.copy(asteroidOrigin)
    asteroid.scale.set(5,5,5);
    asteroids.push(asteroid);
    realScene.add( asteroid );
}

