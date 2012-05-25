//init global vars to center on zoomed-out fractal
/*
var zoom = 1;
var xcenter = 3.6;
var xoffset = -0.6;
var yoffset = 0;
var zoombox = [-1.85,1.85,-1.4,1.4];
*/
var zoom = 1;
var xcenter = 3.2;
var xoffset = -0.6;
var yoffset = 0;
var zoombox = [-1.64,1.64,-1.26,1.26];
//var iter;

//var iter;  //number of iterations
var palette = [];
var NumColors;

$(document).ready(function () {
	//NumColors = buildPalette();
	NumColors = buildPalette();
	WireEvents();
	initiate(zoom,0,0);
});

function WireEvents() {
	$('#canvas').mousedown(function (e) {
		var xmouse = e.clientX;
		var ymouse = e.clientY;
		//Toggle(this);
	})
	.mouseup(function (e) {
		var xmouse = e.clientX;
		var ymouse = e.clientY;
		//var iter = $('#iteration').val();
		initiate(zoom += 1,xmouse,ymouse);
		//$(this).text('X: ' + e.pageX + ' Y: ' + e.pageY);
	});
};

function pixelProc(xpoint,ypoint,n1,n2,zoom,xcenter,xoffset,yoffset,iter){

	// eg. n1 = 320, var n2 = 240;
	var i = xpoint - (n1 / 2);
	var j = ypoint - (n2 / 2);
	
	/*
		center and zoom are set as follows:
		a = x1 + x2 * i / n1
		decrease x1 to center on left region of image
		decrease x2 to zoom in
		
		b = y1 + y2 * j / n2
		when y1 = 0 image is centered on y axis and symmetrical top to bottom
		y2 should be a 0.75 factor of x2
		decrease y1 to pan up
		decrease y2 when decreasing x2 (zooming in) to prevent skew (or image will appear flattened)
		y2 increase/decrease should be proportional to change in x2 (same percent)
	*/

	//dynamically set coordinates
	var a = xoffset + xcenter * i / n1;			//real part
	var b = yoffset + 0.75 * xcenter * j / n2;	//imaginary part
	
	//zoom and pan debugging code
	//these two lines are essentially the initial zoomed-out level, centered on axis
	//var a = -0.6 + 3.6 * i / n1;		//zooms in/out and pans right and left
	//var b = 2.7 * j / n2;  			//this corrects aspect ratio on zoom and pans up and down
	//var a = 1.1 + 3.6 * i / n1;  	//pan right
	//var b = 1.1 + 2.7 * j / n2;  	//pan down
	//var a = -0.95 + 1.2 * i / n1;  	//zoom in on left
	//var b = 0.9 * j / n2;  			//zoom in on left	
	//var a = -0.70 + 0.8 * i / n1;  //zoom in more, not panned to left as much
	//var b = -0.45 + 0.6 * j / n2;   //zoom in more, not panned up as much
	//var a = -0.65 + 0.16 * i / n1;  //zoom in more, not panned to left as much
	//var b = -0.45 + 0.12 * j / n2;   //zoom in more, not panned up as much

	
	var u = 4 * (a * a + b * b);
	var v = u - 2 * a + 1 / 4;	
	
	if (u + 8 * a + 15 / 4 < 0) {
		return [0,0];  //smaller circle (bay) toward the left
	} else if (v - Math.sqrt(v) + 2 * a - 1 / 2 < 0){
		return [0,0]; //large heart-shaped lake in center
	}

	var x = a, y = b;
	
	for (k = 1; k <= iter; k++) {		// find the escape time
		u = x * x;
		v = y * y;
		var w = 2 * x * y; //this is the imaginary value and can be returned for decomp
		if (u + v > 16){  //this value is  == escape radius squared.
			return [k, w]; //the real and imaginary values of last iteration
		}
		x = u - v + a
		y = w + b;
	}
	
	return [0,0]; //all the small bays and rivers around the coast
}


function buildPalette(){

	//rotating spectrum
	//red, orange, yellow, green, cyan-green, cyan, cyan-blue, blue, blue-magenta, magenta, red-magenta
	//var palette = [[255, 0, 0, 255],[255, 127, 0, 255],[255, 255, 0, 255],[0, 255, 0, 255],
	//[0, 255, 127, 255],[0, 255, 255, 255],[0, 127, 255, 255],[0, 0, 255, 255],[127, 0, 255, 255],
	//[255, 0, 255, 255],[255, 0, 127, 255]];
	var paletteSize = 306;
	//var pixelColor = pixelData[0] % paletteSize; 
	var r = 255, g = 0, b = 0;  //set starting color

	for (p = 1; p <= paletteSize; p++) {
	
		palette.push([r,g,b,255]);
		
		if (r == 255 && g < 255 && b == 0) {		//red to yellow
			g += 5;
		} else if (r > 0 && g == 255 && b == 0) {	//yellow to green
			r -= 5;
		} else if (r == 0 && g == 255 && b < 255) { //green to cyan
			b += 5;
		} else if (r == 0 && g > 0 && b == 255) {	//cyan to blue
			g -= 5;
		} else if (r < 255 && g == 0 && b == 255) { //blue to magenta
			r += 5;
		} else if (r == 255 && g == 0 && b > 0) {	//magenta to red
			b -= 5;
		}
	}
	return paletteSize;
}
	
	
function buildPalette2(){

	//rotating spectrum
	var paletteSize = 204;
	//var pixelColor = pixelData[0] % paletteSize; 
	var r = 255, g = 0, b = 255, opacity = 255;  //set starting color

	for (p = 1; p <= paletteSize; p++) {
	
		palette.push([r,g,b,opacity]);
		
		if (r == 255 && g == 0 && b == 255 && opacity > 0) {		//magenta to opaque
			opacity -= 5;
		} else if (opacity < 255 && b == 255) {	//opaque to cyan
			r = 0;
			g = 255;
			opacity += 5;
		} else if (r == 0 && g > 0 && b == 255) {	//cyan to blue
			g -= 5;
		} else if (r < 255 && g == 0 && b == 255) { //blue to magenta
			r += 5;
		}
	}
	return paletteSize;
}
	

