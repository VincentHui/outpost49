import * as THREE from 'three';
const planeX = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), 0 );

export const fireCannon = (intersects, realScene, direction)=>{
    var shellObj = LoadedShells.pop()
    UnloadedShells.push(shellObj)
    if (!shellObj){
        console.log('NO SHELLS!')
        return;
    }
    // var geometry = new THREE.BoxGeometry( 20, 20, 20 );
    // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    // var cube = new THREE.Mesh( geometry, material );

    shellObj.shell.position.set(intersects.x, intersects.y, 1);
    realScene.add( shellObj.shell );
    // shells.push(cube);
}
var LoadedShells= []
var UnloadedShells =[]
export const initCannonShells =()=>{
    for (let index = 0; index < 10; index++) {
        var geometry = new THREE.BoxGeometry( 20, 20, 20 );
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        var shell = new THREE.Mesh( geometry, material );
        LoadedShells.push({
            shell, 
            direction:new THREE.Vector3( 0, 0, 1 )
        });        
    }
    LoadedShells.forEach(function(obj){
        console.log(obj)
    })
    // shells.push({test:'test'})
    // shells.push({test:'test'})
    // shells.push({test:'test'})
    // shells.push({test:'test'})
    // shells.push({test:'test'})
}
var displacement = new THREE.Vector3( 0, 0, 0 )
var target = new THREE.Vector3( 0, 0, 0 )
// var velocity = 
export const updateCannonShells = ()=>{
    UnloadedShells.forEach(function(obj){
        displacement.copy( obj.direction ).multiplyScalar( 0.5 );
        target.copy( obj.shell.position ).add( displacement );
        // console.log(target)
        obj.shell.position.copy(target)
        // obj.shell.position.set(target)
        // console.log(obj.shell.position)
    })
}