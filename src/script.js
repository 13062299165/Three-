import './style.css'
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const scene=new THREE.Scene();
const sizes={
    w:innerWidth,
    h:innerHeight
}
const canvas=document.querySelector('canvas')

//添加雾气
const fog=new THREE.Fog(0x333333,2,18)
scene.fog=fog

//地面部分
{
    const plane=new THREE.PlaneGeometry(20,20)
const material1=new THREE.MeshStandardMaterial({
    color:"#808080",
    side:THREE.DoubleSide
})
const floor=new THREE.Mesh(plane,material1)
floor.rotation.x=Math.PI/2
scene.add(floor)

//墙体部分
const cube=new THREE.BoxGeometry(4,4,4)
const material2=new THREE.MeshStandardMaterial({
    color:"#ffffff"
})
const walls=new THREE.Mesh(cube,material2)
walls.position.y=2-0.01
scene.add(walls)

//门的部分
const plane2=new THREE.PlaneGeometry(1.3,3)
const material3=new THREE.MeshStandardMaterial({
    color:"#ffff33",
    side:THREE.DoubleSide
})
const door=new THREE.Mesh(plane2,material3)
door.position.y=1.5
door.position.z=2+0.01
scene.add(door)

//屋顶部分
const cone=new THREE.ConeGeometry(5,1,4)
const material4=new THREE.MeshStandardMaterial({
    color:"#ff5555"
})
const roof=new THREE.Mesh(cone,material4)
roof.position.y=4.3
roof.rotation.y=Math.PI/4
scene.add(roof)

//随机墓碑
const cnt=30
const material5=new THREE.MeshBasicMaterial({
    color:'gray'
})
for(let i=0;i<cnt;i++){
    const grave=new THREE.Mesh(
        new THREE.BoxGeometry(1,1.5,.5),
        material5
    )
    let flg=Math.random()>.5?-1:1;
    grave.position.x=(Math.random()*5+3)*flg
    flg=Math.random()>.5?-1:1;
    grave.position.z=(Math.random()*5+3)*flg
    grave.position.y=.75+0.01
    flg=Math.random()>.5?-1:1;
    grave.rotation.z=Math.PI/(Math.random()*10+20)*flg;
    scene.add(grave)
}
//植株部分
const sphere=new THREE.SphereGeometry(.5)
const material=new THREE.MeshStandardMaterial({
    color:'#a3be8c'
})
const plant=new THREE.Mesh(sphere,material)
plant.position.set(1.7,.2,2)
scene.add(plant)
}


//光线
const light=new THREE.AmbientLight(0xffffff,.5)
scene.add(light)
const bulb = new THREE.PointLight( 0xf08019, 1, 100 );
bulb.position.set( .95, 3.7, 2.1 );
// const helper=new THREE.PointLightHelper(bulb)
scene.add( bulb );
// scene.add(helper)

const camera=new THREE.PerspectiveCamera(75,sizes.w/sizes.h)
camera.position.z=15;
camera.position.y=3;
scene.add(camera)

const renderer=new THREE.WebGLRenderer({
    canvas
})
renderer.setSize(sizes.w,sizes.h)
renderer.setClearColor(0x333333)

const controls=new OrbitControls(camera,canvas)
const tick=()=>{
    controls.update()
    renderer.render(scene,camera)
    requestAnimationFrame(tick)
}
tick();
