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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'map-plot';
  map: Map;
  mapPlot: OlPlot;
  selectEdit: Select;
  modifyEdit: Modify;

  ngOnInit() {

  }
  ngAfterViewInit() {
    this.map = new Map({
      target: 'plotMap',
      layers: [
        // new TileLayer({ source: new OSM() }),
        new TileLayer({
          source: new XYZ({
            url: 'http://114.215.146.210:25003/v3/tile?x={x}&y={y}&z={z}'
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
    this.mapPlot = new OlPlot(this.map, {})
  }
  drawGemo(type) {
    this.mapPlot.plotDraw.active(type)
  }
  getFeatures() {
    const features = this.mapPlot.plotUtils.getFeatures()
    console.log(features)
    this.mapPlot.plotUtils.removeAllFeatures()
    this.mapPlot.plotEdit.deactivate()
    this.mapPlot.plotUtils.addFeatures(features)
  }

  editLayer() {
    let features: Feature;
    this.selectEdit = new Select({
      multi: false //取消多选
    })
    this.map.addInteraction(this.selectEdit);
    this.modifyEdit = new Modify({
      features: this.selectEdit.getFeatures()//将选中的要素添加修改功能
    })
    this.map.addInteraction(this.modifyEdit)
    this.selectEdit.on("select", function (evt) {
      console.log('选择', evt)
    })
    //监听要素修改时
    this.modifyEdit.on("modifyend", function (evt) {
      let new_feature = evt.features.item(0)
      console.log('编辑结束', new_feature)
    })

    // this.mapPlot.plotEdit.activate(features);
  }
  cancelEdit() {
    this.mapPlot.plotEdit.deactivate()
    this.map.removeInteraction(this.selectEdit);
    this.map.removeInteraction(this.modifyEdit);
  }
}
