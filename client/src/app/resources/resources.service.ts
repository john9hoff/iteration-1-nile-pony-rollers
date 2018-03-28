import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {resources} from './resources';
import {environment} from '../../environments/environment';
import {ResourcesComponent} from'./resources.component'


@Injectable()
export class ResourceService {
    readonly baseUrl: string = environment.API_URL + 'resources';
    private resourceUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {

    }

    getResources(resourcesCategory?: string): Observable<resources[]> {
        //this.filterByCategory(resourcesCategory);
        console.log("stuff is happening");
        return this.http.get<resources[]>(this.resourceUrl);
    }

    getResourceByID(id: string ): Observable<resources> {
        return this.http.get<resources>(this.resourceUrl + '/' + id);
    }

    filterByCategory(resourcesCategory?: string): void {
        if (!(resourcesCategory == null || resourcesCategory === '')) {
            if (this.parameterPresent('cateogry=') ) {
                // there was a previous search by title that we need to clear
                this.removeParameter('cateogry=');
            }
            if (this.resourceUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.resourceUrl += 'cateogry=' + resourcesCategory + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.resourceUrl += '?cateogry=' + resourcesCategory + '&';
            }
        } else {
            // there was nothing in the box to put onto the URL... reset
            if (this.parameterPresent('cateogry=')) {
                let start = this.resourceUrl.indexOf('cateogry=');
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

    addNewResource(newResources: resources): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new goals with the user data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.resourceUrl + '/new', newResources, httpOptions);
    }

    editResource(editedResource: resources): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.resourceUrl + '/edit', editedResource, httpOptions);
    }

    deleteResource(ResourcedID: String) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.delete(this.resourceUrl + '/delete/' + ResourcedID, httpOptions);
    }
}
