import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardServiceService {
  env = environment;
  constructor(private http: HttpClient) {}

  getDashboardData() {
    const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/admin-dashboard`;
    return this.http.get<any>(url)
  }

  getFiles(reportName: string , startDate?: Date,  endDate?: Date): Observable<any> {
    console.log(startDate);
    console.log(endDate);
    
    let url;
    if (startDate && endDate) {
      url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/generate-report?reportName=${reportName}&startDate=${startDate}&endDate=${endDate}`;
    }else {
     url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/generate-report?reportName=${reportName}`;
    }
    console.log("getFiles Service Called, report: ", reportName);
    
    
    return this.http.get(url, { responseType: 'blob' });
  }
  getFilesUser(reportName: string , startDate?: Date,  endDate?: Date): Observable<any> {
    console.log(startDate);
    console.log(endDate);
    

      const  url = `${this.env.serverUrl}${this.env.userUrlPrefix}/generate-report?reportName=${reportName}&startDate=${startDate}&endDate=${endDate}`;
    
    console.log("getFilesUser Service Called, report: ", reportName);
    
    
    return this.http.get(url, { responseType: 'blob' });
  }
}
