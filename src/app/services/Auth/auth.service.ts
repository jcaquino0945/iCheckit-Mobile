import { Injectable } from "@angular/core";
import { Observable } from "@nativescript/core";
// NativeScript 7+
import { firebase, firestore } from "@nativescript/firebase";
import { RouterExtensions } from "@nativescript/angular";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(
    private routerExtensions: RouterExtensions,
    private router: Router
  ) {}
  /*
   getUserData() {
     firebase.getCurrentUser()
    .then(user => console.log("User uid: " + user.uid))
    .catch(error => console.log("Trouble in paradise: " + error));
   }

   registerWithEmailAndPassword(email,password,displayName,contactNumber) {
    firebase.createUser({
        email: email,
        password: password
      })
      .then(() => {
          return usersCollection.add({
            email: email,
            displayName: displayName,
            contactNumber: contactNumber,
      })
    })
      .then(
          function (user) {
            alert('You have succesfully created an account!')
          },
          function (errorMessage) {
            alert('There has been an issue with the creation of your account')
          }
      );
   }
   */

  getUserData() {
    return firebase
      .getCurrentUser()
      .then(user => console.log("User uid: " + user.uid))
      .catch(error => console.log("Trouble in paradise: " + error));
  }

  createAccount(email, password, displayName, contactNumber) {
    firebase
      .createUser({
        email: email,
        password: password
      })
      .then(
        function(user) {
          firebase.updateProfile({ displayName: displayName }).then(
            function() {
              // called when update profile was successful
              console.log(user.uid);
              const data = {
                uid: user.uid,
                contactNumber: contactNumber,
                verified: 'Not Verified',
                email: email,
                pushToken: '',
                section: '',
                course: '',
                displayName: displayName,
                createdAt: Date.now(),
                role: "Student"
              };
              return firestore
                .collection("users")
                .doc(user.uid)
                .set(data)
                .then(res => alert("You have succesfully created an account"))
                .catch(error => console.log(error));
            },
            function(errorMessage) {
              console.log(errorMessage);
            }
          );
        },
        function(errorMessage) {
          alert("There has been an issue with the creation of your account");
        }
      );
  }

  test() {
    return firestore
      .collection("users")
      .get({ source: "server" })
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        });
      });
  }

  login(email, password) {
    firebase
      .login({
        type: firebase.LoginType.PASSWORD,
        passwordOptions: {
          email: email,
          password: password
        }
      })
      .then(async (user) => {
        // firestore.collection('users').doc(user.uid).set({
        // email: user.email,
        // uid: user.uid,
        // displayName: user.displayName,
        // }, {merge: true})

        const usersRef = firestore.collection('users').doc(user.uid)

        usersRef.get()
          .then((docSnapshot) => {
            if (docSnapshot.exists) {
              usersRef.onSnapshot((doc) => {
                firebase.getCurrentPushToken().then((token: string) => {
                // do stuff with the data
                  usersRef.set({
                  pushToken: token
                  }, { merge: true });              
                })
              });  
            } else {
              alert('does not exist!' + user.uid)
              firebase.getCurrentPushToken().then((token: string) => {
                usersRef.set({
                  email: user.email,
                  displayName: user.displayName,
                  course: '',
                  contactNumber: '',
                  createdAt: Date.now(),
                  pushToken: token,
                  role: 'Student',
                  section: '',
                  uid: user.uid,
                  verified: 'Not Verified'
                  }, {merge: true})  
              })
            }
        });
      }).then(() => {
        this.routerExtensions.navigate(["dashboard"], {
          transition: {
            name: "fade"
          }
        });
      })
      .catch(() => {
        alert('There has been an issue with your login. Your credentials might be invalid or the server is currently down.')
      });


        // const cityRef = firestore.collection('users').doc(user.uid);
        // const doc = await cityRef.get();
            
        // if (doc.exists) {
        //   alert('NADITO SYA')
        // } else {
        //   alert('WALA SYA DITO')
          // cityRef.set({
          //   email: user.email,
          //   displayName: user.displayName,
          //   course: '',
          //   contactNumber: '',
          //   createdAt: Date.now(),
          //   pushToken: '',
          //   role: 'Student',
          //   section: '',
          //   uid: user.uid,
          //   verified: 'Not Verified'
          //   }, {merge: true})      
          //   })
        // const usersRef = firestore.collection('users').doc(user.uid)
              //
        // usersRef.get()
        //   .then((docSnapshot) => {
        //     if (docSnapshot.exists) {
        //       usersRef.onSnapshot((doc) => {
        //         console.log('already exists in firestore')
        //         console.log(doc)
        //       });
        //     } else {
        //       usersRef.set({
                // email: user.email,
                // displayName: user.displayName,
                // course: '',
                // contactNumber: '',
                // createdAt: Date.now(),
                // pushToken: '',
                // role: 'Student',
                // section: '',
                // uid: user.uid,
                // verified: 'Not Verified'
        //       }) // create the document
        //     }
        // });
      // .then(() => {
      //   this.routerExtensions.navigate(["dashboard"], {
      //     transition: {
      //       name: "fade"
      //     }
      //   });
      // })
  }

  logout() {
    firebase.logout();
  }

  changePassword(email) {
    firebase
      .sendPasswordResetEmail(email)
      .then(() => alert("Password reset email sent"))
      .catch(error => alert("Error sending password reset email: " + error));
  }

  updatePassword(email, oldPass, newPass) {
    firebase
      .login({
        type: firebase.LoginType.PASSWORD,
        passwordOptions: {
          email: email,
          password: oldPass
        }
      })
      .then(() => {
        firebase
          .updatePassword(newPass)
          .then(() => alert("Password updated"))
          .catch(error => alert("Error updating password: " + error));
      });
  }

  editProfile(displayName, contactNumber, uid) {
    firebase
      .updateProfile({
        displayName: displayName
      })
      .then(
        function() {
          firebase.reloadUser().then(
            function() {
              firebase
                .getCurrentUser()
                .then(user => console.log("User uid: " + user.uid))
                .catch(error => console.log("Trouble in paradise: " + error));
            },
            function(errorMessage) {
              console.log(errorMessage);
            }
          );
          return firestore
            .collection("users")
            .doc(uid)
            .set(
              {
                displayName: displayName,
                contactNumber: contactNumber
              },
              { merge: true }
            );
        },
        function(errorMessage) {
          console.log(errorMessage);
        }
      );
    // firebase
    //   .updateProfile({
    //     displayName: displayName
    //   })
    //   .then(
    //     function() {
    //       return firestore
    //         .collection("users")
    //         .doc(uid)
    //         .set(
    //           {
    //             displayName: displayName,
    //             contactNumber: contactNumber
    //           },
    //           { merge: true }
    //         );
    //     },
    //     function(errorMessage) {
    //       console.log(errorMessage);
    //     }
    //   )
    //   .finally(() => {
    //     console.log("updated profile");
    //     firebase.reloadUser().then(function() {
    //       firebase
    //         .getCurrentUser()
    //         .then(user => console.log("User uid: " + user.uid))
    //         .catch(error => console.log("Trouble in paradise: " + error));
    //       return firestore
    //         .collection("users")
    //         .doc(uid)
    //         .update({
    //           displayName: displayName,
    //           contactNumber: contactNumber
    //         });
    //     });
    //   });
    // .then(function() {
    //   firebase.reloadUser().then(function() {
    //     firebase
    //       .getCurrentUser()
    //       .then(user => console.log("User uid: " + user.uid))
    //       .catch(error => console.log("Trouble in paradise: " + error));
    //   });
    // });
  }

  // getName() {
  //   firebase
  //     .getCurrentUser()
  //     .then(user => console.log("User uid: " + user.uid))
  //     .catch(error => console.log("Trouble in paradise: " + error));
  // }

  // getData(uid) {
  //   let sanFranciscoDocument = firestore.collection("users").doc(uid);
  //   let unsubscribe = sanFranciscoDocument.onSnapshot(doc => {
  //     if (doc.exists) {
  //       console.log("Document data:", JSON.stringify(doc.data()));
  //     } else {
  //       console.log("No such document!");
  //     }
  //   });

  //   // then after a while, to detach the listener:
  //   unsubscribe();
  // }

  // firebase.updateProfile({
  //   displayName: 'Eddy Verbruggen',
  //   photoURL: 'http://provider.com/profiles/eddyverbruggen.png'
  // }).then(
  //     function () {
  //       // called when update profile was successful
  //     },
  //     function (errorMessage) {
  //       console.log(errorMessage);
  //     }
  // );

  deleteAccount() {
    firebase.getCurrentUser()
    .then((user) => {
      return firestore
                .collection("users")
                .doc(user.uid)
                .delete()
                .then(() => {
                  firebase.deleteUser().then(
                    () => {
                      alert("Deleted");
                      this.routerExtensions.navigate(["login"], {
                        transition: {
                          name: "fade"
                        }
                      });
                    },
                    function(errorMessage) {
                      console.log(errorMessage);
                    }
                  );
                })
    })
        
  }

  // deleteAccount(): Promise<any> {
  //   return firebase.deleteUser().then(
  //     function() {
  //       alert("deleted");
  //       // this.routerExtensions.navigate(["/login"]);
  //       this.routerExtensions.navigate(["dashboard"], {
  //         transition: {
  //           name: "fade"
  //         }
  //       });
  //     })
  //     },
  //     function(errorMessage) {
  //       console.log(errorMessage);
  //     }
  //   );
  // }

  /*
  addData() {
    return this.citiesCollection.add({
      name: "San Francisco",
      state: "CA",
      country: "USA",
      capital: false,
      population: 860000,
      location: firebase.firestore().GeoPoint(4.34, 5.67)
    }).then(documentRef => {
      console.log(`San Francisco added with auto-generated ID: ${documentRef.id}`);
    });
  }
  */

  // getDisplayName(uid){
  //   // examples from https://firebase.google.com/docs/firestore/query-data/get-data
  //   const docRef: firestore.DocumentReference = firestore.collection("users").doc(uid);

  //   docRef.get().then((doc: firestore.DocumentSnapshot) => {
  //     if (doc.exists) {
  //       console.log("Document data:", JSON.stringify(doc.data()));
  //     } else {
  //       console.log("No such document!");
  //     }
  //   }).catch(function (error) {
  //     console.log("Error getting document:", error);
  //   });
  // }
}
