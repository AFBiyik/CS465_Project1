/**
 * Debug.js
 * Author: Ahmet Furkan Biyik
 * Date: 20.10.2019
 */

/**
 * Add a debug circle to arrays
 * @param center vec2 position values between -1 and 1
 * @param color vec3 color with values between 0 and 1, default blue
 */
function addDebugCircle(center, color = color3(0,0,255)) {

    var radius = 0.1;

    for (var i = 0; i < numberOfSegments; i++)
    {
        debugCircleVertexAngles.push( angles[i] );
        debugCircleVertexColors.push( color );
        debugCircleVertexCenters.push(center);
        debugCircleVertexRadiuses.push( radius );
    }

    numberOfDebugCircles++;
}

/**
 * Draw debug circles with values in arrays.
 */
function renderDebugCircles() {

    // No circle
    if (numberOfDebugCircles === 0){
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
        gl.bufferData( gl.ARRAY_BUFFER, flatten(debugCircleVertexAngles), gl.STATIC_DRAW );

        var vertexAngle = gl.getAttribLocation( program, "vertexAngle" );
        gl.vertexAttribPointer( vertexAngle, 1, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexAngle );

        // Set center buffer
        var centerBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, centerBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(debugCircleVertexCenters), gl.STATIC_DRAW );

        var vertexCenter = gl.getAttribLocation( program, "vertexCenter" );
        gl.vertexAttribPointer( vertexCenter, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexCenter );

        // Set radius
        var radiusBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, radiusBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(debugCircleVertexRadiuses), gl.STATIC_DRAW );

        var vertexRadius = gl.getAttribLocation( program, "vertexRadius" );
        gl.vertexAttribPointer( vertexRadius, 1, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexRadius );

        // Set color buffer
        var colorBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(debugCircleVertexColors), gl.STATIC_DRAW );

        var vertexColor = gl.getAttribLocation( program, "vertexColor" );
        gl.vertexAttribPointer( vertexColor, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexColor );
    }

    // Draw circles
    for (var i = 0; i < numberOfDebugCircles; i++){
        gl.drawArrays( gl.LINE_LOOP, i*numberOfSegments, angles.length );
    }
}

/**
 * Draw points at attractor positions if there any.
 * Red for house
 * Yellow for tree
 * Blue for rock
 */
function renderDebugAttractors() {

    var vertices = [];
    var colors = [];

    if (variables.userDefined.houseAttractor != null){
        vertices.push(variables.userDefined.houseAttractor);
        colors.push( color3( 180, 0, 0));
    }

    if (variables.userDefined.treeAttractor != null){
        vertices.push(variables.userDefined.treeAttractor);
        colors.push( color3( 220,220,0));
    }

    if (variables.userDefined.rockAttractor != null){
        vertices.push(variables.userDefined.rockAttractor);
        colors.push( color3( 0, 0, 100));
    }

    // No attractor
    if (vertices.length === 0){
        return;
    }

    // Bind Buffers
    {
        // Init shaders
        var program = initShaders( gl, "v_point", "f_default" );
        gl.useProgram( program );

        // Set vertex position
        var vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vertexPositionBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

        var vertexPosition = gl.getAttribLocation( program, "vertexPosition" );
        gl.vertexAttribPointer( vertexPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexPosition);

        // Set color buffer
        var colorBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

        var vertexColor = gl.getAttribLocation( program, "vertexColor" );
        gl.vertexAttribPointer( vertexColor, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexColor );
    }

    // Draw points
    for (var i = 0; i < vertices.length; i++){
        gl.drawArrays( gl.POINTS, i, 1 );
    }
}