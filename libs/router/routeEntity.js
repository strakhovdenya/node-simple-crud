class RouteEntity {
    constructor(method, url, handler) {
        this.method = method;
        this.url = url;
        this.handler = handler;
    }
}

exports.RouteEntity = RouteEntity;