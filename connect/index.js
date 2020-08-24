import { Util, RestApi } from '@magento/peregrine';
const { BrowserPersistence } = Util;

const prepareData = (endPoint, getData, method, header, bodyData) => {
    let requestMethod = method
    // const uri = process.env.MAGENTO_BACKEND_URL
    const requestEndPoint = endPoint
    
    const requestHeader = header
    const requestBody = bodyData

    let dataGetString = Object.keys(getData).map(function (key) {
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(getData[key]);
    })
    dataGetString = dataGetString.join('&')
    if (dataGetString) {
        if(requestEndPoint.includes('?')){
            requestEndPoint += "&" + dataGetString;
        } else { 
            requestEndPoint += "?" + dataGetString;
        }
    }

    //header
    const storage = new BrowserPersistence()
    const token = storage.getItem('signin_token')
    if (token)
        requestHeader['authorization'] = `Bearer ${token}`
    requestHeader['accept'] = 'application/json'
    requestHeader['content-type'] = 'application/json'

    return {requestMethod, requestEndPoint, requestHeader, requestBody}
}

/**
 * 
 * @param {string} endPoint 
 * @param {function} callBack 
 * @param {string} method 
 * @param {Object} getData 
 * @param {Object} bodyData 
 */

export async function sendRequest(endPoint, callBack, method='GET', getData= {}, bodyData= {}) {
    const header = {cache: 'default', mode: 'cors'}
    const {requestMethod, requestEndPoint, requestHeader, requestBody} = prepareData(endPoint, getData, method, header, bodyData)
    const requestData = {}
    requestData['method'] = requestMethod
    requestData['headers'] = requestHeader
    requestData['body'] = (requestBody && requestMethod !== 'GET')?JSON.stringify(requestBody):null
    requestData['credentials'] = 'same-origin';
    
    const _request = new Request(requestEndPoint, requestData);
    let result = null

    fetch(_request)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            /** Allow response for status 401 Unauthorized */
            if (response.ok === false && response.statusText === 'Unauthorized') {
                let data = {};
                data.errors = [];
                data.status = response.status;
                data.statusText = response.statusText;
                try{
                    return response.text().then(function(text) {
                        data.errors = [JSON.parse(text)];
                        return data;
                    });
                } catch (err){}
            }
        })
        .then(function (data) {
            if (data) {
                if (Array.isArray(data) && data.length === 1 && data[0])
                    result = data[0]
                else
                    result = data
                if (result && typeof result === 'object')
                    result.endPoint = endPoint
            } else
                result =  {'errors' : [{'code' : 0, 'message' : 'Network response was not ok', 'endpoint': endPoint}]}
            callBack(result)
        }).catch((error) => {
            console.warn(error);
        });
}