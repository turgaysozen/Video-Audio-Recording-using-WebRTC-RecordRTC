var video = document.querySelector('video');

function captureCamera(callback) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function (camera) {
        callback(camera);
    }).catch(function (error) {
        alert('Unable to capture your camera. Please check console logs.');
        console.error(error);
    });
}

function stopRecordingCallbackVideo() {
    video.src = video.srcObject = null;
    video.muted = false;
    video.volume = 1;
    video.src = URL.createObjectURL(recorder.getBlob());

    recorder.camera.stop();
    console.log("record", recorder)
    upload(recorder.getBlob())
    recorder.destroy();
    recorder = null;
}

var recorder; // globally accessible
var dateStarted;
var duration;

document.getElementById('btn-start-recording').onclick = function () {
    this.disabled = true;
    captureCamera(function (camera) {

        video.muted = true;
        video.volume = 0;
        video.srcObject = camera;

        recorder = RecordRTC(camera, {
            type: 'video'
        });

        recorder.startRecording();


        dateStarted = new Date().getTime();

        // release camera on stopRecording
        recorder.camera = camera;

        document.getElementById('btn-stop-recording').disabled = false;
    });
};

document.getElementById('btn-stop-recording').onclick = function () {
    this.disabled = true;
    recorder.stopRecording(stopRecordingCallbackVideo);
    duration = (new Date().getTime() - dateStarted) / 1000;
    console.log(duration)
};
