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
const promises_1 = __importDefault(require("fs/promises"));
const crypto_1 = __importDefault(require("crypto"));
class BunnyStream {
    constructor(
    /**
     * The API requests are authenticated using the **AccessKey** header. You can find it in your Video Library details page in the bunny.net dashboard.
     *
     * The Stream API uses its own authentication keys. Authenticating via the bunny.net account API key will not work.
     */
    _accessKey) {
        this._accessKey = _accessKey;
        this._endpoint = "https://video.bunnycdn.com";
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
                hourly) => __awaiter(this, void 0, void 0, function* () {
                    const dateFromEpoch = typeof dateFrom === "number" ? dateFrom : dateFrom.getDate() / 1000;
                    const dateToEpoch = typeof dateTo === "number" ? dateTo : dateTo.getDate() / 1000;
                    const res = yield axios_1.default.get(`${this._endpoint}/library/${libraryId}/statistics?dateFrom=${encodeURIComponent(dateFromEpoch)}&dateTo=${encodeURIComponent(dateToEpoch)}&hourly=${encodeURIComponent(hourly)}`);
                    switch (res.status) {
                        case 200: {
                            return res.data;
                        }
                        case 401: {
                            throw new Error("The request authorization failed");
                        }
                        case 404: {
                            throw new Error("The requested video was not found");
                        }
                        case 500: {
                            throw new Error("Internal Server Error");
                        }
                    }
                }),
                videos: {
                    list: (
                    /** @default 1 */
                    page, 
                    /** @default 100 */
                    itemsPerPage, search, collection, 
                    /** @default "date" */
                    orderBy) => __awaiter(this, void 0, void 0, function* () {
                        const res = yield axios_1.default.get(`${this._endpoint}/library/${libraryId}/videos?page=${encodeURIComponent(page)}&itemsPerPage=${encodeURIComponent(itemsPerPage)}&search=${encodeURIComponent(search)}&collection=${encodeURIComponent(collection)}&orderBy=${encodeURIComponent(orderBy)}`, {
                            headers: {
                                AccessKey: this._accessKey,
                            },
                        });
                        switch (res.status) {
                            case 200: {
                                return res.data;
                            }
                            case 401: {
                                throw new Error("The request authorization failed");
                            }
                            case 500: {
                                throw new Error("Internal Server Error");
                            }
                        }
                    }),
                    fetch: (
                    /** The URL where the video will be fetched */
                    url, 
                    /** The headers that will be sent together with the fetch request */
                    headers, collectionId, 
                    /** Video time in ms to extract the main video thumbnail */
                    thumbnailTime, body) => __awaiter(this, void 0, void 0, function* () {
                        const res = yield axios_1.default.post(`${this._endpoint}/library/${libraryId}/videos/fetch?collectionId=${encodeURIComponent(collectionId)}&thumbnailTime=${encodeURIComponent(thumbnailTime)}`, Object.assign({ url,
                            headers }, body), {
                            headers: {
                                "Content-Type": "application/json",
                                AccessKey: this._accessKey,
                            },
                        });
                        switch (res.status) {
                            case 200: {
                                return res.data;
                            }
                            case 400: {
                                throw new Error("Failed fetching the video");
                            }
                            case 401: {
                                throw new Error("The request authorization failed");
                            }
                            case 404: {
                                throw new Error("The requested video was not found");
                            }
                            case 500: {
                                throw new Error("Internal Server Error");
                            }
                        }
                    }),
                },
                video: (videoId) => {
                    return {
                        info: () => __awaiter(this, void 0, void 0, function* () {
                            const res = yield axios_1.default.get(`${this._endpoint}/library/${libraryId}/videos/${videoId}`, {
                                headers: {
                                    AccessKey: this._accessKey,
                                },
                            });
                            switch (res.status) {
                                case 200: {
                                    return res.data;
                                }
                                case 401: {
                                    throw new Error("The request authorization failed");
                                }
                                case 404: {
                                    throw new Error("The requested video was not found");
                                }
                                case 500: {
                                    throw new Error("Internal Server Error");
                                }
                            }
                        }),
                        update: (body) => __awaiter(this, void 0, void 0, function* () {
                            var _a;
                            const res = yield axios_1.default.post(`${this._endpoint}/library/${libraryId}/videos/${videoId}`, body, {
                                headers: {
                                    "Content-Type": "application/json",
                                    AccessKey: this._accessKey,
                                },
                            });
                            switch (res.status) {
                                case 200: {
                                    if (res.data.success) {
                                        return res.data;
                                    }
                                    else {
                                        throw new Error((_a = res.data.message) !== null && _a !== void 0 ? _a : "Unknown Error Occurred");
                                    }
                                }
                                case 401: {
                                    throw new Error("The request authorization failed");
                                }
                                case 404: {
                                    throw new Error("The requested video was not found");
                                }
                                case 500: {
                                    throw new Error("Internal Server Error");
                                }
                            }
                        }),
                        delete: () => __awaiter(this, void 0, void 0, function* () {
                            var _b;
                            const res = yield axios_1.default.delete(`${this._endpoint}/library/${libraryId}/videos/${videoId}`, {
                                headers: {
                                    AccessKey: this._accessKey,
                                },
                            });
                            switch (res.status) {
                                case 200: {
                                    if (res.data.success) {
                                        return res.data;
                                    }
                                    else {
                                        throw new Error((_b = res.data.message) !== null && _b !== void 0 ? _b : "Unknown Error Occurred");
                                    }
                                }
                                case 401: {
                                    throw new Error("The request authorization failed");
                                }
                                case 404: {
                                    throw new Error("The requested video was not found");
                                }
                                case 500: {
                                    throw new Error("Internal Server Error");
                                }
                            }
                        }),
                        upload: ({ video, title, collectionId, thumbnailTime, videoMimeTypeOverride, expirationTimeOverride, createBody, uploadBody, onCreatedVideo, }) => __awaiter(this, void 0, void 0, function* () {
                            const createRes = yield axios_1.default.post(`${this._endpoint}/library/${libraryId}/videos`, Object.assign({ title,
                                collectionId,
                                thumbnailTime }, createBody), {
                                headers: {
                                    "Content-Type": "application/json",
                                    AccessKey: this._accessKey,
                                },
                            });
                            switch (createRes.status) {
                                case 200: {
                                    onCreatedVideo === null || onCreatedVideo === void 0 ? void 0 : onCreatedVideo(createRes.data);
                                    break;
                                }
                                case 401: {
                                    throw new Error("While creating video: The request authorization failed");
                                }
                                case 500: {
                                    throw new Error("While creating video: Internal Server Error");
                                }
                            }
                            const { fileTypeFromBuffer } = yield import("file-type");
                            const videoFile = yield promises_1.default.readFile(video);
                            const videoMimeType = videoMimeTypeOverride !== null && videoMimeTypeOverride !== void 0 ? videoMimeTypeOverride : (yield fileTypeFromBuffer(videoFile));
                            const expirationTime = expirationTimeOverride !== null && expirationTimeOverride !== void 0 ? expirationTimeOverride : 3600000; // 1 day
                            const hash = crypto_1.default.createHash("sha256");
                            hash.update(libraryId + this._accessKey + expirationTime + videoId);
                            // if this ever does get implemented, this function will create the video (https://docs.bunny.net/reference/video_createvideo), then upload the video (https://docs.bunny.net/reference/video_uploadvideo)
                        }),
                        heatmap: () => __awaiter(this, void 0, void 0, function* () {
                            const res = yield axios_1.default.get(`${this._endpoint}/library/${libraryId}/videos/${videoId}/heatmap`, {
                                headers: {
                                    AccessKey: this._accessKey,
                                },
                            });
                            switch (res.status) {
                                case 200: {
                                    return res.data;
                                }
                                case 401: {
                                    throw new Error("The request authorization failed");
                                }
                                case 404: {
                                    throw new Error("The requested video was not found");
                                }
                                case 500: {
                                    throw new Error("Internal Server Error");
                                }
                            }
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
                        hourly) => __awaiter(this, void 0, void 0, function* () {
                            const dateFromEpoch = typeof dateFrom === "number" ? dateFrom : dateFrom.getDate() / 1000;
                            const dateToEpoch = typeof dateTo === "number" ? dateTo : dateTo.getDate() / 1000;
                            const res = yield axios_1.default.get(`${this._endpoint}/library/${libraryId}/statistics?dateFrom=${encodeURIComponent(dateFromEpoch)}&dateTo=${encodeURIComponent(dateToEpoch)}&hourly=${encodeURIComponent(hourly)}&videoGuid=${encodeURIComponent(videoId)}`);
                            switch (res.status) {
                                case 200: {
                                    return res.data;
                                }
                                case 401: {
                                    throw new Error("The request authorization failed");
                                }
                                case 404: {
                                    throw new Error("The requested video was not found");
                                }
                                case 500: {
                                    throw new Error("Internal Server Error");
                                }
                            }
                        }),
                        reencode: () => __awaiter(this, void 0, void 0, function* () {
                            const res = yield axios_1.default.post(`${this._endpoint}/library/${libraryId}/videos/${videoId}/reencode`, {
                                headers: {
                                    AccessKey: this._accessKey,
                                },
                            });
                            switch (res.status) {
                                case 200: {
                                    return res.data;
                                }
                                case 401: {
                                    throw new Error("The request authorization failed");
                                }
                                case 404: {
                                    throw new Error("The requested video was not found");
                                }
                                case 500: {
                                    throw new Error("Internal Server Error");
                                }
                            }
                        }),
                        setThumbnail: (thumbnailUrl, body) => __awaiter(this, void 0, void 0, function* () {
                            const res = yield axios_1.default.post(`${this._endpoint}/library/${libraryId}/videos/${videoId}/thumbnail`, Object.assign({ thumbnailUrl }, body), {
                                headers: {
                                    "Content-Type": "application/json",
                                    AccessKey: this._accessKey,
                                },
                            });
                            switch (res.status) {
                                case 200: {
                                    return res.data;
                                }
                                case 401: {
                                    throw new Error("The request authorization failed");
                                }
                                case 404: {
                                    throw new Error("The requested video could not be found");
                                }
                                case 500: {
                                    throw new Error("Internal Server Error");
                                }
                            }
                        }),
                        caption: (srclang) => {
                            return {
                                add: (
                                /** The text description label for the caption */
                                label, 
                                /** Base64 encoded captions file */
                                captionsFile, body) => __awaiter(this, void 0, void 0, function* () {
                                    const res = yield axios_1.default.post(`${this._endpoint}/library/${libraryId}/videos/${videoId}/captions/${srclang}`, Object.assign({ srclang, label, captionsFile }, body), {
                                        headers: {
                                            "Content-Type": "application/json",
                                            AccessKey: this._accessKey,
                                        },
                                    });
                                    switch (res.status) {
                                        case 200: {
                                            return res.data;
                                        }
                                        case 400: {
                                            throw new Error("Failed uploading the captions");
                                        }
                                        case 401: {
                                            throw new Error("The request authorization failed");
                                        }
                                        case 404: {
                                            throw new Error("The requested video was not found");
                                        }
                                        case 500: {
                                            throw new Error("Internal Server Error");
                                        }
                                    }
                                }),
                                delete: () => __awaiter(this, void 0, void 0, function* () {
                                    const res = yield axios_1.default.delete(`${this._endpoint}/library/${libraryId}/videos/${videoId}/captions/${srclang}`, {
                                        headers: {
                                            AccessKey: this._accessKey,
                                        },
                                    });
                                    switch (res.status) {
                                        case 200: {
                                            return res.data;
                                        }
                                        case 400: {
                                            throw new Error("Failed deleting the captions");
                                        }
                                        case 401: {
                                            throw new Error("The request authorization failed");
                                        }
                                        case 404: {
                                            throw new Error("The requested video or captions were not found");
                                        }
                                        case 500: {
                                            throw new Error("Internal Server Error");
                                        }
                                    }
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
                    orderBy) => __awaiter(this, void 0, void 0, function* () {
                        const res = yield axios_1.default.get(`${this._endpoint}/library/${libraryId}/collections?page=${encodeURIComponent(page)}&itemsPerPage=${encodeURIComponent(itemsPerPage)}&search=${encodeURIComponent(search)}&orderBy=${encodeURIComponent(orderBy)}`, {
                            headers: {
                                AccessKey: this._accessKey,
                            },
                        });
                        switch (res.status) {
                            case 200: {
                                return res.data;
                            }
                            case 401: {
                                throw new Error("The request authorization failed");
                            }
                            case 500: {
                                throw new Error("Internal Server Error");
                            }
                        }
                    }),
                    create: (
                    /** The name of the collection */
                    name) => __awaiter(this, void 0, void 0, function* () {
                        const res = yield axios_1.default.post(`${this._endpoint}/library/${libraryId}/collections`, {
                            name,
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                AccessKey: this._accessKey,
                            },
                        });
                        switch (res.status) {
                            case 200: {
                                return res.data;
                            }
                            case 401: {
                                throw new Error("The request authorization failed");
                            }
                            case 500: {
                                throw new Error("Internal Server Error");
                            }
                        }
                    }),
                },
                collection: (collectionId) => {
                    return {
                        info: () => __awaiter(this, void 0, void 0, function* () {
                            const res = yield axios_1.default.get(`${this._endpoint}/library/${libraryId}/collections/${collectionId}`, {
                                headers: {
                                    AccessKey: this._accessKey,
                                },
                            });
                            switch (res.status) {
                                case 200: {
                                    return res.data;
                                }
                                case 401: {
                                    throw new Error("The request authorization failed");
                                }
                                case 404: {
                                    throw new Error("The requested collection was not found");
                                }
                                case 500: {
                                    throw new Error("Internal Server Error");
                                }
                            }
                        }),
                        update: (body) => __awaiter(this, void 0, void 0, function* () {
                            var _a;
                            const res = yield axios_1.default.post(`${this._endpoint}/library/${libraryId}/collections/${collectionId}`, body, {
                                headers: {
                                    AccessKey: this._accessKey,
                                    "Content-Type": "application/json",
                                },
                            });
                            switch (res.status) {
                                case 200: {
                                    if (res.data.success) {
                                        return res.data;
                                    }
                                    else {
                                        throw new Error((_a = res.data.message) !== null && _a !== void 0 ? _a : "Unknown Error Occurred");
                                    }
                                }
                                case 401: {
                                    throw new Error("The request authorization failed");
                                }
                                case 404: {
                                    throw new Error("The requested collection was not found");
                                }
                                case 500: {
                                    throw new Error("Internal Server Error");
                                }
                            }
                        }),
                        delete: () => __awaiter(this, void 0, void 0, function* () {
                            var _b;
                            const res = yield axios_1.default.delete(`${this._endpoint}/library/${libraryId}/collections/${collectionId}`, {
                                headers: {
                                    AccessKey: this._accessKey,
                                },
                            });
                            switch (res.status) {
                                case 200: {
                                    if (res.data.success) {
                                        return res.data;
                                    }
                                    else {
                                        throw new Error((_b = res.data.message) !== null && _b !== void 0 ? _b : "Unknown Error Occurred");
                                    }
                                }
                                case 401: {
                                    throw new Error("The request authorization failed");
                                }
                                case 404: {
                                    throw new Error("The requested collection was not found");
                                }
                                case 500: {
                                    throw new Error("Internal Server Error");
                                }
                            }
                        }),
                    };
                },
            };
        };
    }
    a() {
        this.library(0).video("").upload;
    }
}
exports.default = BunnyStream;
//# sourceMappingURL=main.js.map