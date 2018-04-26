'use strict';

     // polyfill for ie

if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

var openBtnList = document.querySelectorAll('.is-open');
var modal = document.querySelector('.modal');
var overlay = document.querySelector('.overlay');

openBtnList.forEach(function(item) {
  item.addEventListener('click', function () {
    modal.classList.toggle('hide');
    overlay.classList.toggle('hide');
  });
});

overlay.addEventListener('click', function () {
  modal.classList.toggle('hide');
  overlay.classList.toggle('hide');
});