//collection of color algo snippets
//todo: put into palette array creator functions

//the following code can go into buildPalette algos now instead of getColor	
	/*
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
	*/
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
//}

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

