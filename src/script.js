import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import vertex from './shaders/planetGeneral/vertex.glsl';
import fragment from './shaders/planetGeneral/fragment.glsl';
import vertexStar from './shaders/stars/vertexStar.glsl';
import fragmentStar from './shaders/stars/fragmentStar.glsl';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const textDOM = document.querySelector(".text-class");


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//params
const params = {
    insideColor: new THREE.Color("#e3bc68"),
    outsideColor: new THREE.Color("#8a6b14"),
    resize: 0
}


const colorsOfPlanets = {
    mercury: {
        insideColor: new THREE.Color("#e3bc68"),
        outsideColor: new THREE.Color("#8a6b14")
    },
    venus: {
        insideColor: new THREE.Color("#e0a3d8"),
        outsideColor: new THREE.Color("#b168a0")
    },
    terra: {
        insideColor: new THREE.Color("#33ff00"),
        outsideColor: new THREE.Color("#5b97f1")
    },
    mars: {
        insideColor: new THREE.Color("#b36247"),
        outsideColor: new THREE.Color("#8a371b")
    },
    jupiter: {
        insideColor: new THREE.Color("#fde6b4"),
        outsideColor: new THREE.Color("#d3c0a7")
    },
    saturn: {
        insideColor: new THREE.Color("#0956f1"),
        outsideColor: new THREE.Color("#918221")
    },
    uranus: {
        insideColor: new THREE.Color("#656368"),
        outsideColor: new THREE.Color("#541985")
    },
    neptune: {
        insideColor: new THREE.Color("#1f6b7a"),
        outsideColor: new THREE.Color("#055755")
    },
    pluto: {
        insideColor: new THREE.Color("#536a80"),
        outsideColor: new THREE.Color("#525566")
    },
    
}


//Light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight)

//Sizes
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//Camera
const cameraGroup = new THREE.Group(); //->parallax
scene.add(cameraGroup)
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 9;
camera.position.y = 1.5;
cameraGroup.add(camera)


//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Planets
const nrPoints = 10000;

const positions = new Float32Array(nrPoints * 3);
const colors = new Float32Array(nrPoints * 3);
const scales = new Float32Array(nrPoints * 1);

const centerOfScene = new THREE.Vector3(0,0,0)

const createPlanet = () => {
    for(let i=0; i<nrPoints; i++) {
    
    // This uses the method described in this post. 
    // It works by picking three normally distributed numbers and normalizing the vector resulting from these numbers. 
    // It is then scaled by the cube root of a uniformly chosen random number for the radius.
    //https://karthikkaranth.me/blog/generating-random-points-in-a-sphere/

    let u = Math.random() * sizes.height / 1000;
    let x1 = (Math.random() - 0.5);
    let x2 = (Math.random() - 0.5);
    let x3 = (Math.random() - 0.5);

    let mag = Math.sqrt(x1*x1 + x2*x2 + x3*x3);
    x1 /= mag; x2 /= mag; x3 /= mag;

    // Math.cbrt is cube root
    let d = Math.cbrt(u);
    positions[i * 3 + 0] = x1 * d;
    positions[i * 3 + 1] = x2 * d;
    positions[i * 3 + 2] = x3 * d;

    //colors
    const colorInside = new THREE.Color(params.insideColor);
    const colorOutside = new THREE.Color(params.outsideColor);
    const mixedColor = colorInside.clone();

    const distanceToCenter = new THREE.Vector3(
        positions[i * 3 + 0],
        positions[i * 3 + 1],
        positions[i * 3 + 2]).distanceTo(centerOfScene);

    mixedColor.lerp(colorOutside, distanceToCenter);

    colors[i * 3 + 0] = mixedColor.r
    colors[i * 3 + 1] = mixedColor.g
    colors[i * 3 + 2] = mixedColor.b
    
    //Random scale
    scales[i] = Math.random()
}
}
createPlanet();

const planetsGeometry = new THREE.BufferGeometry();
planetsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
planetsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
planetsGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

const planetMat = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
        uSize: { value: 10 * renderer.getPixelRatio()},
        uTime: { value: 0},
        uWindowSizeHeight: {value: sizes.height},
        uWindowSizeWidth: {value: sizes.width},
        uScrollScale:{value: 0},
        uFinish: {value: 1}
    },
    transparent: true
});

const planet = new THREE.Points(planetsGeometry, planetMat);
planet.scale.set(0.8,0.8,0.8)
scene.add(planet)


const noOfStars = 1000;
const stars = new Float32Array(noOfStars * 3);
for (let i = 0; i<noOfStars; i++){
    const randX = Math.random() - 0.5;
    const randY = Math.random() - 0.3;
    const randZ = Math.random() - 0.5;
    stars[i * 3 + 0] = randX * 15;
    stars[i * 3 + 1] = randY * 10;
    stars[i * 3 + 2] = randZ * 1.5;
}
const starsGeo = new THREE.BufferGeometry();
starsGeo.setAttribute('position', new THREE.BufferAttribute(stars, 3));
const starsMat = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    vertexShader: vertexStar,
    fragmentShader: fragmentStar,
    transparent: true
});
const starsPoint = new THREE.Points(starsGeo, starsMat);
scene.add(starsPoint)

//Scroll
let scrollY = window.scrollY

