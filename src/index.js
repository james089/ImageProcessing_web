
function onOpenCvReady() {
  document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
}

function window_onLoad(){
    let imgElement = document.getElementById('imageSrc');
    let inputElement = document.getElementById('fileInput');
    inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
    }, false);
}

function imageSrc_onLoad(){
    let imgElement = document.getElementById('imageSrc');
    let imgOriginal = cv.imread(imgElement);
    let imgProcessed = makeGray(imgOriginal);
    cv.imshow('canvasOutputStatic', imgProcessed);
    imgOriginal.delete();
    imgProcessed.delete();
}

function makeGray(imgOriginal)
{
    let dst = new cv.Mat();
    cv.cvtColor(imgOriginal, dst, cv.COLOR_RGBA2GRAY, 0);
    return dst;
}

//#region Using OPENCV video
let utils = new Utils('errorMessage');
let streaming = false;

function video_onLoad(){
    let video = document.getElementById("videoInput");
    let button = document.getElementById("Btn_preview")
    if(!streaming)
    {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
            video.srcObject = stream;
            video.play();
            })
            .catch(function (err0r) {
            console.log("Something went wrong!");
            });
            isPreviewOn = true;
            button.innerHTML = "Stop";
            video_onLoad();
        }
    }
    else
    {
        var stream = video.srcObject;
        var tracks = stream.getTracks();

        for (var i = 0; i < tracks.length; i++) {
            var track = tracks[i];
            track.stop();
        }

        video.srcObject = null;
        isPreviewOn = false;
        button.innerHTML = "Turn On";
    }

    let video = document.getElementById("videoInput");
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let cap = new cv.VideoCapture(video);
    const FPS = 30;
    function processVideo() {
        try {
            if (!streaming) {
                // clean and stop.
                src.delete();
                dst.delete();
                return;
            }
            let begin = Date.now();
            // start processing.
            cap.read(src);
            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
            cv.imshow('canvasOutput', dst);
            // schedule the next one.
            let delay = 1000/FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
        } catch (err) {
            //utils.printError(err);
            alert(err);
        }
    }
    // schedule first one.
    setTimeout(processVideo, 0);
}
//#endregion Using OPENCV video

//#region This is for normal video show
var isPreviewOn = false;
function togglePreview()
{
    let video = document.getElementById("videoInput");
    let button = document.getElementById("Btn_preview")
    if(!isPreviewOn)
    {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
            video.srcObject = stream;
            video.play();
            })
            .catch(function (err0r) {
            console.log("Something went wrong!");
            });
            isPreviewOn = true;
            button.innerHTML = "Stop";
            video_onLoad();
        }
    }
    else
    {
        var stream = video.srcObject;
        var tracks = stream.getTracks();

        for (var i = 0; i < tracks.length; i++) {
            var track = tracks[i];
            track.stop();
        }

        video.srcObject = null;
        isPreviewOn = false;
        button.innerHTML = "Turn On";
    }
}

//#endregion 