import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../services/admin.service';
import { CryptoService } from '../../../../services/crypto.service';
import { Location } from '@angular/common'
declare var $: any;


@Component({
  selector: 'app-remitter-request',
  templateUrl: './remitter-request.component.html',
  styleUrls: ['./remitter-request.component.css']
})
export class RemitterRequestComponent implements OnInit, AfterViewInit {
  @ViewChild('dummyScroll') dummyScroll: ElementRef;
  @ViewChild('tableWrapper') tableWrapper: ElementRef;
  ngAfterViewInit() {
    this.dummyScroll.nativeElement.addEventListener('scroll', () => {
      this.tableWrapper.nativeElement.scrollLeft = this.dummyScroll.nativeElement.scrollLeft;
    });
    this.tableWrapper.nativeElement.addEventListener('scroll', () => {
      this.dummyScroll.nativeElement.scrollLeft = this.tableWrapper.nativeElement.scrollLeft;
    });
  }
  userForm: FormGroup;
  paginationForm: FormGroup;
  usdRemittanceForm: FormGroup
  usdTransferBankForm:FormGroup
  remitterTypeUpdateForm: FormGroup;
  beneTransferUpdateForm: FormGroup;
  itemsPerPageContainer = [10, 50, 100];
  itemsPerPage: number = 10;
  currentPage = 1;
  pageStart: number = 1;
  pageEnd: number = 10;
  todayDataCount = 0;
  butDisabled: boolean=true
  selectedAccountNo = '';
  showingUserDetails = false;
  public featureAccessData: any = [];
  public companyData: any = [];
  public futureData: any = [];
  public remitterAccessData: any = [];
  public corpayAccess: any = [];
  public checkBookAccess: any = [];
  public customFeatureAccessData: any = [];
  public accountNo: any;
  isDesc: boolean = false;
  column: string = 'id';
  direction: number;
  term: string;
  remitterList: any = []
  paymentTypedata: any = [];
  filterTypeData: any = [];
  filterValueData: any = [];
  submitted = false;
  pageHeading: any = ""
  constructor(private spinner: NgxSpinnerService, private activeRouter: ActivatedRoute, private cryptoService: CryptoService, private _location: Location, private toastr: ToastrService, private router: Router, private adminService: AdminService, private formBuilder: FormBuilder, private crptoService: CryptoService) { }

