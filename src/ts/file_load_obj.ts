import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

window.addEventListener('DOMContentLoaded', () => {
	Setup(500, 300);
});

var scene = new THREE.Scene();

function initModel()
{
	var manager = new THREE.LoadingManager();

	var onProgress = (xhr: ProgressEvent) => {
		if(xhr.lengthComputable) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log(percentComplete.toFixed(2) + '% downloaded');
		}
	};

	var onError = () => {};

	new MTLLoader(manager)
		.setPath('https://tak-emi.github.io/threejs_sample/obj/teapot/')
		.load('default.mtl', materials => {

			materials.preload();

			new OBJLoader(manager)
				.setMaterials(materials)
				.setPath('https://tak-emi.github.io/threejs_sample/obj/teapot/')
				.load('teapot.obj', object => {

					object.scale.set(0.1, 0.1, 0.1);
					scene.add(object);

				}, onProgress, onError);
		});
	
	return;
}

function Setup(width: number, height: number)
{
	let elCanvas = document.querySelector("#canvas") as HTMLCanvasElement;
	if(!elCanvas) {
		return;
	}

	var camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 10000 );
	camera.position.set(10, 10, 10);

	var gridHelper = new THREE.GridHelper( 100, 100 );
	scene.add( gridHelper );

	var axesHelper = new THREE.AxesHelper( 1000 );
	scene.add( axesHelper );

	const light = new THREE.DirectionalLight(0xffffff);
	light.intensity = 2;
	light.position.set(2, 2, 1);
	scene.add(light);

	var renderer = new THREE.WebGLRenderer({
			canvas: elCanvas
		});
	renderer.setSize( width, height );
	renderer.setClearColor(0xaaaaaa);

	const camController = new OrbitControls(camera, renderer.domElement);
	camController.update();

	initModel();

	function animate() {
		requestAnimationFrame( animate );

		camController.update();

		renderer.render( scene, camera );
	}

	animate();
}
