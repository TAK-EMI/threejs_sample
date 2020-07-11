import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

window.addEventListener('DOMContentLoaded', () => {
	Setup(500, 300);
});

var scene = new THREE.Scene();
var control: TransformControls | null = null;

function update() {
	const elTranslate = document.querySelector('#translate') as HTMLInputElement;
	const elRotate = document.querySelector('#rotate') as HTMLInputElement;
	const elScale = document.querySelector('#scale') as HTMLInputElement;

	if(!control || !elTranslate || !elRotate || !elScale) {
		return;
	}

	if (elTranslate.checked === true) {
		control.setMode("translate");
	} else if (elRotate.checked === true) {
		control.setMode("rotate");
	} else if (elScale.checked === true) {
		control.setMode("scale");
	}
}
function initBox() {
	if(!control) {
		return;
	}

	const box = new THREE.Mesh(
		new THREE.BoxGeometry(5, 5, 5),
		new THREE.MeshLambertMaterial({ color: 0x800080 })
	);

	scene.add(box);

	control.attach(box);
	scene.add(control);

	update();

	return;
}

function Setup(width: number, height: number)
{
	let elCanvas = document.querySelector("#canvas") as HTMLCanvasElement;
	if(!elCanvas) {
		return;
	}

	const elTranslate = document.querySelector('#translate') as HTMLInputElement;
	const elRotate = document.querySelector('#rotate') as HTMLInputElement;
	const elScale = document.querySelector('#scale') as HTMLInputElement;

	if(!elTranslate || !elRotate || !elScale) {
		return;
	}

	elTranslate.onclick = update;
	elRotate.onclick = update;
	elScale.onclick = update;

	var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);

	camera.position.set(10, 10, 10);

	var gridHelper = new THREE.GridHelper(100, 100);
	scene.add(gridHelper);

	var axesHelper = new THREE.AxesHelper(1000);
	scene.add(axesHelper);

	const light = new THREE.DirectionalLight(0xffffff);
	light.intensity = 2;
	light.position.set(2, 2, 1);
	scene.add(light);

	var renderer = new THREE.WebGLRenderer({
		canvas: elCanvas
	});
	renderer.setSize(width, height);
	renderer.setClearColor(0xaaaaaa);

	const orbit = new OrbitControls(camera, renderer.domElement);
	orbit.update();

	control = new TransformControls(camera, renderer.domElement);
	control.addEventListener('change', animate);
	control.addEventListener('dragging-changed', function (event) {
		orbit.enabled = !event.value;
	});

	initBox();

	function animate() {
		requestAnimationFrame(animate);

		orbit.update();

		renderer.render(scene, camera);
	}

	animate();
}
