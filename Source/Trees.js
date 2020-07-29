/**
 * Trees.js
 * Author: Ahmet Furkan Biyik
 * Date: 21.10.2019
 */

/**
 * Generates trees with tree coordinates
 */
function generateTrees() {

    // Add Trees
    for (var i = 0; i < variables.generated.treeCoordinates.length; i++)
    {
        addTree1( variables.generated.treeCoordinates[i]);
    }
}

/**
 * Add a tree to arrays
 * @param center vec2 position values between -1 and 1
 */
function addTree1( center) {

    var radius = 0.07;
    var appleRadius = 0.01;
    var numberOfApples = Math.floor( Math.random() *5 + 5 );
    var treeColor = color3(0,100,0);
    var appleColor = color3(180,0,0);
    variables.generated.apples[treeIndex] = [];

    // Tree background
    for (var i = 0; i < numberOfSegments; i++)
    {
        treeVertexAngles.push( angles[i] );
        treeVertexColors.push( treeColor );
        treeVertexCenters.push(center);
        treeVertexRadiuses.push( radius );
    }

    // Add apples
    for (var i = 0; i < numberOfApples; i++){

        var a = Math.random() * 2 * Math.PI;
        var r = (radius * Math.random() - appleRadius) * variables.userDefined.scale;
        var appleCenter = vec2(r * Math.cos(a) + center[0], r * Math.sin(a)+ center[1]);

        for (var j = 0; j < numberOfSegments; j++)
        {
            treeVertexAngles.push( angles[j] );
            treeVertexColors.push( appleColor );
            treeVertexCenters.push( appleCenter);
            treeVertexRadiuses.push( appleRadius );
        }

        variables.generated.apples[treeIndex].push( appleCenter );
    }

    numberOfCircles += 1 + numberOfApples;
    treeIndex++;

    addDebugCircle(center);
}

/**
 * Add a tree to arrays
 * @param center vec2 position values between -1 and 1
 * @param apples apple coordinates
 */
function addTree2( center, apples) {

    var radius = 0.07;
    var appleRadius = 0.01;
    var numberOfApples = apples.length;
    var treeColor = color3(0,100,0);
    var appleColor = color3(180,0,0);

    // Tree background
    for (var i = 0; i < numberOfSegments; i++)
    {
        treeVertexAngles.push( angles[i] );
        treeVertexColors.push( treeColor );
        treeVertexCenters.push(center);
        treeVertexRadiuses.push( radius );
    }

    // Add apples
    for (var i = 0; i < numberOfApples; i++){

        var appleCenter = apples[i];

        for (var j = 0; j < numberOfSegments; j++)
        {
            treeVertexAngles.push( angles[j] );
            treeVertexColors.push( appleColor );
            treeVertexCenters.push( appleCenter);
            treeVertexRadiuses.push( appleRadius );
        }
    }

    numberOfCircles += 1 + numberOfApples;
    treeIndex++;

    addDebugCircle(center);
}

/**
 * Draw trees with values in arrays.
 */
function drawTrees() {

    // No tree
    if (numberOfCircles === 0){
        return;
    }

    // Bind Buffers
    {
        // Init shaders
        var program = initShaders( gl, "v_circle", "f_default" );
        gl.useProgram( program );

        // Init scale
        var vertexScale = gl.getUniformLocation( program, "vertexScale" );
        gl.uniform1f( vertexScale, variables.userDefined.scale );

        // Set vertex angle buffer
        var vertexAngleBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vertexAngleBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(treeVertexAngles), gl.STATIC_DRAW );

        var vertexAngle = gl.getAttribLocation( program, "vertexAngle" );
        gl.vertexAttribPointer( vertexAngle, 1, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexAngle );

        // Set center buffer
        var centerBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, centerBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(treeVertexCenters), gl.STATIC_DRAW );

        var vertexCenter = gl.getAttribLocation( program, "vertexCenter" );
        gl.vertexAttribPointer( vertexCenter, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexCenter );

        // Set radius
        var radiusBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, radiusBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(treeVertexRadiuses), gl.STATIC_DRAW );

        var vertexRadius = gl.getAttribLocation( program, "vertexRadius" );
        gl.vertexAttribPointer( vertexRadius, 1, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexRadius );

        // Set color buffer
        var colorBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(treeVertexColors), gl.STATIC_DRAW );

        var vertexColor = gl.getAttribLocation( program, "vertexColor" );
        gl.vertexAttribPointer( vertexColor, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexColor );
    }

    // Draw circles
    for (var i = 0; i < numberOfCircles; i++){
        gl.drawArrays( gl.TRIANGLE_FAN, i*numberOfSegments, numberOfSegments );
    }
}