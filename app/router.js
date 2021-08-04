const { RouteEntity } = require('../libs/router/routeEntity.js');
const { ParamsGetterFromPath } = require('../libs/router/paramsGetterFromPath');

const paramsGetterFromPath = new ParamsGetterFromPath();

class Router {
    constructor() {
        this.routs = [];
    }

    get(url, handler) {
        this.routs.push(new RouteEntity('GET', url, handler))
    }

    delete(url, handler) {
        this.routs.push(new RouteEntity('DELETE', url, handler))
    }

    put(url, handler) {
        this.routs.push(new RouteEntity('PUT', url, handler))
    }

    patch(url, handler) {
        this.routs.push(new RouteEntity('PATCH', url, handler))
    }

    handleRequest(res, req) {
        req.url;
        req.method
        const rout = this.routs.filter(rout => {
            return paramsGetterFromPath.isRouteEqual(rout.url, req.url) && rout.method === req.method
        })

        if (rout.length === 0) {
            res.end(JSON.stringify({
                data: '404!!!!!'
            }));
            return;
        }
        const currentRout = rout[0]
        let params = [];
        if (currentRout.method === 'GET') {
            params = paramsGetterFromPath.getParamsFromGetMethod(currentRout.url, req.url)
            this._fetchResponse(currentRout, res, params);
        }

        if (currentRout.method === 'DELETE') {
            const callbackForParams = (data) => [JSON.parse(data).id];

            this._getBodyAndFetchResponse(currentRout, req, res, callbackForParams)
        }

        if (currentRout.method === 'PUT') {
            const callbackForParams = (data) => [JSON.parse(data)];

            this._getBodyAndFetchResponse(currentRout, req, res, callbackForParams)
        }

        if (currentRout.method === 'PATCH') {
            const callbackForParams = (data) => [JSON.parse(data)];

            this._getBodyAndFetchResponse(currentRout, req, res, callbackForParams)
        }
    }

    _getBodyAndFetchResponse(currentRout, req, res, callbackForParams) {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            this._fetchResponse(currentRout, res, callbackForParams(data))

        })
    }

    _fetchResponse(currentRout, res, params) {
        currentRout.handler(...params)
            .then(resp => {
                return res.end(JSON.stringify({
                    data: resp
                }));
            })
            .catch(err => {
                return res.end(JSON.stringify({
                    error: err.toString()

                }));

            });
    }
}

exports.Router = Router;