import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as FullStory from '@fullstory/browser';

export interface FeedbackData {
  nps: number; // net promoter score
  osat: number; // overall satisfaction
  comments: string; // free-form text comments
}

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(FeedbackDialog, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(data => {
      const { nps, osat, comments } = data;

      // Listens for the custom event emitted when feedback is submitted and 
      // sends the feedback data to FullStory

      window.addEventListener('feedback_submitted', (e) => FullStory.event('angular_shoppe_feedback', {
        "nps": (<CustomEvent>e).detail.nps,
        "osat": (<CustomEvent>e).detail.osat,
        "comments": (<CustomEvent>e).detail.comments,
      }));

      // broadcasts a CustomEvent
      // see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
      window.dispatchEvent(new CustomEvent('feedback_submitted', { detail: { nps, osat, comments } }));
    });
  }
}

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback.dialog.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackDialog {
  data: FeedbackData = {
    nps: 0,
    osat: 0,
    comments: '',
  };

  constructor(
    public dialogRef: MatDialogRef<FeedbackDialog>,
  ) { }

  close(): void {
    this.dialogRef.close();
  }
}
