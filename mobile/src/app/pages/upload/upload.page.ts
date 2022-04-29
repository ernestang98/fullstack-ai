import { Component, OnInit, ElementRef } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SettingsService } from 'src/app/services/settings.service';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
  providers: [File]
})
export class AddPage {
  croppedImagePath: String;
  isLoading = false;
  isDesktop = this.platform.platforms().includes("desktop")
  imageSrc: String;

  ip: String;
  name: String;
  final: String;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  constructor(
      private camera: Camera,
      public actionSheetController: ActionSheetController,
      public file: File,
      public platform: Platform,
      private http: HttpClient,
      private settingsService: SettingsService
  ) { }

  async ngOnInit() {
    this.ip = await this.settingsService.getIP()
    this.name = await this.settingsService.getName();
  }

  getThumbnail = function(url, callback, outputFormat, THESOURCE){
    var canvas = <HTMLCanvasElement> document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      var dataURL;
      var cw = img.width, ch = img.height, cx = 0, cy = 0;
      cw = img.width;
      ch = img.width;
      canvas.height = img.height * 0.1;
      canvas.width = img.width * 0.1;
      ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      dataURL = canvas.toDataURL(outputFormat);
      this.final = dataURL
      callback(dataURL);
      THESOURCE = dataURL;
      canvas = null; 
    };
    img.src = url;
  };

  onFileChange(event) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
    }
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 90,
      targetWidth: 100,
      targetHeight: 100,
      sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then(async (imageData) => {
      // imageData is either a base64 encoded string or a file URI
      this.croppedImagePath = 'data:image/jpeg;base64,' + imageData;

      this.getThumbnail(this.croppedImagePath, function(thumbnail){
        return thumbnail;
      }, 'image/jpeg', this.croppedImagePath);

    }, (err) => {
      // Handle error
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image sources',
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
        {
          text: 'Use Camera',
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async upload() {
    console.log("WEB")
    try {
      let formData = new FormData();
      formData.append('name', this.name as string);
      formData.append('image_str', this.imageSrc as string);
      this.http.post(this.ip as string + "/predict", formData).subscribe(data => {
        alert(data["status"]);
      }, err => {
        alert(JSON.stringify(err))
      })
    }
    catch (e) {
      alert(JSON.stringify(e))
    }
  }

  async mobileUpload() {
    console.log("MOBILE")
    try {
      let formData = new FormData();
      formData.append('name', this.name as string);
      formData.append('image_str', this.final as string);
      this.http.post(this.ip as string + "/predict", formData).subscribe(data => {
        alert(data["status"]);
      }, err => {
        alert(JSON.stringify(err))
      })
    }
    catch (e) {
      alert(JSON.stringify(e))
    }
  }

  dataURLToBlob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = parts[1];
        return new Blob([raw], {type: contentType});
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw : any = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {type: contentType});
  }

}

// https://stackoverflow.com/questions/46670385/how-to-send-image-with-http-post
// https://stackoverflow.com/questions/47180634/i-get-http-failure-response-for-unknown-url-0-unknown-error-instead-of-actu