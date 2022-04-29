import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-train',
  templateUrl: './train.page.html',
  styleUrls: ['./train.page.scss'],
  providers: [File]
})
export class TrainPage implements OnInit {

  food_list = [
    "Apple Pie",
    "Baby Back Ribs",
    "Ramen",
    "Sushi"
  ]

  food: String;

  croppedImagePath: String;
  isLoading = false;
  isDesktop = this.platform.platforms().includes("desktop")
  imageSrc: String;

  ip: String;

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
  ) { 
}

async ngOnInit() {
  this.ip = await this.settingsService.getIP()
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
      quality: 100,
      sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
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
      header: 'Select Image source',
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
    let data = new FormData();
    // data.append('file', this.imageSrc as string);
    data.append('file', this.imageSrc as string);
    data.append('cat', this.food as string);
    this.http.post(this.ip as string + "/train", data).subscribe(data => {
      alert(data["status"]);
    })
  }

  async mobileUpload() {
    let data = new FormData();
    // data.append('file', this.croppedImagePath as string);
    data.append('file', this.final as string);
    data.append('cat', this.food as string);
    this.http.post(this.ip as string + "/train", data).subscribe(data => {
      alert(data["status"]);
    })
  }

}