/*
 * Copyright 2023, GeoSolutions Sas.
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
import {executeProcessXML} from '@mapstore/framework/observables/wps/execute';

export const reprojectGeometryXML = ({
    geometry,
    sourceCrs,
    targetCrs,
}) => {
    const payload = [
        processParameter('sourceCrs', processData(literalData(sourceCrs))),
        processParameter('targetCrs', processData(literalData(targetCrs))),
        processParameter('geom', processData(complexData(cdata(geometry), "application/wkt"))),
    ];
    return executeProcessXML(
        'geo:reproject',
        payload,
        responseForm(
            rawDataOutput('result', "application/json")
        )
    );
};
