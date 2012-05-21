//init global vars to center on zoomed-out fractal
var zoom = 1;
var xcenter = 3.6;
var xoffset = -0.6;
var yoffset = 0;
var zoombox = [-1.85,1.85,-1.4,1.4];

$(document).ready(function () {
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
	
	for (k = 1; k <= iter; k++) {		// grayscale (or scale in some other hue)
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
	
	
function getColor(pixelData){

	//rotating spectrum
	//red, orange, yellow, green, cyan-green, cyan, cyan-blue, blue, blue-magenta, magenta, red-magenta
	//var palette = [[255, 0, 0, 255],[255, 127, 0, 255],[255, 255, 0, 255],[0, 255, 0, 255],
	//[0, 255, 127, 255],[0, 255, 255, 255],[0, 127, 255, 255],[0, 0, 255, 255],[127, 0, 255, 255],
	//[255, 0, 255, 255],[255, 0, 127, 255]];
	var paletteSize = 306;
	var pixelColor = pixelData[0] % paletteSize; 
	var r = 255, g = 0, b = 0;  //set starting color

	for (p = 1; p <= pixelColor; p++) {
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
	
	return [r,g,b,255];	
	
	/*
	for (p = 1; p <= pixelColor; p++) {
		if (r == 255 && g < 255 && b == 0) {		//red to yellow
			g += 15;
		} else if (r > 0 && g == 255 && b == 0) {	//yellow to green
			r -= 15;
		} else if (r == 0 && g == 255 && b < 255) { //green to cyan
			b += 15;
		} else if (r == 0 && g > 0 && b == 255) {	//cyan to blue
			g -= 15;
		} else if (r < 255 && g == 0 && b == 255) { //blue to magenta
			r += 15;
		} else if (r == 255 && g == 0 && b > 0) {	//magenta to red
			b -= 15;
		}
	}
	
	return [r,g,b,255];	
	*/
	
	//less smooth version of above
	/*
	var paletteSize = 48;
	var pixelColor = pixelData[0] % paletteSize; 
	var r = 255, g = 0, b = 0;  //set starting color
	
	for (p = 1; p <= pixelColor; p++) {
		if (r == 255 && g < 255 && b == 0) {
			if (g < 224) {
				g += 32;
			} else {
				g = 255;
			}
		} else if (r > 0 && g == 255 && b == 0) {
			if (r > 31) {
				r -= 32;
			} else {
				r = 0;
			}
		} else if (r == 0 && g == 255 && b < 255) {
			if (b < 224) {
				b += 32;
			} else {
				b = 255;
			}
		} else if (r == 0 && g > 0 && b == 255) {
			if (g > 31) {
				g -= 32;
			} else {
				g = 0;
			}
		} else if (r < 255 && g == 0 && b == 255) {
			if (r < 224) {
				r += 32;
			} else {
				r = 255;
			}
		} else if (r == 255 && g == 0 && b > 0) {
			if (b > 31) {
				b -= 32;
			} else {
				b = 0;
			}
		}
	}
	
	return [r,g,b,255];
	*/
	/*
	//set iter == 255
	// decrease iter half or quarter then multiply pixelVal by 2 or 4 for more colorful display
	var pixelVal = pixelData[0];
	if (pixelVal % 2 == 0){
		return [pixelVal, 0, 0, 255];
	} else {
		return [0, 0, pixelVal, 255];
	}
	*/	
	
	/*
	//set iter == 127
	var pixelVal = pixelData[0];	
	if (pixelVal % 2 == 0){
		return [pixelVal * 2, 0, 0, 255];
	} else {
		return [0, 0, pixelVal * 2, 255];
	}	
	*/
	
	/*
	//DECOMP , set iter == 127
	var pixelVal = pixelData[1];  //the imaginary value of last iteration
	if (pixelVal > 0){		//is the imaginary value positive or negative?
		return [255, 0, 0, 255];
	} else {
		return [0, 0, 255, 255];
	}
	*/
	
	/*
	// set iter == 358 , continuous color spectrum
	var pixelVal = pixelData[0];
	var r, g, b;
	var pixelVal = (pixelVal * 4)+100;  //multiply pixelVal by "scale"
	if(pixelVal<256){
		r=255;
		g=pixelVal;
		b=0;
	}else if(pixelVal<512){
		r=511-pixelVal;
		g=255;
		b=0;
	}else if(pixelVal<768){
		r=0;
		g=255;
		b=pixelVal-512;
	}else if(pixelVal<1024){
		r=0;
		g=1023-pixelVal;
		b=255;
	}else if(pixelVal<1280){
		r=pixelVal-1024;
		g=0;
		b=255;
	}else if(pixelVal<1536){
		r=255;
		g=0;
		b=1535-pixelVal;
	}
	return [r, g, b, 255];
	*/
		
	/*
	//set iter == 360, produces "dr suess" color pattern
	var pixelVal = pixelData[0];
	if (pixelVal % 6 == 0){
		return [255, 0, 0, 255];  //red
	} else if (pixelVal % 5 == 0) {
		return [255, 165, 0, 255];  //orange
	} else if (pixelVal % 4 == 0) {
		return [255, 165, 0, 255];  //yellow
	} else if (pixelVal % 3 == 0) {
		return [0, 255, 0, 255];  //green
	} else if (pixelVal % 2 == 0) {
		return [0, 0, 255, 255];  //blue
	} else {
		return [255, 0, 255, 255];  //violet
	}
	*/
	
	/* 
	//greyscale or "monochromatic" scale - set iter==511
	var pcolor = Math.floor(pixelData[0] / 2);
	//return [pcolor, pcolor, pcolor, 255];  //grayscale
	return [pcolor, 0, 0, 255];  //reds
	*/
}


function initiate(zoom, xmouse, ymouse){

	//set resolution of canvas here (change to size of tiles of doing those)
	var n1 = 800;	//800x600 is a good size
	var n2 = 600;
	var iter = 1000;  //number of iterations
	
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
	for (r = n2; r >= 0; r--){

		for (c = n1; c >= 0; c--){
		
			var pixelValue = pixelProc(c,r,n1,n2,zoom,xcenter,xoffset,yoffset,iter);

			if (pixelValue[0] == 0){
				var color = [0, 0, 0, 255];
			} else {
				var color = getColor(pixelValue);
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
	console.log(xoffset.toFixed(6) +", "+ yoffset.toFixed(6) +", "+xcenter.toFixed(6));
	
}

// window.addEventListener("load", initiate(0,0), false);

//various color algos

	/*
		var r, g, b;
	for (k = 1; k <= 478; k++) {		// courtesy of http://instantsolve.net/mandelbrot.htm
		var u = x * x, v = y * y, w = 2 * x * y;
		var x = u - v + a, y = w + b;
		var t2 = u + v;
		if (t2 > 16){
			//value=(k*scale)+100;
			var value = (k * 3)+100;
			if (value >= 768) {
				value = value - 768;
			}
			if(value<256){
				r=255;
				g=value;
				b=0;
			}else if(value<512){
				r=511-value;
				g=255;
				b=0;
			}else if(value<768){
				r=0;
				g=255;
				b=value-512;
			}
		return [r, g, b, 255];
		}
	}
	*/
	/*
	// 12-color full spectrum
			//var hue = Math.floor(k / 3);
			var hue = k;
			if ((hue <= 15) || (180 < hue && hue <= 195)){
				return [255, 0, 0, 255];  //red
			} else if ((hue <= 30) || (195 < hue && hue <= 210)) {
				return [255, 127, 0, 255];  //orange
			} else if ((hue <= 45) || (210 < hue && hue <= 225)) {
				return [255, 255, 0, 255];  //yellow
			} else if ((hue <= 60) || (240 < hue && hue  <= 255)) {
				return [0, 255, 0, 255];  //green
			} else if ((hue <= 90) || (255 < hue && hue  <= 270)) {
				return [0, 255, 127, 255];  //cyan-green				
			} else if ((hue <= 105) || (270 < hue && hue  <= 285)) {
				return [0, 255, 255, 255];  //cyan
			} else if ((hue <= 120) || (285 < hue && hue  <= 300)) {
				return [0, 127, 255, 255];  //cyan-blue
			} else if ((hue <= 135) || (300 < hue && hue  <= 315)) {
				return [0, 0, 255, 255];  //blue
			} else if ((hue <= 150) || (315 < hue && hue  <= 330)) {
				return [127, 0, 255, 255];  //blue-magenta
			} else if ((hue <= 165) || (330 < hue && hue  <= 345)) {
				return [255, 0, 255, 255];  //magenta
			} else {
				return [255, 0, 127, 255];  //red-magenta
			}
	*/
/*	
	for (k = 1; k <= 127; k++) {		// decrease k then multiply at end for more colorful display
		var u = x * x, v = y * y, w = 2 * x * y;
		var x = u - v + a, y = w + b;
		var t2 = u + v;
		if (t2 > 16){
			// the colorful surrounding regions
			// monochromatic with gradient
			//return [k * 4, 0, 0, 255 - k * 2];  //use formulas here to enhance
			// lots of colors
			if (k % 2 == 0){
				return [k * 2, 0, 0, 255];
			} else {
				return [0, 0, k * 2, 255];
			}
		}
	}
*/	
