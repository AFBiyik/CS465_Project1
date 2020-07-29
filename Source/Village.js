/**
 * Village.js
 * Author: Ahmet Furkan Biyik
 * Date: 21.10.2019
 */

var gl;

/**
 * Init function
 */
window.onload = function init() {

    // Configure WebGL
    let canvas = document.getElementById( "canvas" );
    gl = WebGLUtils.setupWebGL( canvas );

    if ( !gl ) {
        alert( "WebGL isn't available" );
        return;
    }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // Set input events
    setEventHandles();

    // Set attractors
    variables.userDefined.houseAttractor = null;
    variables.userDefined.treeAttractor = null;
    variables.userDefined.rockAttractor = null;

    variables.userDefined.riverWidth = Math.random()*(variables.userDefined.riverMax - variables.userDefined.riverMin) +
        variables.userDefined.riverMin;

    // Render terrain
    renderEmpty();
};

/**
 * Sets input event handlers.
 */
function setEventHandles() {
    var errorDiv = document.getElementById("errorDiv");

    errorDiv.onclick = function () {
        this.setAttribute("hidden", "");
    };

    // Set scale slider
    document.getElementById("scale").onchange = function(){
        variables.userDefined.scale = parseFloat(this.value);
        generated = false;
    };

    // River
    var riverMin = document.getElementById("riverMin");
    var riverMax = document.getElementById("riverMax");

    // Set river min slider
    riverMin.onchange = function(){
        variables.userDefined.riverMin = parseFloat(this.value);
        riverMax.setAttribute("min", this.value);
        variables.userDefined.riverWidth = Math.random()*(variables.userDefined.riverMax - variables.userDefined.riverMin) +
            variables.userDefined.riverMin;
        generated = false;
        renderEmpty();
    };

    // Set river max slider
    riverMax.onchange = function(){
        variables.userDefined.riverMax = parseFloat(this.value);
        riverMin.setAttribute("max", this.value);
        variables.userDefined.riverWidth = Math.random()*(variables.userDefined.riverMax - variables.userDefined.riverMin) +
            variables.userDefined.riverMin;
        generated = false;
        renderEmpty();
    };

    // Set generate button
    document.getElementById("randomRiver").onclick = function(){
        variables.userDefined.riverWidth = Math.random()*(variables.userDefined.riverMax - variables.userDefined.riverMin) +
            variables.userDefined.riverMin;
        generated = false;
        renderEmpty();
    };

    // Set generate button
    document.getElementById("generate").onclick = function(){
        variables.userDefined.debug = document.getElementById("debug").checked;

        if (variables.userDefined.houseAttractor == null &&
            variables.userDefined.treeAttractor == null &&
            variables.userDefined.rockAttractor == null ){
            errorDiv.removeAttribute("hidden");
        }

        generateVillage();
    };

    // Set number of entities slider
    document.getElementById("entities").onchange = function(){
        variables.userDefined.numberOfEntities = parseInt(this.value);
        generated = false;
    };

    // Set selected attractor
    document.getElementById("attractors").onchange = function() {
        attractorIndex = this.selectedIndex;
    };

    // Set debug option
    document.getElementById("debug").onchange = function(){
        variables.userDefined.debug = this.checked;

        renderAll();
    };

    // Set generate button
    document.getElementById("generate").onclick = function(){
        variables.userDefined.debug = document.getElementById("debug").checked;

        if (variables.userDefined.houseAttractor == null &&
        variables.userDefined.treeAttractor == null &&
        variables.userDefined.rockAttractor == null ){
            errorDiv.removeAttribute("hidden");
        }

        generateVillage();
    };

    // Set reset button
    document.getElementById("reset").onclick = function(){
        variables.userDefined.scale = 1;
        variables.userDefined.numberOfEntities = 20;
        variables.userDefined.riverWidth = 0.2;

        variables.userDefined.houseAttractor = null;
        variables.userDefined.treeAttractor = null;
        variables.userDefined.rockAttractor = null;

        variables.userDefined.riverMin = 0.01;
        variables.userDefined.riverMax = 1.2;
        riverMax.setAttribute("min", 0.01);
        riverMin.setAttribute("max", 1.2);
        variables.userDefined.riverWidth = Math.random()*(variables.userDefined.riverMax - variables.userDefined.riverMin) +
            variables.userDefined.riverMin;

        reset();

        document.getElementById("scale").value = variables.userDefined.scale;
        document.getElementById("riverMin").value = variables.userDefined.riverMin;
        document.getElementById("riverMax").value = variables.userDefined.riverMax;
        document.getElementById("entities").value = variables.userDefined.numberOfEntities;

        document.getElementById("outScale").innerText = variables.userDefined.scale;
        document.getElementById("outRiverMin").innerText = variables.userDefined.riverMin;
        document.getElementById("outRiverMax").innerText = variables.userDefined.riverMax;
        document.getElementById("outEntities").innerText = variables.userDefined.numberOfEntities;

        renderEmpty();
    };

    // Set save button
    // Code from https://stackoverflow.com/a/34156339
    // Changed download function to download variables as json file.
    document.getElementById("save").onclick = function(){
        var data = JSON.stringify(variables);

        var link = document.createElement("a");
        var file = new Blob([data], {type: 'application/json'});
        link.href = URL.createObjectURL(file);
        link.download = 'save.json';
        link.click();
    };

    // Set load
    document.getElementById("load").onchange = load;

    // Set mouse down event
    canvas.onmousedown = function(event){

        var pos = vec2(2*event.clientX/canvas.width -1,
            2*(canvas.height - event.clientY)/canvas.height -1);

        switch (attractorIndex) {
            case 0:
                variables.userDefined.houseAttractor = pos;
                break;
            case 1:
                variables.userDefined.treeAttractor = pos;
                break;
            case 2:
                variables.userDefined.rockAttractor = pos;
                break;
            default:
                break;
        }

        errorDiv.setAttribute("hidden", "");

        generateVillage();
    };

}

