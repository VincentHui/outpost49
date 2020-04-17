import * as THREE from 'three';
import { planetOrigin } from './app'
import { asteroids } from './asteroidLauncher'
var dir = new THREE.Vector3();
var newPosition = new THREE.Vector3();
const shellOrigin = new THREE.Vector3().copy(planetOrigin).add(new THREE.Vector3(0, 100, -200))
const initialSpeed = 30
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
    shellObj.velocity.copy(dir).multiplyScalar(initialSpeed)
    realScene.add( shellObj.shell );
}
var LoadedShells= []
var UnloadedShells =[]
export const initCannon =()=>{
    for (let index = 0; index < 8; index++) {
        var geometry = new THREE.BoxGeometry( 20, 20, 20 );
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        var shell = new THREE.Mesh( geometry, material );
        LoadedShells.push({
            shell, 
            direction:new THREE.Vector3( 0, 0, 0 ),
            velocity: new THREE.Vector3( 0, 0, 0)
        });        
    }
}
var desiredVelocity = new THREE.Vector3()
// var newPosition = new THREE.Vector3()
var steering = new THREE.Vector3()
const mass = 20
const speed = 300
var raycaster = new THREE.Raycaster();
raycaster.far = 10;
var raycastDir = new THREE.Vector3();
export const updateCannonShells = (delta, realscene)=>{
    var i = UnloadedShells.length;
    while (i--) {

        const obj = UnloadedShells[i]
        desiredVelocity.copy( obj.direction).multiplyScalar(speed * delta);
        steering.copy(desiredVelocity).sub(obj.velocity)
        steering.divideScalar(mass)
        obj.velocity.add(steering)
        obj.shell.position.add( obj.velocity )
        // var ray = new THREE.Ray( obj.shell.position, obj.velocity.clone().normalize() );
        
        raycaster.set(obj.shell.position, raycastDir.copy(obj.velocity).normalize())
        const collisionResults = raycaster.intersectObjects( asteroids );
        // console.log(asteroids)
        if ( collisionResults.length > 0 ) 
        {
            console.log('HIT!')
            // a collision occurred... do something...
        }

        const distance = obj.shell.position.distanceTo (shellOrigin)
        if (distance > 1500){
            UnloadedShells.splice(i, 1);
            LoadedShells.push(obj)
            realscene.remove(obj.shell)
            continue
        }
        
    }
    // UnloadedShells.forEach(function(obj){
    //     //calculate velocity


    // })
}