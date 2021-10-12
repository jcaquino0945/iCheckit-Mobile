import { Application, EventData, View } from "@nativescript/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Component, NgZone, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { firebase, firestore ,firebaseFunctions} from "@nativescript/firebase";
import { storage } from "@nativescript/firebase/storage";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, HttpResponse } from "@nativescript/core";

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
              taskDocument.get({ source: "server" }).then(doc => {
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

  // submitTask() {
  //   alert("Submit attachment of task");
  // }

  cancelSubmission() {
    this.zone.run(() => {
    storage.deleteFile({
      // optional, can also be passed during init() as 'storageBucket' param so we can cache it
      // the full path of an existing file in your Firebase storage
      remoteFullPath: this.taskData.submissionLink
    }).then(
        function () {
          console.log("File deleted.");
        },
        function (error) {
          console.log("File deletion Error: " + error);
        }
    ).then(() => {
      let updatedTaskData = {
        createdAt: this.taskData.createdAt,
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
        attemptsLeft: this.taskData.attemptsLeft + 1,
        deadlineLimit: this.taskData.deadlineLimit
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
    }).then(() => {
      alert('Your submission was canceled.')
    })
    .then(() => {

      const taskDocument = firestore.collection("tasks").doc(this.route.snapshot.paramMap.get('id'));
      
      // note that the options object is optional, but you can use it to specify the source of data ("server", "cache", "default").
      taskDocument.get({ source: "server" }).then(doc => {
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
    .catch(() => {
      alert('There has been an issue with your action.')
    })
  })
  }

  submitTask() {
    let extensions = [];

    extensions = ["png", "pdf", "jpg"];

    let options: FilePickerOptions = {
      android: {
        extensions: extensions,
        maxNumberFiles: 1
      },
      ios: {
        extensions: extensions,
        multipleSelection: true,
        hostView: this._hostView
      }
    };

    let mediafilepicker = new Mediafilepicker();

    mediafilepicker.openFilePicker(options);

    mediafilepicker.on("getFiles", event => {
      this.zone.run(() => {
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

            const path = `${this.taskData.uid}/${this.myFile.split(/(\\|\/)/g).pop()}/`;
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
                      deadlineLimit: this.taskData.deadlineLimit
                    }



              

                    // Http.request({
                    //   url: "https://us-central1-icheckit-6a8bb.cloudfunctions.net/sendEmail",
                    //   method: "POST",
                    //   headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                    //   content: JSON.stringify({
                    //     email: updatedTaskData.email,
                    //     uploadedBy: updatedTaskData.uploadedBy,
                    //     title: updatedTaskData.uploadedBy,
                    //     deadline: updatedTaskData.deadline,
                    //     description: updatedTaskData.description,
                    //     status: 'For Approval',
                    //     message: 'Your task status has been updated to For Approval!',
                    //     instructions: 'Your submission was received! Please wait for the admin to verify your submission.'
                    //   }),
                    // }).then(
                    //   (response: HttpResponse) => {
                    //     const result = response.content.toJSON();
                    //     console.log(`Http POST Result: ${result}`)
                    //   },
                    //   (e) => {
                    //     console.log(e)
                    //   })

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

                          const taskDocument = firestore.collection("tasks").doc(this.route.snapshot.paramMap.get('id'));
                          
                          // note that the options object is optional, but you can use it to specify the source of data ("server", "cache", "default").
                          taskDocument.get({ source: "server" }).then(doc => {
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
                          // const fn = firebaseFunctions.httpsCallable("helloName");

                          // // firebaseFunctions.httpsCallable
                          // Http.request({
                          //   url: "https://us-central1-icheckit-6a8bb.cloudfunctions.net/sendEmail",
                          //   method: "POST",
                          //   headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                          //   content: new URLSearchParams({
                          //     "username": viewModel.get("username"),
                          //     "firstname": viewModel.get("firstname"),
                          //     "lastname": viewModel.get("lastname"),
                          //     "email": viewModel.get("email"),
                          //     "password": viewModel.get("password")
                          //   }),
                          // }).then(
                          //   (response: HttpResponse) => {
                          //     const result = response.content.toJSON();
                          //     console.log(`Http POST Result: ${result}`)
                          //   },
                          //   (e) => {
                          //     console.log(e)
                          //   }
                          // );


                          // const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                          // const params: URLSearchParams = new URLSearchParams();

                          //   // console.log(newData.email);
                          // let email = this.taskData.email;
                          // let uploadedBy = this.taskData.uploadedBy;
                          // let title = this.taskData.title;
                          // let deadline = this.taskData.deadline;
                          // let description = this.taskData.description;
                          // let status = 'For Approval';
                          // let message = 'Your task status has been updated to ' + status + '!';
                          // let instructions = 'Your submission was received! Please wait for the admin to verify your submission.'

                          // params.set('email', email);
                          // params.set('uploadedBy', uploadedBy);
                          // params.set('title', title);
                          // params.set('deadline', deadline);
                          // params.set('description', description);
                          // params.set('status', status);
                          // params.set('message', message);
                          // params.set('instructions', instructions);


                          // return this.http.post(`https://us-central1-icheckit-6a8bb.cloudfunctions.net/sendEmail`, {
                          // email,
                          // uploadedBy,
                          // title,
                          // deadline,
                          // description,
                          // status,
                          // message,
                          // instructions
                          // }, {
                          //   headers
                          // }).toPromise().then(
                          //   () => {
                          //     console.log('Email has been sent to ' + email)
                          //   }
                          // ).catch((err) => {
                          //   console.log(err)
                          // })

                          
              } 
                  // function (url) {
                  //   let updatedTaskData = {
                  //     createdAt: this.taskData.createdAt,
                  //     deadline: this.taskData.deadline,                      
                  //     description: this.taskData.description,
                  //     displayName: this.taskData.displayName,
                  //     email: this.taskData.email,
                  //     section: this.taskData.section,
                  //     status: 'For Approval',
                  //     submissionLink: url,
                  //     taskId: this.taskData.taskId,
                  //     title: this.taskData.title,
                  //     uid: this.taskData.uid,
                  //     uploadedBy: this.taskData.uploadedBy,
                  //   }
                    
                  //   firestore.collection("tasks").doc(this.taskData.taskId)
                  //     .update({                       
                  //       colors2: firestore.FieldValue.arrayRemove(this.taskData)
                  //     }).then(() => {
                  //       firestore.collection("tasks").doc(this.taskData.taskId)
                  //     .update({                       
                  //       colors2: firestore.FieldValue.arrayUnion(updatedTaskData)
                  //     })
                  //     })
                  //     .then(() => {
                  //       alert('File has been uploaded')
                  //     })
                  //   console.log("Remote URL: " + url);
                  // },
                  // function (error) {
                  //   console.log("Error: " + error);
                  // }
              );
            }).catch((err) => {
              alert(err)
            })
          }
        }
      });
    });

    // mediafilepicker.on("getFiles", function(res) {
    //   let results = res.object.get("results");
    //   console.dir(results);

    //   if (results) {
    //     for (let i = 0; i < results.length; i++) {
    //       let result = results[i];
    //       console.log(result.file);
    //       this.myFile = result.file
    //       console.log(this.myFile);
    //       alert(this.myFile)
    //     }
    //   }
    // });

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