function buildPalette3(){

	//rotating spectrum
	var paletteSize = 153;
	//var pixelColor = pixelData[0] % paletteSize; 
	var r = 255, g = 0, b = 255, opacity = 255;  //set starting color

	for (p = 1; p <= paletteSize; p++) {
	
		palette.push([r,g,b,opacity]);
		
		if (r == 255 && g == 0 && b == 255 && opacity > 0) {		//magenta to opaque
			opacity -= 5;
		} else if (opacity < 255 && b == 255) {	//opaque to blue
			r = 0;
			b = 255;
			opacity += 5;
		} else if (r < 255 && g == 0 && b == 255) { //blue to magenta
			r += 5;
		}
	}
	return paletteSize;
}

function buildPalette4(){

	//xmas scheme
	var paletteSize = 153;
	//var pixelColor = pixelData[0] % paletteSize; 
	var r = 0, g = 255, b = 0, opacity = 255;  //set starting color

	for (p = 1; p <= paletteSize; p++) {
	
		palette.push([r,g,b,opacity]);
		
		if (r == 0 && g == 255 && b == 0 && opacity > 0) {		//magenta to opaque
			opacity -= 5;
		} else if (opacity < 255) {	//opaque to blue
			r = 255;
			g = 0;
			b = 0;
			opacity += 5;
		} else if (b == 0 && g < 255) { //blue to magenta
			r -= 5;
			g += 5;
		}
	}
	return paletteSize;
}


function getColor(pixelData, paletteSize){

	//var paletteSize = 306;	//this needs to not be hardcoded here
	var pixelColor = pixelData[0] % paletteSize; 	
	return palette[pixelColor];	
}


function initiate(zoom, xmouse, ymouse){

	var textInput = document.getElementById('iteration');
	var iter = parseInt(textInput.value);
	//var iter = $('#iteration').val();
	//var iter = 1000;
	
	//set resolution of canvas here (change to size of tiles of doing those)
	var n1 = 800;	//800x600 is a good size
	var n2 = 600;
	
	//zoom in and recenter on mouse coords
	xcenter = xcenter / zoom;
	
	if (zoom > 1) {	
		var xquad = n1 / 2;
		var yquad = n2 / 2;
	
		if (xmouse < xquad) {		//setting the real axis
			xoffset = xoffset + ((xquad - xmouse) / xquad) * ((zoombox[0] - zoombox[1])/2) ;
		} else {
			xoffset = xoffset + ((xmouse - xquad) / xquad) * ((zoombox[1] - zoombox[0])/2);
		}
		if (ymouse < yquad) {		//the imaginary axis
			yoffset = yoffset + ((yquad - ymouse) / yquad) * ((zoombox[2] - zoombox[3])/2);
		} else {
			yoffset = yoffset + ((ymouse - yquad) / yquad) * ((zoombox[3] - zoombox[2])/2);
		}
		
		zoombox[1] = (zoombox[1]/zoom) + xoffset;
		zoombox[0] = (zoombox[0]/zoom) + xoffset;
		zoombox[2] = (zoombox[2]/zoom) + yoffset;
		zoombox[3] = (zoombox[3]/zoom) + yoffset;	
	}

	var elem = document.getElementById('canvas');
	elem.width = n1;
	elem.height = n2;
	
	canvas = elem.getContext('2d');
	canvas.clearRect(0,0,n1,n2);
	var img = canvas.createImageData(n1, n2);
		
	var starttime = new Date()
	var startSeconds = starttime.getTime();
	
	//loops have to count backwards to match coordinate system of mandelbrot set to canvas pixels
	for (r = n2 - 1; r >= 0; r--){

		for (c = n1 - 1; c >= 0; c--){
		
			var pixelValue = pixelProc(c,r,n1,n2,zoom,xcenter,xoffset,yoffset,iter);

			if (pixelValue[0] == 0){
				var color = [0, 0, 0, 255];
			} else {
				var color = getColor(pixelValue, NumColors);
			}
			var idx = (c + r * img.width) * 4;

			//for (var p = 0, pN = pixel.length; p < pN; p += 4){
				img.data[idx + 0] = color[0]; // the red channel
				img.data[idx + 1] = color[1]; // the green channel
				img.data[idx + 2] = color[2]; // the blue channel
				img.data[idx + 3] = color[3]; // the alpha channel		
		}
		/*	
		var endtime = new Date()
		var endSeconds = endtime.getTime();
		var elapsed = endSeconds - startSeconds;
		console.log(elapsed + " ms");
		*/	
	}
		
	canvas.putImageData(img, 0, 0);
	
	var endtime = new Date()
	var endSeconds = endtime.getTime();
	var elapsed = endSeconds - startSeconds;
	console.log(elapsed + " ms");
	//console.log(zoombox[0]+","+zoombox[1]+","+zoombox[2]+","+zoombox[3]);
	//console.log(xmouse +", "+ ymouse);
	console.log(xoffset.toFixed(6) +", "+ yoffset.toFixed(6) +", "+xcenter.toFixed(6));
	
}

