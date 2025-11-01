/*
 * Copyright 2025, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {
    cdata,
    complexData,
    literalData,
    processData,
    processParameter,
    rawDataOutput,
    responseForm
} from '@mapstore/framework/observables/wps/common';
import { executeProcessXML } from '@mapstore/framework/observables/wps/execute';

//reproject list of points, geometry is WKT format multipoint
export const reprojectGeometryXML = ({
    sourceCrs,
    targetCrs,
    geometry,
    inputFormat = "application/wkt"
    //TODO verify output format from /geoserver/wps?service=WPS&version=2.0.0&request=DescribeProcess&identifier=gs:ReprojectGeometry
}) => {
    const payload = [
        processParameter('sourceCRS', processData(literalData(sourceCrs))),
        processParameter('targetCRS', processData(literalData(targetCrs))),
        processParameter('geometry', processData(complexData(cdata(geometry), inputFormat))),
    ];
    return executeProcessXML(
        'gs:ReprojectGeometry',
        payload,
        responseForm(
            rawDataOutput('result', "application/wkt")
        )
    );
};


export const reprojectXML = ({
    sourceCrs,
    targetCrs,
    features,
    inputFormat = "application/gml+xml"
}) => {
    const payload = [
        processParameter('sourceCRS', processData(literalData(sourceCrs))),
        processParameter('targetCRS', processData(literalData(targetCrs))),
        processParameter('features', processData(complexData(cdata(features), inputFormat))),
        //TODO features as reference layer or file GML
    ];
    console.log('reprojectXML payload', payload);
    return executeProcessXML(
        'gs:Reproject',
        payload,
        responseForm(
            rawDataOutput('result', "application/wkt")
        )
    );
};
/*
MULTIPOINT(
  (11.4 46.5),
  (11.5 46.6),
  (11.6 46.7)
)
*/

//WPS REQUEST
//gs:ReprojectGeometry
// <?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
//   <ows:Identifier>gs:ReprojectGeometry</ows:Identifier>
//   <wps:DataInputs>
//     <wps:Input>
//       <ows:Identifier>geometry</ows:Identifier>
//       <wps:Data>
//         <wps:ComplexData mimeType="application/wkt"><![CDATA[MULTIPOINT(
//   (11.4 46.5),
//   (11.5 46.6),
//   (11.6 46.7)
// )]]></wps:ComplexData>
//       </wps:Data>
//     </wps:Input>
//     <wps:Input>
//       <ows:Identifier>sourceCRS</ows:Identifier>
//       <wps:Data>
//         <wps:LiteralData>EPSG:4326</wps:LiteralData>
//       </wps:Data>
//     </wps:Input>
//     <wps:Input>
//       <ows:Identifier>targetCRS</ows:Identifier>
//       <wps:Data>
//         <wps:LiteralData>EPSG:3857</wps:LiteralData>
//       </wps:Data>
//     </wps:Input>
//   </wps:DataInputs>
//   <wps:ResponseForm>
//     <wps:RawDataOutput mimeType="application/wkt">
//       <ows:Identifier>result</ows:Identifier>
//     </wps:RawDataOutput>
//   </wps:ResponseForm>
// </wps:Execute>
//
//WPS RESPONSE in WKT
//content-type: application/wkt
//MULTIPOINT ((1269042.1950433187 5860839.829947802), (1280174.1441226462 5877026.552037683), (1291306.0932019735 5893243.176525357))


//gs:Reproject
// <wps:Execute service="WPS" version="1.0.0"
//   xmlns:wps="http://www.opengis.net/wps/1.0.0"
//   xmlns:ows="http://www.opengis.net/ows/1.1"
//   xmlns:xlink="http://www.w3.org/1999/xlink"
//   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
//   xsi:schemaLocation="http://www.opengis.net/wps/1.0.0
//   http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
//   <ows:Identifier>gs:Reproject</ows:Identifier>
//   <wps:DataInputs>
//     <wps:Input>
//       <ows:Identifier>features</ows:Identifier>
//       <wps:Reference xlink:href="http://geoserver/wfs?...typename=mylayer"/>
//     </wps:Input>
//     <wps:Input>
//       <ows:Identifier>targetCRS</ows:Identifier>
//       <wps:Data>
//         <wps:LiteralData>EPSG:4326</wps:LiteralData>
//       </wps:Data>
//     </wps:Input>
//   </wps:DataInputs>
// </wps:Execute>