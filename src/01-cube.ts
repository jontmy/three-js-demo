import * as THREE from "three";
import "./style.css";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7;

// Cube
function createCube(geometry: THREE.BoxGeometry, color: number, y: number) {
    const material = new THREE.MeshPhongMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y = y;
    scene.add(cube);
    return cube;
}
const geometry = new THREE.BoxGeometry(1, 1, 1);
const cubes = [
    createCube(geometry, 0xff6188, 2),
    createCube(geometry, 0xa9dc76, 0),
    createCube(geometry, 0x78dce8, -2),
];

// Light
const color = 0xffffff;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

const canvas = document.querySelector("canvas")!;
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

function resizeRenderer(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;
    const needsResize = canvas.width !== width || canvas.height !== height;
    if (needsResize) {
        renderer.setSize(width, height, false);
    }
    return needsResize;
}

function render(time: number) {
    time /= 1000;

    const resized = resizeRenderer(renderer);
    if (resized) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, i) => {
        const speed = 1 + i * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
