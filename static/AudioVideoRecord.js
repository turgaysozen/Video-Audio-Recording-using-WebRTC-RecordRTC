// hide some divs and buttons when document ready
$(document).ready(function () {
    $("#video_div").hide();
    $("#audio_div").hide();
    $("#record_buttons").hide();
    $("#uploading").hide()
    $("#remaining_time_aud").hide()
    $("#remaining_time_vid").hide()
    $("#post").hide()

});

function RecordType() {
    $("#post").hide()

    // get selecbox value (video or audio)
    var selectBox = document.getElementById('record_type')
    var selectedValue = selectBox.options[selectBox.selectedIndex].value

    // get cookie for django csrf token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // get csrf token
    const csrftoken = getCookie('csrftoken');

    // upload recorded video or audio
    function upload(blob, type) {
        var formData = new FormData();
        formData.append("blob", blob, 'myfile');
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/record/', true);
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.setRequestHeader("LENGTH", duration);
        xhr.setRequestHeader("TYPE", type);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                setTimeout(() => {
                    $("#uploading").hide()
                }, 2000);
            } else if (xhr.readyState == 4 && xhr.status == 400 || xhr.readyState == 4 && xhr.status == 500) {
                alert("Error while Uploading - The admins have been notified. Please try again later")
            }
        };
        xhr.send(formData);
    }

    // calculate duration
    function calculateTimeDuration(secs) {
        var hr = Math.floor(secs / 3600);
        var min = Math.floor((secs - (hr * 3600)) / 60);
        var sec = Math.floor(secs - (hr * 3600) - (min * 60));

        if (min < 10) {
            min = "0" + min;
        }

        if (sec < 10) {
            sec = "0" + sec;
        }

        if (hr <= 0) {
            return min + ':' + sec;
        }

        return hr + ':' + min + ':' + sec;
    }

    if (selectedValue === 'audio') {
        $("#audio_div").show();
        $("#record_buttons").show();
        $("#video_div").hide();
        $("#remaining_time_aud").show()
        $("#remaining_time_vid").hide()

        var audio = document.querySelector('audio');

        function captureMicrophone(callback) {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(function (microphone) {
                callback(microphone);
            }).catch(function (error) {
                alert('Unable to capture your microphone. Please check console logs. Please make sure to enable Windows Start Button => Settings => Privacy => Camera+Microphone for Edge browser.');
                console.error(error);
            });
        }
        var recorderAudio;
        var dateStarted;

        function stopRecordingCallback() {
            audio.srcObject = null;
            var blob = recorderAudio.getBlob();
            audio.src = URL.createObjectURL(blob);

            recorderAudio.microphone.stop();
            console.log("record", recorderAudio)
            // upload(recorder.getBlob())

        }

        var isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);

        document.getElementById('btn-start-recording').onclick = function () {
            this.disabled = true;
            captureMicrophone(function (microphone) {
                audio.srcObject = microphone;
                recorderAudio = RecordRTC(microphone, {
                    type: 'audio',
                    recorderType: StereoAudioRecorder, // this line is required for MS-Edge
                    // sampleRate: 44100,
                    numberOfAudioChannels: isEdge ? 1 : 2,
                    // bufferSize: 16384
                });

                recorderAudio.startRecording();
                triggerCountdownAud()
                // $("#remaining_time").show()
                dateStarted = new Date().getTime();

                // release microphone on stopRecording
                recorderAudio.microphone = microphone;

                document.getElementById('btn-stop-recording').disabled = false;
            });
        };

        var duration;

        document.getElementById('btn-stop-recording').onclick = function () {
            this.disabled = true;
            recorderAudio.stopRecording(stopRecordingCallback);
            duration = (new Date().getTime() - dateStarted) / 1000;
            console.log(duration)
            document.getElementById('btn-start-recording').disabled = false;
            $("#post").show()
        };

        document.getElementById('post').onclick = function () {
            $("#uploading").show()
            upload(recorderAudio.getBlob(), type="audio")
        }
        function startTimerAud(dur, display) {
            var timer = dur, minutes, seconds;
            var inter = setInterval(function () {
                minutes = parseInt(timer / 60, 10)
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                display.textContent = minutes + ":" + seconds;

                if (--timer < 0) {
                    timer = 0;
                    this.disabled = true;
                    recorderAudio.stopRecording(stopRecordingCallback);
                    duration = (new Date().getTime() - dateStarted) / 1000;
                    console.log(duration)
                    document.getElementById('btn-start-recording').disabled = false;
                    $("#post").show()
                    clearInterval(inter)
                }
            }, 1000);
        }

        function triggerCountdownAud() {
            var fiveMinutes = 5 * 60 - 1,
                display = document.querySelector('#time_aud');
            startTimerAud(fiveMinutes, display);
        }

    } else {

        $("#video_div").show();
        $("#record_buttons").show();
        $("#audio_div").hide();
        $("#remaining_time_aud").hide()
        $("#remaining_time_vid").show()

        var recorderVideo;
        var dateStarted;
        var duration;

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
            video.src = URL.createObjectURL(recorderVideo.getBlob());

            recorderVideo.camera.stop();
            console.log("record", recorderVideo)
            // upload(recorder.getBlob())
            // recorderVideo.destroy();
            // recorderVideo = null;
        }

        document.getElementById('btn-start-recording').onclick = function () {
            this.disabled = true;
            captureCamera(function (camera) {

                video.muted = true;
                video.volume = 0;
                video.srcObject = camera;

                recorderVideo = RecordRTC(camera, {
                    type: 'video'
                });

                recorderVideo.startRecording();
                triggerCountdownVid()
                // $("#remaining_time").show()
                dateStarted = new Date().getTime();

                // release camera on stopRecording
                recorderVideo.camera = camera;

                document.getElementById('btn-stop-recording').disabled = false;
            });
        };

        document.getElementById('btn-stop-recording').onclick = function () {
            this.disabled = true;
            recorderVideo.stopRecording(stopRecordingCallbackVideo);
            duration = (new Date().getTime() - dateStarted) / 1000;
            console.log(duration)
            document.getElementById('btn-start-recording').disabled = false;
            $("#post").show()

        };
        document.getElementById('post').onclick = function () {
            $("#uploading").show()
            upload(recorderVideo.getBlob(), type="video")
        }

        function startTimerVid(dur, display) {
            var timer = dur, minutes, seconds;
            var inter = setInterval(function () {
                minutes = parseInt(timer / 60, 10)
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                display.textContent = minutes + ":" + seconds;

                if (--timer < 0) {
                    timer = 0;
                    $("#post").show()
                    this.disabled = true;
                    recorderVideo.stopRecording(stopRecordingCallbackVideo);
                    duration = (new Date().getTime() - dateStarted) / 1000;
                    console.log(duration)
                    document.getElementById('btn-start-recording').disabled = false;
                    clearInterval(inter);
                }

            }, 1000);
        }

        function triggerCountdownVid() {
            var fiveMinutes = 5 * 60 - 1,
                display = document.querySelector('#time_vid');
            startTimerVid(fiveMinutes, display);
        }
    }
}