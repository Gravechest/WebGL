<!DOCTYPE html>

<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <title>opengl Epic demo</title>
</head>
<body  onkeyup="keyHandUp(event)" onkeydown="keyHandDown(event)">
    <canvas id="raycaster" width="1000" height="500" onmousedown="append(event)"></canvas>
</body>
</html>
<script>
    var camPos = [0, 0];
    var zoom = 1.0;
    var vlak = document.getElementById("raycaster");
    var blockCoords = [];
    var blockColor = [];
    var lightRay = 0.0;
    vlak.style.borderWidth = "5px";
    vlak.style.borderStyle = "solid";
    gl = vlak.getContext("webgl2");
    var Keys = [0,0,0,0,0,0];
    var verticles = [];
    function keyHandDown(event) {
        switch (event.key) {
            case 'z':
                Keys[0] = 1;
                break;
            case 'x':
                Keys[1] = 1;
                break;
            case 'w':
                Keys[2] = 1;
                break;
            case 'a':
                Keys[3] = 1;
                break;
            case 's':
                Keys[4] = 1;
                break;
            case 'd':
                Keys[5] = 1;
                break;
        }
    }
    function keyHandUp(event) {
        switch (event.key) {
            case 'z':
                Keys[0] = 0;
                break;
            case 'x':
                Keys[1] = 0;
                break;
            case 'w':
                Keys[2] = 0;
                break;
            case 'a':
                Keys[3] = 0;
                break;
            case 's':
                Keys[4] = 0;
                break;
            case 'd':
                Keys[5] = 0;
                break;
        }
    }
    function append(event) {
        var xCoord = ((event.clientX - 13) / 500 - 1.0) / zoom - camPos[0];
        var yCoord = -((event.clientY - 13) / 250 - 1.0) / zoom - camPos[1];
        xCoord = Math.round(xCoord * 10) / 10;
        yCoord = Math.round(yCoord * 5) / 5;
        blockCoords.push(xCoord * 10, yCoord * 5);
        
        verticles.push(xCoord - 0.05, yCoord + 0.1,
            xCoord - 0.05, yCoord - 0.1,
            xCoord + 0.05, yCoord - 0.1,
            xCoord - 0.05, yCoord + 0.1,
            xCoord + 0.05, yCoord + 0.1,
            xCoord + 0.05, yCoord - 0.1);
    }
    function createShader(gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }
    function shaderAttribute(dimension, name, variable, shaderprogram,stride) {
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(variable), gl.STATIC_DRAW);
        var positionvert = gl.getAttribLocation(shaderprogram, name);
        gl.enableVertexAttribArray(positionvert); 
        gl.vertexAttribPointer(positionvert, dimension, gl.FLOAT, false, stride, 0);
    }
    const fragshader = `
        precision mediump float;
        varying float vertexcolor;
        void main() {
            gl_FragColor = vec4(1.0 - vertexcolor / 5.0,0.0,0.0,1.0);
        }`;
    const vershader = `
        attribute vec4 verticles;
        attribute float color;
        uniform float zoom;
        uniform float camPos[2];
        varying float vertexcolor;  
        void main() {
            vertexcolor = color;
            gl_Position = vec4((verticles[0] + camPos[0]) * zoom,(verticles[1] + camPos[1]) * zoom,verticles[2],verticles[3]);  
        }`;
    var shaderprogram = gl.createProgram();
    var vs = createShader(gl, gl.VERTEX_SHADER, vershader);
    var fs = createShader(gl, gl.FRAGMENT_SHADER, fragshader);
    gl.attachShader(shaderprogram, vs);
    gl.attachShader(shaderprogram, fs);
    gl.linkProgram(shaderprogram);  
    gl.useProgram(shaderprogram);
    window.requestAnimationFrame(opengl)
    function opengl() {
        if (Keys[0] == 1) {
            zoom *= 1.01;
        }
        if (Keys[1] == 1) {
            zoom /= 1.01;
        }
        if (Keys[2] == 1) {
            camPos[1] -= 0.01 / zoom;
        }
        if (Keys[3] == 1) {
            camPos[0] += 0.01 / zoom;
        }
        if (Keys[4] == 1) {
            camPos[1] += 0.01 / zoom;
        }
        if (Keys[5] == 1) {
            camPos[0] -= 0.01 / zoom;
        }
        gl.uniform1f(gl.getUniformLocation(shaderprogram, "zoom"), zoom);
        gl.uniform1fv(gl.getUniformLocation(shaderprogram, "camPos"), camPos);
        gl.uniform1f(gl.getUniformLocation(shaderprogram, "lightRay"), lightRay);
        shaderAttribute(2, "verticles", verticles, shaderprogram,0);
        shaderAttribute(1, "color", blockColor, shaderprogram,0);
        gl.drawArrays(gl.TRIANGLES, 0, verticles.length * 3.0);
        window.requestAnimationFrame(opengl);
    }
</script>
