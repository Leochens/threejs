import React, { useEffect, useState } from 'react';
import { Slider } from 'antd';
import * as THREE from 'three';
import pic from './save.jpg';
import obj from './save1.obj';
// import obj from './lqx5_mask_new.obj';
// import obj from './lqx5_hello.obj';
import ply from './lqx5.ply';
import json from './lqx5_json.json';
import OBJLoader from 'three-obj-loader';

import { OrbitControls } from './lib/OrbitControls';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { MtlObjBridge } from "three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2.js";
import { OBJLoader2Parallel } from "three/examples/jsm/loaders/OBJLoader2Parallel.js";
import { LoadedMeshUserOverride } from "three/examples/jsm/loaders/obj2/shared/MeshReceiver.js";
// import {ObjVertexColor} from './lib/ObjVertexColor';
OBJLoader(THREE);

const TestWebGL = props => {
    const [head, setHead] = useState(null);
    const [opacity, setOpacity] = useState(100);

    const initThree = () => {

        let renderer, width, height, scene, camera, light, controls;
        threeStart();

        function init() {
            width = window.innerWidth;
            height = window.innerHeight;
            renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            renderer.setSize(width, height);
            document.getElementById('canvas-frame').appendChild(renderer.domElement);
            renderer.setClearColor(0x000000, 1.0);
        }


        function initScene() {
            scene = new THREE.Scene();
        }
        function initCamera() {
            camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
            camera.position.set(1, 1, 1)
            camera.up.set(0, 1, 0);
            camera.lookAt(scene.position);
        }

        function initLight() {
            light = new THREE.AmbientLight(0xFFFFFF);
            light.position.set(1, 1, 0);
            scene.add(light);
        }
        //用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
        function initControls() {

            controls = new OrbitControls(camera, renderer.domElement);

            // 如果使用animate方法时，将此函数删除
            //controls.addEventListener( 'change', render );
            // 使动画循环使用时阻尼或自转 意思是否有惯性
            controls.enableDamping = true;
            //动态阻尼系数 就是鼠标拖拽旋转灵敏度
            controls.dampingFactor = 0.25;
            //是否可以缩放
            controls.enableZoom = true;
            //是否自动旋转
            controls.autoRotate = false;
            //设置相机距离原点的最近距离
            controls.minDistance = 1;
            //设置相机距离原点的最远距离
            controls.maxDistance = 1000;
            //是否开启右键拖拽
            controls.enablePan = true;
        }

        function initModel() {
            //轴辅助 （每一个轴的长度）
            const object = new THREE.AxesHelper(20);
            scene.add(object);
        }
        function initObject() {
            //加载贴图
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(pic);

            // var manager = new THREE.LoadingManager();
            //加载obj模型
            // const loader = new THREE.OBJLoader();
            const loader = new OBJLoader2();
            loader.load(obj, function (object) {
                console.log(obj);
                object.traverse(function (child) {
                    console.log('cld', child)
                    if (child instanceof THREE.Mesh) {
                        child.material.map = texture;
                        child.material.transparent = true;
                        child.material.opacity = 1;
                        console.log(child);// 就一个
                        setHead(child);
                    }
                });
                object.position.set(0, 0, 0);
                scene.add(object);
            });
        }
        function initPLY() {
            //加载贴图
            // const textureLoader = new THREE.TextureLoader();
            // const texture = textureLoader.load(pic);

            // 加载ply模型
            const loader = new PLYLoader();
            loader.load(ply, function (geometry) {

                geometry.computeVertexNormals();

                var material = new THREE.MeshStandardMaterial( {flatShading: false } );
                // var material = new THREE.PointCloudMaterial()
                var mesh = new THREE.Mesh(geometry,material);

                mesh.position.y = - 0.2;
                mesh.position.z = 0.3;
                mesh.rotation.x = - Math.PI / 2;
                mesh.scale.multiplyScalar(0.001);

                mesh.castShadow = true;
                mesh.receiveShadow = true;

                scene.add(mesh);

            });

            // loader.load(ply, function (object) {
            //     console.log(ply);
            //     object.traverse(function (child) {
            //         console.log('cld',child)
            //         if (child instanceof THREE.Mesh) {
            //             // child.material.map = texture;
            //             child.material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
            //             child.material.transparent = true;
            //             child.material.opacity = 1;
            //             console.log(child);// 就一个
            //             setHead(child);
            //         }
            //     });
            //     object.position.set(0, 0, 0);
            //     scene.add(object);
            // });
        }

        function threeStart() {
            init();
            initScene();
            initCamera();
            initControls();
            initLight();
            // initModel();
            initObject();
            // initPLY();
            animation();

        }
        function animation() {
            renderer.render(scene, camera);
            requestAnimationFrame(animation);
        }
    }

    /**
     * 开始Three
     *
     * @memberof TestWebGL
     */
    useEffect(() => {
        initThree();
    }, [])
    function changeOpcity(e) {
        // alert("hello")
        // console.log(e);
        setOpacity(e)
        head.material.opacity = e / 100;
    }



    return (
        <div>
            <Slider style={{
                position: 'absolute',
                left: 0,
                right: 0
            }} onChange={changeOpcity} value={opacity}></Slider>

            <div id='canvas-frame' >
            </div>
        </div>
    );
}

export default TestWebGL;

