import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/env';
import { Observable } from 'rxjs';
import { ManageBookRequestsAdmin } from '../../interfaces/manage-book-request-admin';

@Injectable({
  providedIn: 'root',
})
export class EnableDisableBookService {
  constructor(private http: HttpClient) {}

  env = environment;

  enableDisableBook(id: number) {
    //console.log(id)
    const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/enable-disable`;
    return this.http.get<boolean>(url, {
      params: {
        id: id,
      },
    });
  }

  last10BooKRequests(): Observable<ManageBookRequestsAdmin[]> {
    const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/last-10-book-requests`;
    return this.http.get<ManageBookRequestsAdmin[]>(url);
  }

  cancelRequest(reqId: number): Observable<Boolean> {
    const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/decline-request`;
    return this.http.get<Boolean>(url, {
      params: {
        requestId: reqId,
      },
    });
  }

  acceptRequest(reqId: number): Observable<Boolean> {
    const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/accept-request`;
    return this.http.get<Boolean>(url, {
      params: {
        requestId: reqId,
      },
    });
  }

  getAllRequests(
    pageNumber: number = 0,
    pageSize: number = 10,
    sortBy: string,
    sortDir: string,
    filterBy: string | null = null
  ) {
    const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/view-requests`;

    // Explicitly declare the type of params
    let params: { [key: string]: string } = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy,
      sortDir: sortDir,
    };

    // Add filterBy parameter only if it's not null
    if (filterBy !== null) {
      params = { ...params, filterBy: filterBy };
    }

    return this.http.get<any>(url, { params });
  }

  searchRequestsByUsername(
    pageNumber: number = 0,
    pageSize: number = 10,
    sortBy: string,
    sortDir: string,
    username: string,
    filterBy: string | null = null
  ) {
    const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/view-requests-by-username`;
    let params: { [key: string]: string } = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy,
      sortDir: sortDir,
      username: username,
    };

    if (filterBy !== null) {
      params = { ...params, filterBy: filterBy };
    }

    return this.http.get<any>(url, { params });
  }
}
