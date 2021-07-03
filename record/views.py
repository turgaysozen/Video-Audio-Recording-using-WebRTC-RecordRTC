from django.shortcuts import render
from django.conf import settings
import uuid
from datetime import datetime
import os
from django.http import JsonResponse
from .models import Recording
import subprocess


def upload(request):
    if request.method == 'POST':
        baseDir = settings.BASE_DIR
        try:
            length = round(float(request.META['HTTP_LENGTH']), 2)
            path = os.path.join(baseDir, "recordings")
            filename = str(uuid.uuid1())# + "-" + datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            record_type = request.META['HTTP_TYPE']
            extension = ".mp3" if record_type == "audio" else ".webm"

            # create new folder if not exist which name is recordings
            if not os.path.exists(path):
                os.makedirs(path)
            # save recorded audio or video based on its extension
            with open(path + "/" + filename + extension, 'wb+') as destination:
                for chunk in request.FILES['blob'].chunks():
                    destination.write(chunk)

            # save specific meta data in Recording table
            Recording.objects.create(path=path, filename=filename, extension=extension, length=length, record_type=record_type)
        except:
            raise Exception("Something went wrong!")
 
        return JsonResponse('success', safe=False) # return success (200-OK)
    else:
        return render(request, 'record.html')