import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { IPlanet, IPlanets } from './common-interfaces';
import { map } from 'rxjs/operators';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { StoreService } from './store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public TOTAL_PLANETS: number = 0;
  public PLANETS: Array<IPlanet> = [];
  private listOfPlanetsLoaded: Array<IPlanet> = []; 
  private nextSetOfPlanets: string = '';
  private isPlanetAPIInProgress: boolean;
  private isVirtualScrollerSubscribed: boolean;
  public SEARCHED_PLANETS: string = '';
  private searchPlanetsTimer: any;
  public SAVED_PLANETS_LENGTH: number = 0;
  public IS_SHOWING_SAVED_PLANETS: boolean = false;
  @ViewChild('scroll') virtualScroller: VirtualScrollerComponent;
  @ViewChild('clickSound') clickSound: ElementRef;
  constructor(private http: HttpClient, private store: StoreService) {
  }

  ngOnInit() {
    this.fetchPlanetsAPI('https://swapi.dev/api/planets?page=1');
  }

  public listenForScroll() {
      // scroll, Little tricky to get the scroll position 
      // for time being going with working
      this.virtualScroller?.vsEnd.subscribe((e) => {
        if (!this.IS_SHOWING_SAVED_PLANETS && !this.SEARCHED_PLANETS && this.nextSetOfPlanets && e?.endIndex === (this.PLANETS.length - 1) && !this.isPlanetAPIInProgress) {
          this.fetchPlanetsAPI(this.nextSetOfPlanets);
        }
      });
  }

  private fetchPlanetsAPI(url: string) {
    this.isPlanetAPIInProgress = true;
    this.fetchAllPlanetsOfStarWars(url).subscribe((planets: IPlanets) => {
      if (!this.isVirtualScrollerSubscribed) {
        this.isVirtualScrollerSubscribed = true;
        this.listenForScroll();
      }
      this.TOTAL_PLANETS = planets.count || 0;
      this.listOfPlanetsLoaded = this.listOfPlanetsLoaded.concat(planets.planets);
      this.PLANETS = this.getFilteredPlanets(this.listOfPlanetsLoaded); // Remove copy by ref
      this.nextSetOfPlanets = planets.next || '';
      this.isPlanetAPIInProgress = false;
    });
  }

  private getFilteredPlanets(planets: Array<IPlanet>): Array<IPlanet> {
    const searchedPlanets = (this.SEARCHED_PLANETS || '').toLowerCase();
    if (!searchedPlanets) {
      return planets;
    }
    return planets.filter((planet: IPlanet) => {
      if (planet?.name?.toLowerCase().indexOf(searchedPlanets) > -1) {
        return true;
      }
      return false;
    });
  }

  private fetchAllPlanetsOfStarWars(url: string): Observable<IPlanets> {
    return this.http.get<IPlanets>(url, {responseType:'json'}).pipe(map((response: any) => {
      const results = response.results || [];
      return {
        next: response.next,
        count: Number(response.count),
        planets: results.map((planet: IPlanet) => ({
          name: planet.name,
          films: planet.films,
          population: Number(planet.population),
          created: planet.created,
          url: planet.url
        }))
      };
    }));
  }

  public searchPlanets(e: any) {
    e?.stopPropagation();
    // Debouncing
    if (this.searchPlanetsTimer) {
      clearTimeout(this.searchPlanetsTimer);
    }
    this.searchPlanetsTimer = setTimeout(() => {
      const searchedPlanets = this.SEARCHED_PLANETS;
      this.PLANETS = this.getFilteredPlanets(this.listOfPlanetsLoaded); // Remove copy by ref
    }, 500);
  }

  public handleSavePlanet(planet: IPlanet) {
    planet.saved = !planet.saved;
    this.store.savePlanetInStore(planet);
    this.SAVED_PLANETS_LENGTH = this.store.returnSavedPlanetLength();
    if (this.IS_SHOWING_SAVED_PLANETS) {
      this.PLANETS = this.getFilteredPlanets(this.store.returnSavedPlanets());
    }
    this.clickSound?.nativeElement?.play();
  }

  public identify(index: number, planet: IPlanet){
    return planet.name; 
  }

  public showSavedList() {
    let planets = this.listOfPlanetsLoaded;
    if (this.IS_SHOWING_SAVED_PLANETS) {
      this.IS_SHOWING_SAVED_PLANETS = false;
    } else {
      this.IS_SHOWING_SAVED_PLANETS = true;
      planets = this.store.returnSavedPlanets();
    }
    this.PLANETS = this.getFilteredPlanets(planets);
  }

}
