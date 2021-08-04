export default class RouteEntity {
    constructor(method, url, handler) {
        this.method = method;
        this.url = url;
        this.handler = handler;
    }
}