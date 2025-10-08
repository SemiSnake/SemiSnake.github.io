import * as THREE from 'three';
    //import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    //import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FirstPersonControls } from 'https://unpkg.com/three@0.138.0/examples/jsm/controls/FirstPersonControls.js'
import { PointerLockControls } from 'https://unpkg.com/three@0.138.0/examples/jsm/controls/PointerLockControls.js'
window.onload = function()
{



    //const controls = new OrbitControls( camera, renderer.domElement );
    //const loader = new GLTFLoader();

    var global = {gameSpeed: 1, animationSpeed: 1};
    global.animationSpeed = global.gameSpeed * 0.01;



    var player = {height: 0.9, widthx: 0.3, widthy: 0.3, pickUpRange: 1};
    var gravity = 0.01
    var acc = 0
    var mousePressed = false;
    var mouseLocked = false;
    var inMenu = true;

    // ------------ raycasting --------------
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();



    // ----------- Setup ----------------
    const scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.id = "canvas"
    document.body.appendChild( renderer.domElement );

    window.addEventListener('resize', (e) => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );
    })
    const cubeArray = [];
    const cubeToDiv = [document.getElementsByClassName("cubeSelector")];
    const indexDiv = document.getElementById("IndexDiv");
    const infoDivs = [document.getElementsByClassName("cubeDiv")];
    const closeDivButtons = [document.getElementsByClassName("closeButton")];
    const blackBackground = document.getElementById("DarkBackgroundForDivs");
    
    // --------- Rendering for cubes ----------
    const face_texture = new THREE.TextureLoader().load("Textures/Placeholder/selfie.jpg")
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { /*color: 0x00ff00,*/ map: face_texture} );

    // -------- SKYBOX ------------
    let matArray = [];
    
    const skyboxTexturePath = "Textures/Skybox/"
    const skyboxFolder = "ulukai/"
    const skyboxName = "corona"

    
    const texture_bk = new THREE.TextureLoader().load(skyboxTexturePath + skyboxFolder + skyboxName +"_bk.png")
    const texture_dn = new THREE.TextureLoader().load(skyboxTexturePath + skyboxFolder + skyboxName +"_dn.png")
    const texture_ft = new THREE.TextureLoader().load(skyboxTexturePath + skyboxFolder + skyboxName +"_ft.png")
    const texture_lf = new THREE.TextureLoader().load(skyboxTexturePath + skyboxFolder + skyboxName +"_lf.png")
    const texture_rt = new THREE.TextureLoader().load(skyboxTexturePath + skyboxFolder + skyboxName +"_rt.png")
    const texture_up = new THREE.TextureLoader().load(skyboxTexturePath + skyboxFolder + skyboxName +"_up.png")

    matArray.push(new THREE.MeshBasicMaterial({map: texture_ft}))
    matArray.push(new THREE.MeshBasicMaterial({map: texture_bk}))
    matArray.push(new THREE.MeshBasicMaterial({map: texture_up}))
    matArray.push(new THREE.MeshBasicMaterial({map: texture_dn}))
    matArray.push(new THREE.MeshBasicMaterial({map: texture_rt}))
    matArray.push(new THREE.MeshBasicMaterial({map: texture_lf}))

    //Setting skybox textures to inside of cube instead of outside
    for(let i = 0; i<6; i++)
        matArray[i].side = THREE.BackSide;

    let skyboxGeometry = new THREE.BoxGeometry(1000,1000,1000)

    let skybox = new THREE.Mesh(skyboxGeometry, matArray)
    scene.add(skybox)

    //------------Map and cube rendering:---------------


    addCube({x:1,y:0,z:0,}, geometry, material, "Test")
    addCube({x:3,y:0,z:0,}, geometry, material, "Test2")
    addCube({x:5,y:0,z:0,}, geometry, material, "Test3")
    addCube({x:7,y:0,z:0,}, geometry, material, "Test4")

    // ------------- General functionality for opening/closing sections----------------
    function hideBackground()
    {
        blackBackground.style = "visibility: hidden;";
    }  
    
    function showBackground()
    {
        blackBackground.style = "visibility: visible;";
    }

    function hideClasses(cl)
    {
        for(var i = 0; i<cl[0].length; i++)
        {
            cl[0][i].style = "visibility: none;";
            
        }
    }

    for(var i = 0; i<closeDivButtons[0].length; i++)
    {
        closeDivButtons[0][i].addEventListener("click", function(e){
            closeAllMenus()
        });
    }

    camera.position.z = 5;

    function addCube(position, g, m, nameP)
    {
        var newCube = new THREE.Mesh(g, m)
        newCube.name = nameP;
        newCube.position.x += position.x;
        newCube.position.y += position.y;
        newCube.position.z += position.z;
        cubeArray.push(newCube);
        
        scene.add(newCube)
        return newCube;
    }
    function openMenu(div)
    {
        div.style = "visibility: visible";
        inMenu = true;
        showBackground();
        controls.unlock();
        mousePressed = false;
    }
    function closeMenu(div)
    {
        div.style = "visibility: hidden";
        inMenu = false;
        hideBackground();
        controls.lock();
        mousePressed = false;
    }
    function closeAllMenus()
    {
        hideClasses(infoDivs)
        indexDiv.style = "visibility: hidden;";
        inMenu = false;
        hideBackground();
        controls.lock();
        mousePressed = false;
    }
    // ------------ POINTER CONTROLS --------------
    const controls = new PointerLockControls( camera, document.body );

    // add event listener to show/hide a UI (e.g. the game's menu)

    controls.addEventListener( 'lock', function () {
        mouseLocked = true;
        //menu.style.display = 'none';

    } );

    controls.addEventListener( 'unlock', function () {
        mouseLocked = false
        //menu.style.display = 'block';

    } );


    document.addEventListener("mousedown", (event) =>{
        if(!inMenu)
        {
            controls.lock();
            mousePressed = true;
        }
    })

    document.addEventListener("mouseup", (event) =>{
        mousePressed = false;
    })


    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;
            case 'Escape':
                closeAllMenus()
                controls.unlock();
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;
        }
    });

    // ------------------- MOVEMENT ----------------------
    let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
    const speed = 0.05;





    function animate() {
        for(var i = 0; i<cubeArray.length; i++)
        {
            cubeArray[i].rotation.x += 1 * global.animationSpeed
            cubeArray[i].rotation.y += 1 * global.animationSpeed
        }
        // update the picking ray with the camera and pointer position
        raycaster.setFromCamera( pointer, camera );

        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(cubeArray);
        if(intersects[0])
        {
            var rayCastId = intersects[0].object.uuid;
            for(var i = 0; i<cubeArray.length; i++)
            {
                if(rayCastId == cubeArray[i].uuid)
                {
                    console.log(cubeArray[i].name)
                    cubeToDiv[0][i].style = "visibility: visible;";
                    if(mousePressed && mouseLocked)
                    {
                        openMenu(infoDivs[0][i])
                    }
                }
                else
                {
                    cubeToDiv[0][i].style = "visibility: hidden;";
                }
            }
        }

        else
        {
            hideClasses(cubeToDiv);
        }
        
        if (moveForward) controls.moveForward(speed);
        if (moveBackward) controls.moveForward(-speed);
        if (moveLeft) controls.moveRight(-speed);
        if (moveRight) controls.moveRight(speed);
        if(mousePressed){mousePressed = false;}
        renderer.render( scene, camera );

    }
    renderer.setAnimationLoop( animate );
}