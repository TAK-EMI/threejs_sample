import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

window.addEventListener('DOMContentLoaded', () => {
	Setup(500, 300);
});

const scene = new THREE.Scene();

function initModel() {
	const manager = new THREE.LoadingManager();

	const onProgress = (xhr: ProgressEvent) => {
		if (xhr.lengthComputable) {
			const percentComplete = (xhr.loaded / xhr.total) * 100;
			console.log(percentComplete.toFixed(2) + '% downloaded');
		}
	};

	const onError = (err: ErrorEvent) => {
		console.log(err);
	};

	new MTLLoader(manager).setPath('obj/teapot/').load('default.mtl', (materials) => {
		materials.preload();

		new OBJLoader(manager)
			.setMaterials(materials)
			.setPath('obj/teapot/')
			.load(
				'teapot.obj',
				(object) => {
					object.scale.set(0.1, 0.1, 0.1);
					scene.add(object);
				},
				onProgress,
				onError
			);
	});

	return;
}

function Setup(width: number, height: number) {
	const elCanvas = document.querySelector('#canvas') as HTMLCanvasElement;
	if (!elCanvas) {
		return;
	}

	const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
	camera.position.set(10, 10, 10);

	const gridHelper = new THREE.GridHelper(100, 100);
	scene.add(gridHelper);

	const axesHelper = new THREE.AxesHelper(1000);
	scene.add(axesHelper);

	const light = new THREE.DirectionalLight(0xffffff);
	light.intensity = 2;
	light.position.set(2, 2, 1);
	scene.add(light);

	const renderer = new THREE.WebGLRenderer({
		canvas: elCanvas,
	});
	renderer.setSize(width, height);
	renderer.setClearColor(0xaaaaaa);

	const camController = new OrbitControls(camera, renderer.domElement);
	camController.update();

	initModel();

	function animate() {
		requestAnimationFrame(animate);

		camController.update();

		renderer.render(scene, camera);
	}

	animate();
}