  ngOnInit(): void {
    this.pageHeading = sessionStorage.getItem('pageHeading');
    if (!this.pageHeading) {
      this.pageHeading = 'Processor Onboard Request';
    }
    if (localStorage.getItem('currentUser')) {
      let userDetails: any = this.cryptoService.decryptObj(localStorage.getItem('currentUser'));
      this.accountNo = userDetails.accountNo;
    }

    this.getFeatureAcces()
    this.userForm = this.formBuilder.group({
    
      searchText: [''],
      remitterType: [''],
      filterType: [''],
      filterValue: [0],
      pagination: {
        itemsPerPage: [this.itemsPerPage],
        currentPage: [this.currentPage],
      }
    })
    this.paginationForm = this.formBuilder.group({
      paginationValue: [10],

    });
    this.remitterTypeUpdateForm = this.formBuilder.group({

      accountNo: [''],
      remitterTypeID: [''],
   
    })
    this.usdRemittanceForm = this.formBuilder.group({

      accountNo: [''],
      merchantBankID: [''],

    })
    this.usdTransferBankForm = this.formBuilder.group({

      accountNo: [''],
      merchantBankID: [''],

    })
    this.beneTransferUpdateForm = this.formBuilder.group({

      accountNo: [''],
      merchantBankID: [''],

    })
    this.searchUser()
    this.getFilterType();
    this.getPaymentType()
    this.getFilterValue()
  }
  changePage(val: any) {
    this.pageStart = ((val - 1) * this.itemsPerPage) + 1
    this.pageEnd = (this.pageStart - 1 + this.itemsPerPage) <= this.todayDataCount ? (this.pageStart - 1 + this.itemsPerPage) : this.todayDataCount
    this.currentPage = val;
    this.searchUser();
  }
  sort(property: any) {
    
    this.isDesc = !this.isDesc; //change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  }
  setPageNumber(no: any) {
    this.currentPage = 1
    this.paginationForm.patchValue({
      paginationValue: no.target.value
    })
    if (no.target.value) {
      this.itemsPerPage = parseInt(no.target.value);
      
      this.pageStart = ((this.currentPage - 1) * this.itemsPerPage) + 1
      this.pageEnd = (this.pageStart - 1 + this.itemsPerPage) <= this.todayDataCount ? (this.pageStart - 1 + this.itemsPerPage) : this.todayDataCount
      
      this.searchUser()
    }
  }
  selectEvent(val: any) {
    
  }
  onChange(e:any) {
    this.butDisabled=false
  }
 
  getFilterUser() {
    this.spinner.show()
    this.currentPage = 1
    this.pageStart = 1

    this.userForm.patchValue({
      pagination: {
        itemsPerPage: this.itemsPerPage,
        currentPage: this.currentPage,
      }
    })
    this.adminService.searchRemitterrequest(this.userForm.value).subscribe(data => {
      if (data.hasErrors) {
        return;
      }
      this.remitterList = data.result.records;
      this.todayDataCount = data.result.recordsCount.filteredCount
      this.spinner.hide()
      if (this.todayDataCount < 10) {
        this.pageEnd = this.todayDataCount
      }
      else {
        this.pageEnd = (this.pageStart - 1 + this.itemsPerPage) <= this.todayDataCount ? (this.pageStart - 1 + this.itemsPerPage) : this.todayDataCount
      }

    }, (err) => {
      this.spinner.hide()

    })
    
  }
  searchUser() {
    this.spinner.show()
      this.userForm.patchValue({
        pagination: {
          itemsPerPage: this.itemsPerPage,
          currentPage: this.currentPage,
        }
      })
    this.adminService.searchRemitterrequest(this.userForm.value).subscribe(data => {
        if (data.hasErrors) {
          return;
        }
      this.remitterList = data.result.records;
      this.todayDataCount = data.result.recordsCount.filteredCount
      this.spinner.hide()
      if (this.todayDataCount < 10) {
        this.pageEnd = this.todayDataCount
      }
      else {
        this.pageEnd = (this.pageStart - 1 + this.itemsPerPage) <= this.todayDataCount ? (this.pageStart - 1 + this.itemsPerPage) : this.todayDataCount
      }
   
    }, (err) => {
      this.spinner.hide()

    })

    
  }
 
  get f() { return this.remitterTypeUpdateForm.controls; }
  editRemitterType(accountNo: string, remitterTypeID: string, access: any) {
    if (access == false) {
      this.toastr.warning("You don't have access")
    }
    if (access == true) {
      this.remitterTypeUpdateForm.patchValue({
        accountNo,
        remitterTypeID
      })

      $('#exampleModal').modal('show');
    }
    
  }
  updateRemitterType() {
    if (this.remitterTypeUpdateForm.invalid) {
      this.toastr.error('Enter valid payment type', 'Error!');
      this.submitted = true;
      return;
    }
    this.spinner.show()
    this.submitted = false;
    this.adminService.updateRemiterPaymentTpe(this.remitterTypeUpdateForm.value).subscribe(data => {
      if (data.hasErrors) {
        return;
      }
      this.toastr.success('Payment type updated', 'Success!');
      this.spinner.hide()
      $('#exampleModal').modal('hide');
      this.searchUser()
    }, (err) => {
      this.spinner.hide()
      $('#exampleModal').modal('hide');
    })
  }
  hideUpdateRemiterForm() {
    $('#exampleModal').modal('hide');
  }
  get u() { return this.usdRemittanceForm.controls; }
  editUsdRemittance(accountNo: string, merchantBankID: string, access: any) {
    if (access == false) {
      this.toastr.warning("You don't have access")
    }
    if (access == true) {
      this.usdRemittanceForm.patchValue({
        accountNo,
        merchantBankID
      })

      $('#exampleModal1').modal('show');
    }
    
  }
  updateUsdRemittance() {
    if (this.usdRemittanceForm.invalid) {
      this.toastr.error('Enter valid usd remittance type', 'Error!');
      this.submitted = true;
      return;
    }
    this.submitted = false;
    this.spinner.show()
    this.adminService.updateUSDRemittance(this.usdRemittanceForm.value).subscribe(data => {
      if (data.hasErrors) {
        return;
      }
      this.toastr.success('USD Remittance type updated', 'Success!');
      this.spinner.hide()
      $('#exampleModal1').modal('hide');
      this.searchUser()
    })
  }
  hideUSDresistance() {
    $('#exampleModal1').modal('hide');
  }
  get j() { return this.usdTransferBankForm.controls; }
  editUsdTransferBank(accountNo: string, merchantBankID: string, access: any) {
    if (access == false) {
      this.toastr.warning("You don't have access")
    }
    if (access == true) {
      this.usdTransferBankForm.patchValue({
        accountNo,
        merchantBankID
      })

      $('#exampleModal2').modal('show');
    }
   
  }
  updateUsdTransferBank() {
    if (this.usdTransferBankForm.invalid) {
      this.toastr.error('Enter valid USD remitter transfer banke', 'Error!');
      this.submitted = true;
      return;
    }
    this.submitted = false;
    this.spinner.show()
    this.adminService.updateUSDTransferbank(this.usdTransferBankForm.value).subscribe(data => {
      if (data.hasErrors) {
        return;
      }
      this.toastr.success('USD remitter transfer bank updated', 'Success!');
      this.spinner.hide()
      $('#exampleModal2').modal('hide');
      this.searchUser()
    }, (err) => {
      this.spinner.hide()
      $('#exampleModal2').modal('hide');
    })
  }
  hideUSdTransferBank() {
    $('#exampleModal2').modal('hide');
  }
  get k() { return this.beneTransferUpdateForm.controls; }
  editBeneBank(accountNo: string, merchantBankID: string, access: any) {
    if (access == false) {
      this.toastr.warning("You don't have access")
    }
    if (access == true) {
      this.beneTransferUpdateForm.patchValue({
        accountNo,
        merchantBankID
      })

      $('#exampleModal3').modal('show');
    }
   
  }
  updateBeneTransfer() {
    const requestObj = {
      accountNo: this.beneTransferUpdateForm.value.accountNo,
      merchantBankID: parseInt(this.beneTransferUpdateForm.value.merchantBankID)
    }
    if (this.beneTransferUpdateForm.invalid) {
      this.toastr.error('Enter valid bene transfer bank', 'Error!');
      this.submitted = true;
      return;
    }
    this.submitted = false;
    this.spinner.show()
    this.adminService.updatebeneTransferbank(requestObj).subscribe(data => {
      if (data.hasErrors) {
        return;
      }
      this.toastr.success('Bene transfer bank  updated', 'Success!');
      this.spinner.hide()
      $('#exampleModal3').modal('hide');
      this.searchUser()
    }, (err) => {
      this.spinner.hide()
      $('#exampleModal3').modal('hide');
    })
  }
  hidebeneTransfer() {
    $('#exampleModal3').modal('hide');
  }
  getPaymentType() {
    this.adminService.getPaymentType().subscribe(data => {
      if (data.hasErrors) {
        return;
      }
      this.paymentTypedata = data.result;
    })
  }
  getFilterType() {
    this.adminService.getFilterType().subscribe(data => {
      if (data.hasErrors) {
        return;
      }
      this.filterTypeData= data.result

    })
  }
  getFilterValue() {
    this.adminService.getFilterValue().subscribe(data => {
      if (data.hasErrors) {
        return;
      }
      this.filterValueData = data.result;
      
    })
  }
  goToLink(url: string, accountno: string, status: any, companyName: any, access: any) {
    if (access == false) {
      this.toastr.warning("You don't have access")
    }
    if (access == true) {
      if (status == 'C') {
        const request = {
          accountNo: accountno
        }
        this.adminService.verfiyConfiguration(request).subscribe(data => {
          if (data.hasErrors) {
            return;
          }
         
          if (data.result == 0) {
            this.toastr.error(companyName +' ' + "is not configured for checkbook",)
          }
          if (data.result != 0) {
            let path = '';
            path = '#' + url + this.crptoService.encryptURL(accountno);
            this.router.navigate([]).then(result => { window.open(path, '_self'); });
            localStorage.setItem('backRemitter', this.router.url);
          }


        })
      }
    }
   
   
      
   


  }
  goToLink1(url: string, accountno: string) {
    let path = '';
    path =  url + this.crptoService.encryptURL(accountno);
    localStorage.setItem('backRemitter', this.router.url);
    return path;
  }
  goToLink2(url: string, accountno: string, access: any,status:any) {
    if (access == false) {
      this.toastr.warning("You don't have access")
    }
    if (access == true) {
      let path = '';
      path = '#' + url + this.crptoService.encryptURL(accountno) + '/' + this.crptoService.encryptURL(status);
      this.router.navigate([]).then(result => { window.open(path, '_self'); });
      localStorage.setItem('backRemitter', this.router.url);
    }
  }
  goToLink3(url: string, accountno: string,companyname:any, access: any) {
    if (access == false) {
      this.toastr.warning("You don't have access")
    }
    if (access == true) {
      let path = '';
      path = '#' + url + this.crptoService.encryptURL(accountno) + '/' + this.crptoService.encryptURL(companyname);
      this.router.navigate([]).then(result => { window.open(path, '_self'); });
      localStorage.setItem('backRemitter', this.router.url);
    }




  }
  getFeatureAcces() {
    const requestObj = {
      accountNo: this.accountNo
    }
    this.adminService.getAdminFeatureAccess(requestObj).subscribe(data => {
      if (data.hasErrors) {
        return;
      }
      this.featureAccessData = data.result;
      for (var i of this.featureAccessData) {
        if (i.menuID == 3) {
          this.companyData.push(i)
          for (var i of this.companyData) {
            if (i.featureID == 114) {
              this.remitterAccessData = i;
            }
          }
        }
        else if (i.menuID == 0 && i.subMenuID == 0) {
          this.customFeatureAccessData.push(i)
          for (var i of this.customFeatureAccessData) {
            if (i.featureID == 92) {
              this.corpayAccess = i;
            }
            else if (i.featureID == 132) {
              this.checkBookAccess = i
            }
          }
        }

        else {
          this.futureData.push(i)
        }
      }
      if (this.remitterAccessData.isUpdate == false && this.remitterAccessData.isDelete == false && this.remitterAccessData.isInsert == false && this.remitterAccessData.isView == false) {
        this._location.back()
      }
      else {
        return
      }

    })


  }
  downloadReport() {
    this.spinner.show()
    this.userForm.patchValue({
      pagination: {
        itemsPerPage: this.itemsPerPage,
        currentPage: this.currentPage,
      }
    })
    this.adminService.downloadRemitterRequest(this.userForm.value).subscribe(data => {
      if (data.status === 204) {
        this.toastr.warning("No record available for download")
        this.spinner.hide()
      }
      if (data.status === 200) {

        let type = 'text/csv';
        const contentDisposition = data.headers.get('content-disposition') || 'Download.csv';
        const regex = /filename=(?<filename>[^,;]+);/g;
        const match = regex.exec(contentDisposition);
        let filename = match?.groups?.filename;

        if (!filename)
          filename = 'Download.csv';
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none;');
        this.spinner.hide()
        const blob = new Blob([data.body as BlobPart], { type: type });
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    }, (err) => {
      this.spinner.hide()
     
    })
  }
}
