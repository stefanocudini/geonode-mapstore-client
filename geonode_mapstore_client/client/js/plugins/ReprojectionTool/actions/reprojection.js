/*
 * Copyright 2025, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


export const REPROJECT = "RPT:REPROJECT";
export const REPROJECT_GEOM = "RPT:REPROJECT_GEOMETRY";

export const SET_REPROJECT_SOURCE_CRS = "RPT:SET_REPROJECT_SOURCE_CRS";
export const SET_REPROJECT_TARGET_CRS = "RPT:SET_REPROJECT_TARGET_CRS";
export const SET_REPROJECT_GEOM = "RPT:SET_REPROJECT_GEOM";

export const setReprojectSourceCrs = (sourceCrs) => ({
    type: SET_REPROJECT_SOURCE_CRS,
    sourceCrs
});

export const setReprojectTargetCrs = (targetCrs) => ({
    type: SET_REPROJECT_TARGET_CRS,
    targetCrs
});

export const setReprojectGeom = (geom) => ({
    type: SET_REPROJECT_GEOM,
    geom
});
