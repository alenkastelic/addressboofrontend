import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FindResult } from './home/home.component';
import { ContactModel } from './add-contact/add-contact.component';
import { ContactViewModel } from './show-contact/show-contact.component';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  readonly apiUrl = 'http://localhost:5269/api/';

  constructor(private http: HttpClient) { }

  getContacts() {
     return this.http.get<any[]>(this.apiUrl + 'contacts/getContacts');
  }

  getContact(id: string) {
    return this.http.get<ContactViewModel>(this.apiUrl + `contacts/getById/${id}`);
  }

  updateContact(id: string, contact: ContactModel) {
    return this.http.put<any[]>(this.apiUrl + `contacts/edit/${id}`, contact);
  }

  addContact(contact: ContactModel) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Observable<ContactModel>>(this.apiUrl + 'contacts/add', contact, httpOptions);
  }

  deleteContact(contactId: string) {
    return this.http.delete(this.apiUrl + `contacts/delete/${contactId}`);
  }

  doesPhoneNumberExists(phoneNumber: string) {
    return this.http.get<boolean>(this.apiUrl + `contacts/doesPhoneNumberExists/${phoneNumber}`);
  }

  findContacts(firstName: string, lastName: string, address: string, 
      phoneNumber: string, pageSize: number, pageNumber: number) : Observable<FindResult> {
    let params = new HttpParams();
    if (firstName.length > 0) {
      params = params.set('firstName', firstName);
    }

    if (lastName.length > 0) {
      params = params.set('lastName', lastName);
    }

    if (address.length > 0) {
      params = params.set('address', address);
    }

    if (phoneNumber.length > 0) {
      params = params.set('phoneNumber', phoneNumber);
    }

    params = params.set('pageSize', pageSize);
    params = params.set('pageNumber', pageNumber);

    let url = this.apiUrl + 'contacts/search';
    url = url + '?' + params.toString();
    return this.http.get<FindResult>(url);
  }
}
