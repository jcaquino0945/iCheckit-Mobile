import { ChangePasswordComponent } from './MyProfile/ChangePassword/ChangePassword.component';
import { EditProfileComponent } from './MyProfile/EditProfile/EditProfile.component';
import { DeleteAccountComponent } from './MyProfile/DeleteAccount/DeleteAccount.component';
import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'
import { LoginComponent } from './Login/Login.component'
import { RegisterComponent } from './Register/Register.component';
import { ForgotPasswordComponent } from './Forgot-Password/Forgot-Password.component';
import { DashboardComponent } from './Dashboard/Dashboard.component';
import { MyProfileComponent } from './MyProfile/MyProfile.component';
import { ConfirmNewPasswordComponent } from './confirm-new-password/confirm-new-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'confirm-new-password', component: ConfirmNewPasswordComponent},
  { path: 'delete-acc', component: DeleteAccountComponent},
  { path: 'edit-profile', component: EditProfileComponent},
  { path: 'change-pass', component: ChangePasswordComponent},
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
