import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}
gui
    .addColor(parameters, 'materialColor')
    .onChange(() =>
    {
        material.color.set(parameters.materialColor)
        particlesMat.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

/**
 * Lights
 */
 const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
 directionalLight.position.set(1, 1, 0)
 scene.add(directionalLight)

 const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

// Meshes
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)
const sectionMeshes = [ mesh1, mesh2, mesh3 ]

scene.add(mesh1, mesh2, mesh3)


mesh1.position.y = 2
mesh1.scale.set(0.5, 0.5, 0.5)

mesh2.position.y = - 2
mesh2.scale.set(0.5, 0.5, 0.5)

mesh3.position.y = - 2
mesh3.scale.set(0.5, 0.5, 0.5)

const objectsDistance = 4
mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2
mesh1.position.x = 1.5
mesh2.position.x = - 1.5
mesh3.position.x = 1.5

//PARTICLES
const particlesCount = 2000;
const positions = new Float32Array(particlesCount * 3);

for(let i=0; i< 200; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 5;
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
}
const particlesGeo = new THREE.BufferGeometry();
particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMat = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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

/**
 * Camera
 */
// Base camera
const cameraGroup = new THREE.Group();
scene.add(cameraGroup)
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6

cameraGroup.add(camera)
/**
 * Scroll
 */
 let scrollY = window.scrollY

 window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
})

/**
 * Renderer
 */
 const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
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

let previosTime = 0;
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previosTime;
    previosTime = elapsedTime;
    

    // Animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x = elapsedTime * 0.1
        mesh.rotation.y = elapsedTime * 0.12
    }
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5;
    const parallaxY = - cursor.y * 0.5;
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * deltaTime * 0.7;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * deltaTime * 0.7;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()