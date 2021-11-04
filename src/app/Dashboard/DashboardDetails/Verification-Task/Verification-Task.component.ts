import { Application, View } from '@nativescript/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Component, OnInit, NgZone } from '@angular/core';
import { firebase, firestore } from "@nativescript/firebase";
import { RouterLink } from "@angular/router";
import { Router } from "@angular/router";
import { storage } from "@nativescript/firebase/storage";
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import {
	Mediafilepicker,
	FilePickerOptions
  } from "nativescript-mediafilepicker";
@Component({
	moduleId: module.id,
	selector: 'Verification-Task',
	templateUrl: './Verification-Task.component.html',
	styleUrls: ['./Verification-Task.component.css']
})

export class VerificationTaskComponent implements OnInit {
	submitForm!: any;
	verificationTask;
	dateToday = Date.now();
	myFile = '';
	userData;
	userDetails;
	private _hostView: View;
	constructor(private router: Router, private zone: NgZone, private fb: FormBuilder) { }

	ngOnInit() { 

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
					this.userDetails = doc.data();
				}
			})
		})

		this.submitForm = this.fb.group({
			proposedSection: ['',Validators.required]
		});

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
	}

	onDrawerButtonTap(): void {
		const sideDrawer = <RadSideDrawer>Application.getRootView();
		sideDrawer.showDrawer();
	  }

	submitTask() {
		if (this.submitForm.valid) {

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
		
					const path = `60ThDEIPXLwWD8aHYs8E/${this.myFile.split(/(\\|\/)/g).pop()}/`;
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
								displayName: this.userDetails.displayName,
								email: this.userDetails.email,
								proposedSection: this.submitForm.controls['proposedSection'].value,
								pushToken: this.userDetails.pushToken,
								submissionLink: url,
								uid: this.userDetails.uid
							}

							  	firestore.collection("verificationTasks").doc('60ThDEIPXLwWD8aHYs8E')
								.update({                       
									recipients: firestore.FieldValue.arrayUnion(updatedTaskData)
								})
								.then(() => {
								  alert('File has been uploaded! Please wait for the admin to verify your account.')
								}).catch(() => {
									alert('There has been an issue with your file upload! Please try again')
								})
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

		else if (this.submitForm.invalid) {
			this.submitForm.controls['proposedSection'].markAsTouched();
			alert('Please fill up all required fields properly');
		}
	}
}