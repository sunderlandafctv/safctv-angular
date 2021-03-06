import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import { takeUntil } from "rxjs/operators";
import { BaseComponent } from "../_shared/_baseClass/baseClass";

@Injectable({
  providedIn: "root"
})

export class Top10sService extends BaseComponent {

  constructor(private fetch: HttpClient, private sanitizer: DomSanitizer) {
    super();
  }

  private top10Videos: Object = undefined;
  private Observer: Observer<Object>;

  getTop10Videos(){
    
    if(this.top10Videos){
      return new Observable(observer => observer.next(this.top10Videos));
    } else{
      return new Observable(observer => {
        this.Observer = observer;
        this.fetch.get(`https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyDBs9KZOutpxzd-_fNSUAl-nj0rW01XXJI&maxResults=50&part=snippet&playlistId=PLiVty6-a8hTwboGWLDbQL0ZEjC92atdP3`).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(d => {
          //because of typescript"s wierd variable type system
          Array.from(d["items"])
          //bypassSecurityTrustResourceUrl() is called to stop XSS and iframe security errors returned by angular
          for(let i of d["items"]) i["URL"] = this.sanitizer.bypassSecurityTrustResourceUrl(`https://youtube.com/embed/${i.snippet.resourceId.videoId}`);
          this.top10Videos = d;
          this.Observer.next(d);
        });
      });
    }

  }

}