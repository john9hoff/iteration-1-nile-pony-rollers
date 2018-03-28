import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Resource} from './resource';
import {environment} from '../../environments/environment';


@Injectable()
export class ResourcesService {
    readonly baseUrl: string = environment.API_URL + 'resources';
    private resourceUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {
    }


    getResources(goalCategory?: string): Observable<Resource[]> {

        return this.http.get<Resource[]>(this.resourceUrl);
    }

    // This isn't used, but may be useful for future iterations.
    getResourceByID(id: string): Observable<Resource> {
        return this.http.get<Resource>(this.resourceUrl + '/' + id);
    }

    addNewResource(newResource: Resource): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new goal with the user data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.resourceUrl + '/new', newResource, httpOptions);
    }

    editResource(editedResource: Resource): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.resourceUrl + '/edit', editedResource, httpOptions);
    }

    deleteResource(resourcedID: String) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.delete(this.resourceUrl + '/delete/' + resourcedID, httpOptions);
    }
}
