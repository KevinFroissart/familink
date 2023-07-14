"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var puppeteer_1 = __importDefault(require("puppeteer"));
var config_json_1 = __importDefault(require("./config.json"));
var fs = __importStar(require("fs"));
var https_1 = __importDefault(require("https"));
var loginUrl = 'https://app.familinkframe.com/fr/login';
var devicesUrl = 'https://app.familinkframe.com/fr/devices';
var picturesUrl = 'https://app.familinkframe.com/fr/devices/16961/pictures';
var imageWildcard = 'https://media.familinkframe.com/';
var chromiumPath = '/usr/bin/chromium-browser';
var imageFolderPath = '/home/kfroissart/git/familink/images/';
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (ok) { return setTimeout(function () { return ok(null); }, ms); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var download = function (url, destination) { return new Promise(function (resolve, reject) {
    var file = fs.createWriteStream(destination, { flags: 'a+' });
    var request = https_1["default"].get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close();
            resolve(true);
        });
    });
    request.on('error', function (error) {
        console.error(error);
        reject(error);
    });
}); };
function imageExists(imagePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    fs.access(imagePath, fs.constants.F_OK, function (error) {
                        resolve(!error);
                    });
                })];
        });
    });
}
function scrapImages() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, url, e_1, e_2, result, images, i, imageName, imagePath, imageAlreadyExists, e_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, puppeteer_1["default"].launch({ headless: config_json_1["default"].headless, executablePath: chromiumPath })];
                case 1:
                    browser = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 30, 32]);
                    return [4 /*yield*/, browser.newPage()];
                case 3:
                    page = _b.sent();
                    return [4 /*yield*/, page.goto(loginUrl)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, sleep(100)];
                case 5:
                    _b.sent();
                    console.log('Page loaded');
                    _b.label = 6;
                case 6:
                    _b.trys.push([6, 18, , 19]);
                    // On récupère le champ de login et de password et on les remplit
                    return [4 /*yield*/, page.waitForSelector('familink-input[controlname="email"] input')];
                case 7:
                    // On récupère le champ de login et de password et on les remplit
                    _b.sent();
                    return [4 /*yield*/, page.type('familink-input[controlname="email"] input', config_json_1["default"].login, { delay: 25 })];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, page.type('familink-input[controlname="password"] input', config_json_1["default"].password, { delay: 25 })];
                case 9:
                    _b.sent();
                    // On envoie le formulaire
                    return [4 /*yield*/, Promise.all([
                            page.waitForNavigation(),
                            page.click('.submit-button-container button[type="submit"]'),
                        ])];
                case 10:
                    // On envoie le formulaire
                    _b.sent();
                    _b.label = 11;
                case 11:
                    if (!true) return [3 /*break*/, 17];
                    _b.label = 12;
                case 12:
                    _b.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, page.evaluate(function () { return location.href; })];
                case 13:
                    url = _b.sent();
                    if (url.match(devicesUrl))
                        return [3 /*break*/, 17];
                    return [3 /*break*/, 15];
                case 14:
                    e_1 = _b.sent();
                    console.error(e_1);
                    return [3 /*break*/, 15];
                case 15: return [4 /*yield*/, sleep(100)];
                case 16:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 17: return [3 /*break*/, 19];
                case 18:
                    e_2 = _b.sent();
                    console.log('Login Error', e_2);
                    return [3 /*break*/, 19];
                case 19:
                    result = void 0;
                    return [4 /*yield*/, page.goto(picturesUrl)];
                case 20:
                    _b.sent();
                    return [4 /*yield*/, sleep(5000)];
                case 21:
                    _b.sent();
                    return [4 /*yield*/, page.evaluate(function () { return Array.from(document.images, function (e) { return e.src.replace('thumbnails', 'resized').replace('_360x285', ''); }); })];
                case 22:
                    images = _b.sent();
                    console.log(images[0]);
                    i = 0;
                    _b.label = 23;
                case 23:
                    if (!(i < images.length)) return [3 /*break*/, 29];
                    if (!images[i].startsWith(imageWildcard)) return [3 /*break*/, 28];
                    console.log(i, images[i]);
                    _b.label = 24;
                case 24:
                    _b.trys.push([24, 27, , 28]);
                    imageName = "".concat((_a = images[i].split(/[\/]/).pop()) === null || _a === void 0 ? void 0 : _a.replace(/.png|.jpg|.jpeg/gi, ''), ".jpg");
                    imagePath = "".concat(imageFolderPath, "/").concat(imageName);
                    return [4 /*yield*/, imageExists(imagePath)];
                case 25:
                    imageAlreadyExists = _b.sent();
                    if (imageAlreadyExists) {
                        console.log('Skipped:', images[i], 'has already been downloaded.');
                        return [3 /*break*/, 28];
                    }
                    return [4 /*yield*/, download(images[i], imagePath)];
                case 26:
                    result = _b.sent();
                    if (result === true) {
                        console.log('Success:', images[i], 'has been downloaded successfully.');
                    }
                    else {
                        console.error('Error:', images[i], 'was not downloaded.');
                        console.error(result);
                    }
                    return [3 /*break*/, 28];
                case 27:
                    e_3 = _b.sent();
                    console.error(e_3);
                    return [3 /*break*/, 28];
                case 28:
                    i++;
                    return [3 /*break*/, 23];
                case 29: return [3 /*break*/, 32];
                case 30: return [4 /*yield*/, browser.close()];
                case 31:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 32: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, scrapImages()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main()["catch"](function (e) {
    console.error(e);
    process.exitCode = 1;
});
