import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent {
  @Input() numberOfPages!: number;
  pageOptions: number[] = [];

  currentPage = 1;

  ngOnChanges(changes: SimpleChanges) {
    this.pageOptions = [
      this.currentPage - 2,
      this.currentPage - 1,
      this.currentPage,
      this.currentPage + 1,
      this.currentPage + 2,
    ].filter(
      (pageNumber) => pageNumber > 0 && pageNumber <= this.numberOfPages
    );
  }
}