/**
 * Calculate rgb color values between 0 an 1
 * @param R red value between 0 and 255
 * @param G green value between 0 and 255
 * @param B blue value between 0 and 255
 * @returns {vec3} rgb color values between 0 an 1 as vec3
 */
function color3(R, G, B){
    return vec3(R/255, G/255, B/255);
}

/**
 * Calculate square of distance between two points
 * @param pointA vec2 point
 * @param pointB vec2 point
 * @returns {number} square of distance between pointA and pointB
 */
function distanceSquare( pointA, pointB) {
    return ( Math.pow(pointA[0] - pointB[0], 2) + Math.pow(pointA[1] - pointB[1], 2) );
}

/**
 * Resets arrays
 */
function reset() {
    // Reset arrays

    // Clear coordinates
    coordinates = [];

    // Clear entity coordinates
    variables.generated.houseCoordinates = [];
    variables.generated.treeCoordinates = [];
    variables.generated.rockCoordinates = [];

    // Clear houses
    houseVertexPositions = [];
    houseWorldPositions = [];
    houseVertexColors = [];
    houseVertexRotations = [];
    variables.generated.houseRotations = [];
    numberOfRectangles = 0;

    // Clear trees
    treeVertexAngles = [];
    treeVertexColors = [];
    treeVertexCenters = [];
    treeVertexRadiuses = [];
    numberOfCircles = 0;
    treeIndex = 0;
    variables.generated.apples = [];

    // Clear rocks
    variables.generated.numberOfCorners = [];
    variables.generated.rockVertexAngles = [];
    rockVertexColors = [];
    rockVertexCenters = [];
    rockVertexRadiuses = [];
    numberOfRocks = 0;

    // Clear debug circles
    debugCircleVertexAngles = [];
    debugCircleVertexColors = [];
    debugCircleVertexCenters = [];
    debugCircleVertexRadiuses = [];
    numberOfDebugCircles = 0;

    generated = false;

}

/**
 * Generates village with current configuration
 */
function generateVillage() {

    reset();

    generateCoordinates();
    generateEntities();
    generateHouses();
    generateTrees();
    generateRocks();

    generated = true;

    renderAll();
}

/**
 * Clears the canvas and renders terrain and river.
 * If debug is true, also draws attractor positions.
 */
