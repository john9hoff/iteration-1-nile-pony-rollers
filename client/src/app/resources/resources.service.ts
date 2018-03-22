import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {resources} from './resources';
import {environment} from '../../environments/environment';
import {ResourcesComponent} from "./resources.component";


@Injectable()
export class ResourcesService {
    readonly baseUrl: string = environment.API_URL + 'resources';
    private resourceUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {

    }
    getresources(goalTitle?: string): Observable<resources[]> {
        this.filterByTitle(goalTitle);
        return this.http.get<resources[]>(this.resourceUrl);
    }

    getresourceByName(name: string ): Observable<resources> {
        return this.http.get<resources>(this.resourceUrl + '/' + name);
    }


    filterByTitle(goalTitle?: string): void {
        if (!(goalTitle == null || goalTitle === '')) {
            if (this.parameterPresent('title=') ) {
                // there was a previous search by title that we need to clear
                this.removeParameter('title=');
            }
            if (this.resourceUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.resourceUrl += 'title=' + goalTitle + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.resourceUrl += '?title=' + goalTitle + '&';
            }
        } else {
            // there was nothing in the box to put onto the URL... reset
            if (this.parameterPresent('title=')) {
                let start = this.resourceUrl.indexOf('title=');
                const end = this.resourceUrl.indexOf('&', start);
                if (this.resourceUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.resourceUrl = this.resourceUrl.substring(0, start) + this.resourceUrl.substring(end + 1);
            }
        }
    }



    private parameterPresent(searchParam: string) {
        return this.resourceUrl.indexOf(searchParam) !== -1;
    }

    // remove the parameter and, if present, the &
    private removeParameter(searchParam: string) {
        const start = this.resourceUrl.indexOf(searchParam);
        let end = 0;
        if (this.resourceUrl.indexOf('&') !== -1) {
            end = this.resourceUrl.indexOf('&', start) + 1;
        } else {
            end = this.resourceUrl.indexOf('&', start);
        }
        this.resourceUrl = this.resourceUrl.substring(0, start) + this.resourceUrl.substring(end);
    }

    addNewresource(newresource: resources): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new goals with the user data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.resourceUrl + '/new', newresource, httpOptions);
    }
}
