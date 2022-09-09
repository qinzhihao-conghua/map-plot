import { Component } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { transform } from 'ol/proj';
import OSM from 'ol/source/OSM';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'map-plot';
  map: Map;
  ngAfterViewInit() {
    this.map = new Map({
      target: 'plotMap',
      layers: [
        new TileLayer({ source: new OSM() })
      ],
      view: new View({
        // center: transform([108.316492, 22.818136], 'EPSG:4326', 'EPSG:3857'),
        center: [108.316492, 22.818136],
        zoom: 12,
        maxZoom: 20,
        minZoom: 6,
        projection: 'EPSG:4326'
      })
    })
  }
}
