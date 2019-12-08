const cameraOutput = document.querySelector('#camera_view');
const preview = document.querySelector('.preview');
const cameraCanvas = document.querySelector('#camera_canvas');
const camTrigger = document.querySelector('#camera_trigger');
const modal = document.querySelector('#camera_modal');
const openButton = document.querySelector('#open_modal');
const closeButton = document.querySelector('.close_btn');
let streaming;

const ctx = cameraCanvas.getContext('2d');

const constraints = {
  video: { facingMode: 'environment'},
  audio: false
};

let loopFrame;
let width = 0;
let height = 0;
let imgWidth = 200;
let imgHeight = 300;

const img = new Image();
  img.src = './img/silhuette.png';


img.onload = function() {
  ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
}

const loop = () => {
  loopFrame = requestAnimationFrame(loop);

  ctx.drawImage(cameraOutput, 0, 0, width, height);

  const offsetX = (cameraCanvas.width - imgWidth) / 2;
  const offsetY = (cameraCanvas.height - imgHeight) / 2;
  ctx.drawImage(img, offsetX, offsetY, imgWidth, imgHeight);
};

const startLoop = () => {
  loopFrame = loopFrame || requestAnimationFrame(loop);
};

cameraOutput.addEventListener('loadedmetadata', function() {
  width = cameraCanvas.width = cameraOutput.videoWidth > window.innerWidth ? window.innerWidth : cameraOutput.videoWidth;
  height = cameraCanvas.height = cameraOutput.videoHeight > window.innerHeight ? window.innerHeght : cameraOutput.videoHeight;

  if (width < height) {
    imgWidth = width - 50;
    imgHeight = imgWidth * 1.46;
  } else {
    imgHeight = width - 50;
    imgHeight = imgHeight * 0.68;
  }

  console.log('width', width);
  console.log('imgWidth', imgWidth);
  startLoop();
});

const cameraStart = () => {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
      console.log('stream: ', stream.contentHint);
      streaming = stream;
      cameraOutput.srcObject = stream;
    })
    .catch(err => console.error(err));
}

const cameraStop = () => {
  if (streaming) {
    streaming.getTracks().forEach(track => {
      track.stop();
    });
  }
  cameraOutput.srcObject = null;
}

const openModal = () => {
  modal.classList.add('open');
  cameraStart();
};

const closeModal = () => {
  modal.classList.remove('open');
  cameraStop();
}


openButton.addEventListener('click', openModal);
closeButton.addEventListener('click', closeModal);

const capturePhoto = () => {
  preview.src = cameraCanvas.toDataURL('image/webp');
  preview.classList.add('taken');
  closeModal();
}

camTrigger.addEventListener('click', capturePhoto);
