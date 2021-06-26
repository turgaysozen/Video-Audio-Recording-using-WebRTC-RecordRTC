var audio = document.querySelector('audio');

function captureMicrophone(callback) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (microphone) {
        callback(microphone);
    }).catch(function (error) {
        alert('Unable to capture your microphone. Please check console logs. Please make sure to enable Windows Start Button => Settings => Privacy => Camera+Microphone for Edge browser.');
        console.error(error);
    });
}

function stopRecordingCallback() {
    audio.srcObject = null;
    var blob = recorder.getBlob();
    audio.src = URL.createObjectURL(blob);

    recorder.microphone.stop();
    console.log("record", recorder)
    upload(recorder.getBlob())

}

var isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
var recorder; // globally accessible
var dateStarted;

document.getElementById('btn-start-recording').onclick = function () {
    this.disabled = true;
    captureMicrophone(function (microphone) {
        audio.srcObject = microphone;

        recorder = RecordRTC(microphone, {
            type: 'audio',
            recorderType: StereoAudioRecorder, // this line is required for MS-Edge
            // sampleRate: 44100,
            numberOfAudioChannels: isEdge ? 1 : 2,
            // bufferSize: 16384
        });

        recorder.startRecording();
        dateStarted = new Date().getTime();

        // release microphone on stopRecording
        recorder.microphone = microphone;

        document.getElementById('btn-stop-recording').disabled = false;
    });
};

let duration;

document.getElementById('btn-stop-recording').onclick = function () {
    this.disabled = true;
    recorder.stopRecording(stopRecordingCallback);
    duration = (new Date().getTime() - dateStarted) / 1000;
    console.log(duration)
};
