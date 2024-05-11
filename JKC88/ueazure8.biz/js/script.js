var classbtn = document.getElementById("btn3");
var scratchImages = document.getElementById('scratch-card-img');
var rand = "";

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const scratchCardCover = document.querySelector('.scratch-card-cover');
const scratchCardCanvasRender = document.querySelector('.scratch-card-canvas-render');
const scratchCardCoverContainer = document.querySelector('.scratch-card-cover-container');
const scratchCardText = document.querySelector('.scratch-card-text');
const scratchCardImage = document.querySelector('.scratch-card-image');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
let isPointerDown = false;
let positionX;
let positionY;
let clearDetectionTimeout = null;

const devicePixelRatio = window.devicePixelRatio || 1;

const canvasWidth = canvas.offsetWidth * devicePixelRatio;
const canvasHeight = canvas.offsetHeight * devicePixelRatio;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

context.scale(devicePixelRatio, devicePixelRatio);

if (isSafari) {
  canvas.classList.add('hidden');
}

canvas.addEventListener('pointerdown', (e) => {
  // scratchImg();
  scratchCardCover.classList.remove('shine');
  ({ x: positionX, y: positionY } = getPosition(e));
  clearTimeout(clearDetectionTimeout);

  canvas.addEventListener('pointermove', plot);

  window.addEventListener('pointerup', (e) => {
    canvas.removeEventListener('pointermove', plot);
    clearDetectionTimeout = setTimeout(() => {
      checkBlackFillPercentage();
    }, 500);
  }, { once: true });
});

const checkBlackFillPercentage = () => {
  // const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
  const pixelData = imageData.data;

  let blackPixelCount = 0;

  for (let i = 0; i < pixelData.length; i += 4) {
    const red = pixelData[i];
    const green = pixelData[i + 1];
    const blue = pixelData[i + 2];
    const alpha = pixelData[i + 3];

    if (red === 0 && green === 0 && blue === 0 && alpha === 255) {
      blackPixelCount++;
    }
  }

  const blackFillPercentage = blackPixelCount * 100 / (canvasWidth * canvasHeight);

  if (blackFillPercentage >= 20) {
    scratchCardCoverContainer.classList.add('clear');
    // confetti({
    //   particleCount: 100,
    //   spread: 90,
    //   origin: {
    //     y: (scratchCardText.getBoundingClientRect().bottom + 60) / window.innerHeight,
    //   },
    // });
    showBtn();
    // scratchCardText.textContent = '🎉 You got a $50 Apple gift card!';
    scratchCardImage.classList.add('animate');
    scratchCardCoverContainer.addEventListener('transitionend', () => {
      scratchCardCoverContainer.classList.add('hidden');
    }, { once: true });
  }
}

const getPosition = ({ clientX, clientY }) => {
  const { left, top } = canvas.getBoundingClientRect();
  return {
    x: clientX - left,
    y: clientY - top,
  };
}

const plotLine = (context, x1, y1, x2, y2) => {
  var diffX = Math.abs(x2 - x1);
  var diffY = Math.abs(y2 - y1);
  var dist = Math.sqrt(diffX * diffX + diffY * diffY);
  var step = dist / 50;
  var i = 0;
  var t;
  var x;
  var y;

  while (i < dist) {
    t = Math.min(1, i / dist);

    x = x1 + (x2 - x1) * t;
    y = y1 + (y2 - y1) * t;

    context.beginPath();
    context.arc(x, y, 16, 0, Math.PI * 2);
    context.fill();

    i += step;
  }
}

const setImageFromCanvas = () => {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    previousUrl = scratchCardCanvasRender.src;
    scratchCardCanvasRender.src = url;
    if (!previousUrl) {
      scratchCardCanvasRender.classList.remove('hidden');
    } else {
      URL.revokeObjectURL(previousUrl);
    }
    previousUrl = url;
  });
}

let setImageTimeout = null;

const plot = (e) => {
  const { x, y } = getPosition(e);
  plotLine(context, positionX, positionY, x, y);
  positionX = x;
  positionY = y;
  if (isSafari) {
    clearTimeout(setImageTimeout);

    setImageTimeout = setTimeout(() => {
      setImageFromCanvas();
    }, 5);
  }
};


function showBtn() {
  classbtn.style.display = "block";
}

// function scratchImg() {
//   rand = Math.floor(Math.random() * 4);
//   switch (rand) {
//     case 1:
//       scratchImages.innerHTML = '<img class="scratch-card-image" src="image/tombol/18.png">';
//       break;
//     case 2:
//       scratchImages.innerHTML = '<img class="scratch-card-image" src="image/tombol/68.png">';
//       break;
//     case 3:
//       scratchImages.innerHTML = '<img class="scratch-card-image" src="image/tombol/88.png">';
//       break;
//     default:
//       scratchImages.innerHTML = '<img class="scratch-card-image" src="image/tombol/8.png">';
//       break;
//   }

//   switch (rand) {
//     case 1:
//       link = "//yahoo.com"
//       break;
//     case 2:
//       link = "//baidu.com"
//       break;
//     case 3:
//       link = "//bing.com"
//       break;
//     default:
//       link = "//google.com"
//       break;
//   }
// }

// function redirect() {
//   window.location.href = link;
// }