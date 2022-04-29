import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ClientService {

  url = 'https://reqres.in';

  constructor(private http: HttpClient) { }

  getAllCustomers(page: number): Observable<any> {
    return this.http.get(`${this.url}/api/users?page=${page}`);
  }

  getCustomerById(id: number): Observable<any> {
    return this.http.get(`${this.url}/api/users/${id}`);
  }

  registerNewCustomer(customerName: string, customerProfession: string) {
    const body = { name: customerName, job: customerProfession };
    return this.http.post(`${this.url}/api/users`, body);
  }

  updateCustomer(customerId: number, customerName: string, customerProfession: string) {
    const body = {name: customerName, job: customerProfession};
    return this.http.patch(`${this.url}/api/users/${customerId}`, body);
  }

}
