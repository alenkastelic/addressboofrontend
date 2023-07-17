import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../contacts.service';

export class ContactViewModel {
  id: string = ''
  firstName: string = ''
  lastName: string = ''
  address: string = ''
  phoneNumber: string = ''
}

@Component({
  selector: 'app-show-contact',
  templateUrl: './show-contact.component.html',
  styleUrls: ['./show-contact.component.css']
})
export class ShowContactComponent implements OnInit {
  contactId: any;
  
  contact: ContactViewModel = new ContactViewModel();
  constructor(private contactService: ContactsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.contactId = this.route.snapshot.params['contactId'];
    this.refreshData(this.contactId);
  }

  refreshData(id: string) {
      this.contactService.getContact(id).subscribe((data) =>
      {
        this.contact = data;
      },
      error => {
        alert(error.message);
      });
  }

  backHome() {
    this.router.navigate(['Home']);
  }
}
