var playNose = false;
var playLeftEye = false;
var playRightEye = false;
var playLeftCheek = false;
var playRightCheek = false;

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
		
		var count = 0;

		for(var i = 0; i < faces.length; i++) {

			var face = faces[i];

			if(		face.state === brfv4.BRFState.FACE_TRACKING_START ||
					face.state === brfv4.BRFState.FACE_TRACKING) {

				var audioLeftEye = new Audio('sound/Duck Quack.wav');
				var audioRightEye = new Audio('sound/Owl Hoots.wav');
				var audioLeftCheek = new Audio('sound/Cat Meows.wav');
				var audioRightCheek = new Audio('sound/Dog Barks.wav');
				var audioNose = new Audio('sound/Cow Classic Moo.wav');
				// Smile Detection

				
				setPoint(face.vertices, 19, p0); // Eyebrow left
				setPoint(face.vertices, 41, p1); // Eyelid left

				var leftEye = calcDistance(p0, p1);
				//console.log("links : " + leftEye);

				if(leftEye > 47)
				{
					if(playLeftEye == false){
						playLeftEye = true;
						
						if(playLeftEye == true){
							setTimeout(function(){ 
								playLeftEye = false
							}, 2000);}
					}
					
				} 
				else {
					
					playLeftEye = false;
				}

				setPoint(face.vertices, 24, p1); // right Eyebrow
				setPoint(face.vertices, 46, p0); // right eyelid
				console.log(p0); // totale vak is Y:600px Y:400px. bereken in percentages
				var rightEye = calcDistance(p0, p1);
				//console.log("rechts : " + rightEye);


				if(rightEye > 47)
				{
					if(playRightEye == false){
						playRightEye = true;
						
						if(playRightEye == true){
							setTimeout(function(){ 
								playRightEye = false
							}, 2000);}
					}
					
				} 
				else {
					
					playRightEye = false;
				}

				setPoint(face.vertices, 31, p0); // nose corner left
				setPoint(face.vertices, 35, p1); // nose corner right

				var noseDist = calcDistance(p0, p1);
				console.log("Nose Dist: " + noseDist);

				if(noseDist > 46)
				{	
					if(playNose == false){
						playNose = true;
						
						if(playNose == true){
							setTimeout(function(){ 
								playNose = false
							}, 2000);}
					}
					
				} 
				else {
					
					playNose = false;
					//console.log(playNose);
					
				}

				setPoint(face.vertices, 48, p0); // mouth corner left
				setPoint(face.vertices, 1, p1); // cheek left

				var leftCheek = calcDistance(p0, p1);
				console.log("wang links : " + leftCheek);

				if(leftCheek < 99)
				{
					document.getElementById("move").style.left = 10 + '%';
					if(playLeftCheek == false){
						playLeftCheek = true;
						
						if(playLeftCheek == true){
							setTimeout(function(){ 
								playLeftCheek = false
							}, 2000);}
					}
					
				} 
				else {
					document.getElementById("move").style.left = 42.5 + '%';
					playLeftCheek = false;
				}

				setPoint(face.vertices, 54, p0); // mouth corner right
				setPoint(face.vertices, 15, p1); // cheek right

				var rightCheek = calcDistance(p0, p1);
				console.log("wang rechts : " + rightCheek);

				if(rightCheek < 85)
				{
					document.getElementById("move").style.left = 90 + '%';
					if(playRightCheek == false){
						playRightCheek = true;
						
						if(playRightCheek == true){
							setTimeout(function(){ 
								playRightCheek = false
							}, 2000);}
					}
					
				} 
				else {
					
					playRightCheek = false;
				}

//--------------------------------------------------------------------------------------------------------------------------

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