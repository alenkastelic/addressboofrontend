import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../contacts.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

export class ContactModel {
  firstName: string = ''
  lastName: string = ''
  address: string = ''
  phoneNumber: string = ''
}

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {
  contact: ContactModel = new ContactModel();
  phoneNumberExists: boolean = false;
  contactId: any;

  constructor(private contactService: ContactsService, private router: Router, 
    private route: ActivatedRoute) { 
  }

  ngOnInit(): void {
    this.contactId = this.route.snapshot.params['contactId'];
    if (this.contactId) {
      this.contactService.getContact(this.contactId).subscribe((data) => {
        this.contact = data;
      })
    }
  }

  onSubmit(contactForm: NgForm) {
    if (!contactForm.valid) {
      return;
    }
    
    if (this.isUpdate())
    {
      this.updateContact();
      this.backHome();
    }
    else
    {
      this.contactService.doesPhoneNumberExists(this.contact.phoneNumber).subscribe((value: boolean) => {
        this.phoneNumberExists = value;
        if (!this.phoneNumberExists)
        {
            this.addContact();
            this.backHome();
        }
      },
      error => {
        console.log(error);
        window.alert(error.message);
      });
    }
  }

  addContact() {
    this.contactService.addContact(this.contact)
      .subscribe(
        () => {},
        error => {
          console.log(error);
          window.alert(error.message);
        }
      )
  }

  updateContact() {
    this.contactService.updateContact(this.contactId, this.contact).subscribe(
      () => {},
      error => {
        console.log(error);
        alert(error.message);
      }
    );
  }

  backHome() {
    this.router.navigate(['Home']);
  }

  isUpdate() {
    return this.contactId;
  }
}
