require("normalize.css/normalize.css");
require("./styles/index.scss");
import * as THREE from "three";
import { createAsteroids, drawCursor, updateCursor, createLights } from "./app";
import { initCannon, fireCannon, updateCannonShells } from "./cannon";
import { createCollidableAsteroid, updateAsteroids, initAsteroidLauncher } from "./asteroidLauncher"
import { createPlanet } from './planet'
import { renderComponent } from "./renderer";
import { SubscribeEvent, FireEvent, ClearEvent } from "./eventTable"
import { initCoordinator, currentState, GameEnum } from './gameCoordinator'
import TWEEN from "@tweenjs/tween.js";

var ww = window.innerWidth,
    wh = window.innerHeight;
const camera = new THREE.PerspectiveCamera(50, ww / wh, 5, 10000);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var planeX = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const scene = new THREE.Scene();
var lastTime = new Date().getTime();
var currentTime = 0;
var delta = 0;
const renderComp = new renderComponent(ww, wh);
// const GameEnum = {"paused":1, "menu":2, "playing":3}
// let currentState = GameEnum.menu
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
var MouseIntersects = new THREE.Vector3();
function onMouseDown(event) {
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(planeX, MouseIntersects);
    fireCannon(MouseIntersects, scene);
}

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderComp.renderer.setSize( window.innerWidth, window.innerHeight );
}
var coords = { y: 600 };
const intro = new TWEEN.Tween(coords)
    .to({ y: 0 }, 3000)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate(() => {
        camera.position.set(0, coords.y, 1000);
    });
    document.getElementById("menuPlay").onclick = function(params) {
        FireEvent('START_CLICKED')
    };
    document
    .getElementById("gameOver")
    .setAttribute("disabled", false);
    document
    .getElementById("gameOver")
    .style.setProperty("opacity", 0);

SubscribeEvent('GAME_START', ()=>{
    console.log('starting the game!')
    // console.log('state ' + currentState)
    
    window.addEventListener("mousemove", onMouseMove, false);
    window.addEventListener("mousedown", onMouseDown, false);
    // initAsteroidLauncher(scene);

    var cursor = drawCursor(scene);
    createCollidableAsteroid(scene)
})

SubscribeEvent('GAME_OVER', ()=>{
    document
    .getElementById("gameOver")
    .removeAttribute("disabled");

    document.getElementById("gameOver").onclick = function(params) {
        console.log('START AGAIN!')
        FireEvent('GAME_REPLAY');
    };

    var coords = { opacity: 0};
    const tween = new TWEEN.Tween(coords) 
        .to({ opacity:1 }, 1000) 
        .easing(TWEEN.Easing.Cubic.InOut) 
        .onUpdate(() => {
            document
            .getElementById("gameOver")
            .style.setProperty("opacity", `${coords.opacity}`);
            })
        .start();
    
    document.getElementById("menuPlay").remove();
})

SubscribeEvent('START_CLICKED', ()=>{
    document.getElementById("menuPlay").setAttribute("disabled", false);
    intro.stop();
    createPlanet(60, scene);
    initAsteroidLauncher(scene)
    initCannon(); 
    var coords = { y: 0, opacity: 1}; // Start at (0, 0)
    const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
        .to({ y: -900, opacity:0 }, 1000) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Cubic.InOut) // Use an easing function to make the animation smooth.
        .onUpdate(() => {
            // Called after tween.js updates 'coords'.
            camera.position.set(0, coords.y, 1000);
            document
            .getElementById("menuPlay")
            .style.setProperty("opacity", `${coords.opacity}`);

            document
                .getElementById("menuTitle")
                .style.setProperty("opacity", `${coords.opacity}`);
            })
        .onComplete(obj => {
            asteroids.forEach(function(obj) {
                scene.remove(obj);
            });
            FireEvent('GAME_START');
        })
        .start(); // Start the tween immediately.
})

var asteroids = createAsteroids(scene);
function init() {


    scene.fog = new THREE.FogExp2(0xefd1b5, 0.0005);
    camera.position.set(0, 600, 1000);
    scene.add(camera);
    intro.start();
    createLights(scene);
    initCoordinator();
    var CursorIntersects = new THREE.Vector3();

    function update(time) {
        requestAnimationFrame(update);
        // camera.updateMatrix(); // make sure camera's local matrix is updated
        // camera.updateMatrixWorld(); // make sure camera's world matrix is updated
        // camera.matrixWorldInverse.getInverse( camera.matrixWorld );
        currentTime = new Date().getTime();
        delta = (currentTime - lastTime) / 1000;
        
        const canvas = renderComp.domElement;
        // console.log(rende)
        // camera.aspect = canvas.clientWidth / canvas.clientHeight;
        // camera.updateProjectionMatrix();

        asteroids.forEach(function(obj) {
            obj.rotation.x -= obj.r.x;
            obj.rotation.y -= obj.r.y;
            obj.rotation.z -= obj.r.z;
        });

        renderComp.update(scene, camera);
        TWEEN.update();
        if(currentState === GameEnum.playing){
            raycaster.setFromCamera(mouse, camera);
            raycaster.ray.intersectPlane(planeX, CursorIntersects);
            updateCursor(CursorIntersects);
            updateCannonShells(delta, scene);
            updateAsteroids(delta, scene)
        } 
        
        lastTime = currentTime;
    }
    requestAnimationFrame(update);
}



//Init our scene
init();
