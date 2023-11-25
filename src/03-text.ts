import * as THREE from "three";
import { type Font, FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import "./style.css";

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

// Scene
const scene = new THREE.Scene();
const objects: THREE.Object3D[] = [];
const spread = 15;

function addObject(x: number, y: number, obj: THREE.Object3D) {
    obj.position.x = x * spread;
    obj.position.y = y * spread;
    scene.add(obj);
    objects.push(obj);
}

// Font
const loader = new FontLoader();
async function loadFont(url: string) {
    return new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
    });
}

function createMaterial() {
    const material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
    });
    const hue = Math.random();
    const saturation = 1;
    const luminance = 0.5;
    material.color.setHSL(hue, saturation, luminance);
    return material;
}

async function createText() {
    const font = (await loadFont("/fonts/helvetiker_regular.typeface.json")) as Font;
    const geometry = new TextGeometry("three.js", {
        font: font,
        size: 3.0,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.15,
        bevelSize: 0.3,
        bevelSegments: 5,
    });
    const mesh = new THREE.Mesh(geometry, createMaterial());
    geometry.computeBoundingBox();
    geometry.boundingBox?.getCenter(mesh.position).multiplyScalar(-1);

    const parent = new THREE.Object3D();
    parent.add(mesh);
    addObject(0, 0, parent);
}

createText();

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

    objects.forEach((cube, i) => {
        const speed = 1 + i * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
