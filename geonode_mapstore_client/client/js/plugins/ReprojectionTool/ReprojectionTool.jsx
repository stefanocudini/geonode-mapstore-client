/*
 * Copyright 2024, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { createPlugin } from '@mapstore/framework/utils/PluginsUtils';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { withRouter } from 'react-router';
import isEqual from 'lodash/isEqual';
import Message from '@mapstore/framework/components/I18N/Message';
import ResizableModal from '@mapstore/framework/components/misc/ResizableModal';
import Portal from '@mapstore/framework/components/misc/Portal';
import Button from '@mapstore/framework/components/layout/Button';

import {
    setReprojec
} from './actions/reprojection';

import reprojection from './reducers/reprojection';

const connectReprojectionTool = connect(
    createSelector([
        state => state?.reprojection?.sourceCRS,
        state => state?.reprojection?.targetCRS,
        state => state?.reprojection?.geom
    ], (sourceCRS, targetCRS, geom) => ({
        sourceCRS,
        targetCRS,
        geom
    })),
    {
        //TODO maybe setPreview: setReprojectionPreview
    }
);

const ReprojectionTool = ({
    match,
    preview,
    setPreview,
    labelId = 'gnviewer.reprojectionTool',
    capitalizeFieldTitle = true
}) => {
    const { params } = match || {};
    const pk = params?.pk;
    const customProp = encodeURIComponent(JSON.stringify({capitalizeTitle: capitalizeFieldTitle}));
    return (
        <Portal>
            <ResizableModal
                title={<Message msgId={labelId} />}
                show={preview}
                size="lg"
                clickOutEnabled={false}
                modalClassName="gn-simple-dialog"
                onClose={() => setPreview(false)}
            >
                <iframe style={{ border: 'none', position: 'absolute', width: '100%', height: '100%' }} src={`/metadata/${pk}/embed?props=${customProp}`} />
            </ResizableModal>
        </Portal>
    );
};

const ReprojectionToolPlugin = connectReprojectionTool(withRouter(ReprojectionTool));

export default createPlugin('ReprojectionTool', {
    component: ReprojectionToolPlugin,
    containers: {
        // ActionNavbar: {
        //     name: 'ReprojectionTool',
        //     //TODO button to open tool
        // }
    },
    epics: {},
    reducers: {
        reprojection
    }
});
