import { planetOrigin, planetParent } from './planet'
import { SubscribeEvent, FireEvent, ClearEvent } from "./eventTable"
import { RaycastCollisions } from './cannon'
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

const getPointOnRadius =(originX, originY, radius, angle)=>{
    const x = originX + radius * Math.cos(angle)
    const y = originY + radius * Math.sin(angle)
    return {
        x:x,y:y
    }
}

function randomFloatFromInterval(min, max) { // min and max included 
    return Math.random() * (max - min) + min;
  }

const setAsteroid = (asteroid)=>{
    const randomAngle = randomFloatFromInterval(Math.PI* 1/4 ,Math.PI* 3/4)
    const newPos = getPointOnRadius(planetOrigin.x, planetOrigin.y, 400, randomAngle)
    // console.log(randomAngle)
    asteroid.position.copy(new THREE.Vector3(newPos.x, newPos.y, 0))
    // asteroid.velocity.set(new THREE.Vector3().copy(planetOrigin).sub(asteroid.position).normalize().multiplyScalar(0.5))
}


export const initAsteroidLauncher =(realScene)=>{
    for (let index = 0; index < 3; index++) {
        var geometry = new THREE.BoxGeometry( 20, 20, 20 );
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        var asteroid = new THREE.Mesh( geometry, material );
        asteroid.name ='collidable'
        // asteroid.position.copy(asteroidOrigin)
        setAsteroid(asteroid)
        asteroid.scale.set(5,5,5);
        unlaunchedAsteroids.push({asteroid:asteroid, velocity: new  THREE.Vector3().copy(planetOrigin).sub(asteroid.position).normalize().multiplyScalar(0.5)})
    }

    realScene.add( asteroidParent );
}

export const createCollidableAsteroid =(realScene)=>{
   
    let obj = unlaunchedAsteroids.pop()
    asteroidParent.attach(obj.asteroid);
    obj.velocity.copy(new THREE.Vector3().copy(planetOrigin).sub(obj.asteroid.position).normalize().multiplyScalar(0.5))
    launchedAsteroids.push(obj)
    
}


var desiredVelocity = new THREE.Vector3()
var steering = new THREE.Vector3()
const mass = 200
const speed = 300
var raycaster = new THREE.Raycaster();
raycaster.far = 60;
var raycastDir = new THREE.Vector3();

const removeAsteroid = (obj, i, realscene)=>{
    launchedAsteroids.splice(i, 1);
    unlaunchedAsteroids.push(obj)
    setAsteroid(obj.asteroid)
    asteroidParent.remove(obj.asteroid)
    createCollidableAsteroid(realscene)
}

export const updateAsteroids = (delta, realscene, camera)=>{
    var i = launchedAsteroids.length;
    while (i--) {
        const obj = launchedAsteroids[i]
        desiredVelocity.copy( obj.velocity).normalize().multiplyScalar(speed * delta);
        steering.copy(desiredVelocity).sub(obj.velocity)
        steering.divideScalar(mass)
        obj.velocity.add(steering)
        obj.asteroid.position.add( obj.velocity )

        // raycaster.set(obj.asteroid.position, raycastDir.copy(obj.velocity).normalize())
        // const collisionResults = raycaster.intersectObjects( planetParent.children );
        // const collisionResults = RaycastCollisions(obj.asteroid.position,obj.velocity,raycaster, planetParent.children)
        if (planetOrigin.distanceTo(obj.asteroid.position) < 150 ) 
        {
            FireEvent('PLANET_HIT')
            removeAsteroid(obj, i, realscene)
        }
        if(planetOrigin.distanceTo(obj.asteroid.position) > 500)
        {
            removeAsteroid(obj, i, realscene)
        }
    }
}