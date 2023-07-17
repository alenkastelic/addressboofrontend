import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'
import { ContactsService } from '../contacts.service';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

export interface ContactElement {
  id: string,
  firstName: string
  lastName: string,
  address: string,
  phoneNumber: string
}

export interface FindResult {
  contacts: ContactElement[],
  totalResults: number
}

export class FilterModel {
  firstName: string = ''
  lastName: string = ''
  address: string = ''
  phoneNumber: string = ''
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'address', 'phoneNumber', 'actions'];
  dataSource!: MatTableDataSource<ContactElement>;
  filterModel: FilterModel = new FilterModel();

  // Pagination
  pageSize: number = 10;
  currentPage: number = 1;
  totalItems: number = 0;

  constructor(private router: Router, private contactService: ContactsService) {}

  ngOnInit(): void {
    this.currentPage = 1;
    this.refreshContacts();
  }

  addContact() {
    this.router.navigate(['AddContact'])
  }

  deleteContact(id: string) {
    if (confirm('Are you sure you want to delete record?')) {
      this.contactService.deleteContact(id).subscribe(() => {
          this.refreshContacts();
      },
      error => {
        console.log(error);
        window.alert(error.message);
      });
    }
  }

  refreshContacts() {
    this.contactService.findContacts(this.filterModel.firstName, 
      this.filterModel.lastName, this.filterModel.address, this.filterModel.phoneNumber,
      this.pageSize, this.currentPage)
        .subscribe(data => {
          this.totalItems = data.totalResults;
          this.dataSource = new MatTableDataSource(data.contacts);
        },
        error => {
          console.log(error);
          window.alert(error.message);
        });
  }

  handlePageEvent(e: PageEvent) {
    this.currentPage = e.pageIndex + 1;
    this.refreshContacts();
  }
}
