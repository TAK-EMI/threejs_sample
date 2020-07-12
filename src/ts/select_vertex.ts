import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Points, SphereGeometry } from 'three';

window.addEventListener('DOMContentLoaded', () => {
	Setup(500, 300);
});

const POINT_MESH_NAME = 'point';

const sphere = new THREE.Group();
const mouse = new THREE.Vector2();

let INTERSECTED: number | null | undefined;

function initSphere(scene: THREE.Scene) {
	const geo = new THREE.SphereGeometry(100, 10, 10);

	const colorList: THREE.Color[] = new Array(geo.vertices.length);
	colorList.fill(new THREE.Color(0, 0, 0));
	geo.colors = colorList;

	// ワイヤーフレーム
	const wire = new THREE.LineSegments(
		new THREE.WireframeGeometry(geo),
		new THREE.LineBasicMaterial({
			color: 0x000000,
			linewidth: 1,
			depthTest: false,
		})
	);
	wire.name = 'wireframe';
	sphere.add(wire);

	// ポイント
	const point = new THREE.Points(
		geo,
		new THREE.PointsMaterial({
			size: 5,
			vertexColors: true,
			sizeAttenuation: false,
		})
	);
	point.name = POINT_MESH_NAME;
	sphere.add(point);

	scene.add(sphere);
}

function onDocumentMouseMove(event: MouseEvent) {
	event.preventDefault();

	const element = event.currentTarget as HTMLElement;

	const x = event.pageX - element.offsetLeft;
	const y = event.pageY - element.offsetTop;

	const w = element.offsetWidth;
	const h = element.offsetHeight;

	mouse.x = (x / w) * 2 - 1;
	mouse.y = -(y / h) * 2 + 1;
}

function interact(camera: THREE.Camera): void {
	const point = sphere.getObjectByName(POINT_MESH_NAME) as Points;
	if (!point) {
		return;
	}

	const geo = point.geometry as SphereGeometry;
	geo.colors.fill(new THREE.Color(0, 0, 0));

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mouse, camera);
	raycaster.params.Points = { threshold: 5 };

	let intersects = raycaster.intersectObject(point);
	if (intersects.length > 0) {
		intersects = intersects.sort((a, b) => {
			if (a.distance < b.distance) {
				return -1;
			} else if (a.distance > b.distance) {
				return 1;
			} else {
				return 0;
			}
		});
		if (INTERSECTED != intersects[0].index) {
			INTERSECTED = intersects[0].index;

			if (INTERSECTED) {
				geo.colors[INTERSECTED] = new THREE.Color(1, 0, 0);
				geo.colorsNeedUpdate = true;
			}
		}
	} else if (INTERSECTED !== null) {
		geo.colorsNeedUpdate = true;

		INTERSECTED = null;
	}
}

function Setup(width: number, height: number) {
	const elCanvas = document.querySelector('#canvas') as HTMLCanvasElement;
	if (!elCanvas) {
		return;
	}

	elCanvas.onmousemove = onDocumentMouseMove;

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

	initSphere(scene);

	function animate() {
		requestAnimationFrame(animate);

		camController.update();

		interact(camera);

		renderer.render(scene, camera);
	}

	animate();
}
