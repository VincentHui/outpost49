import * as THREE from 'three';
import { planetOrigin } from './planet'
import { asteroidParent, collideWithAteroid} from './asteroidLauncher'
var dir = new THREE.Vector3();
var newPosition = new THREE.Vector3();
const shellOrigin = new THREE.Vector3().copy(planetOrigin).add(new THREE.Vector3(0, 100, 0))
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
    shellObj.velocity.copy(dir).multiplyScalar(initialSpeed)
    realScene.add( shellObj.shell );
}
var LoadedShells= []
var UnloadedShells =[]
const shellCapacity = 14;
export const initCannon =()=>{
    for (let index = 0; index < shellCapacity; index++) {
        var geometry = new THREE.BoxGeometry( 20, 20, 20 );
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        var shell = new THREE.Mesh( geometry, material );
        LoadedShells.push({
            shell, 
            velocity: new THREE.Vector3( 0, 0, 0)
        });        
    }
}
var desiredVelocity = new THREE.Vector3()
var steering = new THREE.Vector3()
const mass = 20
const speed = 300
var raycaster = new THREE.Raycaster();
raycaster.far = 35;
var raycastDir = new THREE.Vector3();
var collisionNormal = new THREE.Vector3();
var reflected = new THREE.Vector3();
export const updateCannonShells = (delta, realscene)=>{
    var i = UnloadedShells.length;
    while (i--) {

        const obj = UnloadedShells[i]
        desiredVelocity.copy( obj.velocity).normalize().multiplyScalar(speed * delta);
        steering.copy(desiredVelocity).sub(obj.velocity)
        steering.divideScalar(mass)
        obj.velocity.add(steering)
        obj.shell.position.add( obj.velocity )

        var collisionResults = RaycastCollisions(obj.shell.position, obj.velocity, raycaster,asteroidParent.children);

        if ( collisionResults.length > 0 ) 
        {
            const collided = collisionResults[0].object;
            collisionNormal.copy(collided.position).sub(obj.shell.position).normalize()
            reflected.copy(obj.velocity).sub(collisionNormal.multiplyScalar(2 * obj.velocity.dot(collisionNormal)))
            obj.velocity.copy(reflected).multiplyScalar(0.5)
            collideWithAteroid(collided, obj, collisionNormal)
        }

        const distance = obj.shell.position.distanceTo (shellOrigin)
        if (distance > 1500){
            UnloadedShells.splice(i, 1);
            LoadedShells.push(obj)
            realscene.remove(obj.shell)
            continue
        }
        
    }
}

export const RaycastCollisions = (position, velocity, p_raycaster, toCollide) => {
    p_raycaster.set(position, raycastDir.copy(velocity).normalize());
    var collisionResults = p_raycaster.intersectObjects(toCollide);
    var axis = new THREE.Vector3(0, 0, 1);
    var angle = Math.PI / 4;
    raycastDir.applyAxisAngle(axis, angle);
    p_raycaster.set(position, raycastDir);
    collisionResults = collisionResults.concat(p_raycaster.intersectObjects(toCollide));
    raycastDir.applyAxisAngle(-axis, angle);
    p_raycaster.set(position, raycastDir);
    collisionResults = collisionResults.concat(p_raycaster.intersectObjects(toCollide));
    return collisionResults;
}
