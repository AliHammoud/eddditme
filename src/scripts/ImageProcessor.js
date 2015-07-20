/*jslint devel: true, bitwise: true, continue: true, plusplus: true,
unparam: false, sloppy: true,  vars: true, white: false, indent: 2,
maxlen: 80*/

var ImageProcessor = function (uploadedImg) {
  
  var
    FOV       = 75.0,
    ASPECT    = uploadedImg.width / uploadedImg.height,
    NEAR      = 0.01,
    FAR       = 1000,
    WIDTH     = 512,
    HEIGHT    = 512,
    DEBUGIMG  = true,
    OBJNAME   = 'imagePlane',
    UNIFS,
    VSHADER,
    FSHADER,
    SCENE,
    CAMERA,
    IMAGE     = uploadedImg,
    HASPECT   = IMAGE.height / IMAGE.width,
    TEXTURE,
    RENDERER;
  
  function flush(message) {
    
    RENDERER.render(SCENE, CAMERA);
    console.log("flush: " + message);
    
  }
  
  function isPowerOfTwo(number) {
    
    var
      binary = number.toString(2),
      count = 0,
      bit;
    
    for (bit in binary) {
      
      if (binary.hasOwnProperty(bit)) {
        
        if (binary[bit] === '1') { count++; }
        
      }
      
    }
    
    if (count === 1) { return true; } else {return false; }
    
  }
  
  function createImgPlane(fshaderID) {
    
    var base64Image = IMAGE.src;
    
    TEXTURE = THREE.ImageUtils.loadTexture(
      base64Image,
      {},
      function () { flush('Async texture loaded'); }
    );
    
    //check if poweroftwo

    UNIFS = {editImg: {type: 't', value: TEXTURE}};
    VSHADER = $('#vertexShader').html();
    FSHADER = $(fshaderID).html();
    
    var
      planeGeo = new THREE.PlaneBufferGeometry(1, HASPECT, 1, 1),
      planeMat = new THREE.ShaderMaterial({uniforms: UNIFS,
                                           vertexShader: VSHADER,
                                           fragmentShader: FSHADER
                                          }),
      imgPlane = new THREE.Mesh(planeGeo, planeMat);
    
    imgPlane.name = OBJNAME;
    
    var scaleToFit = Math.tan(FOV * Math.PI / 180 * 0.5) * ASPECT * 2;
    imgPlane.scale.set(scaleToFit, scaleToFit, 1);
    
    SCENE.add(imgPlane);

    flush('created image plane');
    
  }
  
  ImageProcessor.prototype.initProcessor = function () {
    
    SCENE = new THREE.Scene();
    CAMERA = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
    RENDERER = new THREE.WebGLRenderer();
    
    RENDERER.setSize(IMAGE.width, IMAGE.height);
    
    if (DEBUGIMG) {
      document.body.appendChild(RENDERER.domElement);
    }
    
    CAMERA.position.z = 1;
    
  };
  
  ImageProcessor.prototype.loadShader = function (shaderID) {
    
    if (SCENE.children.length === 0) {
      
      createImgPlane(shaderID);
      
    } else {
      
      var existingPlane = SCENE.getChildByName(OBJNAME);
      
    }
    
  };
  
  ImageProcessor.prototype.updateEffect = function () {
    
  };
  
};