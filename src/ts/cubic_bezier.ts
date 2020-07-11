import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

window.addEventListener('DOMContentLoaded', () => {
	Setup(500, 300);
});

var dragCtrl;
var scene = new THREE.Scene();
var ctrlBox:Array<THREE.Mesh> = [];
var bezier: THREE.Line;

function initBezier() {
	for(let i=0; i<4; ++i) {
		ctrlBox[i] = new THREE.Mesh(
				new THREE.BoxGeometry(1, 1, 1),
				new THREE.MeshLambertMaterial({ color: 0x800080 })
			);
		scene.add(ctrlBox[i]);
	}
	ctrlBox[0].position.set(-10, 0, 10);
	ctrlBox[1].position.set(-5, 10, 5);
	ctrlBox[2].position.set(5, 10, -5);
	ctrlBox[3].position.set(10, 0, -10);

	let curve = new THREE.CubicBezierCurve3(
		ctrlBox[0].position,
		ctrlBox[1].position,
		ctrlBox[2].position,
		ctrlBox[3].position
	);
	bezier = new THREE.Line(
		new THREE.BufferGeometry().setFromPoints(curve.getPoints(50)),
		new THREE.LineBasicMaterial({color: 0x0000ff})
	);
	scene.add(bezier);

	return;
}

function Setup(width: number, height: number)
{
	let elCanvas = document.querySelector("#canvas") as HTMLCanvasElement;
	if(!elCanvas) {
		return;
	}

	var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
	camera.position.set(10, 10, 10);

	var grid = new THREE.GridHelper(100, 100);
	scene.add(grid);

	var axis = new THREE.AxesHelper(1000);
	scene.add(axis);

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

	initBezier();

	dragCtrl = new DragControls(ctrlBox, camera, elCanvas);
	dragCtrl.addEventListener('dragstart', event => {
		orbit.enabled = false;
		event.object.material.emissive.set(0xaaaaaa);
	});
	dragCtrl.addEventListener('dragend', event => {
		event.object.material.emissive.set(0x000000);
		orbit.enabled = true;
	});

	function animate() {
		requestAnimationFrame(animate);

		let curve = new THREE.CubicBezierCurve3(
			ctrlBox[0].position,
			ctrlBox[1].position,
			ctrlBox[2].position,
			ctrlBox[3].position
		);

		let geo = bezier.geometry as THREE.BufferGeometry;
		geo.attributes.position = new THREE.BufferAttribute(new Float32Array(curve.getPoints(50).map(p => p.toArray()).flat()), 3);

		orbit.update();

		renderer.render(scene, camera);
	}

	animate();

}
