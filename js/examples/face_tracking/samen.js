(function exampleCode() {
	"use strict";

	brfv4Example.initCurrentExample = function(brfManager, resolution) {
		brfManager.init(resolution, resolution, brfv4Example.appId);
	};

	brfv4Example.updateCurrentExample = function(brfManager, imageData, draw) {

		brfManager.update(imageData);

		draw.clear();

		// Face detection results: a rough rectangle used to start the face tracking.

		draw.drawRects(brfManager.getAllDetectedFaces(),	false, 1.0, 0x00a1ff, 0.5);
		draw.drawRects(brfManager.getMergedDetectedFaces(),	false, 2.0, 0xffd200, 1.0);

		var faces = brfManager.getFaces(); // default: one face, only one element in that array.

		for(var i = 0; i < faces.length; i++) {

			var face = faces[i];

			if(		face.state === brfv4.BRFState.FACE_TRACKING_START ||
					face.state === brfv4.BRFState.FACE_TRACKING) {

				// Smile Detection

				setPoint(face.vertices, 48, p0); // mouth corner left
				setPoint(face.vertices, 54, p1); // mouth corner right

				var mouthWidth = calcDistance(p0, p1);
				var audio = new Audio('Laugh.mp3');
				
				

				setPoint(face.vertices, 39, p1); // left eye inner corner
				setPoint(face.vertices, 42, p0); // right eye outer corner

				var eyeDist = calcDistance(p0, p1);
				var smileFactor = mouthWidth / eyeDist;
				
				smileFactor -= 1.40; // 1.40 - neutral, 1.70 smiling

				if(smileFactor >= 0.25 && smileFactor <= 0.27)
					{ 
						audio.play();
						  
					}
				console.log(smileFactor);
				if(smileFactor > 0.25) smileFactor = 0.25;
				if(smileFactor < 0.00) smileFactor = 0.00;

				smileFactor *= 4.0;

				if(smileFactor < 0.0) { smileFactor = 0.0; }
				if(smileFactor > 1.0) { smileFactor = 1.0; }
				if(smileFactor >= 1.0) { document.getElementById("hoi").style.backgroundColor="green"; }
				else{ document.getElementById("hoi").style.backgroundColor="red"; }
				

				
				

				// Let the color show you how much you are smiling.
				var color =
					(((0x0000FF * (1.0 - smileFactor) & 0x0000FF) << 16)) +
					(((0x0000FF * smileFactor) & 0x0000FF) << 8);


				// Face Tracking results: 68 facial feature points.

				draw.drawTriangles(	face.vertices, face.triangles, false, 1.0, color, 0.4);
				draw.drawVertices(	face.vertices, 2.0, false, color, 0.4);

				// --------------------------------------------------------------------------------------------------------------

				var v = face.vertices;

				if(_oldFaceShapeVertices.length === 0) storeFaceShapeVertices(v);

				var k, l, yLE, yRE;

				// Left eye movement (y)

				for(k = 36, l = 41, yLE = 0; k <= l; k++) {
					yLE += v[k * 2 + 1] - _oldFaceShapeVertices[k * 2 + 1];
				}
				yLE /= 6;

				// Right eye movement (y)

				for(k = 42, l = 47, yRE = 0; k <= l; k++) {
					yRE += v[k * 2 + 1] - _oldFaceShapeVertices[k * 2 + 1];
				}

				yRE /= 6;

				var yN = 0;

				// Compare to overall movement (nose y)

				yN += v[27 * 2 + 1] - _oldFaceShapeVertices[27 * 2 + 1];
				yN += v[28 * 2 + 1] - _oldFaceShapeVertices[28 * 2 + 1];
				yN += v[29 * 2 + 1] - _oldFaceShapeVertices[29 * 2 + 1];
				yN += v[30 * 2 + 1] - _oldFaceShapeVertices[30 * 2 + 1];
				yN /= 4;

				var blinkRatio = Math.abs((yLE + yRE) / yN);

				if((blinkRatio > 12 && (yLE > 0.4 || yRE > 0.4))) {
					console.log("blink " + blinkRatio.toFixed(2) + " " + yLE.toFixed(2) + " " +
						yRE.toFixed(2) + " " + yN.toFixed(2));

					blink();
				}

				// Let the color of the shape show whether you blinked.

				var color = 0x00a0ff;

				if(_blinked) {
					color = 0xffd200;
					
				}

				// Face Tracking results: 68 facial feature points.

				draw.drawTriangles(	face.vertices, face.triangles, false, 1.0, color, 0.4);
				draw.drawVertices(	face.vertices, 2.0, false, color, 0.4);

				brfv4Example.dom.updateHeadline("BRFv4 - intermediate - face tracking - simple " +
					"smile detection.\nDetects how much someone is smiling. smile factor: " +
					(smileFactor * 100).toFixed(0) + "%");

				storeFaceShapeVertices(v);
			}
		}
	};

	var audio2 = new Audio('doh.wav');
	var p0				= new brfv4.Point();
	var p1				= new brfv4.Point();

	var setPoint		= brfv4.BRFv4PointUtils.setPoint;
	var calcDistance	= brfv4.BRFv4PointUtils.calcDistance;

	brfv4Example.dom.updateHeadline("BRFv4 - intermediate - face tracking - simple smile " +
		"detection.\nDetects how much someone is smiling.");

	brfv4Example.dom.updateCodeSnippet(exampleCode + "");

	function blink() {
		_blinked = true;

		if(_timeOut > -1) { clearTimeout(_timeOut); }

		if(_blinked = true){audio2.play();}

		_timeOut = setTimeout(resetBlink, 100);
	}

	function resetBlink() {
		_blinked = false;
	}

	function storeFaceShapeVertices(vertices) {
		for(var i = 0, l = vertices.length; i < l; i++) {
			_oldFaceShapeVertices[i] = vertices[i];
		}
	}

	var _oldFaceShapeVertices = [];
	var _blinked		= false;
	var _timeOut		= -1;

	brfv4Example.dom.updateHeadline("BRFv4 - advanced - face tracking - simple blink detection.\n" +
		"Detects a blink of the eyes: ");

	brfv4Example.dom.updateCodeSnippet(exampleCode + "");

})();

