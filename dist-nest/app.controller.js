"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const fs = require("fs");
const path = require("path");
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const serverBundle = require("./ssr/server-bundle.json");
const clientManifest = require("./ssr/client-manifest.json");
const vue_server_renderer_1 = require("vue-server-renderer");
const templatePath = path.join(__dirname, './index.template.html');
const template = fs.readFileSync(templatePath, 'utf-8');
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    async getHello(request, response) {
        const render = (0, vue_server_renderer_1.createBundleRenderer)(serverBundle, {
            clientManifest,
            template,
            inject: false,
            runInNewContext: false,
            shouldPreload: () => false,
            shouldPrefetch: () => false,
        });
        const html = await render.renderToString({});
        response.status(200).send(html);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHello", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map