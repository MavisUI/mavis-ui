import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../_ui/button/Button';
import {inject, observer} from 'mobx-react';
import Store from '../../Store';
import exportFromJSON from 'export-from-json';
import JsZip from 'jszip';
import App from '../../App';
import fs from 'fs';
import path from 'path';

@inject('store', 'app')
@observer
export default class Downloads extends React.Component {
    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        return (
            <div className="downloads">
                <Button id="downloadXls" className="downloads__button" onClick={() => this.exportData('xls')}>als .XLS speichern</Button>
                <Button id="downloadCsv" className="downloads__button" onClick={() => this.exportData('csv')} >als .CSV speichern</Button>
                <Button id="downloadJson" className="downloads__button" onClick={() => this.exportData('json')}>als .JSON speichern</Button>
                <Button id="downloadTxt" className="downloads__button" onClick={() => this.exportData('txt')}>als .TXT speichern</Button>
                <Button id="downloadImages" className="downloads__button" onClick={() => this.saveImages()}>Bilder speichern</Button>
            </div>
        )
    }

    /**
     * Retrieves the data to export.
     * @returns {*}
     */
    retrieveData() {
        let {data, store} = {...this.props};
        return data.map((item, i) => {
            return  {
                id : (i + 1),
                label : item.label,
                caption : item.caption,
                rating : 'SK' + item.rating,
                cable : store.cableData[item.cableIndex].name,
                position : item.position.toFixed(2) + ' m',
                distance : item.distance,
                value : item.value,
                sides : item.sides,
                images : item.images,
            }
        });
    }

    /**
     * Exports the data in the given type.
     * @param type
     */
    exportData(type) {
        let fileName = 'mavis',
            itemsToExport;
        itemsToExport = this.retrieveData();
        exportFromJSON({data:itemsToExport, fileName:fileName, exportType: type});
    }

    /**
     * Saves the images into a zip file.
     */
    saveImages() {
        let totalImages = [],
            {app, store} = {...this.props},
            appPath = store.appPath,
            zip = new JsZip(),
            data = this.retrieveData(),
            fileName =  store.userState.activeBridge + '-bilder.zip',
            // we create a temp file because it the amount of images can exceed the 500 mb blob limit of the browser
            tempFile = './' + fileName;

        app.setLoading(true, 'Erstelle zip Datei');

        data.map(entry => totalImages = totalImages.concat(entry.images));
        totalImages
            .filter((imagePath, index, self) => self.indexOf(imagePath) === index)
            .filter(imagePath => fs.existsSync(appPath + imagePath))
            .map(imagePath => {
                let imageData = fs.readFileSync(appPath + imagePath),
                // we strip the leading and duplicate "/" if there are any.
                trimmedImagePath = imagePath.split('/').filter(v => v).join('/');
                zip.file(trimmedImagePath, imageData);
            });

        zip.generateNodeStream({streamFiles: true, type: 'nodebuffer'})
            .pipe(fs.createWriteStream(tempFile))
            .on('finish', () => {
                app.setLoading(false);
                this.downloadFile('file://' + path.resolve(tempFile), fileName);
            })
            .on('error', (e) => {
                console.log(e);
                app.setLoading(false);
            });

    }

    /**
     * Helper to trigger the download dialog of the browser.
     * @param {string} url
     * @param {string} fileName
     */
    downloadFile(url, fileName) {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.setAttribute('download', fileName);
        anchor.setAttribute('style', 'visibility:hidden');
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }
}

Downloads.propTypes = {
    store: PropTypes.instanceOf(Store),
    app: PropTypes.instanceOf(App),
    data: PropTypes.any
};