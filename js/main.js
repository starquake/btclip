// Load native UI library
var gui = require('nw.gui');
var clipboard = gui.Clipboard.get();

var holderEl = document.getElementById('holder');

var basePath = document.getElementById("basePath");
var baseUrl = document.getElementById("baseUrl");

// Read previous values
basePath.value = localStorage.basePath || "";
baseUrl.value = localStorage.baseUrl || "";

// prevent default behavior from changing page on dropped file
window.ondragover = function (e) {
    e.preventDefault();
    return false
};
window.ondrop = function (e) {
    e.preventDefault();
    return false
};


holderEl.ondragover = function () {
    this.className = 'hover';
    return false;
};
holderEl.ondragend = function () {
    this.className = '';
    return false;
};
holderEl.ondrop = function (e) {
    e.preventDefault();
    this.className = '';

    for (var i = 0; i < e.dataTransfer.files.length; ++i) {
        var origFilename = e.dataTransfer.files[i].path;
        var newFilename = origFilename.replace(new RegExp("^" + basePath.value, "g"), baseUrl.value);
        console.log(origFilename + ' -> ' + newFilename);
        clipboard.set(newFilename, 'text');


    }
    return false;
};

gui.Window.get().on('close', function () {
    localStorage.basePath = basePath.value;
    localStorage.baseUrl = baseUrl.value;
    this.close(true);
});

