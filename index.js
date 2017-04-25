var ffmpeg_webm = require("ffmpeg.js/ffmpeg-webm.js");
var ffmpeg_mp4 = require("ffmpeg.js/ffmpeg-mp4.js");
var fs = require("fs");
var videoData = new Uint8Array(fs.readFileSync("test.webm"));

// Generate thumbnails every second
var thumbs = ffmpeg_webm({
    MEMFS: [{name: 'test.webm', data: videoData}],
    arguments: ["-i", "test.webm", "-f", "image2", "-vsync", "cfr", "-r", "1", "thumb%03d.jpg"],
    stdin: function() {},
});
// Encode test video to MP4.
var result = ffmpeg_mp4({
  MEMFS: [{name: "test.webm", data: videoData}],
  TOTAL_MEMORY: 1073741824,
  arguments: ["-i", "test.webm", "-c:v", "libx264", "-an", "out.mp4"],
  // Ignore stdin read requests.
  stdin: function() {}
});

// Write out.mp4 to disk.
var out = result.MEMFS[0];
var pngs = thumbs.MEMFS;

fs.writeFileSync(out.name, Buffer(out.data));
pngs.forEach((png) => {
  fs.writeFileSync(png.name, Buffer(png.data));
})
