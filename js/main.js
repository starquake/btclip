// Load native UI library
var gui = require('nw.gui');
var os = require("os");
var path = require("path");
var clipboard = gui.Clipboard.get();

var holderEl = document.getElementById('holder');

var basePathEl = document.getElementById("basePath");
var baseUrlEl = document.getElementById("baseUrl");
var basePathExampleEl = document.getElementById("basePathExample");
var openBasePathEl = document.getElementById("openBasePath");


switch (os.platform()) {
    case 'win32':
        basePathExampleEl.innerHTML = 'C:\\Users\\John\\BTSync\\Public\\';
        break;
    case 'darwin':
        basePathExampleEl.innerHTML = '/Users/John/BTSync/Public/';
        break;
    default: // linux
        basePathExampleEl.innerHTML = '/home/john/BTSync/Public/';
        break;
}


// Read previous values
basePathEl.value = localStorage.basePath || "";
baseUrlEl.value = localStorage.baseUrl || "";

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

openBasePathEl.onclick = function (e) {
    basePathEl.value = path.normalize(basePathEl.value);
    basePathEl.value = path.dirname(basePathEl.value + path.sep + '.');
    gui.Shell.openItem(basePathEl.value);
};

// prevent default behavior from changing page on dropped file
window.ondragover = function (e) {
    e.preventDefault();
    return false;
};
window.ondrop = function (e) {
    e.preventDefault();
    return false;
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
    var urls = [];
    for (var i = 0; i < e.dataTransfer.files.length; ++i) {
        var originalFullPath = e.dataTransfer.files[i].path;

        basePathEl.value = path.normalize(basePathEl.value);
        basePathEl.value = path.dirname(basePathEl.value + path.sep + '.');

        if (originalFullPath.indexOf(basePathEl.value) === 0) {

            var relativePath = originalFullPath.replace(new RegExp("^" + escapeRegExp(basePathEl.value), "g"), '');

            if (os.platform() === 'win32') {
                relativePath = relativePath.replace(/\\/g, '/');
            }
            if (baseUrlEl.value && baseUrlEl.value.slice(-1) !== '/') {
                baseUrlEl.value = baseUrlEl.value + '/';
            }
            var newUrl = baseUrlEl.value + encodeURI(relativePath);
            urls.push(newUrl);

            console.log(originalFullPath + ' -> ' + newUrl);

        } else {
            console.log(originalFullPath + ' not in ' + basePathEl.value + ', skipping...');
        }

    }
    if (urls.length > 0) {
        clipboard.clear();
        clipboard.set(urls.join(os.EOL), 'text');
    }

    return false;
};

gui.Window.get().on('close', function () {
    localStorage.basePath = basePathEl.value;
    localStorage.baseUrl = baseUrlEl.value;
    this.close(true);
});
