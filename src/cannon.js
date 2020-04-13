import * as THREE from 'three';

export const fireCannon = (intersects, realScene, direction)=>{
    var shellObj = LoadedShells.pop()
    if (!shellObj){
        console.log('NO SHELLS!')
        return;
    }
    UnloadedShells.push(shellObj)

    shellObj.shell.position.set(intersects.x, intersects.y, 1);
    realScene.add( shellObj.shell );
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
    // LoadedShells.forEach(function(obj){
    //     console.log(obj)
    // })
}
var displacement = new THREE.Vector3( 0, 0, 0 )
var target = new THREE.Vector3( 0, 0, 0 )
// var velocity = 
export const updateCannonShells = ()=>{
    UnloadedShells.forEach(function(obj){
        displacement.copy( obj.direction ).multiplyScalar( 0.5 );
        target.copy( obj.shell.position ).add( displacement );
        obj.shell.position.copy(target)
        //range check
        // (x - center_x)^2 + (y - center_y)^2 < radius^2
    })
}