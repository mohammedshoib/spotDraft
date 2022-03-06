 export interface IPlanets {
    count: number,
    next: string,
    planets: Array<IPlanet>
}
    
export interface IPlanet {
    name: string,
    films: Array<IFilms>,
    population: number,
    created: Date,
    url: string,
    saved?: boolean
 }
 export interface IFilms {
    url: string
 }