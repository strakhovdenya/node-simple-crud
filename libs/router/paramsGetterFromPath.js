export default class ParamsGetterFromPath {
    isRouteEqual(pathRoute, pathUrl) {
        const pathRoutParts = pathRoute.split('/');
        const pathUrlParts = pathUrl.split('/');

        if (pathRoutParts.length !== pathUrlParts.length) {
            return false;
        }

        const mainChunksOfRout = pathRoutParts.reduce((acc, el, index) => {
            if (/^{:[a-z]+}$/.test(el)) {
                return acc;
            }
            acc[index] = el;
            return acc;
        }, {});

        const isMainPathRoutEqualMainUrl = pathUrlParts.reduce((acc, el, index) => {
            if (acc === false) {
                return acc;
            }
            if (mainChunksOfRout[index] === undefined) {
                return acc;
            }
            if (mainChunksOfRout[index] !== el) {
                return false;
            }

            return acc;
        }, true);

        return isMainPathRoutEqualMainUrl;
    }

    getParamsFromGetMethod(pathRoute, pathUrl) {
        const pathRoutParts = pathRoute.split('/');
        const pathUrlParts = pathUrl.split('/');

        const paramsNameChunksOfRout = pathRoutParts.reduce((acc, el, index) => {
            if (/^{:[a-z]+}$/.test(el)) {
                const paramName = el.match(/^{:([a-z]+)}$/)[1];
                acc[index] = paramName;
            }

            return acc;
        }, {});

        const paramsValueChunksOfUrl = pathUrlParts.reduce((acc, el, index) => {
            if (paramsNameChunksOfRout[index] !== undefined && /^\d+$/.test(el)) {
                const paramValue = el.match(/^(\d+)$/)[0];
                acc[index] = paramValue;
            }

            return acc;
        }, {});

        const params = [];
        for (let key in paramsValueChunksOfUrl) {
            params.push(paramsValueChunksOfUrl[key])
        }

        return params;


    }
}