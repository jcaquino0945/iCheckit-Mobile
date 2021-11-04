import { Router } from "@angular/router";
import { Component, OnInit, NgZone } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Application } from "@nativescript/core";
import { RouterLink } from "@angular/router";
import { firebase, firestore } from "@nativescript/firebase";
@Component({
  moduleId: module.id,
  selector: "Dashboard",
  templateUrl: "./Dashboard.component.html",
  styleUrls: ["./Dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  dashboardTitle;
  dateToday = Date.now();
  constructor(private router: Router, private zone: NgZone) {}
  userData;
  userDetails;
  section;
  myTasks = [];
  myPendingTasks = [];
  myLateTasks = [];
  myForApprovalTasks = [];
  myAccomplishedTasks = [];
  verificationTask;
  ngOnInit() {
    this.section = '';
    this.dashboardTitle = "My Tasks";
    // this.myTasks.splice(0, this.myTasks.length)
    // this.myAccomplishedTasks.splice(0, this.myAccomplishedTasks.length)
    // this.myForApprovalTasks.splice(0, this.myForApprovalTasks.length)
    // this.myLateTasks.splice(0, this.myLateTasks.length)
    // this.myPendingTasks.splice(0, this.myPendingTasks.length)
    const citiesCollection = firestore.collection("tasks");
    const verifyTask = firestore
      .collection("verificationTasks")
      .doc("60ThDEIPXLwWD8aHYs8E");

    verifyTask.get({ source: "default" }).then(doc => {
      if (doc.exists) {
        console.log(`Document data: ${JSON.stringify(doc.data())}`);
        this.verificationTask = doc.data();
      } else {
        console.log("No such document!");
      }
    });
    

        this.zone.run(() => {
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
                      //bind doc.data() to userDetails to be used in frontend
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
                      )

                      //prompting the query
                      query.get({ source: "default" }).then(querySnapshot => {
                        this.myTasks = [];
                        this.myAccomplishedTasks = [];
                        this.myForApprovalTasks = [];
                        this.myLateTasks = [];
                        this.myPendingTasks = [];
                        querySnapshot.forEach(doc => {
                          doc.data().recipients.forEach(element => {
                            if (
                              Object.values(element).includes(this.userData.uid)
                            ) {
                              // console.log(element)
                              // console.log('it exists')
                              this.myTasks.push(element);
                            }
                            if (
                              Object.values(element).includes(
                                this.userData.uid
                              ) &&
                              Object.values(element).includes("Pending")
                            ) {
                              // console.log(element)
                              // console.log('it exists')
                              this.myPendingTasks.push(element);
                            }
                            if (
                              Object.values(element).includes(
                                this.userData.uid
                              ) &&
                              Object.values(element).includes("Late")
                            ) {
                              // console.log(element)
                              // console.log('it exists')
                              this.myLateTasks.push(element);
                            }
                            if (
                              Object.values(element).includes(
                                this.userData.uid
                              ) &&
                              Object.values(element).includes("For Approval")
                            ) {
                              // console.log(element)
                              // console.log('it exists')
                              this.myForApprovalTasks.push(element);
                            }
                            if (
                              Object.values(element).includes(
                                this.userData.uid
                              ) &&
                              Object.values(element).includes("Accomplished")
                            ) {
                              // console.log(element)
                              // console.log('it exists')
                              this.myAccomplishedTasks.push(element);
                            }
                          });
                        });
                      });
                    } else {
                      console.log("No such document!");
                    }
                  });
            })
            .catch(error => console.log("Trouble in paradise: " + error));
        });
    
   
    // then after a while, to detach the listener:
    // unsubscribe();
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }

  onDetails(taskId) {
    this.router.navigate(["/dashboard-details/", taskId]);
  }

  navigate() {
    this.router.navigate(["/verify"]);
  }

  onSelectedIndexchanged($event) {
    console.log($event);
    if ($event == 0) {
      this.dashboardTitle = "My Tasks";
      this.zone.run(() => {
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
                    //bind doc.data() to userDetails to be used in frontend
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
                    )

                    //prompting the query
                    query.get({ source: "default" }).then(querySnapshot => {
                      this.myTasks = [];
                      this.myAccomplishedTasks = [];
                      this.myForApprovalTasks = [];
                      this.myLateTasks = [];
                      this.myPendingTasks = [];
                      querySnapshot.forEach(doc => {
                        doc.data().recipients.forEach(element => {
                          if (
                            Object.values(element).includes(this.userData.uid)
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("Pending")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myPendingTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("Late")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myLateTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("For Approval")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myForApprovalTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("Accomplished")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myAccomplishedTasks.push(element);
                          }
                        });
                      });
                    });
                  } else {
                    console.log("No such document!");
                  }
                });
          })
          .catch(error => console.log("Trouble in paradise: " + error));
      });
    } else if ($event == 1) {
      this.dashboardTitle = "My Pending Tasks";
      this.zone.run(() => {
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
                    //bind doc.data() to userDetails to be used in frontend
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
                    )

                    //prompting the query
                    query.get({ source: "default" }).then(querySnapshot => {
                      this.myTasks = [];
                      this.myAccomplishedTasks = [];
                      this.myForApprovalTasks = [];
                      this.myLateTasks = [];
                      this.myPendingTasks = [];
                      querySnapshot.forEach(doc => {
                        doc.data().recipients.forEach(element => {
                          if (
                            Object.values(element).includes(this.userData.uid)
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("Pending")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myPendingTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("Late")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myLateTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("For Approval")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myForApprovalTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("Accomplished")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myAccomplishedTasks.push(element);
                          }
                        });
                      });
                    });
                  } else {
                    console.log("No such document!");
                  }
                });
          })
          .catch(error => console.log("Trouble in paradise: " + error));
      });
    } else if ($event == 2) {
      this.dashboardTitle = "My Late and Closed Tasks";
      this.zone.run(() => {
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
                    //bind doc.data() to userDetails to be used in frontend
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
                    )

                    //prompting the query
                    query.get({ source: "default" }).then(querySnapshot => {
                      this.myTasks = [];
                      this.myAccomplishedTasks = [];
                      this.myForApprovalTasks = [];
                      this.myLateTasks = [];
                      this.myPendingTasks = [];
                      querySnapshot.forEach(doc => {
                        doc.data().recipients.forEach(element => {
                          if (
                            Object.values(element).includes(this.userData.uid)
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("Pending")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myPendingTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("Late")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myLateTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("For Approval")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myForApprovalTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("Accomplished")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myAccomplishedTasks.push(element);
                          }
                        });
                      });
                    });
                  } else {
                    console.log("No such document!");
                  }
                });
          })
          .catch(error => console.log("Trouble in paradise: " + error));
      });
    } else if ($event == 3) {
      this.dashboardTitle = "My For Approval Tasks";
      this.zone.run(() => {
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
                    //bind doc.data() to userDetails to be used in frontend
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
                    )

                    //prompting the query
                    query.get({ source: "default" }).then(querySnapshot => {
                      this.myTasks = [];
                      this.myAccomplishedTasks = [];
                      this.myForApprovalTasks = [];
                      this.myLateTasks = [];
                      this.myPendingTasks = [];
                      querySnapshot.forEach(doc => {
                        doc.data().recipients.forEach(element => {
                          if (
                            Object.values(element).includes(this.userData.uid)
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("Pending")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myPendingTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("Late")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myLateTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("For Approval")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myForApprovalTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("Accomplished")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myAccomplishedTasks.push(element);
                          }
                        });
                      });
                    });
                  } else {
                    console.log("No such document!");
                  }
                });
          })
          .catch(error => console.log("Trouble in paradise: " + error));
      });
    } else if ($event == 4) {
      this.dashboardTitle = "My Accomplished Tasks";
      this.zone.run(() => {
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
                    //bind doc.data() to userDetails to be used in frontend
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
                    )

                    //prompting the query
                    query.get({ source: "default" }).then(querySnapshot => {
                      this.myTasks = [];
                      this.myAccomplishedTasks = [];
                      this.myForApprovalTasks = [];
                      this.myLateTasks = [];
                      this.myPendingTasks = [];
                      querySnapshot.forEach(doc => {
                        doc.data().recipients.forEach(element => {
                          if (
                            Object.values(element).includes(this.userData.uid)
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("Pending")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myPendingTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("Late")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myLateTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("For Approval")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myForApprovalTasks.push(element);
                          }
                          if (
                            Object.values(element).includes(
                              this.userData.uid
                            ) &&
                            Object.values(element).includes("Accomplished")
                          ) {
                            // console.log(element)
                            // console.log('it exists')
                            this.myAccomplishedTasks.push(element);
                          }
                        });
                      });
                    });
                  } else {
                    console.log("No such document!");
                  }
                });
          })
          .catch(error => console.log("Trouble in paradise: " + error));
      });
    }
  }
}
