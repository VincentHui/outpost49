
require('normalize.css/normalize.css');
require('./styles/index.scss');
import * as THREE from 'three';
import {createAsteroids, createPlanet, drawLines, drawCursor, updateCursor} from './app'
import {initCannonShells,  fireCannon, updateCannonShells} from './cannon'
import TWEEN from '@tweenjs/tween.js';


var ww = window.innerWidth,
    wh = window.innerHeight;
const camera = new THREE.PerspectiveCamera(50, ww/wh, 5, 10000);
var raycaster = new THREE.Raycaster();
// var raycasterClick = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var planeX = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), 0 );
const scene = new THREE.Scene();
var lastTime = (new Date()).getTime();
var currentTime = 0;
var delta = 0;

function onMouseMove( event ) {

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onMouseDown (event) {
    raycaster.setFromCamera( mouse, camera );
    var intersects = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeX, intersects);
    fireCannon(intersects, scene)
}

function init(){
	const renderer = new THREE.WebGLRenderer({canvas : document.getElementById('scene'),antialias: true});
	renderer.setClearColor(0x000000);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setSize(ww,wh);

    scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0005 );
	// const camera = new THREE.PerspectiveCamera(50, ww/wh, 5, 10000);
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
            // console.log(Obj.opacity)
        })
        .start();
        
    }

    initCannonShells();

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
//   var lines = drawLines(scene);
  var cursor = drawCursor(scene);
  window.addEventListener( 'mousemove', onMouseMove, false );
  window.addEventListener( 'mousedown', onMouseDown, false );


  function update (time) {
    requestAnimationFrame(update);
    currentTime = (new Date()).getTime();
    delta = (currentTime - lastTime) / 1000;
    // console.log(delta)
    asteroids.forEach(function(obj){
          obj.rotation.x -= obj.r.x;
          obj.rotation.y -= obj.r.y;
          obj.rotation.z -= obj.r.z;
    })
    raycaster.setFromCamera( mouse, camera );
    
    var intersects = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeX, intersects);
    updateCursor(intersects)
    renderer.render(scene, camera);
    TWEEN.update();
    updateCannonShells(delta);
    lastTime = currentTime;


  }
  requestAnimationFrame(update);
};

//Init our scene
init();





