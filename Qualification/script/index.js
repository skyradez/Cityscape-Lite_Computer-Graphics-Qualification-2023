import * as THREE from "./../three.js/build/three.module.js"
import { GLTFLoader } from "./../three.js/examples/jsm/loaders/GLTFLoader.js"

let scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.FogExp2(0x000000, 0.002);

let gltfLoader = new GLTFLoader();
let vehicle; 

gltfLoader.load('./../cartoon_car/scene.gltf', function(gltf) {
    vehicle = gltf.scene;
    vehicle.scale.set(0.5, 0.5, 0.5)
    vehicle.castShadow = true
    vehicle.receiveShadow = true
    scene.add(vehicle);
});

let loader = new THREE.CubeTextureLoader();
let texture = loader.load([
    './../skybox/four.png',
    './../skybox/one.png',
    './../skybox/sky.png',
    './../skybox/land.png',
    './../skybox/two.png',
    './../skybox/three.png'
]);
scene.background = texture;

// First camera
let camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera1.position.set(50, 50, 50);
camera1.lookAt(scene.position);

// Second camera
let camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera2.position.set(0, 100, 0); 
camera2.lookAt(scene.position);

let activeCamera = camera1;

// Renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Directional light
let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024; 
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
scene.add(directionalLight);

// Ambient light
let ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Grid of buildings
let buildingMaterial1 = new THREE.MeshPhongMaterial({color: 0x555555});
let buildingMaterial2 = new THREE.MeshLambertMaterial({color: 0x333333});
let buildingMaterial3 = new THREE.MeshStandardMaterial({color: 0x777777, roughness: 0.5, metalness: 0.5});

let buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
let cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
let sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
let coneGeometry = new THREE.ConeGeometry(0.5, 1, 8);
let torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 8, 16);
let octahedronGeometry = new THREE.OctahedronGeometry(0.5, 0);

let geometries = [buildingGeometry, cylinderGeometry, sphereGeometry, coneGeometry, torusGeometry, octahedronGeometry];

// Cityscape
function createCity(startX, endX, startZ, endZ, roadX, roadZ) {
    for(let x = startX; x <= endX; x++){
        for(let z = startZ; z <= endZ; z++){
            if ((x == roadX) || (z == roadZ)) continue; // Avoid overlapping with roads

            let buildingMaterial;
            let rand = Math.random();
            if(rand < 0.33) {
                buildingMaterial = buildingMaterial1;
            } else if(rand < 0.66) {
                buildingMaterial = buildingMaterial2;
            } else {
                buildingMaterial = buildingMaterial3;
            }

            let geometry = geometries[Math.floor(Math.random()*geometries.length)];
            let building = new THREE.Mesh(geometry, buildingMaterial);
            building.scale.set(2, Math.random() * 10 + 5, 2); 
            building.position.x = x * 3;  
            building.position.y = building.scale.y / 2;
            building.position.z = z * 3; 

            building.castShadow = true;
            building.receiveShadow = true;
            scene.add(building);
        }
    }
}

// Cities
createCity(-200, 200, -200, 200, 0, 0);  // First city
createCity(200, 400, -200, 200, 300, 0);  // Second city in the background
createCity(400, 600, -200, 200, 500, 0);  // Third city in the background
createCity(-400, -200, -200, 200, -300, 0);  // Fourth city in the background

// Roads
let roadMaterial = new THREE.MeshPhongMaterial({color: 0x333333});

// Horizontal Road
let roadH = new THREE.Mesh(new THREE.BoxGeometry(2400, 0.1, 5), roadMaterial);  
roadH.position.y = 0.05;  
roadH.position.x = 0; 
scene.add(roadH);

// Vertical Roads
let roadV1 = new THREE.Mesh(new THREE.BoxGeometry(5, 0.1, 800), roadMaterial); 
roadV1.position.y = 0.05;
roadV1.position.x = -300; 
scene.add(roadV1);

let roadV2 = new THREE.Mesh(new THREE.BoxGeometry(5, 0.1, 800), roadMaterial); 
roadV2.position.y = 0.05;
roadV2.position.x = 0; 
scene.add(roadV2);

let roadV3 = new THREE.Mesh(new THREE.BoxGeometry(5, 0.1, 800), roadMaterial); 
roadV3.position.y = 0.05;
roadV3.position.x = 300; 
scene.add(roadV3);

let roadV4 = new THREE.Mesh(new THREE.BoxGeometry(5, 0.1, 800), roadMaterial); 
roadV4.position.y = 0.05;
roadV4.position.x = 600; 
scene.add(roadV4);

window.addEventListener('keydown', function(event) {
    if (event.key == 'c') {
        activeCamera = (activeCamera == camera1) ? camera2 : camera1;
    }
});

renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;

roadH.castShadow = true;
roadH.receiveShadow = true;

roadV1.castShadow = true;
roadV1.receiveShadow = true;
roadV2.castShadow = true;
roadV2.receiveShadow = true;
roadV3.castShadow = true;
roadV4.receiveShadow = true;
roadV4.castShadow = true;
roadV4.receiveShadow = true;

let mouseMoveRaycaster = new THREE.Raycaster();
let mouseMove = new THREE.Vector2();

let colorStats = true;

function onMouseMove( event ) {
    mouseMove.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouseMove.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    mouseMoveRaycaster.setFromCamera( mouseMove, activeCamera );
    let intersects = mouseMoveRaycaster.intersectObjects( scene.children );

    for ( let i = 0; i < intersects.length; i++ ) {
        if (intersects[i].object === vehicle) {
            if (colorStats) {
                colorStats = false;
                intersects[i].object.material.color.setHex(0xc5de83);
            } else {
                colorStats = true;
                intersects[i].object.material.color.setHex(0xFF0000);
            }
        }
    }
}

window.addEventListener( 'mousemove', onMouseMove, false );


// Animation Function
let clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);

    if (vehicle) {
        let speed = 5; 
        let position = vehicle.position.z + speed; 
        if (position > 100) { 
          position = -100;
        }
        vehicle.position.z = position; 
    }

    renderer.render(scene, activeCamera);
}

animate();