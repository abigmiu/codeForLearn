/**
 * 
 * @param {HTMLVideoElement} video 
 * @returns 
 */
function drawVideo(video) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
            const res = {
                blob,
                url: window.URL.createObjectURL(blob)
            }

            resolve(res);
        })

        // document.body.appendChild(canvas)
    })
}

/** 获取视频的某一帧 */
export function captureVideo(file, currentTime = 0) {
    const videoEl = document.createElement('video')

    videoEl.currentTime = currentTime;
    // videoEl.muted = true;
    // videoEl.autoplay = true;
    videoEl.oncanplay = async () => {
        const res = await drawVideo(videoEl)
        const image = document.createElement('img');
        image.src = res.url;
        document.body.appendChild(image);
    }
    videoEl.src = window.URL.createObjectURL(file);
    // document.body.appendChild(videoEl)
}

export class VideoCapture {
    constructor(file) {
        const videoEl = document.createElement('video');
        this.videoEl = videoEl;
        const fileUrl = window.URL.createObjectURL(file);
        this.fileUrl = fileUrl;
        console.log(videoEl);
    }

    load() {
        return new Promise((resolve) => {
            this.videoEl.onloadeddata = () => {
                resolve()
            }
            this.videoEl.src = this.fileUrl;
        })
    }

    setTime(currentTime) {
        return new Promise((resolve) => {
            this.videoEl.onseeked = () => {
                resolve();
            }
            this.videoEl.currentTime = currentTime
        })
    }

    draw() {
        const video = this.videoEl;
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            canvas.toBlob((blob) => {
                resolve(window.URL.createObjectURL(blob));
            })
        })
    }

    appendImage(src) {
        const image = document.createElement('img');
        image.src = src;
        document.body.appendChild(image);
    }
}

