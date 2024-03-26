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

// function paintToCanvas() {
//   const width = video.videoWidth;
//   const height = video.videoHeight;
//   // console.log(width, height);   (for checking the canvas size & then change it in HTML canvas tag) // it's important
//   canvas.width = width;
//   canvas.height = height;

//   let imageFilter = false;

//   function applyGreen() {
//     let pixels = ctx.getImageData(0, 0, width, height);
//     pixels = colorEffect2(pixels);
//     ctx.putImageData(pixels, 0, 0);
//   }
//   function applyRed() {
//     let pixels = ctx.getImageData(0, 0, width, height);
//     pixels = colorEffect1(pixels);
//     ctx.putImageData(pixels, 0, 0);
//   }
//   function applyBlue() {
//     let pixels = ctx.getImageData(0, 0, width, height);
//     pixels = colorEffect3(pixels);
//     ctx.putImageData(pixels, 0, 0);
//   }
//   // function applyRGB() {
//   //   let pixels = ctx.getImageData(0, 0, width, height);
//   //   pixels = colorEffect3(pixels);
//   //   ctx.putImageData(pixels, 0, 0);
//   // }
//   function showImage1() {
//     ctx.drawImage(video, 0, 0, width, height);
//     if (imageFilter) {
//       applyGreen();
//     }
//   }
//   function showImage2() {
//     ctx.drawImage(video, 0, 0, width, height);
//     if (imageFilter) {
//       applyRed();
//     }
//   }
//   function showImage3() {
//     ctx.drawImage(video, 0, 0, width, height);
//     if (imageFilter) {
//       applyBlue();
//     }
//   }

//   // imageGetter = setInterval(showImage1, 16);
//   //imageGetter = setInterval(showImage2, 16);
//   // imageGetter = setInterval(showImage3, 16);

//   document.getElementById("GreenColor").addEventListener("click", () => {
//     console.log(imageFilter);
//     if (!imageFilter) {
//       imageFilter = true;
//     } else {
//       imageFilter = false;
//     }
//     imageGetter = setInterval(showImage1, 16);
//     console.log(imageFilter);
//   });

//   document.getElementById("RedColor").addEventListener("click", () => {
//     console.log(imageFilter);
//     if (!imageFilter) {
//       imageFilter = true;
//     } else {
//       imageFilter = false;
//     }
//     console.log(imageFilter);
//   });

//   document.getElementById("BlueColor").addEventListener("click", () => {
//     console.log(imageFilter);
//     if (!imageFilter) {
//       imageFilter = true;
//     } else {
//       imageFilter = false;
//     }
//     console.log(imageFilter);
//   });
// }

let imageFilter = null;

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  function applyGreen(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
      pixels.data[i + 1] = pixels.data[i + 1] + 100; // Green effect
    }
    return pixels;
  }

  function applyRed(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
      pixels.data[i + 0] = pixels.data[i + 0] + 100; // Red effect
    }
    return pixels;
  }

  function applyBlue(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
      pixels.data[i + 2] = pixels.data[i + 2] + 100; // Blue effect
    }
    return pixels;
  }

  function applyFilter() {
    const pixels = ctx.getImageData(0, 0, width, height);
    let filteredPixels = pixels;

    switch (imageFilter) {
      case "green":
        filteredPixels = applyGreen(pixels);
        break;
      case "red":
        filteredPixels = applyRed(pixels);
        break;
      case "blue":
        filteredPixels = applyBlue(pixels);
        break;
      default:
        break;
    }

    ctx.putImageData(filteredPixels, 0, 0);
  }

  function showImage() {
    ctx.drawImage(video, 0, 0, width, height);
    if (imageFilter) {
      applyFilter();
    }
  }

  document.getElementById("GreenColor").addEventListener("click", () => {
    if (imageFilter === "green") {
      imageFilter = null; // Toggle off
    } else {
      imageFilter = "green"; // Toggle on
    }
  });

  document.getElementById("RedColor").addEventListener("click", () => {
    if (imageFilter === "red") {
      imageFilter = null; // Toggle off
    } else {
      imageFilter = "red"; // Toggle on
    }
  });

  document.getElementById("BlueColor").addEventListener("click", () => {
    if (imageFilter === "blue") {
      imageFilter = null; // Toggle off
    } else {
      imageFilter = "blue"; // Toggle on
    }
  });

  setInterval(showImage, 16);
}

/*    Screen Shot of the picture in canvas    */

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

/*    Green Screen Effect   */

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
