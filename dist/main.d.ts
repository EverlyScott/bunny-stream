/// <reference types="node" />
import axios from "axios";
import { PathLike } from "fs";
export interface PagedList<T> {
    /** The total number of items that can be returned */
    totalItems: number;
    /** The current page of the response */
    currentPage: number;
    /** The number of items returned per page */
    itemsPerPage: number;
    /** The result items on the current result */
    items?: T[];
}
export interface Status {
    /** Determines if the request was successful */
    success: boolean;
    /** Response message description */
    message?: string;
    /** The response status code */
    statusCode: number;
}
export interface Collection {
    /** The video library ID that contains the collection */
    videoLibraryId: number;
    /** The unique ID of the collection */
    guid?: string;
    /** The name of the collection */
    name?: string;
    /** The number of videos that the collection contains */
    videoCount: number;
    /** The total storage size of the collection */
    totalSize: number;
    /** the IDs of videos to be used as preview icons */
    previewVideoIds?: string;
}
export type EditableCollection = Partial<{
    /** The name of the collection */
    name: string;
    [key: string]: any;
}>;
export interface Video {
    /** The ID of the video library that the video belongs to */
    videoLibraryId: number;
    /** The unique ID of the video */
    guid?: string;
    /** The title of the video */
    title?: string;
    /** The date when the video was uploaded */
    dateUploaded: number;
    /** The number of views the video received */
    views: number;
    /** Determines if the video is publically accessible */
    isPublic: boolean;
    /** The duration of the video in seconds */
    length: number;
    status: 1 | 2 | 3 | 4 | 5 | 6 | (number & {});
    /** The framerate of the video */
    framerate: number;
    /** The width of the original video file */
    width: number;
    /** The height of the original video file */
    height: number;
    /** The available resolutions of the video */
    availableResolutions?: string;
    /** The number of thumbnails generated for this video */
    thumbnailCount: number;
    /** The current encode progress of the video */
    encodeProgress: number;
    /** The amount of storage used by this video */
    storageSize: number;
    /** The list of captions available for this video */
    captions?: Caption[];
    /** Determines if the video has MP4 fallback files generated */
    hasMP4Fallback: boolean;
    /** The ID of the collection where the video belongs */
    collectionId?: string;
    /** The file name of the thumbnail inside of the storage */
    thumbnailFileName?: string;
    /** The average watch time of the video in seconds */
    averageWatchTime: number;
    /** The total video watch time in seconds */
    totalWatchTime: number;
    /** The automatically detected category of the video */
    category?: string;
    /** The list of chapters available for the video */
    chapters?: Chapter[];
    /** The list of moments available for the video */
    moments?: Moment[];
    /** The list of meta tags that have been added to the video */
    metaTags?: MetaTag[];
    /** The list of transcoding messages that describe potential issues while the video was transcoding */
    transcodingMessages?: TranscodingMessage[];
}
export type EditableVideo = Partial<{
    /** The title of the video */
    title: string;
    /** The ID of the collection where the video belongs */
    collectionId: string;
    /** The list of chapters available for the video */
    chapters: Chapter[];
    /** The list of moments available for the video */
    moments: Moment[];
    /** The meta tags added to the video */
    metaTags: MetaTag[];
    [key: string]: any;
}>;
export interface Caption {
    /** The unique srclang shortcode for the caption */
    srclang?: string;
    /** The text description label for the caption */
    label?: string;
}
export interface Chapter {
    /** The title of the chapter */
    title: string;
    /** The start time of the chapter in seconds */
    start: number;
    /** The end time of the chapter in seconds */
    end: number;
}
export interface Moment {
    /** The text description label for the chapter */
    label: string;
    /** The timestamp of the moment in seconds */
    timestamp: number;
}
export interface MetaTag {
    property: string;
    value: string;
}
export interface TranscodingMessage {
    timeStamp: number;
    level: 1 | 2 | 3 | (number & {});
    issueCode: 1 | (number & {});
    message: string;
    value: string;
}
export interface Statistics {
    /** The constructed chart of checked requests threats */
    viewsChart?: ChartData;
    /** The constructed chart of the total watch time */
    watchTimeChart?: ChartData;
    /** The contry view count constructed chart */
    countryViewCounts?: ChartData;
    /** The country watch time constructed chart */
    countryWatchTime?: ChartData;
    engagementScore: number;
}
export interface ChartData {
    [key: string]: number;
}
export interface Heatmap {
    heatmap: {
        [key: string]: number;
    };
}
export interface SetThumbnailBody {
    thumbnailUrl: string;
    [key: string]: any;
}
export interface UploadParams {
    /** A path, Buffer, or URL to a video file. */
    video: PathLike;
    /** The title of the video. */
    title: string;
    /** The ID of the collection where the video will be put. */
    collectionId?: string;
    /** Video time in ms to extract the main video thumbnail. */
    thumbnailTime?: number;
    /** Should contain the mime type type of the uploaded video. If not provided, it will be automatically generated using the [file-type package](https://npmjs.org/package/file-type). */
    videoMimeTypeOverride?: string;
    /** Override the signature's expiration time in ... (seconds? ms?) */
    expirationTimeOverride?: number;
    createBody?: Body;
    uploadBody?: Body;
    onCreatedVideo?: (data: Video) => any;
}
export type HTTPMethod = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";
export type HTTPMethodsWithBody = "POST" | "PUT" | "PATCH";
export interface RequestQuery {
    [key: string]: any;
}
export type HTTPErrorCodes = 100 | 101 | 102 | 103 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 147 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511;
export type HTTPErrorMessages = {
    [K in HTTPErrorCodes]?: string;
};
export default class BunnyStream {
    /**
     * The API requests are authenticated using the **AccessKey** header. You can find it in your Video Library details page in the bunny.net dashboard.
     *
     * The Stream API uses its own authentication keys. Authenticating via the bunny.net account API key will not work.
     */
    private _accessKey;
    constructor(
    /**
     * The API requests are authenticated using the **AccessKey** header. You can find it in your Video Library details page in the bunny.net dashboard.
     *
     * The Stream API uses its own authentication keys. Authenticating via the bunny.net account API key will not work.
     */
    _accessKey: string);
    private _endpoint;
    makeRequest: <R = any, B = any, M extends HTTPMethod = HTTPMethod>(method: M, path: string, query?: RequestQuery, body?: M extends HTTPMethodsWithBody ? B : undefined, errorMessages?: HTTPErrorMessages, config?: axios.AxiosRequestConfig<B>) => Promise<R>;
    library: (libraryId: number) => {
        statistics: (dateFrom?: Date | number, dateTo?: Date | number, hourly?: boolean, config?: axios.AxiosRequestConfig<Statistics>) => Promise<"GET">;
        videos: {
            list: (page?: number, itemsPerPage?: number, search?: string, collection?: string, orderBy?: "date" | "title" | (string & {}), config?: axios.AxiosRequestConfig<PagedList<Video>>) => Promise<PagedList<Video>>;
            fetch: (url: string, headers?: {
                [key: string]: string;
            }, collectionId?: string, thumbnailTime?: number, body?: {
                [key: string]: any;
            }, config?: axios.AxiosRequestConfig<Statistics>) => Promise<Status>;
        };
        video: (videoId: string) => {
            info: (config?: axios.AxiosRequestConfig<Statistics>) => Promise<Video>;
            update: (body: EditableVideo, config?: axios.AxiosRequestConfig<Statistics>) => Promise<Status>;
            delete: (config?: axios.AxiosRequestConfig<Statistics>) => Promise<Status>;
            upload: ({ video, title, collectionId, thumbnailTime, videoMimeTypeOverride, expirationTimeOverride, createBody, uploadBody, onCreatedVideo, }: UploadParams) => Promise<never>;
            heatmap: (config?: axios.AxiosRequestConfig<Statistics>) => Promise<Heatmap>;
            statistics: (dateFrom?: Date | number, dateTo?: Date | number, hourly?: boolean, config?: axios.AxiosRequestConfig<Statistics>) => Promise<Statistics>;
            reencode: (config?: axios.AxiosRequestConfig<Statistics>) => Promise<Video>;
            setThumbnail: (thumbnailUrl: string, config?: axios.AxiosRequestConfig<Statistics>) => Promise<Status>;
            caption: (srclang: string) => {
                add: (label?: string, captionsFile?: string, body?: {
                    [key: string]: any;
                }, config?: axios.AxiosRequestConfig<Statistics>) => Promise<Status>;
                delete: (config?: axios.AxiosRequestConfig<Statistics>) => Promise<Status>;
            };
        };
        collections: {
            list: (page?: number, itemsPerPage?: number, search?: string, orderBy?: "date" | (string & {}), config?: axios.AxiosRequestConfig<Statistics>) => Promise<PagedList<Collection>>;
            create: (name: string, config?: axios.AxiosRequestConfig<Statistics>) => Promise<Collection>;
        };
        collection: (collectionId: string) => {
            info: (config?: axios.AxiosRequestConfig<Statistics>) => Promise<Collection>;
            update: (body: EditableVideo, config?: axios.AxiosRequestConfig<Statistics>) => Promise<Status>;
            delete: (config?: axios.AxiosRequestConfig<Statistics>) => Promise<Status>;
        };
    };
}
