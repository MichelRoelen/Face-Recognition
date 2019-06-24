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

				var audio = new Audio('sound/KHats Open-03.wav');
				var audio2 = new Audio('sound/CYCdh_KesKick-08.wav');
				var audio3 = new Audio('sound/CYCdh_LudFlamA-03.wav');
				var audio4 = new Audio('sound/CYCdh_TamFlam-01.wav');
				var audio5 = new Audio('sound/GUITAR SOUND EFFECT.wav');
				var soundstop = false;
				// Smile Detection

				
				setPoint(face.vertices, 19, p0); // Eyebrow left
				setPoint(face.vertices, 41, p1); // Eyelid left

				var leftEye = calcDistance(p0, p1);
				console.log("links : " + leftEye);

				setPoint(face.vertices, 24, p1); // right Eyebrow
				setPoint(face.vertices, 46, p0); // right eyelid

				var rightEye = calcDistance(p0, p1);
				console.log("rechts : " + rightEye);
				
				if(leftEye >= 47 && leftEye <= 50)
				{
					audio.play();
				}


				if(rightEye > 47 && rightEye < 50)
				{
					audio2.play();
				}


				setPoint(face.vertices, 48, p0); // mouth corner left
				setPoint(face.vertices, 2, p1); // cheek left

				var leftCheek = calcDistance(p0, p1);
				//console.log("wang links : " + leftCheek);

				setPoint(face.vertices, 54, p0); // mouth corner right
				setPoint(face.vertices, 14, p1); // cheek right

				var rightCheek = calcDistance(p0, p1);
				//console.log("wang rechts : " + rightCheek);

				if(leftCheek < 70)
				{
					audio3.play();
				}
				
				if(rightCheek < 70)
				{
					audio4.play();
				}

				setPoint(face.vertices, 31, p0); // nose corner left
				setPoint(face.vertices, 35, p1); // nose corner right

				var noseDist = calcDistance(p0, p1);
				console.log("Nose Dist : " + noseDist);

				if(noseDist > 44)
				{
					audio5.play();
				}

				var smileFactor = rightEye / leftEye;
				//console.log("smileFactor : " + smileFactor);

				smileFactor -= 1.40; // 1.40 - neutral, 1.70 smiling

				if(smileFactor > 0.25) smileFactor = 0.25;
				if(smileFactor < 0.00) smileFactor = 0.00;

				smileFactor *= 4.0;

				if(smileFactor < 0.0) { smileFactor = 0.0; }
				if(smileFactor > 1.0) { smileFactor = 1.0; }

				// Let the color show you how much you are smiling.
				var color =
					(((0x0000FF * (1.0 - smileFactor) & 0x0000FF) << 16)) +
					(((0x0000FF * smileFactor) & 0x0000FF) << 8);


				// Face Tracking results: 68 facial feature points.

				draw.drawTriangles(	face.vertices, face.triangles, false, 1.0, color, 0.4);
				draw.drawVertices(	face.vertices, 2.0, false, color, 0.4);

				brfv4Example.dom.updateHeadline("BRFv4 - intermediate - face tracking - simple " +
					"smile detection.\nDetects how much someone is smiling. smile factor: " +
					(smileFactor * 100).toFixed(0) + "%");
			}
		}
	};

	var p0				= new brfv4.Point();
	var p1				= new brfv4.Point();

	var setPoint		= brfv4.BRFv4PointUtils.setPoint;
	var calcDistance	= brfv4.BRFv4PointUtils.calcDistance;

	brfv4Example.dom.updateHeadline("BRFv4 - intermediate - face tracking - simple smile " +
		"detection.\nDetects how much someone is smiling.");

	brfv4Example.dom.updateCodeSnippet(exampleCode + "");
})();