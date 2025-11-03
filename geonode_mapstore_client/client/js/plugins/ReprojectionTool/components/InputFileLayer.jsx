/*
 * Copyright 2025, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState, useRef, useCallback} from 'react';
import Message from '@mapstore/framework/components/I18N/Message';
import HTML from '@mapstore/framework/components/I18N/HTML';
import Button from '@mapstore/framework/components/layout/Button';
import Loader from '@mapstore/framework/components/misc/Loader';
import { Glyphicon } from 'react-bootstrap';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import Dropzone from 'react-dropzone';

import { uploadAsset } from '@js/api/geonode/v2';
// https://docs.geonode.org/en/master/devel/api/usage/index.html#assets-upload

import { ASSETS, getEndpointUrl } from '@js/api/geonode/v2/constants';
import { getFileNameParts } from '@js/utils/FileUtils';
import {
    getMaxAllowedSizeByResourceType,
} from '@js/utils/UploadUtils';

const InputFileLayer = ({
    supportedFileLayerTypes,
    onChange = () => {},
    onNotify = () => {}
}) => {
    
    const dropzoneRef = useRef();

    const maxParallelUploads = 1;
    const maxAllowedSize = getMaxAllowedSizeByResourceType() || 100; // default to 100MB
    
    const [uploading, setUploading] = useState(false);
    const [fileLayer, setFileLayer] = useState(null);

    const validateFiles = useCallback((files) => {
        // Check parallel upload limit
        if (maxParallelUploads && files.length > maxParallelUploads) {
            onNotify({
                title: 'gnviewer.assetUpload',
                message: 'gnviewer.parallelUploadLimit',
                values: { limit: maxParallelUploads }
            }, 'warning');
            return false;
        }

        // Check file size limits
        const isExceedingLimit = files.some(file => {
            const fileSizeMB = file.size / (1024 * 1024);
            return fileSizeMB > maxAllowedSize;
        });

        if (isExceedingLimit) {
            onNotify({
                title: 'gnviewer.assetUpload',
                message: 'gnviewer.exceedingFileMsg',
                values: { limit: maxAllowedSize}
            }, 'warning');
            return false;
        }

        return true;
    }, [maxParallelUploads, maxAllowedSize]);
    
    const handleFileUpload = useCallback((files) => {
        setUploading(true);
        setFileLayer(files?.[0]);
        onChange(files)
            .then(() => {
                //file processed on WPS
            }).finally(() => {
                setUploading(false);
            });
        
    }, []);

    const handleDrop = (acceptedFiles, fileRejections) => {

        // Handle rejected files (unsupported formats)
        if (!isEmpty(fileRejections)) {
            let unsupportedFormats = [];
            fileRejections.forEach(file => {
                const {ext = ""} = getFileNameParts(file);
                unsupportedFormats.push(ext);
            });
            onNotify({
                title: 'gnviewer.assetUpload',
                message: 'gnviewer.assetUploadUnsupportedFormatError',
                values: { ext: unsupportedFormats.join(', ') }
            }, 'error');
            return;
        }

        // Handle accepted files & validate files before upload
        // to check if the files are supported and within the size limits
        if (!isEmpty(acceptedFiles) && validateFiles(acceptedFiles)) {
            handleFileUpload(acceptedFiles);
        }
    };

    //Dropzone used like:
    // geonode_mapstore_client/client/js/plugins/ResourceDetails/components/DetailsAssets.jsx
    return (
        <div className="gn-reprojection-upload text-center">
            {uploading && <div className="text-center">
                <Loader size={50} style={{margin: 0, auto: 'auto'}}   />
                <label>Processing file.. {fileLayer?.name}</label>
                <br />
            </div>}

            <Dropzone
                style={{opacity: uploading ? 0.5 : 1}}
                disabled={uploading}
                ref={dropzoneRef}
                onDrop={handleDrop}
                accept={supportedFileLayerTypes.length > 0
                    ? supportedFileLayerTypes.map(ext => `.${ext}`).join(',')
                    : undefined
                }
                multiple={false}
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