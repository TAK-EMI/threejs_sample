import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

window.addEventListener('DOMContentLoaded', () => {
	Setup(500, 300);
});

function Setup(width: number, height: number) {
	const elCanvas = document.querySelector('#canvas') as HTMLCanvasElement;
	if (!elCanvas) {
		return;
	}

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

	camera.position.set(100, 100, 100);

	const gridHelper = new THREE.GridHelper(1000, 100);
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

	function animate() {
		requestAnimationFrame(animate);

		camController.update();

		renderer.render(scene, camera);
	}

	animate();
}
