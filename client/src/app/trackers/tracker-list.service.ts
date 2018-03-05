import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Tracker} from './tracker';
import {environment} from '../../environments/environment';


@Injectable()
export class TrackerListService {
    readonly baseUrl: string = environment.API_URL + 'trackers';
    private trackerUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {
    }

    getTrackers(trackerEmoji?: string): Observable<Tracker[]> {
        this.filterByEmoji(trackerEmoji);
        return this.http.get<Tracker[]>(this.trackerUrl);
    }

    getTrackerById(id: string): Observable<Tracker> {
        return this.http.get<Tracker>(this.trackerUrl + '/' + id);
    }

    /*
    //This method looks lovely and is more compact, but it does not clear previous searches appropriately.
    //It might be worth updating it, but it is currently commented out since it is not used (to make that clear)
    getTrackersByEmoji(trackerEmoji?: string): Observable<Tracker> {
        this.trackerUrl = this.trackerUrl + (!(trackerEmoji == null || trackerEmoji == "") ? "?emoji=" + trackerEmoji : "");
        console.log("The url is: " + this.trackerUrl);
        return this.http.request(this.trackerUrl).map(res => res.json());
    }
    */

    filterByEmoji(trackerEmoji?: string): void {
        if (!(trackerEmoji == null || trackerEmoji === '')) {
            if (this.parameterPresent('emoji=') ) {
                // there was a previous search by emoji that we need to clear
                this.removeParameter('emoji=');
            }
            if (this.trackerUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.trackerUrl += 'emoji=' + trackerEmoji + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.trackerUrl += '?emoji=' + trackerEmoji + '&';
            }
        } else {
            // there was nothing in the box to put onto the URL... reset
            if (this.parameterPresent('emoji=')) {
                let start = this.trackerUrl.indexOf('emoji=');
                const end = this.trackerUrl.indexOf('&', start);
                if (this.trackerUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.trackerUrl = this.trackerUrl.substring(0, start) + this.trackerUrl.substring(end + 1);
            }
        }
    }

    private parameterPresent(searchParam: string) {
        return this.trackerUrl.indexOf(searchParam) !== -1;
    }

    // remove the parameter and, if present, the &
    private removeParameter(searchParam: string) {
        const start = this.trackerUrl.indexOf(searchParam);
        let end = 0;
        if (this.trackerUrl.indexOf('&') !== -1) {
            end = this.trackerUrl.indexOf('&', start) + 1;
        } else {
            end = this.trackerUrl.indexOf('&', start);
        }
        this.trackerUrl = this.trackerUrl.substring(0, start) + this.trackerUrl.substring(end);
    }
}
