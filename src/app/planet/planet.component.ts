import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPlanet } from '../common-interfaces';

@Component({
  selector: 'app-planet',
  templateUrl: './planet.component.html',
  styleUrls: ['./planet.component.scss']
})
export class PlanetComponent implements OnInit {
  @Input() planet: IPlanet;
  @Output() savePlanetEvent = new EventEmitter<IPlanet>();
  constructor() { }

  ngOnInit(): void {
  }

  public savePlanet(planet: IPlanet) {
    this.savePlanetEvent.emit(planet);
  }

}
