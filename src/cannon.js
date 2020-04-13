import * as THREE from 'three';
import { planetOrigin } from './app'
var dir = new THREE.Vector3();
var target = new THREE.Vector3();
const shellOrigin = new THREE.Vector3().copy(planetOrigin).add(new THREE.Vector3(0, 100, -200))
export const fireCannon = (intersects, realScene, direction)=>{
    var shellObj = LoadedShells.pop()
    if (!shellObj){
        console.log('NO SHELLS!')
        return;
    }
    UnloadedShells.push(shellObj)
    target.set(intersects.x, intersects.y, 0)
    dir.subVectors(target , shellOrigin).normalize();
    console.log(dir);
    // shellObj.shell.position.set(intersects.x, intersects.y, 1);
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
            direction:new THREE.Vector3( 0, 0, 1 )
        });        
    }
    // LoadedShells.forEach(function(obj){
    //     console.log(obj)
    // })
}
var displacement = new THREE.Vector3( 0, 0, 0 )
var target = new THREE.Vector3( 0, 0, 0 )
const speed = 150
export const updateCannonShells = (delta)=>{
    UnloadedShells.forEach(function(obj){
        //calculate velocity
        displacement.copy( obj.direction).multiplyScalar(speed * delta);
        target.copy( obj.shell.position ).add( displacement );
        obj.shell.position.copy(target)
    })
}