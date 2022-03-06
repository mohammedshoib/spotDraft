import { Injectable } from '@angular/core';
import { IPlanet } from './common-interfaces';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private savedPlanets: Set<IPlanet>;
  constructor() { 
    this.savedPlanets = new Set();
  }

  public savePlanetInStore(planet: IPlanet) {
    if (this.savedPlanets.has(planet)) {
      this.removePlanetInStore(planet);
    } else {
      this.savedPlanets.add(planet);
    }
  }

  private removePlanetInStore(planet: IPlanet) {
    this.savedPlanets.delete(planet);
  }

  public returnSavedPlanetLength(): number {
    return this.savedPlanets.size;
  }

  public returnSavedPlanets(): Array<IPlanet> {
    return [...this.savedPlanets];
  }
}
