var drawing = false, writing = false;
function $(el) {
    return document.getElementById(el.replace(/#/, ''));
}
;
$('#board').contentEditable = true;
$('#board').blur();
$('#write').addEventListener('click', function(e) {
    this.setAttribute('class', 'selected');
    $('#draw').removeAttribute('class');
    drawing = false;
    writing = true;
    var text = $('#board');
    if (text.innerText.length <= 0)
        text.innerHTML = "&nbsp;";
    if (document.createRange) {
        var range = document.createRange();
        range.selectNodeContents(text);
        range.collapse(false);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
}, false);

$('#draw').addEventListener('click', function(e) {
    this.setAttribute('class', 'selected');
    $('#write').removeAttribute('class');
    drawing = true;
    writing = false;
    color = "#fff";
}, false);

$('#drawred').addEventListener('click', function(e) {
    this.setAttribute('class', 'selected');
    $('#write').removeAttribute('class');
    drawing = true;
    writing = false;
    color = "red";
}, false);

$('#clear').addEventListener('click', function(e) {
    $('#board').innerHTML = '';
    $('#canvas').width = document.body.clientWidth;
    if (writing)
        $('#write').triggerEvent('click');
}, false);

var canvas = $('#canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var context = canvas.getContext('2d');
var start = function(coors) {
    context.beginPath();
    context.moveTo(coors.x, coors.y);
    this.isDrawing = true;
};
var move = function(coors) {
    if (this.isDrawing) {
        context.strokeStyle = color;
        context.lineJoin = "round";
        context.lineWidth = 3;
        context.lineTo(coors.x, coors.y);
        context.stroke();
    }
};
var stop = function(coors) {
    if (this.isDrawing) {
        this.touchmove(coors);
        this.isDrawing = false;
    }
};
var drawer = {
    isDrawing: false,
    mousedown: start,
    mousemove: move,
    mouseup: stop,
    touchstart: start,
    touchmove: move,
    touchend: stop
};
var draw = function(e) {
    if (drawing) {
        var coors = {
            x: e.clientX || e.targetTouches[0].pageX,
            y: e.clientY || e.targetTouches[0].pageY
        };
        drawer[e.type](coors);
    }
}
canvas.addEventListener('mousedown', draw, false);
canvas.addEventListener('mousemove', draw, false);
canvas.addEventListener('mouseup', draw, false);
canvas.addEventListener('touchstart', draw, false);
canvas.addEventListener('touchmove', draw, false);
canvas.addEventListener('touchend', draw, false);
// prevent elastic scrolling
document.body.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, false);
// end body:touchmove
window.onresize = function(e) {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
};

Element.prototype.triggerEvent = function(eventName) {
    if (document.createEvent) {
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent(eventName, true, true);

        return this.dispatchEvent(evt);
    }
    if (this.fireEvent)
        return this.fireEvent('on' + eventName);
};

$('#write').triggerEvent('click');