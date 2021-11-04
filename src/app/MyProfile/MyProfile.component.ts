import { AuthService } from "~/app/services/Auth/auth.service";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Component, OnInit, NgZone} from "@angular/core";
import { Dialogs, Application } from "@nativescript/core";
import { Router } from "@angular/router";
import { EventData } from "@nativescript/core";
import { ChangePasswordComponent } from "./ChangePassword/ChangePassword.component";
import { DeleteAccountComponent } from "./DeleteAccount/DeleteAccount.component";
import { EditProfileComponent } from "./EditProfile/EditProfile.component";
import { ViewContainerRef } from "@angular/core";
import { ModalDialogService } from "@nativescript/angular";
import { firebase, firestore } from "@nativescript/firebase";
@Component({
  selector: "MyProfile",
  templateUrl: "./MyProfile.component.html",
  styleUrls: ["./MyProfile.component.css"]
})
export class MyProfileComponent implements OnInit {
  userData;
  userDetails;
  section;
  myTasks = [];
  myPendingTasks = [];
  myLateTasks = [];
  myForApprovalTasks = [];
  myAccomplishedTasks = [];
  
  constructor(
    private router: Router,
    private modal: ModalDialogService,
    private vcRef: ViewContainerRef,
    private auth: AuthService,
    private zone:NgZone,
  ) {}

  ngOnInit() {
    this.section = '';
    const citiesCollection = firestore.collection("tasks");
    
          this.zone.run(() => {
              firebase
              .getCurrentUser()
              .then(user => {
                (this.userData = user),
                  firestore
                    .collection("users")
                    .doc(user.uid)
                    .get()
                    .then(doc => {
                      if (doc.exists) {
                        this.userDetails = doc.data();
                        this.section = doc.data().section;
                        // this.myAccomplishedTasks = [];
                        // this.myForApprovalTasks = [];
                        // this.myLateTasks = [];
                        // this.myPendingTasks = [];
                        
                        //display data in console
                        // console.log(`Document data: ${JSON.stringify(doc.data())}`);
                        // console.log(doc.data().section);
                      
                        //reference to collection "tasks"            
                        const citiesCollection = firestore.collection("tasks");
    
                        //query for all tasks documents that contains the user's section
                        const query = citiesCollection.where(
                          "scope",
                          "array-contains",
                          doc.data().section
                        );

                        //prompting the query
                        query.get({ source: "server" }).then(querySnapshot => {
                          this.myTasks = [];
                          this.myAccomplishedTasks = [];
                          this.myForApprovalTasks = [];
                          this.myLateTasks = [];
                          this.myPendingTasks = [];
                          querySnapshot.forEach(doc => {
                            doc.data().recipients.forEach(element => {
                              if(Object.values(element).includes(this.userData.uid)) { 
                                // console.log(element)
                                // console.log('it exists')
                                this.myTasks.push(element);
                              }
                              if(Object.values(element).includes(this.userData.uid) && Object.values(element).includes('Pending')) { 
                                // console.log(element)
                                // console.log('it exists')
                                this.myPendingTasks.push(element);
                              }
                              if(Object.values(element).includes(this.userData.uid) && Object.values(element).includes('Late')) { 
                                // console.log(element)
                                // console.log('it exists')
                                this.myLateTasks.push(element);
                              }
                              if(Object.values(element).includes(this.userData.uid) && Object.values(element).includes('For Approval')) { 
                                // console.log(element)
                                // console.log('it exists')
                                this.myForApprovalTasks.push(element);
                              }
                              if(Object.values(element).includes(this.userData.uid) && Object.values(element).includes('Accomplished')) { 
                                // console.log(element)
                                // console.log('it exists')
                                this.myAccomplishedTasks.push(element);
                              }
                            });
                          });
                        });
                        //bind doc.data() to userDetails to be used in frontend
                      } else {
                        console.log("No such document!");
                      }
                    });
              })
              .catch(error => console.log("Trouble in paradise: " + error));
            })
           

    const userCollection = firestore.collection("users");

    userCollection.onSnapshot((snapshot: firestore.QuerySnapshot) => {
      snapshot.forEach(() => {      
          this.zone.run(() => {
            firebase
            .getCurrentUser()
            .then(user => {
              (this.userData = user),
                firestore
                  .collection("users")
                  .doc(user.uid)
                  .get().then(doc => {
                    if (doc.exists) {
                      this.section = doc.data().section;
                      console.log(`Document data: ${JSON.stringify(doc.data())}`);
                      this.userDetails = doc.data();
                    } else {
                      console.log("No such document!");
                    }
                  });
            })
            .catch(error => console.log("Trouble in paradise: " + error));
          })
      })
    })
      
    
      
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
