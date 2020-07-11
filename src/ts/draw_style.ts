import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

window.addEventListener('DOMContentLoaded', () => {
	Setup(500, 300);
});

var scene = new THREE.Scene();
const group = new THREE.Group();

export function update()
{
	const elPoint = document.querySelector('#point') as HTMLInputElement;
	const elEdge = document.querySelector('#edge') as HTMLInputElement;
	const elFace = document.querySelector('#face') as HTMLInputElement;

	if(!elPoint || !elEdge || !elFace) {
		return;
	}

	const point = group.getObjectByName('point');
	const wireframe = group.getObjectByName('wireframe');
	const face = group.getObjectByName('face');

	if(!point || !wireframe || !face) {
		return;
	}

	point.visible = elPoint.checked;
	wireframe.visible = elEdge.checked;
	face.visible = elFace.checked;

	return;
}
function initBox()
{
	const faceModel = new THREE.Mesh(
		new THREE.BoxGeometry(5, 5, 5),
		new THREE.MeshLambertMaterial({ color: 0x808080 })
	);
	faceModel.name = 'face';
	group.add(faceModel);
	
	const wireModel = new THREE.LineSegments(
		new THREE.WireframeGeometry(faceModel.geometry),
		new THREE.LineBasicMaterial({
			color: 0x000000,
			linewidth: 2
		})
	);
	wireModel.name = 'wireframe';
	group.add(wireModel);

	const pointModel = new THREE.Points(
		new THREE.BufferGeometry().setFromPoints(faceModel.geometry.vertices),
		new THREE.PointsMaterial({
			size: 5,
			color: 0x000000,
			sizeAttenuation: false
		})
	);
	pointModel.name = 'point';
	group.add(pointModel);

	scene.add( group );

	update();
	
	return;
}

function Setup(width: number, height: number)
{
	let elCanvas = document.querySelector("#canvas") as HTMLCanvasElement;
	if(!elCanvas) {
		return;
	}

	const elPoint = document.querySelector('#point') as HTMLInputElement;
	const elEdge = document.querySelector('#edge') as HTMLInputElement;
	const elFace = document.querySelector('#face') as HTMLInputElement;

	elPoint.addEventListener('click', update);
	elEdge.addEventListener('click', update);
	elFace.addEventListener('click', update);

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

	initBox();

	function animate() {
		requestAnimationFrame( animate );

		camController.update();

		renderer.render( scene, camera );
	}

	animate();
}
