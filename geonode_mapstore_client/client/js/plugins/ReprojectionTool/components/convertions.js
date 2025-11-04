/*
 * Copyright 2025, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import WFS from 'ol/format/WFS';
import GeoJSON from 'ol/format/GeoJSON';
import GML2 from 'ol/format/GML2';
import GML3 from 'ol/format/GML3';

export function convertWFS2GeoJSON(
  xmlInput
) {
  return xmlInput;
  
  //DONT PARSE
  // sample of response in ../__tests__/response.xml
  /*
  console.log('convertWFS2GeoJSON input...', xmlInput);
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlInput, "text/xml");

  console.log('WFS XML Document:', xmlDoc);

  //const format = new WFS();
  const format = new GML2(); 
  //const format = new GML3(); 
  const features = format.readFeatures(xmlDoc, {
    //dataProjection: 'EPSG:3857',
    //featureProjection: 'EPSG:3857'
  });

  console.log('WFS Features:', features );

  const geojsonFormat = new GeoJSON();
  const geo = geojsonFormat.writeFeaturesObject(features);

  console.log('WFS Geojson Features:', geo );
  return JSON.stringify(geo);
  */
}