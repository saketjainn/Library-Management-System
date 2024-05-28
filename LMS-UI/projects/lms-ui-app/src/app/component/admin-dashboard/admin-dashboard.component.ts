import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AdminDashboardServiceService } from '../../services/admin-services/admin-dashboard-service.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  title = 'ng-chart';
  chart: any = [];
  totalNoOfBooks: number = 0;
  totalNoOfUsers: number = 0;
  genreLables: string[] = [];
  genreData: number[] = [];
  //genreWiseSplit!: Map<string, number>;
  // finesDue : number = 0
  //finesCleared : number = 0
  topBooksLabels: string[] = [];
  topBooksData: number[] = [];
  topAuthorsLabels: string[] = [];
  topAuthorsData: number[] = [];
  totalFineDue: number = 0;
  toalFinePaid: number = 0;
  finesLabel: string[] = [];
  finesData: number[] = [];
  selectedReport: string = '';
  reportName: string = '';
  showDatePicker: boolean = false;
  currentDate = new Date();
  startDate: any = new Date(this.currentDate.getTime()- (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
  endDate: any =  new Date().toISOString().split('T')[0];
  // todayDate: string = new Date().toISOString().split('T')[0];
  tooltipsMessage: string = 'Please Select Report'

  constructor(
    private dashboardService: AdminDashboardServiceService,
    private toast: NgToastService,
    private loader: NgxUiLoaderService
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.dashboardService.getDashboardData().subscribe({
      next: (res: any) => {
        console.log(res);
        //this.genreWiseSplit = res.genreWiseSplit

        this.genreLables = Object.keys(res.genreWiseSplit);
        console.log(this.genreLables);
        this.genreData = Object.values(res.genreWiseSplit);
        console.log(this.genreData);
        this.topBooksLabels = Object.keys(res.mostRequestedBooks);
        console.log(this.topBooksLabels);
        this.topBooksData = Object.values(res.mostRequestedBooks);
        console.log(this.topBooksData);
        this.topAuthorsLabels = Object.keys(res.topAuthorsWithBooksIssued);
        console.log(this.topAuthorsLabels);
        this.topAuthorsData = Object.values(res.topAuthorsWithBooksIssued);
        console.log(this.topAuthorsData);
        this.toalFinePaid = res.totalFines.totalFinesPaid;
        console.log(this.toalFinePaid);
        this.totalFineDue =
          res.totalFines.totalFinesDue - res.totalFines.totalFinesPaid;
        console.log(this.totalFineDue);
        this.finesLabel = Object.keys(res.totalFines);
        console.log(this.finesLabel);
        this.finesData = [this.toalFinePaid, this.totalFineDue];
        console.log(this.finesData);

        this.totalNoOfBooks = res.totalBooksAvailable;
        this.totalNoOfUsers = res.totalUsers;
        this.renderTopBooks();
        this.renderTopAuthors();
        this.renderGenreSplit();
        //this.renderFineSplit();
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }


  renderTopBooks() {
    function randomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgba(${r}, ${g}, ${b}, 0.2)`;
    }

    const barColors = this.topBooksData.map(() => randomColor());
    this.chart = new Chart('top-books-bar', {
      type: 'bar',
      data: {
        labels: this.topBooksLabels,
        //labels: this.topBooksLabels
        datasets: [
          {
            barPercentage: 0.4,
            barThickness: 'flex',
            label: 'Most Popular Books',
            data: this.topBooksData,
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
          x: {
            title: {
              display: false,
              text: 'Books',
            },
          },
        },
      },
    });
  }

  renderTopAuthors() {
    this.chart = new Chart('top-authors-bar', {
      type: 'bar',
      data: {
        labels: this.topAuthorsLabels,
        //labels: this.topBooksLabels
        datasets: [
          {
            barPercentage: 0.5,
            barThickness: 'flex',
            label: 'Most Popular Authors',
            data: this.topAuthorsData,
            //data: this.topBooksData
            borderWidth: 1,
            backgroundColor: [
              // 'rgba(255, 99, 132, 0.2)',
              // 'rgba(255, 159, 64, 0.2)',
              // 'rgba(153, 102, 255, 0.2)',
              // 'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
              // 'rgb(255, 99, 132)',
              // 'rgb(255, 159, 64)',
              // 'rgb(153, 102, 255)',
              // 'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
            ],
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

  renderGenreSplit() {
    console.log(this.genreLables);
    this.genreLables = this.genreLables.map((str) => {
      return str.replace(/_/g, ' ');
    });
    console.log(this.genreLables);
    this.chart = new Chart('genre-pie', {
      type: 'doughnut',
      data: {
        labels: this.genreLables,

        datasets: [
          {
            label: 'Genre Split',
            data: this.genreData,
            backgroundColor: [
              // 'rgb(255, 99, 132)',
              // 'rgb(75, 192, 192)',
              // 'rgb(201, 203, 207)',
              // 'rgb(255, 205, 86)',
              // 'rgb(54, 162, 235)',
              'rgb(75, 192, 192)',

              'rgb(255, 159, 64)',
              'rgb(43, 151, 32)',

              'rgb(255, 99, 132)',
              'rgb(255, 205, 86)',
              'rgb(54, 162, 235)',
              // 'rgb(153, 102, 255)',
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




  datePicker() {
    console.log('start date: ', this.startDate);
    console.log('end date: ', this.endDate);

    if (
      this.selectedReport == 'AllUserDataReport' ||
      this.selectedReport == 'AllPublisherDataReport' ||
      this.selectedReport == 'FineSummaryReport' ||
      this.selectedReport == ''
    ) {
      this.tooltipsMessage = ''
      this.showDatePicker = false;
    } else {
      this.tooltipsMessage = ''
      this.showDatePicker = true;
    }
  }

  helper() {
    this.reportName = this.selectedReport;
    this.downloadFile(this.reportName, this.startDate, this.endDate);
  }

  downloadFile(reportName: string, startDate: any, endDate: any) {
    console.log('START DATE: ' + startDate);
    console.log('END DATE: ' + endDate);
    this.loader.startLoader('master');
    this.dashboardService
      .getFiles(reportName, startDate, endDate)

      .subscribe({
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
          this.startDate = '';
          this.endDate = '';
          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Report Generation Successful',
            duration: 5000,
          });
          this.loader.stopLoader('master');
        },
        error: (err: any) => {
          this.startDate = '';
          this.endDate = '';
          this.toast.error({
            detail: 'Error Message',
            summary: err.error.message,
            duration: 5000,
          });
          console.log(err);
          this.loader.stopLoader('master');
        },
      });
  }
}
