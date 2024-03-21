const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");
//const changeColor = document.querySelector(".changeColor");

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      console.log(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => {
      console.error("Error accessing webcam:", err);
    });
}

getVideo();

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  // console.log(width, height);   (for checking the canvas size & then change it in HTML canvas tag) // it's important
  canvas.width = width;
  canvas.height = height;

  let imageFilter = false;

  function apply() {
    let pixels = ctx.getImageData(0, 0, width, height);
    pixels = colorEffect2(pixels);
    ctx.putImageData(pixels, 0, 0);
  }
  function showImage() {
    ctx.drawImage(video, 0, 0, width, height);
    if (imageFilter) {
      apply();
    }
  }

  imageGetter = setInterval(showImage, 16);

  document.getElementById("changeColor").addEventListener("click", () => {
    console.log(imageFilter);
    if (!imageFilter) {
      imageFilter = true;
    } else {
      imageFilter = false;
    }
    console.log(imageFilter);
  });
}

//   return setInterval(() => {
//     function showImage() {
//       ctx.drawImage(video, 0, 0, width, height);
//     }
//     showImage();
//     //clearTimeout(showImage, 2000);
//     // ---------- take pixels out
//     // let pixels = ctx.getImageData(0, 0, width, height);......
//     /* console.log (millions of pixels data will show) red , green , blue , alpha <---- (order of the pixel) */

//     // ---------- Mess with the pixels

//     // pixels = colorEffect1(pixels);
//     // pixels = colorEffect2(pixels);.......

//     //pixels = rgbSplit(pixels);
//     //pixels = greenScreen(pixels);
//     //  ctx.globalAlpha = 0.1;    ( <----- must try it  )

//     // --------- Put those pixels again

//     function putImageData(pixels) {
//       ctx.putImageData(pixels, 0, 0);
//     }
//     /*const colorInterval = setInterval(putImageData);
//      function myStop() {
//       clearInterval(colorInterval);
//     }/*/
//     // setTimeout(putImageData);
//     document.getElementById("changeColor").addEventListener("click", () => {
//       let pixels = ctx.getImageData(0, 0, width, height);
//       pixels = colorEffect2(pixels);
//       ctx.putImageData(pixels);
//     });

//     // ctx.putImageData(pixels, 0, 0);
//   }, 16);
// }

function takePhoto() {
  //  played the clicking sound
  snap.currentTime = 0;
  snap.play();

  //  now time to take data from canvas
  const data = canvas.toDataURL("image/jpeg");
  //console.log(data);
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "handsome");
  link.textContent = "Download image";
  link.innerHTML = `<img src='${data}'  alt='A handsome man'/>`;
  strip.insertBefore(link, strip.firstChild);
}

function colorEffect1(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // red
    //pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    // pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }
  return pixels;
}
function colorEffect2(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    //pixels.data[i + 0] = pixels.data[i + 0] + 200; // red
    pixels.data[i + 1] = pixels.data[i + 1] + 100; // green
    // pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }
  return pixels;
}
function colorEffect3(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    //pixels.data[i + 0] = pixels.data[i + 0] + 200; // red
    //pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 550] = pixels.data[i + 0] + 200; // red
    pixels.data[i + 100] = pixels.data[i + 1] - 50; // green
    pixels.data[i - 850] = pixels.data[i + 2] * 0.5; // blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll(".rgb input").forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

video.addEventListener("canplay", paintToCanvas);
