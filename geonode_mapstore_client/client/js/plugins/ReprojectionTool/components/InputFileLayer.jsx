/*
 * Copyright 2025, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState, useRef} from 'react';
import Message from '@mapstore/framework/components/I18N/Message';
import HTML from '@mapstore/framework/components/I18N/HTML';
import Button from '@mapstore/framework/components/layout/Button';

import Dropzone from 'react-dropzone';
import { Glyphicon } from 'react-bootstrap';

import {
    getMaxParallelUploads,
    getMaxAllowedSizeByResourceType
} from '@js/utils/UploadUtils';

const InputFileLayer = ({
    supportedFileLayerTypes,
    onChange = () => {}
}) => {
    
    const dropzoneRef = useRef();

    const maxParallelUploads = 1;
    const maxAllowedSize = getMaxAllowedSizeByResourceType() || 100; // default to 100MB
    
    const [uploading, setUploading] = useState(false);
    
    const handleDrop = (acceptedFiles, fileRejections) => {
        //TODO 
        onChange();
    }

    //Dropzone used like: geonode_mapstore_client/client/js/plugins/ResourceDetails/components/DetailsAssets.jsx
    return (
        <div className="gn-reprojection-upload">
            <Dropzone
                ref={dropzoneRef}
                onDrop={handleDrop}
                accept={supportedFileLayerTypes.length > 0
                    ? supportedFileLayerTypes.map(ext => `.${ext}`).join(',')
                    : undefined
                }
                multiple={false}
                disabled={uploading}
                className="gn-upload-dropzone"
                activeClassName="gn-dropzone-active"
                rejectClassName="gn-dropzone-reject"
            >
                <div className={`gn-upload-area ${uploading ? 'gn-upload-area-disabled' : ''}`}>
                    <Glyphicon glyph="upload" className="gn-upload-area-icon" />
                    <div>
                        <HTML msgId="gnviewer.dragDropAsset" />
                    </div>
                    <Button className="gn-assets-upload-button" size="sm" disabled={uploading}>
                        <Message msgId="gnviewer.browseFile" />
                    </Button>
                    <div className="gn-upload-area-supported-file-types">
                        <Message msgId="gnviewer.supportedFileTypes" />: {supportedFileLayerTypes.join(', ')}
                    </div>
                </div>
            </Dropzone>
        </div>
            
    );
};

export default InputFileLayer;