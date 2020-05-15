function makeGray(src)
{
    let dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
    return dst;
}

function cannyEdgeDetection(src)
{    
    let src_gray = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC4); //new cv.Mat(src.height, src.width, cv.CV_8UC4);
    let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC1);
    cv.cvtColor(src, src_gray, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(src_gray, src_gray, 100, 200, cv.THRESH_BINARY);
    cv.Canny(src_gray, dst, 50, 100, 3, false);
    return dst;
}

function contourDetection(src)
{
    let src_gray = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC4); //new cv.Mat(src.height, src.width, cv.CV_8UC4);
    let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC1);
    cv.cvtColor(src, src_gray, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(src_gray, src_gray, 50, 200, cv.THRESH_BINARY);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(src_gray, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let cnt = contours.get(0);
    let contoursColor = new cv.Scalar(255, 255, 255);
    cv.drawContours(dst, contours, 0, contoursColor, 1, 8, hierarchy, 100);
    return dst;
}

Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

function faceDetection(src, classifier)
{
    let faces = new cv.RectVector();
    let dst = cv.Mat.zeros(src.height, src.width, cv.CV_8UC4);
    let src_gray = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC4);

    src.copyTo(dst);

    cv.cvtColor(src, src_gray, cv.COLOR_RGBA2GRAY, 0);
    classifier.detectMultiScale(src_gray, faces, 1.1, 3, 0);
    // draw faces.
    for (let i = 0; i < faces.size(); ++i) {
        let face = faces.get(i);
        let point1 = new cv.Point(face.x, face.y);
        let point2 = new cv.Point(face.x + face.width, face.y + face.height);
        cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
    }
    return dst;
}