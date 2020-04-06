
require('normalize.css/normalize.css');
require('./styles/index.scss');
// const THREE = require('three');
import * as THREE from 'three';
import {createAsteroids, createPlanet} from './app'
import TWEEN from '@tweenjs/tween.js';
// const TWEEN = require('@tweenjs/tween.js');
// function animate(time) {
//     requestAnimationFrame(animate);

// }
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
	camera.position.set(0, 600, 1000);
    scene.add(camera);

    var coords = { y: 600 }; 
    const intro = new TWEEN.Tween(coords) 
    .to({ y: 0 }, 3000)
    .easing(TWEEN.Easing.Cubic.InOut) 
    .onUpdate(() => { 
        camera.position.set(0, coords.y, 1000);
    })
    .start(); 
    // document.getElementById('menuPlay').style.setProperty('opacity', `1`);
    document.getElementById('menuPlay').onclick = function (params) {
        document.getElementById('menuPlay').setAttribute("disabled", false);
        intro.stop();
        var coords = { y: 0 }; // Start at (0, 0)
        const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
        .to({ y: -900 }, 1000) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Cubic.InOut) // Use an easing function to make the animation smooth.
        .onUpdate(() => { // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
            // box.style.setProperty('transform', `translate(${coords.x}px, ${coords.y}px)`);
            camera.position.set(0, coords.y, 1000);
        })
        .onComplete(obj =>{
            asteroids.forEach(function(obj){
                scene.remove(obj)
          })
        })
        .start(); // Start the tween immediately.
        var Obj = { opacity: 1 };
        const alphaTween = new TWEEN.Tween(Obj) // Create a new tween that modifies 'coords'.
        .to({ opacity: 0}, 1000) 
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(() => { // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
            document.getElementById('menuPlay').style.setProperty('opacity', `${Obj.opacity}`);

            document.getElementById('menuTitle').style.setProperty('opacity', `${Obj.opacity}`);
            console.log(Obj.opacity)
        })
        .start();
        
    }
	// var light = new THREE.DirectionalLight(0xffffff, 1);
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
    light2.position.set(-500, -100, 0 );
    light2.castShadow = true;            // default false
    light2.shadow.mapSize.width = 512;  // default 512
    light2.shadow.mapSize.height = 512; // default 512
    light2.shadow.camera.near = 2;       // default 0.5
    light2.shadow.camera.far = 1500;  
	scene.add(light2);
  
  
  
  
  var asteroids = createAsteroids(scene);
  var planet = createPlanet(60,scene);
  function update (time) {
  //  console.log(1);
    // pointCloud.rotation.x -= 0.0001;
    // pointCloud.rotation.y -= 0.001;
    // pointCloud.rotation.z -= 0.0001;
    asteroids.forEach(function(obj){
          obj.rotation.x -= obj.r.x;
          obj.rotation.y -= obj.r.y;
          obj.rotation.z -= obj.r.z;
    })

    renderer.render(scene, camera);
    TWEEN.update();
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
};



//Init our scene
init();





