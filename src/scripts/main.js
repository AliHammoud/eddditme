/*jslint devel: true, bitwise: true, continue: true, plusplus: true,
unparam: false, sloppy: true,  vars: true, white: false, indent: 2,
maxlen: 80*/

/*global $, FileReader, ImageProcessor */

var
  img,
  viewport,
  WARNINGS = false;

function fitOrigSize(selector, imageWidth, imageHeight) {

  $(selector).attr('width', imageWidth);
  $(selector).attr('height', imageHeight);
  
  viewport.resizeCanvas(imageWidth, imageHeight);

}

function fitWidth(selector, aspect, winWidth) {
  
  $(selector).attr('width', winWidth);
  $(selector).attr('height', $(selector).attr('width') / aspect);
  
  viewport.resizeCanvas(winWidth, ($(selector).attr('width') / aspect));

}

function fitHeight(selector, aspect, winHeight) {
  
  $(selector).attr('width', $(selector).attr('height') * aspect);
  $(selector).attr('height', winHeight);
  
  viewport.resizeCanvas(($(selector).attr('height') * aspect), winHeight);

}

function checkTopBar(selector) {

  if ($(selector).attr('height') > (window.innerHeight - 80)) {

    var
      diff = $(selector).attr('height') - (window.innerHeight - 80),
      val = 0.5 + (1 - (diff / 80));

    $('#topBar').css({opacity: val});

  } else {

    $('#topBar').css({opacity: 1});
    
  }

}

function fitLargestDim(selector, aspect) {

  var
    winWidth = window.innerWidth,
    winHeight = window.innerHeight,
    width = $(selector).attr('width'),
    height = $(selector).attr('height');

  if (img.width > winWidth && img.height < winHeight) {
    
    fitWidth(selector, aspect, winWidth);

  }

  if (img.width > winWidth && img.height > winHeight) {

    var screenAspect = winWidth / winHeight;

    if (screenAspect > aspect) {

      fitHeight(selector, aspect, winHeight);

    }

    if (screenAspect < aspect) {

      fitWidth(selector, aspect, winWidth);

    }

  }

  if (img.width > winWidth && img.height === winHeight) {

    fitWidth(selector, aspect, winWidth);

  }

  if (img.width < winWidth && img.height < winHeight) {

    fitOrigSize(selector, img.width, img.height);

  }

  if (img.width < winWidth && img.height > winHeight) {

    fitHeight(selector, aspect, winHeight);

  }

  if (img.width < winWidth && img.height === winHeight) {

    fitOrigSize(selector, img.width, img.height);

  }

  if (img.width === winWidth && img.height > winHeight) {

    fitHeight(selector, aspect, winHeight);

  }

  if (img.width === winWidth && img.height < winHeight) {

    fitOrigSize(selector, img.width, img.height);

  }

  checkTopBar(selector);

}

function fitElement(selector) {

  try {

    var aspect;
    
    aspect = img.width / img.height;
    fitLargestDim(selector, aspect);

  } catch (e) {
    
    if (WARNINGS) { console.warn(e); }
    
  }

}

function setupUploader() {

  //temporary
  $('#dragDrop').css({visibility: 'visible'});

}

function removeUploader() {

  //temporary
  $('#dragDrop').css({visibility: 'hidden'});

}

function setupImage() {

  var image = [
    '<img src="" class="centered"',
    'id="dispImg" height="0" width="0"',
    'style="z-index: 1">'
  ].join(' ');

  //$('body').append(image);

  $('#dispImg')
    .attr('src', img.src)
    .attr('width', img.width)
    .attr('height', img.height)
    .css({visibility: 'visible'});
  
  //fitElement('#dispImg');

  viewport = new ImageProcessor(img);
  viewport.initProcessor();
  viewport.loadShader('#fragmentShader_0');

  $('canvas').addClass('centered');
  
  fitElement('canvas');
  
}

function removeImage() {
  
  $('#dispImg').remove();
  
}

function createLoader() {

  console.time('create loader');

  var loader = [
    '<div id="loaderParent">',
    '  <img src="img/loader.png"',
    '  id="loader"',
    '  class="centered appended rotating"',
    '  width="100" height="100">',
    '  <p>Loading Image</p>',
    '</div>'
  ].join(' ');

  $('body').append(loader);
  console.timeEnd('create loader');

}

function removeLoader() {

  $('#loaderParent').remove();

}

function readImageFile(file) {

  var
    reader = new FileReader(),
    fileSizeRaw = file.size,
    fileSizeMB,
    imageType = 'image';
  
  fileSizeMB = fileSizeRaw / (1024 * 1024);
  
  if (file.type.match(imageType)) {
    
    createLoader();
    removeUploader();
    
    // write the image to the FileReader objcet as dataURL
    reader.readAsDataURL(file);
    
    reader.onloadstart = function (e) {

      console.log('loading image');

    };

    reader.onprogress = function (e) {

    };

    reader.onloadend = function (e) {

      console.log('image loaded');
      removeLoader();

    };

    reader.onload = function (e) {

      e.preventDefault();

      img = new Image();
      img.src = reader.result;

      setupImage();

    };

  } else {
    // Handle error: file format specified by user is not supported
    alert("Invalid file format");

  }

}

function upload(fileList) {
  
  if (fileList.length > 0) {
    
    readImageFile(fileList[0]);

  }

}

$(document).ready(function () {
  'use strict';

  $('#dragDrop').on(
    'dragover',
    function (e) {
      e.preventDefault();
      e.stopPropagation();

    }
  );

  $('#dragDrop').on(
    'dragenter',
    function (e) {
      e.preventDefault();
      e.stopPropagation();

    }
  );

  $('#dragDrop').on(
    'dragleave',
    function (e) {
      e.preventDefault();
      e.stopPropagation();

    }
  );
  
  $('#op1').click(
    function (e) {
      
      try {
        
        viewport.loadShader('#fragmentShader_0');
        
      } catch (er) { alert(er); }
      
    }
  );
  
  $('#op2').click(
    function (e) {

      try {

        viewport.loadShader('#fragmentShader_1');

      } catch (er) { alert(er); }

    }
  );
  
  $('#actionButton').click(
    function (e) {
      
      if ($('#bottomMenu').hasClass('hidden')) {
        
        $('#bottomMenu').removeClass('hidden');
        $('#bottomMenu').animate({bottom: '0px'}, 500, 'easeInOutElastic');
        
      } else {
        
        $('#bottomMenu').addClass('hidden');
        $('#bottomMenu').animate({bottom: '-125px'}, 500, 'easeInOutElastic');
        
      }
    }
  );

  /* drop-related */

  $('#dragDrop').on(
    'drop',
    function (e) {
      
      if (e.originalEvent.dataTransfer) {
        
        if (e.originalEvent.dataTransfer.files.length) {
          
          e.preventDefault();
          e.stopPropagation();
          upload(e.originalEvent.dataTransfer.files);

        }

      }

    }
  );

  $('#dragDrop').click(function () {

    $('#imgInput').trigger('click');

  });

  $('#imgInput').change(function () {

    var
      input = document.getElementById('imgInput'),
      inputFileList = input.files;

    upload(inputFileList);

  });
  
  /* Window Events */

  window.onresize = function () {
    
    try {
      
      fitElement('canvas');
      
    } catch (e) {
      
      
      
    }
    
    
  };

  window.onunload = function () {
    
    sessionStorage.clear();
    
  };

});