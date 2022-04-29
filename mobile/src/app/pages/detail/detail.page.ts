import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-detalhe',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  @Input() id: number;
  client: any;
  editorMode = false;
  email: string;
  name: string;

  constructor(
    public modalCtrl: ModalController,
    private clientService: ClientService,
    private alertController: AlertController) { }

  ngOnInit() {
    this.getClientDetails();
  }

  getClientDetails() {
    this.clientService.getCustomerById(this.id).subscribe((data => {
      this.client = data.data;
      this.name = `${this.client.first_name} ${this.client.last_name}`;
      this.email = this.client.email;
    }));
  }

  async toggleEditorMode() {
    if (this.editorMode && (this.name !== `${this.client.first_name} ${this.client.last_name}`)) {
      const alert = await this.alertController.create({
        header: 'Confirmation',
        message: 'Delete all changes?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.editorMode = false;
              this.name = `${this.client.first_name} ${this.client.last_name}`;
              this.email = this.client.email;
            }
          },
          {
            text: 'No',
          }
        ]
      });
      await alert.present();
    } else if (this.editorMode) {
      this.editorMode = false;
    } else if (!this.editorMode) {
      this.editorMode = true;
    }

  }

  async updateClientDetails() {

    if (!this.name) {
      const alert = await this.alertController.create({
        header: 'Alert',
        message: 'Please add client name',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (!this.email) {
      const alert = await this.alertController.create({
        header: 'Alert',
        message: 'Please add client email',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.clientService.updateCustomer(this.id, this.name, this.email).subscribe(async (data: any) => {
      const alert = await this.alertController.create({
        header: 'Sucesso!',
        message: `Cadastro atualizado (ID ${this.id}).`,
        buttons: ['OK']
      });
      this.client.first_name = this.name;
      this.client.last_name = '';
      this.client.email = this.email;
      this.editorMode = false;
      await alert.present();
      return;
    });
  }

}
