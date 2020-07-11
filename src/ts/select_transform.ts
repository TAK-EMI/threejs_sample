import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

window.addEventListener('DOMContentLoaded', () => {
	Setup(500, 300);
});

let grid: THREE.GridHelper;
let axis: THREE.AxesHelper;
var scene = new THREE.Scene();
var control: TransformControls | null = null;
var mouse = new THREE.Vector2();
var mouseOverObject: THREE.Mesh | null = null;
var isSelect = false;

function onMouseMove(event: MouseEvent) {
	const element = event.currentTarget as HTMLElement;

	const x = event.pageX - element.offsetLeft;
	const y = event.pageY - element.offsetTop;

	const w = element.offsetWidth;
	const h = element.offsetHeight;

	mouse.x = ( x / w ) * 2 - 1;
	mouse.y = -( y / h ) * 2 + 1;
}
function onMouseDown(_: MouseEvent) {

	if(!control) {
		return;
	}

	if(mouseOverObject) {
		console.log('attach');
		control.attach(mouseOverObject);
		isSelect = true;
	}else {
		console.log('detach');
		control.detach();
		isSelect = false;
	}
}
function onUnSelect(_: Event) {
	if(!control) {
		return;
	}

	if(mouseOverObject) {
		let mat = mouseOverObject.material as THREE.MeshLambertMaterial;
		mat.color.set(0x800080);
	}

	mouseOverObject = null;

	control.detach();
	isSelect = false;
}
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
	const max = 100;
	for(let i:number=0; i<max; i++) {
		const box = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshLambertMaterial({ color: 0x800080 })
		);

		const z = (Math.random() * 2) - 1;
		const phi = Math.random() * (2 * Math.PI);
		const r = Math.random();

		box.position.set((Math.pow(r, 1/3) * Math.sqrt(1 - z * z) * Math.cos(phi)) * 10, (Math.pow(r, 1/3) * Math.sqrt(1 - z * z) * Math.sin(phi)) * 10, (Math.pow(r, 1/3) * z) * 10);
		scene.add(box);
	}

	update();

	return;
}

function Setup(width: number, height: number)
{
	let elCanvas = document.querySelector("#canvas") as HTMLCanvasElement;
	if(!elCanvas) {
		return;
	}

	elCanvas.addEventListener('mousemove', onMouseMove, false);
	elCanvas.addEventListener('mousedown', onMouseDown);

	const elTranslate = document.querySelector('#translate') as HTMLInputElement;
	const elRotate = document.querySelector('#rotate') as HTMLInputElement;
	const elScale = document.querySelector('#scale') as HTMLInputElement;

	const elClearBtn = document.getElementById('clear') as HTMLButtonElement

	if(!elTranslate || !elRotate || !elScale || !elClearBtn) {
		return;
	}

	elTranslate.onclick = update;
	elRotate.onclick = update;
	elScale.onclick = update;

	elClearBtn.onclick = onUnSelect;

	var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
	camera.position.set(10, 10, 10);

	grid = new THREE.GridHelper(100, 100);
	scene.add(grid);

	axis = new THREE.AxesHelper(1000);
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

	control = new TransformControls(camera, renderer.domElement);
	control.addEventListener('change', animate);
	control.addEventListener('dragging-changed', function (event) {
		orbit.enabled = !event.value;
	});
	scene.add(control);

	initBox();

	function animate() {
		requestAnimationFrame(animate);

		camera.updateMatrixWorld();

		if(isSelect === false) {
			let raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(mouse, camera);

			var intersects = raycaster.intersectObjects(scene.children).filter(element => (element.object != grid && element.object != axis));
			if(intersects.length > 0) {
				let inter = intersects[0].object;
				if(mouseOverObject != inter) {
					if(mouseOverObject) {
						let mat = mouseOverObject.material as THREE.MeshLambertMaterial;
						mat.color.set(0x800080);
					}

					mouseOverObject = inter as THREE.Mesh;
					let mat = mouseOverObject.material as THREE.MeshLambertMaterial;
					mat.color.set(0xffff00);
				}
			}else {
				if(mouseOverObject) {
					let mat = mouseOverObject.material as THREE.MeshLambertMaterial;
					mat.color.set(0x800080);
				}

				mouseOverObject = null;
			}
		}

		orbit.update();

		renderer.render(scene, camera);
	}

	animate();

}
