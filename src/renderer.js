import * as THREE from 'three';

export class renderComponent {
    constructor(ww, wh){
        this.renderer = new THREE.WebGLRenderer({canvas : document.getElementById('scene'),antialias: true});
        this.renderer.setClearColor(0x000000);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(ww,wh);
    }
    update(scene, camera){
        this.renderer.render(scene, camera);
    }
}