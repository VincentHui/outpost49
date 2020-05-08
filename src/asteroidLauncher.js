import { planetOrigin, planetParent } from './planet'
import { SubscribeEvent, FireEvent, ClearEvent } from "./eventTable"
import * as THREE from "three";
const asteroidOrigin = new THREE.Vector3().copy(planetOrigin).add(new THREE.Vector3(-400, 400, 0))
var launchedAsteroids = []
var unlaunchedAsteroids =[]
export const asteroidParent = new THREE.Object3D('asteroidParent')
var collisionForce = new THREE.Vector3()
export const collideWithAteroid = (asteroid, shell, collisionNormal)=>{
    const found = launchedAsteroids.find(obj => obj.asteroid === asteroid)
    found.velocity.add(collisionForce.copy(collisionNormal.multiplyScalar(0.01)))
}

export const initAsteroidLauncher =(realScene)=>{
    var geometry = new THREE.BoxGeometry( 20, 20, 20 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var asteroid = new THREE.Mesh( geometry, material );
    asteroid.name ='collidable'
    asteroid.position.copy(asteroidOrigin)
    asteroid.scale.set(5,5,5);
    // realScene.attach(asteroid);
    unlaunchedAsteroids.push({asteroid:asteroid, velocity: new  THREE.Vector3().copy(planetOrigin).sub(asteroidOrigin).add(new THREE.Vector3(0,0,0)).normalize().multiplyScalar(0.5)})
    realScene.add( asteroidParent );
}

export const createCollidableAsteroid =(realScene)=>{
   
    let obj = unlaunchedAsteroids.pop()
    asteroidParent.attach(obj.asteroid);
    launchedAsteroids.push(obj)
    
}
var desiredVelocity = new THREE.Vector3()
var steering = new THREE.Vector3()
const mass = 200
const speed = 150
var raycaster = new THREE.Raycaster();
raycaster.far = 40;
var raycastDir = new THREE.Vector3();
export const updateAsteroids = (delta, realscene)=>{
    var i = launchedAsteroids.length;
    while (i--) {
        const obj = launchedAsteroids[i]
        desiredVelocity.copy( obj.velocity).normalize().multiplyScalar(speed * delta);
        steering.copy(desiredVelocity).sub(obj.velocity)
        steering.divideScalar(mass)
        obj.velocity.add(steering)
        obj.asteroid.position.add( obj.velocity )

        raycaster.set(obj.asteroid.position, raycastDir.copy(obj.velocity).normalize())
        const collisionResults = raycaster.intersectObjects( planetParent.children );
        if ( collisionResults.length > 0 ) 
        {
            // const collided = collisionResults[0].object;
            FireEvent('PLANET_HIT')
            launchedAsteroids.splice(i, 1);
            unlaunchedAsteroids.push(obj)
            asteroidParent.remove(obj.asteroid)
            
        }
    }
}