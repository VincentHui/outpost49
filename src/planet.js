import * as THREE from 'three';
import {ColorLuminance} from './app'
export const planetParent = new THREE.Object3D('planetParent')
export const planetOrigin =  new THREE.Vector3( 0, -1400, 0 )

export const createPlanet = (size, realScene) =>{
    const geometry = new THREE.DodecahedronGeometry(size, 1);
    geometry.vertices.forEach(function(v){
      v.x += (0.5*(size/4));
      v.y += (0.6*(size/4));
      v.z += (0.4*(size/4));
    })
    var color = '#111111';
    color = ColorLuminance(color,2+Math.random()*10);
    // console.log(color);
      const texture = new THREE.MeshStandardMaterial({color:color,
        flatShading: true,
        shininess: 0.2,
            roughness: 0.8,
            metalness: 1
        });
  
      const	cube = new THREE.Mesh(geometry, texture);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.scale.set(1+0.6,1+0.8,1*0.4);
    
    cube.position.copy(planetOrigin)
    realScene.add(cube);
    var light2 = new THREE.PointLight( 0x6495ed, 7, 900 );
    light2.position.set(0, -900, 150 );
    // light2.castShadow = true;            // default false
    // light2.shadow.mapSize.width = 512;  // default 512
    // light2.shadow.mapSize.height = 512; // default 512
    // light2.shadow.camera.near = 2;       // default 0.5
    // light2.shadow.camera.far = 1500;  
	realScene.add(light2);
    return {cube,  light2};
}
