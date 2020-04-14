import * as THREE from 'three';
import { planetOrigin } from './app'
var dir = new THREE.Vector3();
var newPosition = new THREE.Vector3();
const shellOrigin = new THREE.Vector3().copy(planetOrigin).add(new THREE.Vector3(0, 100, -200))
export const fireCannon = (intersects, realScene, direction)=>{
    var shellObj = LoadedShells.pop()
    if (!shellObj){
        console.log('NO SHELLS!')
        return;
    }
    UnloadedShells.push(shellObj)
    newPosition.set(intersects.x, intersects.y, 0)
    dir.subVectors(newPosition , shellOrigin).normalize();
    shellObj.shell.position.copy(shellOrigin);
    shellObj.direction.copy(dir)
    realScene.add( shellObj.shell );
}
var LoadedShells= []
var UnloadedShells =[]
export const initCannon =()=>{
    for (let index = 0; index < 10; index++) {
        var geometry = new THREE.BoxGeometry( 20, 20, 20 );
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        var shell = new THREE.Mesh( geometry, material );
        LoadedShells.push({
            shell, 
            direction:new THREE.Vector3( 0, 0, 1 ),
            velocity: new THREE.Vector3( 0, 0, 0)
        });        
    }
}
var desiredVelocity = new THREE.Vector3()
// var newPosition = new THREE.Vector3()
var steering = new THREE.Vector3()
const mass = 10
const speed = 600
export const updateCannonShells = (delta)=>{
    UnloadedShells.forEach(function(obj){
        //calculate velocity
        desiredVelocity.copy( obj.direction).multiplyScalar(speed * delta);
        
        steering.copy(desiredVelocity).sub(obj.velocity)
        steering.divideScalar(mass)
        obj.velocity.add(steering)
        // console.log(obj.velocity)
        // newPosition.copy( obj.shell.position ).add( obj.velocity );
        obj.shell.position.add( obj.velocity )
    })
}