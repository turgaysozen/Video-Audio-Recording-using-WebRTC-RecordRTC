
### Beehob Video-Audio Recording using WebRTC-RecordRTC ###

Recording video and audio using WebRTC technology and RecordRTC library.

After standart process of Django (create venv, install requirements.txt etc.), you can visit http://127.0.0.1:8000/record/ page to record audio-video contents.

- All of Javascript files locate in static folder.

- It records video and audio, coundt down from 5 minutes and stop automaticly then you can post all meta data and record to your server. It creates new folder which is recordings and stores all records in this folder. If the record is audio it creates ".ogg" file if it is video record it creates ".webm" with unique file name. And it stores specific meta data like path, filename, extension, length, record_type in Recording table.

- I had limited time so could not add a few feature and I could not use Mysql (mysql client problem, I used Postgresql).

source: 
https://webrtc.org/
https://github.com/muaz-khan/RecordRTC
