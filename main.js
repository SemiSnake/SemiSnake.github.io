import * as THREE from 'three';
    //import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    //import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FirstPersonControls } from 'https://unpkg.com/three@0.138.0/examples/jsm/controls/FirstPersonControls.js'
import { PointerLockControls } from 'https://unpkg.com/three@0.138.0/examples/jsm/controls/PointerLockControls.js'
import {utils, Vector3D} from '/../utils.js';
import map from './json/layout.json' with {type: 'json'};
import config from './json/config.json' with {type: 'json'};


window.onload = function()
{
  var mousePressed = false;
  var mouseLocked = false;
  var inMenu = true;

  // ------------ raycasting --------------
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const clock = new THREE.Clock();

  // ----------- Setup ----------------
  const scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  var renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.domElement.id = "canvas"
  document.body.appendChild( renderer.domElement );

  window.addEventListener('resize', (e) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight );
  })

    // ------ Cube and div setup -------
  const infoCubes = []
  const infoCubesHoverText = this.document.getElementById("infoCubeHoverText")
  const cubeToDiv = [document.getElementsByClassName("cubeSelector")];
  const indexDiv = document.getElementById("IndexDiv");
  const infoDivs = [document.getElementsByClassName("cubeDiv")];
  const closeDivButtons = [document.getElementsByClassName("closeButton")];
  const blackBackground = document.getElementById("DarkBackgroundForDivs");
  
  // --------- Rendering for cubes ----------

  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const placeHoldermaterial = utils.imageToMaterial("Textures/Placeholder/selfie.jpg");

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
  for(let i = 0; i<6; i++) matArray[i].side = THREE.BackSide;

  let skyboxGeometry = new THREE.BoxGeometry(1000,1000,1000)

  let skybox = new THREE.Mesh(skyboxGeometry, matArray)
  scene.add(skybox)

  //------------Map and cube rendering:---------------


  /*addCube({x:1,y:0,z:0,}, geometry, material, "Test")
  addCube({x:3,y:0,z:0,}, geometry, material, "Test2")
  addCube({x:5,y:0,z:0,}, geometry, material, "Test3")
  addCube({x:7,y:0,z:0,}, geometry, material, "Test4")*/
  const cubeMatPath = "./Textures/CubeMaterials/";
  for(let i = 0; i < map.objects.infoCubesData.length; i++)
  {
    const cube = map.objects.infoCubesData[i];
    console.log(cube)
    addCube(cube.position, cube.scale, utils.imageToMaterial(cubeMatPath + cube.texture), cube.id, true);
  }

  var ground = addCube({x:0,y:-2,z:0}, {x:100,y:-1,z:100}, utils.imageToMaterial(cubeMatPath+"controller.png"), "Ground", false);
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

  

  function addCube(position, scale, material, name, isInfoCube)
  {
      var geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z);
      var newCube = new THREE.Mesh(geometry, material)

      newCube.name = name;
      newCube.position.x += position.x;
      newCube.position.y += position.y;
      newCube.position.z += position.z;
      if(typeof isInfoCube != "undefined" && isInfoCube) 
      {
        infoCubes.push(newCube)
      };
      
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
      /*const mat = utils.pageToMaterial();
      var geometry = new THREE.BoxGeometry(10,10,1);
      var newCube = new THREE.Mesh(geometry, mat)
      scene.add(newCube)
      */
      hideClasses(infoDivs)
      indexDiv.style = "visibility: hidden;";
      inMenu = false;
      hideBackground();
      controls.lock();
      config.globalSpeed = 1;
      mousePressed = false;
  }
  // ------------ POINTER CONTROLS --------------
  const controls = new PointerLockControls( camera, document.body );

  // add event listener to show/hide a UI (e.g. the game's menu)

  controls.addEventListener( 'lock', function () {
      mouseLocked = true;
      config.globalSpeed = 1;
      //menu.style.display = 'none';

  } );

  controls.addEventListener( 'unlock', function () {
      mouseLocked = false
      config.globalSpeed = 0;
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
        if(mouseLocked)
        {
          closeAllMenus()
          controls.unlock();
        }
        break;
      case 'Space':
        jump()
        break;
      case 'ShiftLeft':
        config.player.speed = 7.5;
        config.player.fov = 100;
        break;
      case 'KeyE':
        config.groundVelocity.y = 1;
        break;
      case 'KeyQ':
        config.groundVelocity.y = -1;
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
      case 'Space':
        stopJump()
        break;
      case 'ShiftLeft':
        config.player.speed = 5;
        config.player.fov = 75;
        break;
      case 'KeyE':
        config.groundVelocity.y = 0;
        break;
      case 'KeyQ':
        config.groundVelocity.y = 0;
        break;
    }
  });

  // ------------------- MOVEMENT ----------------------
  let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
  
  var jumping = false


  function jump()
  {
    if(grounded)
    {
      grounded = false
      jumping = true
      console.log("Jump!");
      velocity.y = config.player.JumpPower * config.globalSpeed;
    }
  }

  function stopJump()
  {

  }

  camera.position.z = 5;
  var deltaTime = 0;
  function animateCubes()
  {
    for(var i = 0; i<infoCubes.length; i++)
      {
          //infoCubes[i].visible = false;
          infoCubes[i].rotation.x += 1 * config.animationSpeed * config.globalSpeed * deltaTime
          infoCubes[i].rotation.y += 1 * config.animationSpeed * config.globalSpeed * deltaTime
      }
    
     ground.position.y += (config.groundVelocity.y*config.animationSpeed * config.globalSpeed * deltaTime)
  }
  var velocity = new Vector3D(0,0,0);
  var acceleration = new Vector3D(0,-9.81*config.gravityScale,0);
  var position = new Vector3D(0,0,0);
  var grounded = false;

  function playerPhysics()
  {
    var distanceToGround = position.y - (ground.position.y+ground.scale.y/2);
    camera.position.y = position.y + config.player.geometry.y;
    if(velocity.y > 0)
    {
      jumping = true
    }
    else
    {
      jumping = false
    }
    if(distanceToGround < 0.1 && !jumping)
    {
      grounded = true;
      position.y = ground.position.y + ground.scale.y/2
      velocity.y = 0
    }
    else{
      velocity = velocity.add(acceleration.multiply(config.globalSpeed).multiply(deltaTime));
      position = position.add(velocity.multiply(config.globalSpeed).multiply(deltaTime));
    }

  }

  function cameraPhysics()
  {
    var fovChangeSpeed = 5
    camera.fov += (config.player.fov - camera.fov) * fovChangeSpeed * config.globalSpeed * deltaTime
    camera.updateProjectionMatrix();
    
  }

  function animate() {
      deltaTime = clock.getDelta();
      console.log(deltaTime)
      animateCubes();
      playerPhysics();
      cameraPhysics();
      // update the picking ray with the camera and pointer position
      raycaster.setFromCamera( pointer, camera );

      // calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(infoCubes);
      if(intersects[0])
      {
          //var rayCastId = intersects[0].object.uuid;
          var curCube = intersects[0].object;
          infoCubesHoverText.style.visibility = "visible";
          infoCubesHoverText.innerHTML = utils.getCubesDataFromId(curCube.name).name
          if(mousePressed && mouseLocked)
          {
            openMenu(document.getElementById(utils.getCubesDataFromId(curCube.name).infoDivId))
            config.globalSpeed = 0;
          }
      }

      else
      {
          infoCubesHoverText.style.visibility = "hidden";
      }
      
      if (moveForward) controls.moveForward(config.player.speed * config.globalSpeed * deltaTime);
      if (moveBackward) controls.moveForward(-config.player.speed * config.globalSpeed * deltaTime);
      if (moveLeft) controls.moveRight(-config.player.speed * config.globalSpeed * deltaTime);
      if (moveRight) controls.moveRight(config.player.speed * config.globalSpeed * deltaTime);
      if(mousePressed){mousePressed = false;}
      renderer.render( scene, camera );

  }
  renderer.setAnimationLoop(animate);
 
}