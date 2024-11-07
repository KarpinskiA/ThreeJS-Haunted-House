import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// AxesHelper
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Floor texture
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg')

// Wall texture

// Roof texture

// Door texture
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.jpg')
const doorColorTexture = textureLoader.load('./door/color.jpg')
const doorHeightTexture = textureLoader.load('./door/height.jpg')
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg')
const doorNormalTexture = textureLoader.load('./door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

// Grave texture

/**
 * House
 */
// Floor
const floorDebugParams = {
    width: 20,
    height: 20
}

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(floorDebugParams.width, floorDebugParams.height),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture,
        transparent: true
    })
);
floor.rotation.x = - Math.PI * 0.5;
scene.add(floor);

// Floor debug
const floorDebugFolder = gui.addFolder('Floor')
floorDebugFolder.close()

floorDebugFolder.add(floorDebugParams, 'width').min(10).max(50).step(0.1).onChange((value) => {
    floor.geometry.dispose()
    floor.geometry = new THREE.PlaneGeometry(value, floorDebugParams.height)
})

floorDebugFolder.add(floorDebugParams, 'height').min(10).max(50).step(0.1).onChange((value) => {
    floor.geometry.dispose()
    floor.geometry = new THREE.PlaneGeometry(floorDebugParams.width, value)
})

// Wall
const wallDebugParams = {
    width: 4,
    height: 2.5,
    depth: 4
}

const wall = new THREE.Mesh(
    new THREE.BoxGeometry(wallDebugParams.width, wallDebugParams.height, wallDebugParams.depth),
    new THREE.MeshStandardMaterial({ color: 'red' })
)
wall.position.y = floor.position.y + wallDebugParams.height / 2
scene.add(wall)

// Wall debug
const wallFolder = gui.addFolder('Wall')
wallFolder.close()

wallFolder.add(wallDebugParams, 'width').min(1).max(50).step(0.1).onChange((value) => {
    wall.geometry.dispose()
    wall.geometry = new THREE.BoxGeometry(value, wallDebugParams.height, wallDebugParams.depth)
})

wallFolder.add(wallDebugParams, 'height').min(1).max(50).step(0.1).onChange((value) => {
    wall.geometry.dispose()
    wall.geometry = new THREE.BoxGeometry(wallDebugParams.width, value, wallDebugParams.depth)
    wall.position.y = floor.position.y + value / 2
})

wallFolder.add(wallDebugParams, 'depth').min(1).max(50).step(0.1).onChange((value) => {
    wall.geometry.dispose()
    wall.geometry = new THREE.BoxGeometry(wallDebugParams.width, wallDebugParams.height, value)
})

// Roof
const roofDebugParams = {
    radius: 3.5,
    height: 1,
    radialSegments: 4
}

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(roofDebugParams.radius, roofDebugParams.height, roofDebugParams.radialSegments),
    new THREE.MeshStandardMaterial({ color: 'green' })
)
roof.rotation.y = Math.PI * 0.25
roof.position.y = wallDebugParams.height + roofDebugParams.height / 2
scene.add(roof)

// Roof debug
const roofFolder = gui.addFolder('Roof')
roofFolder.close()

roofFolder.add(roofDebugParams, 'radius').min(1).max(50).step(0.1).onChange((value) => {
    roof.geometry.dispose()
    roof.geometry = new THREE.ConeGeometry(value, roofDebugParams.height, roofDebugParams.radialSegments)
})

roofFolder.add(roofDebugParams, 'height').min(1).max(50).step(0.1).onChange((value) => {
    roof.geometry.dispose()
    roof.geometry = new THREE.ConeGeometry(roofDebugParams.radius, value, roofDebugParams.radialSegments)
    roof.position.y = wallDebugParams.height + value / 2
})

// Door
const doorDebugParams = {
    width: 2,
    height: 2
}

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(doorDebugParams.width, doorDebugParams.height),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.position.y = doorDebugParams.height / 2
door.position.z = wallDebugParams.depth / 2 + 0.01
scene.add(door)

// Door debug
const doorFolder = gui.addFolder('Door')
doorFolder.close()

doorFolder.add(doorDebugParams, 'width').min(1).max(wallDebugParams.width).step(0.1).onChange((value) => {
    door.geometry.dispose()
    door.geometry = new THREE.PlaneGeometry(value, doorDebugParams.height)
})

doorFolder.add(doorDebugParams, 'height').min(1).max(wallDebugParams.height).step(0.1).onChange((value) => {
    door.geometry.dispose()
    door.geometry = new THREE.PlaneGeometry(doorDebugParams.width, value)
    door.position.y = floor.position.y + value / 2
})

// Bush
const bushDebugParams = {
    radius: 1,
    widthSegments: 32,
    heightSegments: 16
}

const bushGeometry = new THREE.SphereGeometry(bushDebugParams.radius, bushDebugParams.widthSegments, bushDebugParams.heightSegments)
const bushMaterial = new THREE.MeshStandardMaterial({ color: 'blue' })

// Right big bush
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(1.2, 0.2, 2.2)

// Right small bush
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.8, 0.1, 2.1)

// Left big bush
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.5, 0.5, 0.5)
bush3.position.set(-1.2, 0.2, 2.2)

