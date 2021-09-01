import { AuthService } from "~/app/services/Auth/auth.service";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Component, OnInit } from "@angular/core";
import { Dialogs, Application } from "@nativescript/core";
import { Router } from "@angular/router";
import { EventData } from "@nativescript/core";
import { ChangePasswordComponent } from "./ChangePassword/ChangePassword.component";
import { DeleteAccountComponent } from "./DeleteAccount/DeleteAccount.component";
import { EditProfileComponent } from "./EditProfile/EditProfile.component";
import { ViewContainerRef } from "@angular/core";
import { ModalDialogService } from "@nativescript/angular";
import { firebase } from "@nativescript/firebase";
@Component({
  selector: "MyProfile",
  templateUrl: "./MyProfile.component.html",
  styleUrls: ["./MyProfile.component.css"]
})
export class MyProfileComponent implements OnInit {
  userData;

  constructor(
    private router: Router,
    private modal: ModalDialogService,
    private vcRef: ViewContainerRef,
    private auth: AuthService
  ) {}

  ngOnInit() {
    return firebase
      .getCurrentUser()
      .then(user => (this.userData = user))
      .catch(error => console.log("Trouble in paradise: " + error));
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }

  onChangePass() {
    let options = {
      context: {},
      fullscreen: false,
      viewContainerRef: this.vcRef
    };
    this.modal.showModal(ChangePasswordComponent, options).then(res => {
      console.log(res);
    });
  }

  onEdit() {
    let options = {
      context: {},
      fullscreen: false,
      viewContainerRef: this.vcRef
    };
    this.modal.showModal(EditProfileComponent, options).then(res => {
      console.log(res);
    });
  }

  onDel() {
    let options = {
      context: {},
      fullscreen: false,
      viewContainerRef: this.vcRef
    };
    this.modal.showModal(DeleteAccountComponent, options).then(res => {
      console.log(res);
    });
  }
}
