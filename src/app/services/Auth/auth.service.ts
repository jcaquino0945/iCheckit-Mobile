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
                verified: false,
                email: email,
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
      .then(() => {
        this.routerExtensions.navigate(["dashboard"], {
          transition: {
            name: "fade"
          }
        });
      })
      .catch(error => console.log(error));
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
    console.log("from service");
    console.log(displayName);
    console.log(uid);
    console.log(contactNumber);
    firebase
      .updateProfile({
        displayName: displayName
      })
      .then(
        function(user) {
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
          // alert("Account not updated, please fill out all the fields ")
          console.log(errorMessage);
        }
      );
  }

  getData(uid) {
    let sanFranciscoDocument = firestore.collection("users").doc(uid);
    let unsubscribe = sanFranciscoDocument.onSnapshot(doc => {
      if (doc.exists) {
        console.log("Document data:", JSON.stringify(doc.data()));
      } else {
        console.log("No such document!");
      }
    });

    // then after a while, to detach the listener:
    unsubscribe();
  }

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
}
