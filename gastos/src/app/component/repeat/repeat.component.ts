import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-repeat',
  templateUrl: './repeat.component.html',
  styleUrls: ['./repeat.component.css'],
  standalone: false,
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
      this.months = 1;
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
