import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AuthService } from "../services/Auth/auth.service";
import { firebase } from "@nativescript/firebase";
import { Router } from "@angular/router";
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: "Login",
  templateUrl: "./Login.component.html",
  styleUrls: ["./Login.component.css"]
})
export class LoginComponent implements OnInit {
  //userData;
  //WAG MUNA TANGGALIN MGA NAKA COMMENT
  loginForm!: any;

  @ViewChild("passwordField") passwordField: ElementRef;
  _email = "";
  _password = "";



  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder) {}

  // Validators.pattern('^[a-z0-9._%+-]+@[(ust.edu)]+\\.ph$')
  ngOnInit() {
    this.loginForm = this.fb.group({
      _email: ['',[Validators.required,Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[(ust.edu)]+\\.ph$')]],
      _password: ['',Validators.required],
    });
  }
  /*
	register() {
		this.auth.createAccount('juancarlos.aquino.iics@ust.gmail.com','test12345','Miguel UST','123456');
	}

	login() {
		this.auth.test()
	}
	*/

  public tapLogin() {
    console.log(this._email, this._password);
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.controls['_email'].value,this.loginForm.controls['_password'].value)
    }
    else if (this.loginForm.invalid) {
      this.loginForm.controls['_email'].markAsTouched();
      this.loginForm.controls['_password'].markAsTouched();
      alert('Please fill up all required fields properly');
      }
  }

  public tapforgotPass() {
    this.router.navigate(["/forgot-password"]);
  }
  public tapcreateAcc() {
    this.router.navigate(["/register"]);
  }

  isToggled=false;
  toggleShow() {
    this.passwordField.nativeElement.secure = !this.passwordField.nativeElement
      .secure;
    this.isToggled = !this.isToggled;
  }
}
