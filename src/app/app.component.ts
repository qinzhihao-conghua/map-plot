import { Component } from '@angular/core';
import { Feature, Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { transform } from 'ol/proj';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import OlPlot from 'src/plot-utils';
import Select from 'ol/interaction/Select';
import Modify from 'ol/interaction/Modify';
import { defaults } from 'ol/interaction';
import { SelectEvent } from 'ol/interaction/Select';
import { ModifyEvent } from 'ol/interaction/Modify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'map-plot';
  map!: Map;
  mapPlot!: OlPlot;
  selectEdit!: Select;
  modifyEdit!: Modify;

  ngOnInit(): void {
    // 初始化逻辑
  }

  ngAfterViewInit(): void {
    this.map = new Map({
      target: 'plotMap',
      layers: [
        // new TileLayer({ source: new OSM() }),
        new TileLayer({
          source: new XYZ({
            // url: 'http://114.215.146.210:25003/v3/tile?x={x}&y={y}&z={z}'
            // 高德电子地图URL
            // url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
            // 高德卫星影像URL
            // url: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
            // 高德大字体电子地图URL
            // url: 'http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
            // 高德路网URL
            // url: 'https://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=8<ype=11'
            // 高德地名路网URL
            // url: 'https://wprd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
            // 腾讯电子地图
            // url: 'https://rt1.map.gtimg.com/tile?z={z}&x={x}&y={-y}&styleid=0&version=256'
            // 腾讯电子地图
            url: 'https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
          })
        }),
      ],
      view: new View({
        // center: transform([108.316492, 22.818136], 'EPSG:4326', 'EPSG:3857'),
        center: [108.316492, 22.818136],
        zoom: 12,
        maxZoom: 20,
        minZoom: 6,
        projection: 'EPSG:4326'
      }),
      interactions: defaults({
        doubleClickZoom: false
      })
    });
    this.mapPlot = new OlPlot(this.map, {});
  }

  drawGemo(type: string): void {
    this.mapPlot.plotDraw.active(type);
  }

  getFeatures(): void {
    const features = this.mapPlot.plotUtils.getFeatures();
    console.log(features);
    this.mapPlot.plotUtils.removeAllFeatures();
    this.mapPlot.plotEdit.deactivate();
    this.mapPlot.plotUtils.addFeatures(features);
  }

  editLayer(): void {
    this.selectEdit = new Select({
      multi: false
    });
    this.map.addInteraction(this.selectEdit);

    this.selectEdit.on('select', (evt: SelectEvent) => {
      const features = evt.selected;
      if (features && features.length > 0) {
        const feature = features[0];
        if (feature.get('isPlot')) {
          this.mapPlot.plotEdit.activate(feature);
        }
      }

      const deselected = evt.deselected;
      if (deselected && deselected.length > 0) {
        this.mapPlot.plotEdit.deactivate();
      }
    });
  }

  cancelEdit(): void {
    this.mapPlot.plotEdit.deactivate();
    this.map.removeInteraction(this.selectEdit);
    this.map.removeInteraction(this.modifyEdit);
  }
}