const changeColors = (planet) => {
        params.insideColor.set(planet.insideColor);
        params.outsideColor.set(planet.outsideColor);
        createPlanet();
        planetsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
}


window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    const scrollValue = scrollY / sizes.height;
    planetMat.uniforms.uScrollScale.value = scrollValue % 1;

    //console.log(scrollValue % 1)
    textDOM.style.opacity = Math.abs(0.45 - (scrollValue % 1)) * 2;

    if (scrollValue < 0.45) {
        textDOM.removeAttribute('id')
        textDOM.setAttribute('id', 'mercury');
        textDOM.textContent = 'mercury'
        changeColors(colorsOfPlanets.mercury);
        camera.position.z = 9 + scrollValue / 10;
    } else if(scrollValue >= 0.45 && scrollValue < 1.45){
        textDOM.removeAttribute('id')
        textDOM.setAttribute('id', 'venus');
        textDOM.textContent = 'venus'
        changeColors(colorsOfPlanets.venus);
        camera.position.z = 9 + scrollValue / 10;
    } else if(scrollValue >= 1.45 && scrollValue < 2.45){
        textDOM.removeAttribute('id')
        textDOM.setAttribute('id', 'terra');
        textDOM.textContent = 'terra'
        changeColors(colorsOfPlanets.terra);
        camera.position.z = 9 + scrollValue / 10;
    } else if(scrollValue >= 2.45 && scrollValue < 3.45){
        textDOM.removeAttribute('id')
        textDOM.setAttribute('id', 'mars');
        textDOM.textContent = 'mars'
        changeColors(colorsOfPlanets.mars);
        camera.position.z = 9 + scrollValue / 10;
    } else if(scrollValue >= 3.45 && scrollValue < 4.45){
        textDOM.removeAttribute('id')
        textDOM.setAttribute('id', 'jupiter');
        textDOM.textContent = 'jupiter'
        changeColors(colorsOfPlanets.jupiter);
        camera.position.z = 9 + scrollValue / 10;
    } else if(scrollValue >= 4.45 && scrollValue < 5.45){
        textDOM.removeAttribute('id')
        textDOM.setAttribute('id', 'saturn');
        textDOM.textContent = 'saturn'
        changeColors(colorsOfPlanets.saturn);
        camera.position.z = 9 + scrollValue / 10;
    } else if(scrollValue >= 5.45 && scrollValue < 6.45){
        textDOM.removeAttribute('id')
        textDOM.setAttribute('id', 'uranus');
        textDOM.textContent = 'uranus'
        changeColors(colorsOfPlanets.uranus);
        camera.position.z = 9 + scrollValue / 10;
    } else if(scrollValue >= 6.45 && scrollValue < 7.45){
        textDOM.removeAttribute('id')
        textDOM.setAttribute('id', 'neptune');
        textDOM.textContent = 'neptune'
        changeColors(colorsOfPlanets.neptune);
        camera.position.z = 9 + scrollValue / 10;
    } else if(scrollValue >= 7.45 && scrollValue < 8.45){
        textDOM.removeAttribute('id')
        textDOM.setAttribute('id', 'pluto');
        textDOM.textContent = 'pluto'
        changeColors(colorsOfPlanets.pluto);
        camera.position.z = 9 + scrollValue / 10;
    } else if(scrollValue >= 8.45){
        planetMat.uniforms.uFinish.value = Math.exp((scrollValue - 8.45) * 5)
        textDOM.removeAttribute('id')
        textDOM.setAttribute('id', 'follow')
        //console.log((8.45 - scrollValue) * 0.5)
        textDOM.textContent = 'K BYE'
        camera.position.z = 9.84 - (8.45 - scrollValue) * 5 ;
    }
    
})

const clock = new THREE.Clock()

//CURSOR
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
     cursor.x = event.clientX / sizes.width - 0.5;
     cursor.y = event.clientY / sizes.height - 0.5;
})

//ORbit
//const controls = new OrbitControls( camera, renderer.domElement );

//GUI
// const gui = new dat.GUI();
// gui.addColor(params, 'insideColor').onFinishChange(() => {
//     createPlanet();
//     planetsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
// })
// gui.addColor(params, 'outsideColor').onFinishChange(() => {
//     createPlanet();
//     planetsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
// })

let previosTime = 0;
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previosTime;
    previosTime = elapsedTime;
    planetMat.uniforms.uTime.value = elapsedTime;

    //starsPoint.rotation.set(0, 0, elapsedTime * 0.01)
    //planet.rotation.set(elapsedTime * 0.2, 0, 0)

    //planet.rotation.set(Math.sin(elapsedTime * 0.2), Math.sin(elapsedTime * 0.2),Math.sin(elapsedTime * 0.2))

    // Animate meshes
    // for(const mesh of sectionMeshes)
    // {
    //     mesh.rotation.x = elapsedTime * 0.1
    //     mesh.rotation.y = elapsedTime * 0.12
    // }

    const parallaxX = cursor.x * 0.5;
    const parallaxY = - cursor.y * 0.5;
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * deltaTime * 0.3;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * deltaTime * 0.3;

    //console.log(planetMat.uniforms.uScrollScale)
    // Render
    renderer.render(scene, camera)

    //Orbit
    //controls.update();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()