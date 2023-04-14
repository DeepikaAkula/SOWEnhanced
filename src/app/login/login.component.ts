import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  submitted: boolean = false
  userData: any;
  resultloader: boolean = false;
  errorMessage: string;
  showError: boolean = false;

  constructor(private service: LoginService, private router: Router, private common: CommonService) { }

  ngOnInit(): void {

  }

  loginForm = new FormGroup({
    loginName: new FormControl('', [Validators.required]),
    loginPassword: new FormControl('', [Validators.required]),
  })

 

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      alert("Invalid Credentials")
      return;
    } else {
      this.checkUserisValid();
      
    }
  }
  
  get f() { return this.loginForm.controls; }
  
 
  async checkUserisValid() {
    if(this.loginForm.valid)
    {
    let formValue = this.loginForm.value;
    let httpParams = new HttpParams().append("loginName", formValue.loginName).append("loginPassword", formValue.loginPassword);
    sessionStorage.setItem("loginName", formValue.loginName);
    sessionStorage.setItem("loginPassword", formValue.loginPassword);
   
    this.resultloader = true; 
    
    this.service.GetUserData(httpParams).subscribe({
      next: (res) => {
        if (res.Status == 1) {
          this.resultloader == false; 
          this.userData = res;
          if (this.userData.PermissionName.toLowerCase() == 'edit') {
            sessionStorage.setItem('author', 'true');
          }
          sessionStorage.setItem('userData', JSON.stringify(this.userData));
          this.loginForm.reset(); 
          this.router.navigate(['/dashboard']);
        }
       
      },
      error: (err) => {
        console.log(err);
        this.resultloader = true; 
        if (err.status === 0) {
         
          this.router.navigate(['/server-down']);
         this.showError = true;
         
        } else {
          this.errorMessage = "Username or Password is Incorrect";
        }
      }
    });
  }
}
  
}
