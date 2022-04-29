import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Observable } from 'rxjs';
import * as constants from '../utils/constants';
import { HTTPResponse } from '@awesome-cordova-plugins/http';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // constructor(private storage: Storage, private http: HttpClient) { }
  constructor(private storage: Storage, private http: HTTP, private http1: HttpClient) { }
  async ngOnInit() {
  }

  async setIp(ip?: String) : Promise<void> {
    if (ip === '' || ip === undefined) {
      this.storage.set('ip', constants.default_server_ip);
    }
    else {
      this.storage.set('ip', ip);
    }
  }

  async setName(name?: String) : Promise<void> {
    if (name === '' || name === undefined) {
      this.storage.set('name', constants.default_name);
    }
    else {
      this.storage.set('name', name);
    }
  }

  async getIP() : Promise<String> {
    return await this.storage.get('ip')
  }

  async getName() : Promise<String> {
    return await this.storage.get('name')
  }

  async testIP(): Promise<Observable<any>> {
    // return await this.http.get(`https://reqres.in/api/users/1`, {observe: 'response'});
    const ip = await this.storage.get('ip')
    return await this.http1.get(`${ip}`);
  }

  // async testIP(): Promise<HTTPResponse> {
  //   // return await this.http.get(`https://reqres.in/api/users/1`, {observe: 'response'});
  //   const ip = await this.storage.get('ip')
  //   return await this.http.get(`${ip}`, {}, {});
  // }

}
