/*jslint devel: true, bitwise: true, continue: true, plusplus: true,
unparam: false, sloppy: true,  vars: true, white: false, indent: 2,
maxlen: 80*/

var img;

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

  /* drop-related */

  function fitOrigSize(selector, imageWidth, imageHeight) {
    
    $(selector).attr('width', imageWidth);
    $(selector).attr('height', imageHeight);
    
  }
  
  function fitWidth(selector, aspect, winWidth) {

    $(selector).attr('width', winWidth);
    $(selector).attr('height', $(selector).attr('width') / aspect);

  }

  function fitHeight(selector, aspect, winHeight) {

    $(selector).attr('height', winHeight);
    $(selector).attr('width', $(selector).attr('height') * aspect);
    
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
      
      console.log("same width, scale height");
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
      
      //console.warn("img not set yet");
      console.warn(e);
      
    }

  }
  
  function readImageFile(file) {

    var
      reader = new FileReader(),
      fileSizeRaw = file.size,
      fileSizeMB,
      imageType = /image/;

    fileSizeMB = fileSizeRaw / (1024 * 1024);

    if (file.type.match(imageType)) {

      reader.onload = function (e) {

        e.preventDefault();

        img = new Image();
        img.src = reader.result;

        $('#dispImg')
          .attr('width', img.width)
          .attr('height', img.height)
          .attr('src', img.src);
        
        try {
          
          sessionStorage.setItem('editImg', img.src);
          console.log("Image uploaded. Size: " +
                      fileSizeMB.toPrecision(2) + " MB");
          
        } catch (exception) {

          console.warn("Quota exceeded");

        }

        fitElement('#dispImg');

      };

      // write the image to the FileReader objcet as dataURL
      reader.readAsDataURL(file);
      //success

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

  window.onresize = function () {
    fitElement('#dispImg');
  };

  window.onunload = function () {
    
    sessionStorage.clear();
    
  };

});