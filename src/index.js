import "./styles.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer;
let geometry, material, cube;
let colour, intensity, light;
let ambientLight;

let orbit;

let listener, sound, audioLoader;

let clock, delta, interval;

let startButton = document.getElementById("startButton");
startButton.addEventListener("click", init);

function init() {
  //alert("We have initialised!")
  //remove overlay
  let overlay = document.getElementById("overlay");
  overlay.remove();
  //create clock and set interval at 30 fps
  clock = new THREE.Clock();
  delta = 0;
  interval = 1 / 30;
  //create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdfdfdf);
  //create camera
  camera = new THREE.PerspectiveCamera(
    75, //fov
    window.innerWidth / window.innerHeight, //aspect
    0.1, //near
    1000 //far
  );
  camera.position.z = 5;
  //specify our render and add it to our document
  renderer = new THREE.WebGL1Renderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  //create the orbit controls instace so we can use the mouse to move around our scene
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableZoom = true;

  //sound for single source and single listener
  listener = new THREE.AudioListener();
  camera.add(listener);
  sound = new THREE.PositionalAudio(listener);

  audioLoader = new THREE.AudioLoader();
  audioLoader.load("./src/sounds/CPC_Basic_Drone_Loop.mp3", function (buffer) {
    sound.setBuffer(buffer);
    sound.setRefDistance(10);
    sound.setDirectionalCone(180, 230, 0.1);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
  });

  play();
  //lighting
  colour = 0xffffff;
  intensity = 1;
  light = new THREE.DirectionalLight(colour, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  //create a box to spin
  geometry = new THREE.BoxGeometry();
  material = new THREE.MeshNormalMaterial();
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}
//start animating
function play() {
  //using the new set animationloop method which means we are webxr ready if need be
  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}
//stop animating (not currentky used)
function stop() {
  renderer.setAnimationLoop(null);
}
//update function
function update() {
  orbit.update();
  //update in here
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.04;
  cube.rotation.z += 0.01;
}
//simple render function
function render() {
  renderer.render(scene, camera);
}
