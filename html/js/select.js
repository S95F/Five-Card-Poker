import { RenderPass } from './three.js-master/three.js-master/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './three.js-master/three.js-master/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from './three.js-master/three.js-master/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from './three.js-master/three.js-master/examples/jsm/shaders/FXAAShader.js';



let composer, effectFXAA, outlinePass;

let selectedObjects = [];

//const raycaster = new THREE.Raycaster();
//const mouse = new THREE.Vector2();
