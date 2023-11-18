"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class BunnyStream {
    constructor(
    /**
     * The API requests are authenticated using the **AccessKey** header. You can find it in your Video Library details page in the bunny.net dashboard.
     *
     * The Stream API uses its own authentication keys. Authenticating via the bunny.net account API key will not work.
     */
    _accessKey) {
        this._accessKey = _accessKey;
        // a() {
        //   this.library(0).video("").upload;
        // }
        this._endpoint = "https://video.bunnycdn.com";
        this.makeRequest = (method, path, query, body, errorMessages, config) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const res = yield (0, axios_1.default)(`${this._endpoint}${path}`, Object.assign({ headers: {
                    AccessKey: this._accessKey,
                }, method, params: query, data: body }, config));
            if (res.status >= 200 && res.status < 300) {
                if (res.data.success === false) {
                    throw new Error((_a = res.data.message) !== null && _a !== void 0 ? _a : "Unknown Error Occurred");
                }
                return res.data;
            }
            else {
                throw new Error((_b = errorMessages[res.status]) !== null && _b !== void 0 ? _b : res.statusText);
            }
        });
        this.library = (libraryId) => {
            return {
                statistics: (
                /**
                 * The start date of the statistics
                 *
                 * @default
                 * ```js
                 * Date.now() / 1000 - 2592000 // 30 days from now
                 * ```
                 */
                dateFrom, 
                /**
                 * The end date of the statistics
                 *
                 * @default
                 * ```js
                 * Date.now() / 1000 // Current date in seconds
                 * ```
                 */
                dateTo, 
                /** If true, the statistics data will be returned in hourly groupping */
                hourly, 
                /** Axios config */
                config) => __awaiter(this, void 0, void 0, function* () {
                    const dateFromEpoch = typeof dateFrom === "number" ? dateFrom : dateFrom.getDate() / 1000;
                    const dateToEpoch = typeof dateTo === "number" ? dateTo : dateTo.getDate() / 1000;
                    return yield this.makeRequest("GET", `/library/${libraryId}/statistics`, {
                        dateFrom: dateFromEpoch,
                        dateTo: dateToEpoch,
                        hourly,
                    }, undefined, {
                        404: "The requested video was not found",
                    }, config);
                }),
                videos: {
                    list: (
                    /** @default 1 */
                    page, 
                    /** @default 100 */
                    itemsPerPage, search, collection, 
                    /** @default "date" */
                    orderBy, 
                    /** Axios config */
                    config) => __awaiter(this, void 0, void 0, function* () {
                        return yield this.makeRequest("GET", `/library/${libraryId}/videos`, {
                            page,
                            collection,
                            itemsPerPage,
                            search,
                            orderBy,
                        }, undefined, {}, config);
                    }),
                    fetch: (
                    /** The URL where the video will be fetched */
                    url, 
                    /** The headers that will be sent together with the fetch request */
                    headers, collectionId, 
                    /** Video time in ms to extract the main video thumbnail */
                    thumbnailTime, body, 
                    /** Axios config */
                    config) => __awaiter(this, void 0, void 0, function* () {
                        return yield this.makeRequest("POST", `/library/${libraryId}/videos/fetch`, {
                            collectionId,
                            thumbnailTime,
                        }, Object.assign({ url,
                            headers }, body), {
                            400: "Failed fetching the video",
                            404: "The requested video was not found",
                        }, config);
                    }),
                },
                video: (videoId) => {
                    return {
                        info: (
                        /** Axios config */
                        config) => __awaiter(this, void 0, void 0, function* () {
                            return yield this.makeRequest("GET", `/library/${libraryId}/videos/${videoId}`, {}, undefined, {
                                404: "The requested video was not found",
                            }, config);
                        }),
                        update: (body, 
                        /** Axios config */
                        config) => __awaiter(this, void 0, void 0, function* () {
                            return yield this.makeRequest("POST", `/library/${libraryId}/videos/${videoId}`, {}, body, {
                                404: "The requested video was not found",
                            }, config);
                        }),
                        delete: (
                        /** Axios config */
                        config) => __awaiter(this, void 0, void 0, function* () {
                            return yield this.makeRequest("DELETE", `/library/${libraryId}/videos/${videoId}`, {}, undefined, {
                                404: "The requested video was not found",
                            }, config);
                        }),
                        upload: ({ video, title, collectionId, thumbnailTime, videoMimeTypeOverride, expirationTimeOverride, createBody, uploadBody, onCreatedVideo, }) => __awaiter(this, void 0, void 0, function* () {
                            throw new Error("Not implemented");
                            // const createRes = await axios.post<Video>(
                            //   `${this._endpoint}/library/${libraryId}/videos`,
                            //   {
                            //     title,
                            //     collectionId,
                            //     thumbnailTime,
                            //     ...createBody,
                            //   },
                            //   {
                            //     headers: {
                            //       "Content-Type": "application/json",
                            //       AccessKey: this._accessKey,
                            //     },
                            //   }
                            // );
                            // switch (createRes.status) {
                            //   case 200: {
                            //     onCreatedVideo?.(createRes.data);
                            //     break;
                            //   }
                            //   case 401: {
                            //     throw new Error("While creating video: The request authorization failed");
                            //   }
                            //   case 500: {
                            //     throw new Error("While creating video: Internal Server Error");
                            //   }
                            // }
                            // const { fileTypeFromBuffer } = await import("file-type");
                            // const videoFile = await fs.readFile(video);
                            // const videoMimeType = videoMimeTypeOverride ?? (await fileTypeFromBuffer(videoFile));
                            // const expirationTime = expirationTimeOverride ?? 3600000; // 1 day
                            // const hash = crypto.createHash("sha256");
                            // hash.update(libraryId + this._accessKey + expirationTime + videoId);
                            // // if this ever does get implemented, this function will create the video (https://docs.bunny.net/reference/video_createvideo), then upload the video (https://docs.bunny.net/reference/video_uploadvideo)
                        }),
                        heatmap: (
                        /** Axios config */
                        config) => __awaiter(this, void 0, void 0, function* () {
                            return yield this.makeRequest("GET", `/library/${libraryId}/videos/${videoId}/heatmap`, {}, undefined, {
                                404: "The requested video was not found",
                            }, config);
                        }),
                        statistics: (
                        /**
                         * The start date of the statistics
                         *
                         * @default
                         * ```js
                         * Date.now() / 1000 - 2592000 // 30 days from now
                         * ```
                         */
                        dateFrom, 
                        /**
                         * The end date of the statistics
                         *
                         * @default
                         * ```js
                         * Date.now() / 1000 // Current date in seconds
                         * ```
                         */
                        dateTo, 
                        /** If true, the statistics data will be returned in hourly groupping */
                        hourly, 
                        /** Axios config */
                        config) => __awaiter(this, void 0, void 0, function* () {
                            const dateFromEpoch = typeof dateFrom === "number" ? dateFrom : dateFrom.getDate() / 1000;
                            const dateToEpoch = typeof dateTo === "number" ? dateTo : dateTo.getDate() / 1000;
                            return yield this.makeRequest("GET", `/library/${libraryId}/statistics`, {
                                dateFrom: dateFromEpoch,
                                dateTo: dateToEpoch,
                                hourly,
                                videoGuid: videoId,
                            }, undefined, {
                                404: "The requested video was not found",
                            }, config);
                        }),
                        reencode: (
                        /** Axios config */
                        config) => __awaiter(this, void 0, void 0, function* () {
                            return this.makeRequest("POST", `/library/${libraryId}/videos/${videoId}/reencode`, {}, {}, {
                                404: "The requested video was not found",
                            }, config);
                        }),
                        setThumbnail: (thumbnailUrl, 
                        /** Axios config */
                        config) => __awaiter(this, void 0, void 0, function* () {
                            return yield this.makeRequest("POST", `/library/${libraryId}/videos/${videoId}/thumbnail`, {
                                thumbnailUrl,
                            }, {}, {
                                404: "The requested video could not be found",
                            }, config);
                        }),
                        caption: (srclang) => {
                            return {
                                add: (
                                /** The text description label for the caption */
                                label, 
                                /** Base64 encoded captions file */
                                captionsFile, body, 
                                /** Axios config */
                                config) => __awaiter(this, void 0, void 0, function* () {
                                    return yield this.makeRequest("POST", `/library/${libraryId}/videos/${videoId}/captions/${srclang}`, {}, Object.assign({ srclang,
                                        label,
                                        captionsFile }, body), {
                                        400: "Failed uploading the captions",
                                        404: "The requested video was not found",
                                    }, config);
                                }),
                                delete: (
                                /** Axios config */
                                config) => __awaiter(this, void 0, void 0, function* () {
                                    return yield this.makeRequest("DELETE", `/library/${libraryId}/videos/${videoId}/captions/${srclang}`, {}, undefined, {
                                        400: "Failed deleting the captions",
                                        404: "The requested video or captions were not found",
                                    }, config);
                                }),
                            };
                        },
                    };
                },
                collections: {
                    list: (
                    /** @default 1 */
                    page, 
                    /** @default 100 */
                    itemsPerPage, search, 
                    /** @default "date" */
                    orderBy, 
                    /** Axios config */
                    config) => __awaiter(this, void 0, void 0, function* () {
                        return yield this.makeRequest("GET", `/library/${libraryId}/collections`, {
                            page,
                            itemsPerPage,
                            search,
                            orderBy,
                        }, undefined, {}, config);
                    }),
                    create: (
                    /** The name of the collection */
                    name, 
                    /** Axios config */
                    config) => __awaiter(this, void 0, void 0, function* () {
                        return yield this.makeRequest("POST", `/library/${libraryId}/collections`, {}, { name }, {}, config);
                    }),
                },
                collection: (collectionId) => {
                    return {
                        info: (
                        /** Axios config */
                        config) => __awaiter(this, void 0, void 0, function* () {
                            return yield this.makeRequest("GET", `/library/${libraryId}/collections/${collectionId}`, {}, undefined, {
                                404: "The requested collection was not found",
                            }, config);
                        }),
                        update: (body, 
                        /** Axios config */
                        config) => __awaiter(this, void 0, void 0, function* () {
                            return yield this.makeRequest("POST", `/library/${libraryId}/collections/${collectionId}`, {}, body, {
                                404: "The requested collection was not found",
                            }, config);
                        }),
                        delete: (
                        /** Axios config */
                        config) => __awaiter(this, void 0, void 0, function* () {
                            return yield this.makeRequest("DELETE", `/library/${libraryId}/collections/${collectionId}`, {}, undefined, {
                                404: "The requested collection was not found",
                            }, config);
                        }),
                    };
                },
            };
        };
    }
}
exports.default = BunnyStream;
//# sourceMappingURL=main.js.map