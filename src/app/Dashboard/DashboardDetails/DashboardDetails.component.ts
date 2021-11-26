import { CancelSubmissionComponent } from './Cancel-Submission/Cancel-Submission.component';
import { Application, EventData, View } from "@nativescript/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Component, NgZone, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { firebase, firestore ,firebaseFunctions} from "@nativescript/firebase";
import { storage } from "@nativescript/firebase/storage";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, HttpResponse } from "@nativescript/core";
import { ViewContainerRef } from "@angular/core";
import { ModalDialogService } from "@nativescript/angular";

import {
  Mediafilepicker,
  FilePickerOptions
} from "nativescript-mediafilepicker";
import { openUrl } from "@nativescript/core/utils";

@Component({
  selector: "DashboardDetails",
  templateUrl: "./DashboardDetails.component.html",
  styleUrls: ["./DashboardDetails.component.css"]
})
export class DashboardDetailsComponent implements OnInit {
  id;
  userData;
  userDetails;
  taskData;
  myFile = '';
  private _hostView: View;

  constructor(private route: ActivatedRoute,
    private zone:NgZone,
    private router: Router,
    private http: HttpClient,
    private vcRef: ViewContainerRef,
    private modal: ModalDialogService,
    ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
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
              const taskDocument = firestore.collection("tasks").doc(this.route.snapshot.paramMap.get('id'));

              // note that the options object is optional, but you can use it to specify the source of data ("server", "cache", "default").
              taskDocument.get({ source: "default" }).then(doc => {
                if (doc.exists) {
                  // this.taskData = doc.data();
                  doc.data().recipients.forEach(element => {
                    if(Object.values(element).includes(this.userData.uid)) { 
                      console.log(element)
                      console.log('it exists')
                      this.taskData = element;
                  }
                  });
                  console.log(`Document data: ${JSON.stringify(doc.data())}`);
                } else {
                  console.log("No such document!");
                }
              });
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

  onDel() {
    let options = {
      context: {},
      fullscreen: false,
      viewContainerRef: this.vcRef
    };
    this.modal.showModal(CancelSubmissionComponent, options).then(res => {
      console.log(res);
    });
  }

  // submitTask() {
  //   alert("Submit attachment of task");
  // }

  cancelSubmission() {
    // this.zone.run(() => {
    storage.deleteFile({
      // optional, can also be passed during init() as 'storageBucket' param so we can cache it
      // the full path of an existing file in your Firebase storage
      remoteFullPath: this.taskData.submissionLink
    }).then(
        function () {
          ("File deleted.");
        },
        function (error) {
          console.log("File deletion Error: " + error);
        }
    ).then(() => {
      let updatedTaskData = {
        createdAt: this.taskData.createdAt,
        startsAt: this.taskData.startsAt,                      
        deadline: this.taskData.deadline,                      
        description: this.taskData.description,
        displayName: this.taskData.displayName,
        email: this.taskData.email,
        section: this.taskData.section,
        pushToken: this.taskData.pushToken,
        status: 'Pending',
        submissionLink: '',
        taskId: this.taskData.taskId,
        title: this.taskData.title,
        uid: this.taskData.uid,
        uploadedBy: this.taskData.uploadedBy,
        term: this.taskData.term,
        attemptsLeft: this.taskData.attemptsLeft,
        deadlineLimit: this.taskData.deadlineLimit,
        submittedAt:'',
      }
  
      firestore.collection("tasks").doc(this.taskData.taskId)
      .update({                       
          recipients: firestore.FieldValue.arrayRemove(this.taskData)
      }).then(() => {
      firestore.collection("tasks").doc(this.taskData.taskId)
        .update({                       
          recipients: firestore.FieldValue.arrayUnion(updatedTaskData)
        })
      })   .then(() => {
        this.zone.run(() => {
  
        const taskDocument = firestore.collection("tasks").doc(this.route.snapshot.paramMap.get('id'));
        
        // note that the options object is optional, but you can use it to specify the source of data ("server", "cache", "default").
        taskDocument.get({ source: "default" }).then(doc => {
          if (doc.exists) {
            // this.taskData = doc.data();
            doc.data().recipients.forEach(element => {
              if(Object.values(element).includes(this.userData.uid)) { 
                console.log(element)
                console.log('it exists')
                this.taskData = element;
            }
            });
            console.log(`Document data: ${JSON.stringify(doc.data())}`);
          } else {
            console.log("No such document!");
          }
        });
      })
      })
    }).then(() => {
      alert('Your submission was canceled.')
    })
    .catch(() => {
      alert('There has been an issue with your action.')
    })
  // })
  }

  submitTask() {


    let options: FilePickerOptions = {
      android: {
        extensions: ['txt', 'pdf','jpg'],
        maxNumberFiles: 1
      }
    };

    let mediafilepicker = new Mediafilepicker();

    mediafilepicker.openFilePicker(options);

    mediafilepicker.on("getFiles", event => {
      // this.zone.run(() => {

      // });
        let results = event.object.get("results");
        // do your stuff here
        // any UI changes will be reflected
        if (results) {
          for (let i = 0; i < results.length; i++) {
            let result = results[i];
            console.log(result.file);
            this.myFile = result.file;
            // this.myFile = this.myFile.split(/(\\|\/)/g).pop()
            console.log(this.myFile);

            const path = `${this.taskData.taskId}-${this.taskData.title}/${this.myFile.split(/(\\|\/)/g).pop()}/`;
            console.log(path);
            var metadata = ({});
            
            storage.uploadFile({
              remoteFullPath: path,
              localFullPath: result.file,
              metadata
            }).then(() => {
              storage.getDownloadUrl({
                // optional, can also be passed during init() as 'storageBucket' param so we can cache it
                // the full path of an existing file in your Firebase storage
                remoteFullPath: path
              }).then((url) => {
                   let updatedTaskData = {
                      createdAt: this.taskData.createdAt,
                      deadline: this.taskData.deadline,                      
                      description: this.taskData.description,
                      displayName: this.taskData.displayName,
                      email: this.taskData.email,
                      section: this.taskData.section,
                      pushToken: this.taskData.pushToken,
                      status: 'For Approval',
                      submissionLink: url,
                      taskId: this.taskData.taskId,
                      title: this.taskData.title,
                      uid: this.taskData.uid,
                      uploadedBy: this.taskData.uploadedBy,
                      term: this.taskData.term,
                      attemptsLeft: this.taskData.attemptsLeft - 1,
                      deadlineLimit: this.taskData.deadlineLimit,
                      submittedAt: + new Date()
                    }
                      firestore.collection("tasks").doc(this.taskData.taskId)
                        .update({                       
                            recipients: firestore.FieldValue.arrayRemove(this.taskData)
                        }).then(() => {
                        firestore.collection("tasks").doc(this.taskData.taskId)
                          .update({                       
                            recipients: firestore.FieldValue.arrayUnion(updatedTaskData)
                          })
                        })
                        .then(() => {
                          alert('Your submission was received! Please wait for the admins to verify your submission.')
                        })
                        .then(() => {
                          this.zone.run(() => {
                            const taskDocument = firestore.collection("tasks").doc(this.route.snapshot.paramMap.get('id'));
                          
                            // note that the options object is optional, but you can use it to specify the source of data ("server", "cache", "default").
                            taskDocument.get({ source: "default" }).then(doc => {
                              if (doc.exists) {
                                // this.taskData = doc.data();
                                doc.data().recipients.forEach(element => {
                                  if(Object.values(element).includes(this.userData.uid)) { 
                                    console.log(element)
                                    console.log('it exists')
                                    this.taskData = element;
                                }
                                });
                                console.log(`Document data: ${JSON.stringify(doc.data())}`);
                              } else {
                                console.log("No such document!");
                              }
                            });
                          });

                          
                        })
                         
              } 
                  
              );
            }).catch((err) => {
              alert(err)
            })
          }
        }
      
    });

 

    mediafilepicker.on("error", function(res) {
      let msg = res.object.get("msg");
      console.log(msg);
    });

    mediafilepicker.on("cancel", function(res) {
      let msg = res.object.get("msg");
      console.log(msg);
    });
  }

  onTap(url){     
    openUrl(url);
  }
}
