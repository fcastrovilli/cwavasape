import * as THREE from 'three';
import { gsap } from 'gsap';

const vertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const fragment = `
varying vec2 vUv;

uniform float dispFactor;
uniform float direction;
uniform float dpr;
uniform sampler2D disp;

uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float angle1;
uniform float angle2;
uniform float intensity1;
uniform float intensity2;
uniform vec4 res;
uniform vec2 parent;

mat2 getRotM(float angle) {
	float s = sin(angle);
	float c = cos(angle);
	return mat2(c, s*(-direction), s*(direction), c);
}

void main() {
	vec4 disp = texture2D(disp, vUv);
	vec2 dispVec = vec2(disp.g, disp.r); // Swap r and g

	vec2 uv = 0.6 * gl_FragCoord.xy / (res.xy) ;
	vec2 myUV = (uv - vec2(0.7))*res.zw + vec2(0.7);

	vec2 distortedPosition1 = myUV + getRotM(angle1) * dispVec * intensity1 * dispFactor;
	vec2 distortedPosition2 = myUV + getRotM(angle2) * dispVec * intensity2 * (1.0 - dispFactor);
	vec4 _texture1 = texture2D(texture1, distortedPosition1);
	vec4 _texture2 = texture2D(texture2, distortedPosition2);
	gl_FragColor = mix(_texture1, _texture2, dispFactor);
}
`;
// const fragment = `
// varying vec2 vUv;

// uniform float dispFactor;
// uniform float dpr;
// uniform sampler2D disp;

// uniform sampler2D texture1;
// uniform sampler2D texture2;
// uniform float angle1;
// uniform float angle2;
// uniform float intensity1;
// uniform float intensity2;
// uniform vec4 res;
// uniform vec2 parent;

// mat2 getRotM(float angle) {
//   float s = sin(angle);
//   float c = cos(angle);
//   return mat2(c, -s, s, c);
// }

// void main() {
//   vec4 disp = texture2D(disp, vUv);
//   vec2 dispVec = vec2(disp.r, disp.g);

//   vec2 uv = 0.5 * gl_FragCoord.xy / (res.xy) ;
//   vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);

//   vec2 distortedPosition1 = myUV + getRotM(angle1) * dispVec * intensity1 * dispFactor;
//   vec2 distortedPosition2 = myUV + getRotM(angle2) * dispVec * intensity2 * (1.0 - dispFactor);
//   vec4 _texture1 = texture2D(texture1, distortedPosition1);
//   vec4 _texture2 = texture2D(texture2, distortedPosition2);
//   gl_FragColor = mix(_texture1, _texture2, dispFactor);
// }
// `;

interface Options {
	parent: HTMLElement;
	displacementImage: string;
	image1: string;
	image2: string;
	imagesRatio?: number;
	intensity1?: number;
	intensity2?: number;
	angle?: number;
	angle1?: number;
	angle2?: number;
	speedIn?: number;
	speedOut?: number;
	hover?: boolean;
	easing?: string;
}

