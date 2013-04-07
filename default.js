var app = {
    drawing: false,
    writing: false,
    font: 'Waiting for the Sunrise',
    color: '#fff',
    fontSize: 60,
    lineWidth: 3,
    init: function() {

        app.text = document.getElementById('board');
        app.text.contentEditable = true;
        app.text.blur();
        $('#box').css('background', app.color);

        $('#picker').farbtastic(function(color) {
            $('#box').css('background', color);
            app.color = color;
            if (app.writing)
                $('#write').trigger('click');
        });

        $('#fonts li').each(function() {
            $(this).css('font-family', $(this).data('font'))
                    .on('click', function() {
                app.font = $(this).data('font');
                $('#write').trigger('click');
            });
        });

        $('#write').on('click', function() {
            $('nav a').removeClass('selected');
            $(this).addClass('selected');
            app.drawing = false;
            app.writing = true;
            $('#board').css({
                'font-family': app.font,
                'font-size': app.fontSize,
                'color': app.color
            });
            if (app.text.innerText.length <= 0)
                app.text.innerHTML = "&nbsp;";
            if (document.createRange) {
                var range = document.createRange();
                range.selectNodeContents(app.text);
                range.collapse(false);
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
        $('#draw').on('click', function() {
            $('nav a').removeClass('selected');
            $(this).addClass('selected');
            app.text.blur();
            app.drawing = true;
            app.writing = false;
        });
        $('#clear').on('click', function(e) {
            $('#board').html('');
            $('#canvas')[0].width = document.body.clientWidth;
            if (app.writing)
                $('#write').trigger('click');
        });
        var canvas = $('#canvas')[0];
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
                context.strokeStyle = app.color;
                context.lineJoin = "round";
                context.lineWidth = app.lineWidth;
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
            if (app.drawing) {
                var coors = {
                    x: e.clientX || e.targetTouches[0].pageX,
                    y: e.clientY || e.targetTouches[0].pageY
                };
                drawer[e.type](coors);
            } else {
                e.preventDefault();
            }
        };
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
        $(document).on('keydown', function(e) {
            if (e.ctrlKey && e.keyCode === 38) {
                $('#increase').trigger('click');
            }
            else if (e.ctrlKey && e.keyCode === 40) {
                $('#decrease').trigger('click');
            }
            else if (e.ctrlKey && e.keyCode === 46) {
                $('#clear').trigger('click');
            }
            else if (!e.shiftKey && e.ctrlKey && e.keyCode === 39) {
                e.preventDefault();
                $('#draw').trigger('click');
            }
            else if (!e.shiftKey && e.ctrlKey && e.keyCode === 37) {
                e.preventDefault();
                $('#write').trigger('click');
            }
        });

        $('#increase, #decrease').on('click', function(e) {
            var ID = $(this).attr('id');
            if (ID === 'increase') {
                if (app.writing) {
                    $('#write').trigger('click');
                    app.fontSize += 2;
                } else
                    app.lineWidth += 1;
            } else {
                if (app.writing) {
                    $('#write').trigger('click');
                    app.fontSize -= 2;
                } else
                    app.lineWidth -= 1;
            }
            $('#size').html(app.writing ? app.fontSize : app.lineWidth);
        });
        $('#write').trigger('click');
        $('#size').html(app.writing ? app.fontSize : app.lineWidth);
    }
};

$(document).ready(app.init);