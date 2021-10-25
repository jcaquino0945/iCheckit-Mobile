import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "../services/Auth/auth.service";
import { firebase } from "@nativescript/firebase";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { Validators } from "@angular/forms";

@Component({
  moduleId: module.id,
  selector: "Register",
  templateUrl: "./Register.component.html",
  styleUrls: ["./Register.component.css"]
})
export class RegisterComponent implements OnInit {
  loginForm!: any;
  @ViewChild("passwordField") passwordField: ElementRef;
  @ViewChild("confirmPasswordField") confirmPasswordField: ElementRef;

  fullnameError = "";
  emailError = "";
  contactnumError = "";
  passwordError = "";
  confirmPasswordError = "";

  _fullname = "";
  _email = "";
  _contactNum = "";
  _password = "";
  _confirmPassword = "";

  public constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  // Validators.pattern('^[a-z0-9._%+-]+@[(ust.edu)]+\\.ph$')
  ngOnInit() {
    this.loginForm = this.fb.group({
      _email: ["", [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[(ust.edu)]+\\.ph$')]],
      _fullName: ["", Validators.required],
      _password: ["", Validators.required],
      _confirmPassword: ["", Validators.required],
      _contactNumber: ["", Validators.required]
    });
  }

  public tapRegister() {

    this.auth.createAccount(
      this.loginForm.controls['_email'].value,
      this.loginForm.controls['_password'].value,
      this.loginForm.controls['_fullName'].value,
      this.loginForm.controls['_contactNumber'].value,

    );
  }
  public tapBack() {
    this.router.navigate(["/login"]);
  }


  isToggled=false;
  isConfirmToggled=false;
  toggleShow() {
    this.passwordField.nativeElement.secure = !this.passwordField.nativeElement
      .secure;
    this.isToggled = !this.isToggled;
  }

  confirmToggleShow() {
    this.confirmPasswordField.nativeElement.secure = !this.confirmPasswordField.nativeElement
      .secure;
    this.isConfirmToggled = !this.isConfirmToggled;
  }
}
