import { Component, OnInit } from "@angular/core";
import { ModalDialogParams, ModalDialogService } from "@nativescript/angular";

@Component({
  moduleId: module.id,
  selector: "Cancel-Submission",
  templateUrl: "./Cancel-Submission.component.html",
  styleUrls: ["./Cancel-Submission.component.css"]
})
export class CancelSubmissionComponent implements OnInit {
  constructor(private modalDialogParams: ModalDialogParams) {}

  ngOnInit() {}

  goBack() {
    // this.router.navigate(["/login"]);
    this.modalDialogParams.closeCallback();
  }
}
