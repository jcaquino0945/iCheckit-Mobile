import { VerificationTaskComponent } from './Dashboard/DashboardDetails/Verification-Task/Verification-Task.component';
import { ContactUsComponent } from './Contact-Us/Contact-Us.component';
import { FaqsComponent } from './Faqs/Faqs.component';
import { DashboardDetailsComponent } from './Dashboard/DashboardDetails/DashboardDetails.component';
import { DeleteAccountComponent } from './MyProfile/DeleteAccount/DeleteAccount.component';
import { ChangePasswordComponent } from './MyProfile/ChangePassword/ChangePassword.component';
import { EditProfileComponent } from './MyProfile/EditProfile/EditProfile.component';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { ModalDialogService, NativeScriptModule } from '@nativescript/angular'
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Login/Login.component';
import { RegisterComponent } from './Register/Register.component';
import { ForgotPasswordComponent } from './Forgot-Password/Forgot-Password.component';
import { DashboardComponent } from './Dashboard/Dashboard.component';
import { MyProfileComponent } from './MyProfile/MyProfile.component';
import { ConfirmNewPasswordComponent } from './confirm-new-password/confirm-new-password.component'
//new Imports for Data Binding
import { NativeScriptFormsModule } from '@nativescript/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CancelSubmissionComponent } from './Dashboard/DashboardDetails/Cancel-Submission/Cancel-Submission.component';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    NativeScriptModule,
    NativeScriptUISideDrawerModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    ConfirmNewPasswordComponent,
    MyProfileComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    DeleteAccountComponent,
    DashboardDetailsComponent,
    FaqsComponent,
    ContactUsComponent,
    VerificationTaskComponent,
    CancelSubmissionComponent
  ],
  providers: [
    ModalDialogService,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