export default function (opts: Options) {
	function firstDefined(...args: any[]): any {
		for (let i = 0; i < args.length; i++) {
			if (args[i] !== undefined) return args[i];
		}
	}

	const parent = opts.parent;
	const dispImage = opts.displacementImage;
	const image1 = opts.image1;
	const image2 = opts.image2;
	const imagesRatio = firstDefined(opts.imagesRatio, 1.0);
	const intensity1 = firstDefined(opts.intensity1, opts.intensity1, 1);
	const intensity2 = firstDefined(opts.intensity2, opts.intensity2, 1);
	const commonAngle = firstDefined(opts.angle, Math.PI / 4);
	const angle1 = firstDefined(opts.angle1, commonAngle);
	const angle2 = firstDefined(opts.angle2, -commonAngle * 3);

	if (!parent) {
		console.warn('Parent missing');
		return;
	}

	if (!(image1 && image2 && dispImage)) {
		console.warn('One or more images are missing');
		return;
	}

	const scene = new THREE.Scene();
	const camera = new THREE.OrthographicCamera(
		parent.offsetWidth / -2,
		parent.offsetWidth / 2,
		parent.offsetHeight / 2,
		parent.offsetHeight / -2,
		1,
		1000
	);

	camera.position.z = 1;

	const renderer = new THREE.WebGLRenderer({
		antialias: false,
		alpha: true
	});

	renderer.setPixelRatio(2.0);
	renderer.setClearColor(0xffffff, 0.0);
	renderer.setSize(parent.offsetWidth, parent.offsetHeight);
	parent.appendChild(renderer.domElement);

	const render = function () {
		renderer.render(scene, camera);
	};

	const loader = new THREE.TextureLoader();
	loader.crossOrigin = '';

	const disp = loader.load(dispImage, () => {
		disp.magFilter = disp.minFilter = THREE.LinearFilter;
		render();
	});

	const texture1 = loader.load(image1, () => {
		texture1.magFilter = THREE.LinearFilter;
		texture1.minFilter = THREE.LinearFilter;
		render();
	});

	const texture2 = loader.load(image2, () => {
		texture2.magFilter = THREE.LinearFilter;
		texture2.minFilter = THREE.LinearFilter;
		render();
	});

	let a1: number, a2: number;
	const imageAspect = imagesRatio;
	if (parent.offsetHeight / parent.offsetWidth < imageAspect) {
		a1 = 1;
		a2 = parent.offsetHeight / parent.offsetWidth / imageAspect;
	} else {
		a1 = (parent.offsetWidth / parent.offsetHeight) * imageAspect;
		a2 = 1;
	}
	console.log('imageAspect:', imageAspect);
	console.log('imagesRatio:', imagesRatio);
	console.log('a1:', a1);
	console.log('a2:', a2);

	const mat = new THREE.ShaderMaterial({
		uniforms: {
			intensity1: {
				type: 'f',
				value: intensity1
			} as THREE.IUniform<number>,
			intensity2: {
				type: 'f',
				value: intensity2
			} as THREE.IUniform<number>,
			dispFactor: {
				type: 'f',
				value: 0.0
			} as THREE.IUniform<number>,
			angle1: {
				type: 'f',
				value: angle1
			} as THREE.IUniform<number>,
			angle2: {
				type: 'f',
				value: angle2
			} as THREE.IUniform<number>,
			texture1: {
				type: 't',
				value: texture1
			} as THREE.IUniform<THREE.Texture>,
			texture2: {
				type: 't',
				value: texture2
			} as THREE.IUniform<THREE.Texture>,
			disp: {
				type: 't',
				value: disp
			} as THREE.IUniform<THREE.Texture>,
			res: {
				type: 'vec4',
				value: new THREE.Vector4(parent.offsetWidth, parent.offsetHeight, a1, a2)
			} as THREE.IUniform<THREE.Vector4>,
			dpr: {
				type: 'f',
				value: window.devicePixelRatio
			} as THREE.IUniform<number>,
			direction: {
				type: 'f',
				value: 1.0
			} as THREE.IUniform<number>,
			dispFactor2: {
				type: 'f',
				value: 0.0
			} as THREE.IUniform<number>
		},

		vertexShader: vertex,
		fragmentShader: fragment,
		transparent: true,
		opacity: 1.0
	});

	const geometry = new THREE.PlaneGeometry(parent.offsetWidth, parent.offsetHeight, 1);
	const object = new THREE.Mesh(geometry, mat);
	scene.add(object);

	// function handleSliderChange(e: Event) {
	// 	const value = (e.target as HTMLInputElement).value;
	// 	const dispFactor = Number(value);

	// 	gsap.to(mat.uniforms.dispFactor, {
	// 		duration: 0.1,
	// 		value: dispFactor,
	// 		ease: 'none',
	// 		onUpdate: render,
	// 		onComplete: render
	// 	});
	// }
	// Assuming the slider element has an id of 'slider'
	const slider_x = document.getElementById('sliderx') as HTMLInputElement;
	const slider_y = document.getElementById('slidery') as HTMLInputElement;
	slider_x.addEventListener('input', function () {
		// mat.uniforms.dispFactor.value = this.value;
		gsap.to(mat.uniforms.dispFactor, {
			duration: 0.1,
			value: this.value,
			ease: 'none',
			onUpdate: render,
			onComplete: render
		});
		gsap.to(mat.uniforms.direction, {
			duration: 0.1,
			value: 1.0
		});
	});
	slider_y.addEventListener('input', function () {
		// mat.uniforms.dispFactor.value = this.value;
		gsap.to(mat.uniforms.dispFactor, {
			duration: 0.1,
			value: this.value,
			ease: 'none',
			onUpdate: render,
			onComplete: render
		});
		gsap.to(mat.uniforms.direction, {
			duration: 0.1,
			value: -1.0
		});
	});

	window.addEventListener('resize', function () {
		if (parent.offsetHeight / parent.offsetWidth < imageAspect) {
			a1 = 1;
			a2 = parent.offsetHeight / parent.offsetWidth / imageAspect;
		} else {
			a1 = (parent.offsetWidth / parent.offsetHeight) * imageAspect;
			a2 = 1;
		}
		object.material.uniforms.res.value = new THREE.Vector4(
			parent.offsetWidth,
			parent.offsetHeight,
			a1,
			a2
		);
		renderer.setSize(parent.offsetWidth, parent.offsetHeight);

		render();
	});
}
