/* MoveNet Skeleton - Steve's Makerspace (most of this code is from TensorFlow)

MoveNet is developed by TensorFlow:
https://www.tensorflow.org/hub/tutorials/movenet

*/

let video, bodypose, pose, keypoint, detector;
let poses = [];
let carImg;
let carPosX1, carPosX2;
let carSpeed1, carSpeed2;

async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );
}

async function videoReady() {
  console.log("video ready");
  await getPoses();
}

async function getPoses() {
  if (detector) {
    poses = await detector.estimatePoses(video.elt, {
      maxPoses: 2,
      //flipHorizontal: true,
    });
  }
  requestAnimationFrame(getPoses);
}

function preload() {
  carImg = loadImage("123.gif");
  console.log(carImg); // Check if the image is loaded properly
}

async function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, videoReady);
  video.size(width, height);
  video.hide();
  await init();

  stroke(255);
  strokeWeight(5);

  // Initialize car positions and speeds
  carPosX1 = 0;
  carPosX2 = width - 150; // Ensure it starts within the canvas
  carSpeed1 = 2;
  carSpeed2 = -2;
}

function draw() {
  image(video, 0, 0);
  drawSkeleton();
  // flip horizontal
  let cam = get();
  translate(cam.width, 0);
  scale(-1, 1);
  image(cam, 0, 0);

  // Update car positions
  carPosX1 += carSpeed1;
  carPosX2 += carSpeed2;

  // Reset car positions if they go off-screen
  if (carPosX1 > width) {
    carPosX1 = -150;
  }
  if (carPosX2 < -150) {
    carPosX2 = width;
  }

  // Draw moving cars
  image(carImg, carPosX1, 200, 150, 150); // Adjust y-position as needed
  image(carImg, carPosX2, 200, 150, 150); // Adjust y-position as needed
}

function drawSkeleton() {
  // Draw all the tracked landmark points
  for (let i = 0; i < poses.length; i++) {
    pose = poses[i];
    // shoulder to wrist

    partA = pose.keypoints[0];

    if (partA.score > 0.1) {
      //line(partA.x, partA.y, partB.x, partB.y);
      push()
      textSize(40)
      scale(-1, 1)
      text("412730029,林冰湲", partA.x - width, partA.y - 250)
      //print(partA.x)
      pop()
    }

    for (j = 5; j < 9; j++) {
      if (pose.keypoints[j].score > 0.1 && pose.keypoints[j + 2].score > 0.1) {
        partA = pose.keypoints[j];
        partB = pose.keypoints[j + 2];
        line(partA.x, partA.y, partB.x, partB.y);
      }
    }
    // shoulder to shoulder
    partA = pose.keypoints[5];
    partB = pose.keypoints[6];
    if (partA.score > 0.1 && partB.score > 0.1) {
      //line(partA.x, partA.y, partB.x, partB.y);
      push()
      image(carImg, carPosX1, partA.y - 75, 150, 150)
      image(carImg, carPosX2, partB.y - 75, 150, 150)
      // print(partA.x)
      pop()
    }

    // hip to hip
    partA = pose.keypoints[11];
    partB = pose.keypoints[12];
    if (partA.score > 0.1 && partB.score > 0.1) {
      line(partA.x, partA.y, partB.x, partB.y);
    }
    // shoulders to hips
    partA = pose.keypoints[5];
    partB = pose.keypoints[11];
    if (partA.score > 0.1 && partB.score > 0.1) {
      line(partA.x, partA.y, partB.x, partB.y);
    }
    partA = pose.keypoints[6];
    partB = pose.keypoints[12];
    if (partA.score > 0.1 && partB.score > 0.1) {
      line(partA.x, partA.y, partB.x, partB.y);
    }
    // hip to foot
    for (j = 11; j < 15; j++) {
      if (pose.keypoints[j].score > 0.1 && pose.keypoints[j + 2].score > 0.1) {
        partA = pose.keypoints[j];
        partB = pose.keypoints[j + 2];
        line(partA.x, partA.y, partB.x, partB.y);
      }
    }
  }
}

/* Points (view on left of screen = left part - when mirrored)
  0 nose
  1 left eye
  2 right eye
  3 left ear
  4 right ear
  5 left shoulder
  6 right shoulder
  7 left elbow
  8 right elbow
  9 left wrist
  10 right wrist
  11 left hip
  12 right hip
  13 left kneee
  14 right knee
  15 left foot
  16 right foot
*/
