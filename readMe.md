# YouTube Playlist Downloader API

A REST API built with **Node.js**, **Express.js**, and **youtube-dl-exec (yt-dlp)** to fetch YouTube playlist metadata and downloadable video information.

---

## Features

- Fetch complete playlist information.
- Get metadata for every video in a playlist.
- Returns a clean and optimized JSON response.
- Built-in request rate limiting.
- Response compression using gzip.
- CORS enabled.
- Input validation for playlist URLs.
- Production-ready structure.

---

## Tech Stack

- Node.js
- Express.js
- yt-dlp
- youtube-dl-exec
- Compression
- Express Rate Limit
- CORS

---

# Endpoints

## Health Check

### GET /

Returns server status.

### Response

```json
{
  "success": true,
  "message": "API Is working Fine"
}
```

---

## Get Playlist Data

### POST

```
/yt-playlist/get-playlist-data
```

### Request Body

```json
{
  "playlistUrl": "https://www.youtube.com/playlist?list=YOUR_PLAYLIST_ID"
}
```

---

## Success Response

```json
{
  "success": true,
  "message": "Playlist data Fetch Successfully..",
  "data": {
    "id": "PLxxxxxxxx",
    "title": "React Tutorial",
    "availability": "public",
    "description": "...",
    "mainThumbnail": {
      "url": "https://..."
    },
    "lastModified": "20250615",
    "viewCount": 120000,
    "playlistCount": 45,
    "channelName": "Programming Channel",
    "channelUrl": "https://www.youtube.com/@channel",

    "entries": [
      {
        "thumbnail": "https://...",
        "description": "...",
        "duration": 752,
        "viewCount": 15422,
        "likeCount": 623,
        "availability": "public",
        "webpage_url": "https://youtube.com/watch?v=xxxxx",

        "requestedDownloads": {
          "url": "...",
          "ext": "mp4",
          "audio_ext": "m4a",
          "video_ext": "mp4",
          .........
        }
      }
    ]
  },
  ......
}
```

---

## Error Response

```json
{
  "success": false,
  "message": "please provide Valid playlistUrl"
}
```

### POST

```
/tiktok/download-video
```

### Request Body

```json
{
  "tiktokUrl": "https://www.tiktok.com/@username/video/VIDOE_ID"
}
```

### Response

```js
{
  "success": true,
  "message": "your result is ready",
  "data": [
    "Array of Vidoes alteast three"
  ]
}
```

### POST

```
/tiktok/download-images
```

### Request Body

```json
{
  "tiktokUrl": "https://www.tiktok.com/@username/photo/POST_DI"
}
```

### Response

this will return downlaodable mp4 file and frontend should to tackle this like below

```js
currentObjectUrl = URL.createObjectURL(res.json());
videoPlayer.src = currentObjectUrl;
downloadBtn.href = currentObjectUrl;
```

---

# Request Example

```javascript
const response = await fetch(
  "http://localhost:4000/yt-playlist/get-playlist-data",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playlistUrl: "https://www.youtube.com/playlist?list=YOUR_PLAYLIST_ID",
    }),
  },
);

const data = await response.json();
console.log(data);
```

---

# Response Object

| Field         | Type   | Description             |
| ------------- | ------ | ----------------------- |
| id            | string | Playlist ID             |
| title         | string | Playlist title          |
| description   | string | Playlist description    |
| availability  | string | Playlist visibility     |
| mainThumbnail | object | Playlist thumbnail      |
| lastModified  | string | Last modified date      |
| playlistCount | number | Total videos            |
| viewCount     | number | Playlist views          |
| channelName   | string | Channel name            |
| channelUrl    | string | Channel URL             |
| entries       | array  | List of playlist videos |

---

# Video Object

| Field              | Type   |
| ------------------ | ------ |
| thumbnail          | string |
| description        | string |
| duration           | number |
| viewCount          | number |
| likeCount          | number |
| availability       | string |
| webpage_url        | string |
| requestedDownloads | object |

---

# Download Object

| Field     | Type   | Description             |
| --------- | ------ | ----------------------- |
| url       | string | Direct downloadable URL |
| ext       | string | File extension          |
| audio_ext | string | Audio format            |
| video_ext | string | Video format            |

---

# HTTP Status

| Status | Meaning               |
| ------ | --------------------- |
| 200    | Success               |
| 400    | Invalid Request       |
| 429    | Too Many Requests     |
| 500    | Internal Server Error |

---

# License

MIT
