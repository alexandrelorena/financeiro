import { Component, OnInit } from '@angular/core';
import { DateService } from '../../service/date.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  today: string = '';

  constructor(private dateService: DateService) {}
  ngOnInit(): void {
    this.today = this.dateService.getCurrentDate();
  }
}