function renderEmpty() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    drawTerrain();

    if (variables.userDefined.debug)
    {
        renderDebugAttractors();
    }
}

/**
 * Clears canvas and renders terrain and river.
 * Draws houses, trees and rocks.
 * If debug is true, draws debug circles.
 */
function renderAll() {

    renderEmpty();

    if (!generated){
        return;
    }

    drawHouses();
    drawTrees();
    drawRocks();
    if (variables.userDefined.debug){
        renderDebugCircles();
    }
}

/**
 * Generate points with Poisson-Disk sampling
 */
function generateCoordinates() {

    // scaled disk radius
    var scaledDiskRadius = diskRadius * variables.userDefined.scale;

    /*  areas:
            left:
                x min = -1 + diskRadius
                x max = 0 - riverWidth / 2 - diskRadius
                y min = -1 + diskRadius
                y max = 1 - diskRadius

                size x = 1 - riverWidth / 2 - 2 * diskRadius
                size y = 2 - 2 * diskRadius

            right:
                x min = 0 + riverWidth / 2 + diskRadius
                x max = 1 - diskRadius
                y min = -1 + diskRadius
                y max = 1 - diskRadius

                size x = 1 - 2 * diskRadius - riverWidth / 2
                size y = 2 - 2 * diskRadius
     */

    // Max grid to limit trials
    var maxCircles = ((1 - variables.userDefined.riverWidth / 2) / (scaledDiskRadius * 2)) * (1 / scaledDiskRadius);

    // number of points generated
    var activePoints = 0;

    // left and right points
    var left = [];
    var right = [];

    // push initial point
    left.push(
        vec2(
        Math.random()*(1 - variables.userDefined.riverWidth / 2 - 2 * scaledDiskRadius)-1 + scaledDiskRadius,
        Math.random()*(2 - 2 * scaledDiskRadius)-1 + scaledDiskRadius)
    );
    activePoints++;

    // create points until max circles
    Loop1: for (var i = 0; i < maxCircles; i++){
        var point = vec2(
            Math.random()*(1 - variables.userDefined.riverWidth / 2 - 2 * scaledDiskRadius)-1 + scaledDiskRadius,
            Math.random()*(2 - 2 * scaledDiskRadius)-1 + scaledDiskRadius);

        // check point
        for (var j = 0; j < left.length; j++){
            if ( distanceSquare(left[j], point) <= 4*scaledDiskRadius*scaledDiskRadius)
            {
                // return to loop
                continue Loop1;
            }
        }

        // add point
        left.push(point);
        activePoints++;
    }

    // push initial point
    right.push(
        vec2(
            Math.random()*(1 - 2 * scaledDiskRadius - variables.userDefined.riverWidth / 2) + variables.userDefined.riverWidth / 2 + scaledDiskRadius,
            Math.random()*(2 - 2 * scaledDiskRadius)-1 + scaledDiskRadius)
    );
    activePoints++;

    // create points until max circles
    Loop2: for (var i = 0; i < maxCircles; i++){
        var point = vec2(
            Math.random()*(1 - 2 * scaledDiskRadius - variables.userDefined.riverWidth / 2) + variables.userDefined.riverWidth / 2 + scaledDiskRadius,
            Math.random()*(2 - 2 * scaledDiskRadius)-1 + scaledDiskRadius );

        // check point
        for (var j = 0; j < right.length; j++){
            if ( distanceSquare(right[j], point) <= 4*scaledDiskRadius*scaledDiskRadius)
            {
                // return to loop
                continue Loop2;
            }
        }

        // add point
        right.push(point);
        activePoints++;
    }

    // merge coordinates
    coordinates = left.concat(right);

    // reduce points to number of entities
    while (activePoints > variables.userDefined.numberOfEntities) {
        coordinates.splice( Math.floor(Math.random() * coordinates.length),1);
        activePoints--;
    }
}

/**
 * Calculates distance between a coordinate and an attractor.
 * Adds the point to an entities' coordinate.
 */
