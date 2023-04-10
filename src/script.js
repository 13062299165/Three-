import './style.css'
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import dat from 'dat.gui'
const scene=new THREE.Scene();
const sizes={
    w:innerWidth,
    h:innerHeight
}
const canvas=document.querySelector('canvas')
const gui=new dat.GUI()

//添加雾气
const fog=new THREE.Fog(0x333333,2,18)
scene.fog=fog

const textureLoader=new THREE.TextureLoader();

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const brickColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const brickAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const brickNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const brickRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8,8)
grassAmbientOcclusionTexture.repeat.set(8,8)
grassNormalTexture.repeat.set(8,8)
grassRoughnessTexture.repeat.set(8,8)

grassColorTexture.wrapS=THREE.RepeatWrapping 
grassAmbientOcclusionTexture.wrapS=THREE.RepeatWrapping 
grassNormalTexture.wrapS=THREE.RepeatWrapping 
grassRoughnessTexture.wrapS=THREE.RepeatWrapping     

grassColorTexture.wrapT=THREE.RepeatWrapping 
grassAmbientOcclusionTexture.wrapT=THREE.RepeatWrapping 
grassNormalTexture.wrapT=THREE.RepeatWrapping 
grassRoughnessTexture.wrapT=THREE.RepeatWrapping   


//实体部分
{
const entity=new THREE.Group()

//地面部分
const plane=new THREE.PlaneGeometry(20,20)
const material1=new THREE.MeshStandardMaterial({
    color:"#808080",
    map:grassColorTexture,
    normalMap:grassNormalTexture,
    roughnessMap:grassRoughnessTexture,
    aoMap:grassAmbientOcclusionTexture

})
const floor=new THREE.Mesh(plane,material1)
floor.rotation.x=Math.PI*3/2
floor.receiveShadow=true
entity.add(floor)

//墙体部分
const cube=new THREE.BoxGeometry(4,4,4)
const material2=new THREE.MeshStandardMaterial({
    color:"#ffffff",
    map:brickColorTexture,
    normalMap:brickNormalTexture,
    roughnessMap:brickRoughnessTexture,
    aoMap:brickAmbientOcclusionTexture
})
const walls=new THREE.Mesh(cube,material2)
walls.position.y=2-0.01
walls.geometry.setAttribute(
    'uv',
    new THREE.BufferAttribute(walls.geometry.attributes.uv.array,2)
)
entity.add(walls)

//门的部分
const plane2=new THREE.PlaneGeometry(3,3,100,100)
const material3=new THREE.MeshStandardMaterial({
    color:"#ffff33",
    side:THREE.DoubleSide,
    transparent:true,
    map:doorColorTexture,
    //去除黑色部分需要设置transparent为true
    alphaMap:doorAlphaTexture,
    //环境光遮挡纹理，需要提供uv坐标
    aoMap:doorAmbientOcclusionTexture,
    //该属性影响顶点位置，产生立体感,需要提供顶点
    displacementMap:doorHeightTexture,
    displacementScale:.2,
    metalnessMap:doorMetalnessTexture,
    roughnessMap:doorRoughnessTexture,
    normalMap:doorNormalTexture,
    bumpScale:1
})
const door=new THREE.Mesh(plane2,material3)
door.geometry.setAttribute(
    'uv',
    new THREE.BufferAttribute(door.geometry.attributes.uv.array,2)
)
door.position.y=1.5
door.position.z=2+0.01
entity.add(door)

//屋顶部分
const cone=new THREE.ConeGeometry(4.5,1,4)
const material4=new THREE.MeshStandardMaterial({
    color:"#ff5555"
})
const roof=new THREE.Mesh(cone,material4)
roof.position.y=4.3
roof.rotation.y=Math.PI/4
entity.add(roof)

//随机墓碑
const cnt=30
const material5=new THREE.MeshStandardMaterial({
    color:'gray'
})
for(let i=0;i<cnt;i++){
    const grave=new THREE.Mesh(
        new THREE.BoxGeometry(1,1.5,.5),
        material5
    )
    grave.geometry.setAttribute(
        'uv',
        new THREE.BufferAttribute(grave.geometry.attributes.uv.array,2)
    )
    let flg=Math.random()>.5?-1:1;
    grave.position.x=(Math.random()*5+3)*flg
    flg=Math.random()>.5?-1:1;
    grave.position.z=(Math.random()*5+3)*flg
    grave.position.y=.75+0.01
    flg=Math.random()>.5?-1:1;
    grave.rotation.z=Math.PI/(Math.random()*10+20)*flg;
    entity.add(grave)
}
//植株部分
const sphere=new THREE.SphereGeometry(.5)
const material=new THREE.MeshStandardMaterial({
    color:'#2a2401'
})
const plant=new THREE.Mesh(sphere,material)
plant.position.set(1.7,.2,2)
entity.add(plant)

entity.children.forEach(obj => {
    obj.castShadow=true
});

scene.add(entity)
}


//光线
{
const lights=new THREE.Group()
const ambientLight=new THREE.AmbientLight(0xffffff,.5)
lights.add(ambientLight)

const bulb = new THREE.PointLight( 0xf08019, .5, 50 );
bulb.position.set( .95, 3.7, 2.1 );
bulb.castShadow=true
const helper=new THREE.PointLightHelper(bulb)
lights.add( bulb );

scene.add(lights)
// scene.add(helper)
}

//鬼影
const ghost1=new THREE.PointLight('#1a73e8',4,7,1)
const helper=new THREE.PointLightHelper(ghost1)
// scene.add(helper)
scene.add(ghost1)
const ghost2=new THREE.PointLight('#fc011a',4,7,1)
const helper2=new THREE.PointLightHelper(ghost2)
// scene.add(helper2)
scene.add(ghost2)
const ghost3=new THREE.PointLight('#07c160',4,7,1)
const helper3=new THREE.PointLightHelper(ghost3)
// scene.add(helper3)
scene.add(ghost3)


const camera=new THREE.PerspectiveCamera(75,sizes.w/sizes.h)
camera.position.z=15;
camera.position.y=3;
scene.add(camera)

const renderer=new THREE.WebGLRenderer({
    canvas
})
renderer.shadowMap.enabled=true
renderer.setSize(sizes.w,sizes.h)
renderer.setClearColor(0x333333)

const controls=new OrbitControls(camera,canvas)
const clock=new THREE.Clock()
console.log(clock)

const tick=()=>{
    let t=clock.getElapsedTime()
    //添加鬼影
    ghost1.position.set(Math.sin(t/4)*8,3,Math.cos(t/4)*8)

    ghost2.position.set(Math.sin(t/8)*6,Math.sin(t)+3,Math.cos(t/8)*6)

    ghost3.position.set(-5,3,5)


    controls.update()
    renderer.render(scene,camera)
    requestAnimationFrame(tick)
}
tick();
