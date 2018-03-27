import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Tracker} from '../trackers/tracker';
import {environment} from '../../environments/environment';


@Injectable()
export class ReportChartService{
    readonly baseUrl: string = environment.API_URL + 'reports';
    private reportUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {
    }

    getReports(reportSubject?: string): Observable<Tracker[]> {
       // this.filterBySubject(reportSubject);
        return this.http.get<Tracker[]>(this.reportUrl);
    }



}