// Left big bush
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.25, 0.25, 0.25)
bush4.position.set(-1.8, 0.1, 2.1)
scene.add(bush1, bush2, bush3, bush4)

// Bush debug
const bushFolder = gui.addFolder('Bush')
bushFolder.close()

// Debug right big bush
const rightBigBush = bushFolder.addFolder('Right big bush')
rightBigBush.close()
rightBigBush.add(bush1.position, 'x').min(-5).max(5).step(0.1).name('Position X')
rightBigBush.add(bush1.position, 'y').min(0).max(5).step(0.1).name('Position Y')
rightBigBush.add(bush1.position, 'z').min(-5).max(5).step(0.1).name('Position Z')
rightBigBush.add(bush1.scale, 'x').min(0.1).max(2).step(0.1).name('Scale X')
rightBigBush.add(bush1.scale, 'y').min(0.1).max(2).step(0.1).name('Scale Y')
rightBigBush.add(bush1.scale, 'z').min(0.1).max(2).step(0.1).name('Scale Z')

// Debug right small bush
const rightSmallBush = bushFolder.addFolder('Right small bush')
rightSmallBush.close()
rightSmallBush.add(bush2.position, 'x').min(-5).max(5).step(0.1).name('Position X')
rightSmallBush.add(bush2.position, 'y').min(0).max(5).step(0.1).name('Position Y')
rightSmallBush.add(bush2.position, 'z').min(-5).max(5).step(0.1).name('Position Z')
rightSmallBush.add(bush2.scale, 'x').min(0.1).max(2).step(0.1).name('Scale X')
rightSmallBush.add(bush2.scale, 'y').min(0.1).max(2).step(0.1).name('Scale Y')
rightSmallBush.add(bush2.scale, 'z').min(0.1).max(2).step(0.1).name('Scale Z')

// Debug left big bush
const leftBigBush = bushFolder.addFolder('Left big bush')
leftBigBush.close()
leftBigBush.add(bush3.position, 'x').min(-5).max(5).step(0.1).name('Position X')
leftBigBush.add(bush3.position, 'y').min(0).max(5).step(0.1).name('Position Y')
leftBigBush.add(bush3.position, 'z').min(-5).max(5).step(0.1).name('Position Z')
leftBigBush.add(bush3.scale, 'x').min(0.1).max(2).step(0.1).name('Scale X')
leftBigBush.add(bush3.scale, 'y').min(0.1).max(2).step(0.1).name('Scale Y')
leftBigBush.add(bush3.scale, 'z').min(0.1).max(2).step(0.1).name('Scale Z')

// Debug left small bush
const leftSmallBush = bushFolder.addFolder('Left small bush')
leftSmallBush.close()
leftSmallBush.add(bush4.position, 'x').min(-5).max(5).step(0.1).name('Position X')
leftSmallBush.add(bush4.position, 'y').min(0).max(5).step(0.1).name('Position Y')
leftSmallBush.add(bush4.position, 'z').min(-5).max(5).step(0.1).name('Position Z')
leftSmallBush.add(bush4.scale, 'x').min(0.1).max(2).step(0.1).name('Scale X')
leftSmallBush.add(bush4.scale, 'y').min(0.1).max(2).step(0.1).name('Scale Y')
leftSmallBush.add(bush4.scale, 'z').min(0.1).max(2).step(0.1).name('Scale Z')

// Graves
const graveDebugParam = {
    width: 0.5,
    height: 1,
    depth: 0.15
}

const graveGeometry = new THREE.BoxGeometry(graveDebugParam.width, graveDebugParam.height, graveDebugParam.depth)
const graveMaterial = new THREE.MeshStandardMaterial({ color: 'grey' })

// On veut 30 tombes
for (let i = 0; i < 30; i++) {
    // Création de la tombe
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)

    // Coordonnées random
    const random = Math.random() * Math.PI * 2 // pour que ça fasse un cercle
    const radius = 3.5 + Math.random() * 4 // pour positionner entre 3 et 4m
    const x = Math.sin(random) * radius
    const z = Math.cos(random) * radius

    // Positionnement de la tombe
    grave.position.x = x
    grave.position.z = z
    grave.position.y = Math.random() * 0.4 // Pour faire varier a "taille" de la tombe en l'enfonçant plus ou moins

    // Rotation de la tombe
    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4

    // Ajout de la tombe à la scène
    scene.add(grave)
}

// Graves debug
const graveFolder = gui.addFolder('Grave')
graveFolder.close()

graveFolder.add(graveDebugParam, 'width').min(0.1).max(1).step(0.01).onChange((value) => {
    grave.geometry.dispose()
    grave.geometry = new THREE.BoxGeometry(value, graveDebugParam.height, graveDebugParam.depth)
})
graveFolder.add(graveDebugParam, 'height').min(0.1).max(1).step(0.01).onChange((value) => {
    grave.geometry.dispose()
    grave.geometry = new THREE.BoxGeometry(graveDebugParam.width, value, graveDebugParam.depth)
})
graveFolder.add(graveDebugParam, 'depth').min(0.1).max(1).step(0.01).onChange((value) => {
    grave.geometry.dispose()
    grave.geometry = new THREE.BoxGeometry(graveDebugParam.width, graveDebugParam.height, value)
})

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

/**
 * Sizes
 */
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const timer = new Timer()

const tick = () => {
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()