/*jslint eqeq: true, nomen: true, plusplus: true, unparam: false, sloppy: true, indent: 2, maxlen: 80*/

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

  function fitWidth(selector, aspect, winWidth) {
    
    $(selector).attr('width', winWidth);
    $(selector).attr('height', $(selector).attr('width') / aspect);
    
  }
  
  function fitHeight(selector, aspect, winHeight) {
    
    $(selector).attr('height', winHeight);
    $(selector).attr('width', $(selector).attr('height') * aspect);
    
  }
  
  function fitLargestDim(selector, aspect) {
    
    var
      winWidth = window.innerWidth,
      winHeight = window.innerHeight;
    
    //check if element height larger than win height
    if ($(selector).attr('height') > winHeight &&
        img.height > winHeight
        ) {
      
      fitHeight(selector, aspect, winHeight);

    } else {
      
      fitHeight(selector, aspect, winHeight);
      
    }

    //check if element width larger than win width
    if ($(selector).attr('width') > winWidth &&
        img.width > winWidth
        ) {

      fitWidth(selector, aspect, winWidth);

    } else {
      
      fitHeight(selector, aspect, winHeight);
      
    }
    
  }

  function checkSmallestDim(selector) {

    var
      aspect;

    if (img != null) {

      aspect = img.width / img.height;

    }

    fitLargestDim(selector, aspect);

  }

  function readImageFile(file) {

    var
      reader = new FileReader(),
      imageType = /image/;

    if (file.type.match(imageType)) {

      reader.onload = function (e) {

        e.preventDefault();

        img = new Image();
        img.src = reader.result;

        $('#dispImg')
          .attr('width', img.width)
          .attr('height', img.height)
          .attr('src', img.src);

        checkSmallestDim('#dispImg');

      };

      // write the image to the FileReader objcet as dataURL
      reader.readAsDataURL(file);
      //success

    } else {
      // Handle error: file format specified by user is not supported
      alert("Invalid format");

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

  window.onresize = function () {
    checkSmallestDim('#dispImg');
  };

});