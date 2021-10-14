import { AuthService } from './../services/Auth/auth.service';
import { ChangePasswordComponent } from './../MyProfile/ChangePassword/ChangePassword.component';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
	moduleId: module.id,
	selector: 'Forgot-Password',
	templateUrl: './Forgot-Password.component.html',
	styleUrls: ['./Forgot-Password.component.css']
})

export class ForgotPasswordComponent implements OnInit {
  loginForm!: any;
  _email = "";
  // emailError = "";

	constructor(
		private auth: AuthService,
		private router: Router,
    private fb: FormBuilder) { }

  // Validators.pattern('^[a-z0-9._%+-]+@[(ust.edu)]+\\.ph$')
	ngOnInit() {
    this.loginForm = this.fb.group({
      _email: ['',[Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[(ust.edu)]+\\.ph$') ]]
    })
  }

  public tapSubmit() {
    console.log (this._email);
	this.auth.changePassword(this.loginForm.controls['_email'].value,
  )
  }
  public tapBack(){
    this.router.navigate(["/login"])
  }
}
