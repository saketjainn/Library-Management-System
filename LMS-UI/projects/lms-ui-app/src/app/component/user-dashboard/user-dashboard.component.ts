import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AdminDashboardServiceService } from '../../services/admin-services/admin-dashboard-service.service';
import { SearchBookService } from '../../services/user-service/search-book.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewArrivalsComponent } from './new-arrivals/new-arrivals.component';
import { NgToastService } from 'ng-angular-popup';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit {
  chart: any = [];
  totalBorrowedBooks: number = 0;
  totalFineDue: number = 0;
  genreLables: string[] = [];
  genreData: number[] = [];
  favBooksLabels: string[] = [];
  favBooksData: number[] = [];
  favAuthorsLabels: string[] = [];
  favAuthorsData: number[] = [];
  selectedReport: string = '';
  reportName: string = '';
  showDatePicker: boolean = false;
  currentDate = new Date();
  startDate: any = new Date(
    this.currentDate.getTime() - 30 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split('T')[0];
  endDate: any = new Date().toISOString().split('T')[0];
  // todayDate: string = new Date().toISOString().split('T')[0];
  tooltipsMessage: string = 'Please Select Report';
  showEmpty!: boolean;

  constructor(
    private dashboardService: SearchBookService,
    private reportService: AdminDashboardServiceService,
    private modalService: NgbModal,
    private toast: NgToastService,
    private loader: NgxUiLoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchData();
    // console.log("Today's date: "+this.todayDate);

    // this.renderFinePieChart()
    // this.renderTopBooks()
  }

  fetchData() {
    this.dashboardService.getUserDashboardData().subscribe({
      next: (res: any) => {
        console.log(res);
        // console.log(res === null);

        this.totalBorrowedBooks = res.totalBooksBorrowed;
        this.totalFineDue = res.totalDuesAmount;
        this.genreLables = Object.keys(res.genreWiseSplit);
        console.log(this.genreLables.length);

        this.genreData = Object.values(res.genreWiseSplit);
        console.log(this.genreData.length);

        this.favBooksLabels = Object.keys(res.favoriteBooks);
        console.log(this.favBooksLabels);

        this.favBooksData = Object.values(res.favoriteBooks);
        console.log(this.favBooksData);

        this.favAuthorsLabels = Object.keys(res.favoriteAuthors);
        console.log(this.favAuthorsLabels);

        this.favAuthorsData = Object.values(res.favoriteAuthors);
        console.log(this.favAuthorsData);

        this.renderUserGenreSplit();
        this.renderFavBooks();
        this.renderFavAuthors();
      },
      error: (err: any) => {
        this.toast.error({
          detail: 'Error Message',
          summary: err.error.message,
          duration: 5000,
        });
        // console.log(err);
      },
    });
  }

  renderUserGenreSplit() {
    this.genreLables = this.genreLables.map((str) => {
      return str.replace(/_/g, ' ');
    });
    console.log(this.genreLables);
    this.chart = new Chart('user-genre-pie', {
      type: 'doughnut',
      data: {
        labels: this.genreLables,
        //labels: this.genreLabels
        datasets: [
          {
            label: 'Genre Wise Split',
            data: this.genreData,
            //data: this.genreData
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(54, 162, 235)',
              'rgb(75, 192, 192)',
              'rgb(255, 205, 86)',
              'rgb(153, 102, 255)',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            position: 'top',
            text: 'Genre Split',
          },
        },
      },
    });
  }

  renderFavBooks() {
    this.chart = new Chart('user-fav-books', {
      type: 'bar',
      data: {
        labels: this.favBooksLabels,
        datasets: [
          {
            barPercentage: 0.5,
            barThickness: 'flex',
            label: 'Favorite Books',
            data: this.favBooksData,
            //data: this.topBooksData
            borderWidth: 1,
            backgroundColor: ['rgba(255, 159, 64, 0.2)'],
            borderColor: ['rgb(255, 159, 64)'],
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Copies Issued',
            },
            ticks: {
              precision: 0, // Display integer values only
            },
          },
        },
      },
    });
  }
  renderFavAuthors() {
    this.chart = new Chart('user-fav-authors', {
      type: 'bar',
      data: {
        labels: this.favAuthorsLabels,
        datasets: [
          {
            barPercentage: 0.5,
            barThickness: 'flex',
            label: 'Favorite Authors',
            data: this.favAuthorsData,
            //data: this.topBooksData
            borderWidth: 1,
            backgroundColor: [
              // 'rgba(153, 102, 255, 0.2)',
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: ['rgb(54, 162, 235)'],
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Copies Issued',
            },
            ticks: {
              precision: 0, // Display integer values only
            },
          },
        },
      },
    });
  }

  datePicker() {
    console.log('start date: ', this.startDate);
    console.log('end date: ', this.endDate);

    if (this.selectedReport === '') {
      console.log(this.selectedReport);

      //this.tooltipsMessage = 'Please Select Report'
      this.showDatePicker = false;
    } else {
      this.showDatePicker = true;
      this.tooltipsMessage = '';
    }
    // if (this.startDate == null || this.endDate == null) {
    //   this.tooltipsMessage = 'Please Select Dates'
    // }
  }

  helper() {
    this.reportName = this.selectedReport;

    this.downloadFile(this.reportName, this.startDate, this.endDate);
  }

  downloadFile(reportName: string, startDate: any, endDate: any) {
    console.log('START DATE: ' + startDate);
    console.log('END DATE: ' + endDate);
    this.loader.startLoader('master');
    this.reportService.getFilesUser(reportName, startDate, endDate).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.selectedReport;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.toast.success({
          detail: 'Success',
          summary: 'Report Generation Successful',
          duration: 5000,
        });
        this.startDate = '';
        this.endDate = '';
        this.loader.stopLoader('master');
      },
      error: (err: any) => {
        this.toast.error({
          detail: 'Error Message',
          summary: err.error.message,
          duration: 5000,
        });
        this.startDate = '';
        this.endDate = '';
        this.loader.stopLoader('master');
        // console.log(err.error.message);
      },
    });
  }

  openNewArrivalsModal() {
    this.modalService.open(NewArrivalsComponent, { size: 'lg' });
    //this.modalService.dismissAll()
  }

  gotoExploreBooks() {
    this.router.navigate(['user-home/app-request-book']);
  }
}
