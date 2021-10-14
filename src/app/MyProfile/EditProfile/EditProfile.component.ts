import { Application } from "@nativescript/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { AuthService } from "~/app/services/Auth/auth.service";
import { firebase, firestore } from "@nativescript/firebase";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "EditProfile",
  templateUrl: "./EditProfile.component.html",
  styleUrls: ["./EditProfile.component.css"]
})
export class EditProfileComponent implements OnInit {
  editForm!: any;
  _fullName = "";
  _number = "";
  userData;
  userDetails;


  constructor(
    private modalDialogParams: ModalDialogParams,
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.editForm = this.fb.group({
      displayName: ['',Validators.required],
      contactNumber: ['']
    });


    firebase
      .getCurrentUser()
      .then(user => {
        (this.userData = user),
          firestore
            .collection("users")
            .doc(this.userData.uid)
            .get()
            .then(doc => {
              if (doc.exists) {
                console.log(`Document data: ${JSON.stringify(doc.data())}`);
                this.userDetails = doc.data();
                this.editForm.controls.displayName.setValue(this.userDetails.displayName);
                this.editForm.controls.contactNumber.setValue(this.userDetails.contactNumber);
              } else {
                console.log("No such document!");
              }
            });
      })
      .catch(error => console.log("Trouble in paradise: " + error));

    // this.editForm = new FormGroup({
    //   _fullName: new FormControl(this.userDetails.displayName),
    //   _number: new FormControl(this.userDetails.contactNumber)
    // });

    // this.editForm = new FormGroup({
    //   _fullName: new FormControl(
    //     this.auth.getName(this.userData.uid, this._fullName)
    //   ),
    //   _number: new FormControl("09123789172")
    // });

    // this.editForm = new FormGroup({
    //   _fullName: new FormControl(this.auth.getName(this.userData.uid, this._fullName)),
    //   _number: new FormControl("09123789172")
    // });
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }
  public return() {
    this.modalDialogParams.closeCallback();
  }

  public editProfile() {
    this.auth.editProfile(this.editForm.controls['displayName'].value, this.editForm.controls['contactNumber'].value, this.userData.uid);
    this.modalDialogParams.closeCallback();
    alert("Profile Updated");
  }
}
