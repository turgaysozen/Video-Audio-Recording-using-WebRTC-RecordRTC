$("#video_div").hide();
$("#audio_div").hide();

function RecordType() {

    // document.getElementById('btn-start-recording').disabled = false;
    var selectBox = document.getElementById('record_type')
    var selectedValue = selectBox.options[selectBox.selectedIndex].value
    if (selectedValue === 'audio') {
        $("#audio_div").show();
        // $("#record_buttons").show();
        $("#video_div").hide();


    } else {
        $("#video_div").show();
        // $("#record_buttons").show();
        $("#audio_div").hide();

    }
}