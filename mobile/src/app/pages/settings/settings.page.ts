import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import * as constants from "../../utils/constants";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  ip: String;
  name: String;

  constructor(private settingsService: SettingsService) { }

  async ngOnInit() {
    this.ip = await this.settingsService.getIP()
    this.name = await this.settingsService.getName()
  }

  async save() {
    if (this.ip === undefined || this.ip === "") {
      this.ip = constants.default_server_ip;
    }
    await this.settingsService.setIp(this.ip)
    alert("Saved new ip as " + this.ip);
  }

  async saveName() {
    if (this.name === undefined || this.name === "") {
      this.ip = constants.default_name;
    }
    await this.settingsService.setName(this.name)
    alert("Saved new name as " + this.name);
  }

  async ping() {
    const res = await this.settingsService.testIP();
    res.subscribe((ip) => {
      if (ip["status"] !== "success") {
        alert(JSON.stringify(ip))
        alert("Error!");
      }
      else {
        alert(JSON.stringify(ip))
        alert("Success!");
      }
    }, (err) => {
      if (err.statusText === "OK") {
        alert(JSON.stringify(err))
        alert("Success!");
      }
      else {
        alert(JSON.stringify(err))
        alert("Error!");
      }
    })
  }

  // async ping() {
  //   alert("testing")
  //   const res = await this.settingsService.testIP();
  //   alert(JSON.stringify(res))
  // }


}
