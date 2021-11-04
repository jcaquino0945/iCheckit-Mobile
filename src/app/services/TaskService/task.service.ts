import { Injectable } from "@angular/core";
import { Observable } from "@nativescript/core";
// NativeScript 7+
import { firebase, firestore } from "@nativescript/firebase";
import { RouterExtensions } from "@nativescript/angular";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class TaskService {
  constructor(
    private routerExtensions: RouterExtensions,
    private router: Router
  ) {}

  getMyTasks(section) {
    const tasksCollection = firestore.collection("tasks").where('scope','array-contains',section)

// note that the options object is optional, but you can use it to specify the source of data ("server", "cache", "default").
        return tasksCollection.get({ source: "default" }).then(querySnapshot => {
        querySnapshot.forEach(doc => {
            console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        });
        });
  }
}