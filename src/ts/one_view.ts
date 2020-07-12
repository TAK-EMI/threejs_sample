import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

window.addEventListener('DOMContentLoaded', () => {
	Setup(500, 300);
});

const scene = new THREE.Scene();

let camera: THREE.OrthographicCamera;

function initModel() {
	const manager = new THREE.LoadingManager();

	const onProgress = (xhr: ProgressEvent) => {
		if (xhr.lengthComputable) {
			const percentComplete = (xhr.loaded / xhr.total) * 100;
			console.log(percentComplete.toFixed(2) + '% downloaded');
		}
	};

	const onError = (err: ErrorEvent) => {
		console.log(`Error: ${err}`);
	};

	new OBJLoader(manager).setPath('obj/teapot/').load(
		'teapot.obj',
		(object) => {
			const wire = new THREE.LineSegments(
				new THREE.WireframeGeometry((object.children[0] as THREE.Mesh).geometry),
				new THREE.LineBasicMaterial({
					color: 0x000000,
					linewidth: 2,
				})
			);
			scene.add(wire);
		},
		onProgress,
		onError
	);

	return;
}

function Setup(width: number, height: number) {
	const elCanvas = document.querySelector('#canvas') as HTMLCanvasElement;
	if (!elCanvas) {
		return;
	}

	camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -100, 1000);

	const gridHelper = new THREE.GridHelper(width * 100, 1000);
	gridHelper.rotateX(Math.PI / 2);
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

	const orbit = new MapControls(camera, elCanvas);
	orbit.screenSpacePanning = true;
	orbit.update();

	initModel();

	function animate() {
		requestAnimationFrame(animate);

		orbit.update();

		renderer.render(scene, camera);
	}

	animate();
}
