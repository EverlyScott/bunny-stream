import axios from "axios";
import { PathLike } from "fs";
import fs from "fs/promises";
import crypto, { Hash } from "crypto";

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

export default class BunnyStream {
  constructor(
    /**
     * The API requests are authenticated using the **AccessKey** header. You can find it in your Video Library details page in the bunny.net dashboard.
     *
     * The Stream API uses its own authentication keys. Authenticating via the bunny.net account API key will not work.
     */
    private _accessKey: string
  ) {}

  // a() {
  //   this.library(0).video("").upload;
  // }

  private _endpoint = "https://video.bunnycdn.com";

  library = (libraryId: number) => {
    return {
      statistics: async (
        /**
         * The start date of the statistics
         *
         * @default
         * ```js
         * Date.now() / 1000 - 2592000 // 30 days from now
         * ```
         */
        dateFrom?: Date | number,
        /**
         * The end date of the statistics
         *
         * @default
         * ```js
         * Date.now() / 1000 // Current date in seconds
         * ```
         */
        dateTo?: Date | number,
        /** If true, the statistics data will be returned in hourly groupping */
        hourly?: boolean
      ) => {
        const dateFromEpoch = typeof dateFrom === "number" ? dateFrom : dateFrom.getDate() / 1000;
        const dateToEpoch = typeof dateTo === "number" ? dateTo : dateTo.getDate() / 1000;

        const res = await axios.get<Statistics>(
          `${this._endpoint}/library/${libraryId}/statistics?dateFrom=${encodeURIComponent(
            dateFromEpoch
          )}&dateTo=${encodeURIComponent(dateToEpoch)}&hourly=${encodeURIComponent(hourly)}`
        );

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
      },
      videos: {
        list: async (
          /** @default 1 */
          page?: number,
          /** @default 100 */
          itemsPerPage?: number,
          search?: string,
          collection?: string,
          /** @default "date" */
          orderBy?: "date" | "title" | (string & {})
        ) => {
          const res = await axios.get<PagedList<Video>>(
            `${this._endpoint}/library/${libraryId}/videos
            ${page !== undefined && `?page=${encodeURIComponent(page)}`}
            ${collection !== undefined && `&collection=${encodeURIComponent(collection)}`}
            ${itemsPerPage !== undefined && `&itemsPerPage=${encodeURIComponent(itemsPerPage)}`}
            ${search !== undefined && `&search=${encodeURIComponent(search)}`}
            ${orderBy !== undefined && `&orderBy=${encodeURIComponent(orderBy)}`}`,
            {
              headers: {
                AccessKey: this._accessKey,
              },
            }
          );

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
        },
        fetch: async (
          /** The URL where the video will be fetched */
          url: string,
          /** The headers that will be sent together with the fetch request */
          headers?: {
            [key: string]: string;
          },
          collectionId?: string,
          /** Video time in ms to extract the main video thumbnail */
          thumbnailTime?: number,
          body?: {
            [key: string]: any;
          }
        ) => {
          const res = await axios.post<Status>(
            `${this._endpoint}/library/${libraryId}/videos/fetch?collectionId=${encodeURIComponent(
              collectionId
            )}&thumbnailTime=${encodeURIComponent(thumbnailTime)}`,
            {
              url,
              headers,
              ...body,
            },
            {
              headers: {
                "Content-Type": "application/json",
                AccessKey: this._accessKey,
              },
            }
          );

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
        },
      },
      video: (videoId: string) => {
        return {
          info: async () => {
            const res = await axios.get<Video>(`${this._endpoint}/library/${libraryId}/videos/${videoId}`, {
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
          },
          update: async (body: EditableVideo) => {
            const res = await axios.post<Status>(`${this._endpoint}/library/${libraryId}/videos/${videoId}`, body, {
              headers: {
                "Content-Type": "application/json",
                AccessKey: this._accessKey,
              },
            });

            switch (res.status) {
              case 200: {
                if (res.data.success) {
                  return res.data;
                } else {
                  throw new Error(res.data.message ?? "Unknown Error Occurred");
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
          },
          delete: async () => {
            const res = await axios.delete<Status>(`${this._endpoint}/library/${libraryId}/videos/${videoId}`, {
              headers: {
                AccessKey: this._accessKey,
              },
            });

            switch (res.status) {
              case 200: {
                if (res.data.success) {
                  return res.data;
                } else {
                  throw new Error(res.data.message ?? "Unknown Error Occurred");
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
          },
          upload: async ({
            video,
            title,
            collectionId,
            thumbnailTime,
            videoMimeTypeOverride,
            expirationTimeOverride,
            createBody,
            uploadBody,
            onCreatedVideo,
          }: UploadParams) => {
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
          },
          heatmap: async () => {
            const res = await axios.get<Heatmap>(`${this._endpoint}/library/${libraryId}/videos/${videoId}/heatmap`, {
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
          },
          statistics: async (
            /**
             * The start date of the statistics
             *
             * @default
             * ```js
             * Date.now() / 1000 - 2592000 // 30 days from now
             * ```
             */
            dateFrom?: Date | number,
            /**
             * The end date of the statistics
             *
             * @default
             * ```js
             * Date.now() / 1000 // Current date in seconds
             * ```
             */
            dateTo?: Date | number,
            /** If true, the statistics data will be returned in hourly groupping */
            hourly?: boolean
          ) => {
            const dateFromEpoch = typeof dateFrom === "number" ? dateFrom : dateFrom.getDate() / 1000;
            const dateToEpoch = typeof dateTo === "number" ? dateTo : dateTo.getDate() / 1000;

            const res = await axios.get<Statistics>(
              `${this._endpoint}/library/${libraryId}/statistics?dateFrom=${encodeURIComponent(
                dateFromEpoch
              )}&dateTo=${encodeURIComponent(dateToEpoch)}&hourly=${encodeURIComponent(
                hourly
              )}&videoGuid=${encodeURIComponent(videoId)}`
            );

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
          },
          reencode: async () => {
            const res = await axios.post<Video>(`${this._endpoint}/library/${libraryId}/videos/${videoId}/reencode`, {
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
          },
          setThumbnail: async (thumbnailUrl: string) => {
            const res = await axios.post<Status>(
              `${this._endpoint}/library/${libraryId}/videos/${videoId}/thumbnail?thumbnailUrl=${encodeURIComponent(
                thumbnailUrl
              )}`,
              {
                headers: {
                  AccessKey: this._accessKey,
                },
              }
            );

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
          },
          caption: (srclang: string) => {
            return {
              add: async (
                /** The text description label for the caption */
                label?: string,
                /** Base64 encoded captions file */
                captionsFile?: string,
                body?: {
                  [key: string]: any;
                }
              ) => {
                const res = await axios.post<Status>(
                  `${this._endpoint}/library/${libraryId}/videos/${videoId}/captions/${srclang}`,
                  { srclang, label, captionsFile, ...body },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      AccessKey: this._accessKey,
                    },
                  }
                );

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
              },
              delete: async () => {
                const res = await axios.delete<Status>(
                  `${this._endpoint}/library/${libraryId}/videos/${videoId}/captions/${srclang}`,
                  {
                    headers: {
                      AccessKey: this._accessKey,
                    },
                  }
                );

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
              },
            };
          },
        };
      },
      collections: {
        list: async (
          /** @default 1 */
          page?: number,
          /** @default 100 */
          itemsPerPage?: number,
          search?: string,
          /** @default "date" */
          orderBy?: "date" | (string & {})
        ) => {
          const res = await axios.get<PagedList<Collection>>(
            `${this._endpoint}/library/${libraryId}/collections?page=${encodeURIComponent(
              page
            )}&itemsPerPage=${encodeURIComponent(itemsPerPage)}&search=${encodeURIComponent(
              search
            )}&orderBy=${encodeURIComponent(orderBy)}`,
            {
              headers: {
                AccessKey: this._accessKey,
              },
            }
          );

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
        },
        create: async (
          /** The name of the collection */
          name: string
        ) => {
          const res = await axios.post<Collection>(
            `${this._endpoint}/library/${libraryId}/collections`,
            {
              name,
            },
            {
              headers: {
                "Content-Type": "application/json",
                AccessKey: this._accessKey,
              },
            }
          );

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
        },
      },
      collection: (collectionId: string) => {
        return {
          info: async () => {
            const res = await axios.get<Collection>(
              `${this._endpoint}/library/${libraryId}/collections/${collectionId}`,
              {
                headers: {
                  AccessKey: this._accessKey,
                },
              }
            );

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
          },
          update: async (body: EditableVideo) => {
            const res = await axios.post<Status>(
              `${this._endpoint}/library/${libraryId}/collections/${collectionId}`,
              body,
              {
                headers: {
                  AccessKey: this._accessKey,
                  "Content-Type": "application/json",
                },
              }
            );

            switch (res.status) {
              case 200: {
                if (res.data.success) {
                  return res.data;
                } else {
                  throw new Error(res.data.message ?? "Unknown Error Occurred");
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
          },
          delete: async () => {
            const res = await axios.delete<Status>(
              `${this._endpoint}/library/${libraryId}/collections/${collectionId}`,
              {
                headers: {
                  AccessKey: this._accessKey,
                },
              }
            );

            switch (res.status) {
              case 200: {
                if (res.data.success) {
                  return res.data;
                } else {
                  throw new Error(res.data.message ?? "Unknown Error Occurred");
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
          },
        };
      },
    };
  };
}
