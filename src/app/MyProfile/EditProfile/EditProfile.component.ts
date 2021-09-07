import { Application } from "@nativescript/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { AuthService } from "~/app/services/Auth/auth.service";
import { firebase, firestore } from "@nativescript/firebase";
import { ConfirmNewPasswordComponent } from "~/app/confirm-new-password/confirm-new-password.component";
@Component({
  selector: "EditProfile",
  templateUrl: "./EditProfile.component.html",
  styleUrls: ["./EditProfile.component.css"]
})
export class EditProfileComponent implements OnInit {
  _fullName = "";
  _number = "";
  userData;
  userDetails;

  fullnameError = "";
  contactNumError = "";

  constructor(
    private modalDialogParams: ModalDialogParams,
    private auth: AuthService
  ) {}

  ngOnInit() {
     firebase
      .getCurrentUser()
      .then(user => {
        (this.userData = user),
          firestore
            .collection("users")
            .doc(this.userData.uid)
            .get().then(doc => {
              if (doc.exists) {
                console.log(`Document data: ${JSON.stringify(doc.data())}`);
                this.userDetails = doc.data();
              } else {
                console.log("No such document!");
              }
            });

      })
      .catch(error => console.log("Trouble in paradise: " + error));
  }


  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }

  onUpdate() {
    // console.log (
    //   this._fullName,
    //   this._number
    // );

    // if (this._fullName.length > 0)
    // this.fullnameError = "";
    if (this._fullName.length == 0)
    this.fullnameError = "Full Name field is required";

    if (this._number.length == 0)
    this.contactNumError = "Contact Number field is required"
    // if (this._number.length > 0)
    // this.contactNumError = ""


    this.auth.editProfile(this._fullName, this._number, this.userData.uid);
    this.modalDialogParams.closeCallback();
  }

}