function generateEntities() {

    var sqrt8 = Math.sqrt(8);

    for (var i = 0; i < coordinates.length; i++){

        var houseProb = variables.userDefined.houseAttractor == null ? 0 : sqrt8 - Math.sqrt( distanceSquare( coordinates[i], variables.userDefined.houseAttractor) );
        var treeProb = variables.userDefined.treeAttractor == null ? 0 : sqrt8 - Math.sqrt( distanceSquare( coordinates[i], variables.userDefined.treeAttractor) );
        var rockProb = variables.userDefined.rockAttractor == null ? 0 : sqrt8 - Math.sqrt( distanceSquare( coordinates[i], variables.userDefined.rockAttractor) );

        var random = Math.random()*(houseProb + treeProb + rockProb);

        if (random === 0){
            // Nop
        }
        // house
        else if (random < houseProb){
            variables.generated.houseCoordinates.push(coordinates[i]);
        }
        // tree
        else if (random < houseProb + treeProb){
            variables.generated.treeCoordinates.push(coordinates[i]);
        }
        // rock
        else if (random >= houseProb + treeProb){
            variables.generated.rockCoordinates.push(coordinates[i]);
        }
    }
}

/**
 * Draw green terrain and river
 */
function drawTerrain() {
    // Set vertices
    var vertices = [
        // terrain
        vec2(  -1,  1 ),
        vec2(  1,  1 ),
        vec2( -1, -1 ),
        vec2(  1, -1 ),
        // river
        vec2(  -variables.userDefined.riverWidth/2,  1 ),
        vec2(  variables.userDefined.riverWidth/2,  1 ),
        vec2( -variables.userDefined.riverWidth/2, -1 ),
        vec2(  variables.userDefined.riverWidth/2, -1 )
    ];

    // Set colors
    var colors = [
        // terrain
        color3(34,139,34),
        color3(34,139,34),
        color3(34,139,34),
        color3(34,139,34),
        // river
        color3(0,191,255),
        color3(0,191,255),
        color3(0,191,255),
        color3(0,191,255)
    ];

    // Bind buffers
    var program = initShaders( gl, "v_default", "f_default" );
    gl.useProgram( program );

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vertexPosition = gl.getAttribLocation( program, "vertexPosition" );
    gl.vertexAttribPointer( vertexPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vertexPosition );

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vertexColor = gl.getAttribLocation( program, "vertexColor" );
    gl.vertexAttribPointer( vertexColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vertexColor );

    // Draw rectangles
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 4, 4 );
}

/**
 * Load button event. Loads selected file and renders its contents.
 * Code from https://stackoverflow.com/a/30454523
 * Changed to read json file and set properties
 */
function load() {

    reset();

    var file = this.files[0];

    var fileReader = new FileReader();

    fileReader.onload = function (text) {
        var lines = text.target.result;
        variables = JSON.parse(lines);

        for (var i = 0; i < variables.generated.houseCoordinates.length; i++){
            addHouse1(variables.generated.houseCoordinates[i], variables.generated.houseRotations[i]);
        }

        for (var i = 0; i < variables.generated.treeCoordinates.length; i++){
            addTree2(variables.generated.treeCoordinates[i], variables.generated.apples[i]);
        }

        for (var i = 0; i < variables.generated.rockCoordinates.length; i++){
            addRock2(variables.generated.rockCoordinates[i], variables.generated.numberOfCorners[i] );
        }

        generated = true;
        renderAll();

        document.getElementById("scale").value = variables.userDefined.scale;
        document.getElementById("riverMin").value = variables.userDefined.riverMin;
        document.getElementById("riverMax").value = variables.userDefined.riverMax;
        document.getElementById("entities").value = variables.userDefined.numberOfEntities;

        document.getElementById("outScale").innerText = variables.userDefined.scale;
        document.getElementById("outRiverMin").innerText = variables.userDefined.riverMin;
        document.getElementById("outRiverMax").innerText = variables.userDefined.riverMax;
        document.getElementById("outEntities").innerText = variables.userDefined.numberOfEntities;

        document.getElementById("debug").checked = variables.userDefined.debug;
    };
    fileReader.readAsText(file);

    // Reset to no file
    this.value = this.defaultValue;
}

