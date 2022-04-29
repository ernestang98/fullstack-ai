import { Component, OnInit } from '@angular/core';
import * as constants from "./utils/constants";
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationEnd } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Overview',
      url: 'dashboard',
      icon: 'clipboard'
    },
    {
      title: 'Predict Food',
      url: 'upload',
      icon: 'cloud-upload'
    },
    {
      title: 'Train Model',
      url: 'train',
      icon: 'barbell'
    },
    {
      title: 'Settings',
      url: 'settings',
      icon: 'settings'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private storage: Storage

  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async ngOnInit() {
    this.router.events.subscribe((evento) => {
      if (evento instanceof NavigationEnd) {
        console.log(evento.url);
        this.navigate(evento.url.replace('/dashboard', ''));
      }
    });
    await this.storage.create();
    this.storage.set('ip', constants.default_server_ip);
    this.storage.set('name', constants.default_name);
  }


  navigate(pageDestination?) {
    if (!pageDestination || pageDestination === `/`){
      this.selectedIndex = 0;
    } else {
      this.selectedIndex = this.appPages.findIndex(page => page.url.toLowerCase() === pageDestination.toLowerCase());
    }
  }


}
