import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-repeat',
  templateUrl: './repeat.component.html',
  styleUrls: ['./repeat.component.css'],
})
export class RepeatComponent {
  @Output() repeatSelected = new EventEmitter<{
    repeat: boolean;
    months: number;
  }>();

  repeat: boolean = false;
  months: number = 1;

  onRepeatChange(event: any): void {
    this.repeat = event.target.checked;
    if (!this.repeat) {
      this.months = 1; // Reset months to 1 if repeat is unchecked
    }
    this.emitRepeatSelection();
  }

  onMonthChange(event: any): void {
    this.months = event.target.value;
    this.emitRepeatSelection();
  }

  private emitRepeatSelection(): void {
    this.repeatSelected.emit({ repeat: this.repeat, months: this.months });
  }
}
