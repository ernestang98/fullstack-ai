import { Component, OnInit } from '@angular/core';
import { PhotoService } from 'src/app/services/photo.service';
import { ModalController } from '@ionic/angular';
import { DetailPage } from '../detail/detail.page';
import { IonRouterOutlet } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from 'src/app/services/settings.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  currentImage: any;

  listOfImages: any[];

  name: String;
  ip: String;

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService,
    public photoService: PhotoService, 
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet) {  }

  async ngOnInit() {
    // this.photoService.loadSaved();
    this.name = await this.settingsService.getName();
    this.ip = await this.settingsService.getIP();
    await this.loadImages();
  }

  async showDetails() {
    const modal = await this.modalController.create({
      component: DetailPage,
      swipeToClose: true,
      componentProps: {}
    });
    await modal.present();
  }

  async loadImages() {
    this.listOfImages = []
    const temp = this.name.replace(" ", "_");
    this.http.get(this.ip as string + "/predict/filter/" + temp).subscribe((data: any) => {
      data.forEach(element => {
        console.log(element)
        this.listOfImages.push(element);
      });
    })
  }



}
