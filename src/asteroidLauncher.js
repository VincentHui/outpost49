import { planetOrigin } from './planet'
import * as THREE from "three";
const asteroidOrigin = new THREE.Vector3().copy(planetOrigin).add(new THREE.Vector3(-400, 400, 0))
var asteroidsToMove = []
export const asteroidParent = new THREE.Object3D('asteroidParent')
var collisionForce = new THREE.Vector3()
export const collideWithAteroid = (asteroid, shell, collisionNormal)=>{
    const found = asteroidsToMove.find(obj => obj.asteroid === asteroid)
    found.velocity.add(collisionForce.copy(collisionNormal.multiplyScalar(0.01)))
}

export const createCollidableAsteroid =(realScene)=>{
    var geometry = new THREE.BoxGeometry( 20, 20, 20 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var asteroid = new THREE.Mesh( geometry, material );
    asteroid.name ='collidable'
    asteroid.position.copy(asteroidOrigin)
    asteroid.scale.set(5,5,5);
    asteroidParent.attach(asteroid);
    asteroidsToMove.push({asteroid:asteroid, velocity: new  THREE.Vector3().copy(planetOrigin).sub(asteroidOrigin).add(new THREE.Vector3(0,0,0)).normalize().multiplyScalar(0.5)})
    realScene.add( asteroidParent );
}
var desiredVelocity = new THREE.Vector3()
var steering = new THREE.Vector3()
const mass = 200
const speed = 100
export const updateAsteroids = (delta, realscene)=>{
    var i = asteroidsToMove.length;
    while (i--) {
        const obj = asteroidsToMove[i]
        desiredVelocity.copy( obj.velocity).normalize().multiplyScalar(speed * delta);
        steering.copy(desiredVelocity).sub(obj.velocity)
        steering.divideScalar(mass)
        obj.velocity.add(steering)
        obj.asteroid.position.add( obj.velocity )
    }
}
