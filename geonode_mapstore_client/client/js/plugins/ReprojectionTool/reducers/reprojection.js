/*
 * Copyright 2024, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {
    SET_REPROJECT_SOURCE_CRS,
    SET_REPROJECT_TARGET_CRS,
    SET_REPROJECT_GEOM,
} from '../actions/reprojection';

function reprojection(state = {}, action) {
    switch (action.type) {
    case SET_REPROJECT_SOURCE_CRS: {
        return {
            ...state,
            sourceCRS: action.sourceCRS
        };
    }
    case SET_REPROJECT_TARGET_CRS: {
        return {
            ...state,
            targetCRS: action.targetCRS
        };
    }
    case SET_REPROJECT_GEOM: {
        return {
            ...state,
            geom: action.geom
        };
    }
    
    default:
        return state;
    }
}

export default reprojection;
