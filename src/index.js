
require('normalize.css/normalize.css');
require('./styles/index.scss');
// const THREE = require('three');
import * as THREE from 'three';
import {createAsteroids} from './app'

// document.addEventListener("DOMContentLoaded", () => {

//     const pluginsTriggerElement = document.getElementById('plugins-trigger');
//     const pluginsElement = document.getElementById('plugins');

//     const pluginsVisibleClass = "splash-overview-plugins__list--visible";

//     pluginsTriggerElement.onclick = () => {
//         pluginsElement.classList.toggle(pluginsVisibleClass);
//     }
// });


var ww = window.innerWidth,
	wh = window.innerHeight;

function init(){
	const renderer = new THREE.WebGLRenderer({canvas : document.getElementById('scene'),antialias: true});
	renderer.setClearColor(0x000000);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setSize(ww,wh);
	const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0005 );
	const camera = new THREE.PerspectiveCamera(50, ww/wh, 5, 10000);
	camera.position.set(0, 0, 1000);
	scene.add(camera);
	// light = new THREE.DirectionalLight(0xffffff, 1);
	// light.position.set( 50, 250, 500 );
  
//  var light = new THREE.PointLight( 0xff7f24, 6, 1000 );
// light.position.set(250, 0, 750 );
// light.castShadow = true;            // default false
// light.shadow.mapSize.width = 1024;  // default 512
// light.shadow.mapSize.height = 1024; // default 512
// light.shadow.camera.near = 2;       // default 0.5
// light.shadow.camera.far = 1500;  
// 	scene.add(light);
  
   var light2 = new THREE.PointLight( 0x6495ed, 6, 1000 );
light2.position.set(-250, -100, 0 );
light2.castShadow = true;            // default false
light2.shadow.mapSize.width = 1024;  // default 512
light2.shadow.mapSize.height = 1024; // default 512
light2.shadow.camera.near = 2;       // default 0.5
light2.shadow.camera.far = 1500;  
	scene.add(light2);


//	var obj = createBox(10);
  var material = new THREE.PointCloudMaterial({
      color: 0x555555
    });
    
    const geometry = new THREE.Geometry();
    var x, y, z;
    for(var i=0;i<2000;i++){
      x = (Math.random() * ww *2) - ww;
      y = (Math.random() * wh * 2) - wh;
      z = (Math.random() * 3000) - 1500;
      
      geometry.vertices.push(new THREE.Vector3(x, y, z));
    };
    
    var pointCloud = new THREE.PointCloud(geometry, material);
    scene.add(pointCloud);
  
  
  
  
  var asteroids = createAsteroids(scene);
//  var obj = extrude();
//  var obj = extrude2();
  
  function update () {
  //  console.log(1);
    pointCloud.rotation.x -= 0.0001;
    //pointCloud.rotation.y -= 0.001;
    pointCloud.rotation.z -= 0.0001;
    asteroids.forEach(function(obj){
          obj.rotation.x -= obj.r.x;
          obj.rotation.y -= obj.r.y;
          obj.rotation.z -= obj.r.z;
    })

    renderer.render(scene, camera);
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
};



//Init our scene
init();





