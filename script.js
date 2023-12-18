// The navigator object contains information about the browser.
// The navigator object is a property of the window object.
// The MediaDevices interface provides access to connected media input devices
//  like cameras and microphones, as well as screen sharing. In essence, it lets you obtain
// access to any hardware source of media data.

// getUserMedia()
// With the user's permission through a prompt, turns on a camera and/or a microphone on the system and provides a MediaStream containing a video track and/or an audio track with the input.

let record_btn_cont = document.querySelector(".record-btn-cont");
let capture_btn_cont = document.querySelector(".capture-btn-cont");
let capture_btn = document.querySelector(".capture-btn");
let record_btn = document.querySelector(".record-btn");
let record_flag = false;
let recording_instance = false;
let capturing_instance = false;
let chunks = [];
let video = document.querySelector("video");
let orange = document.querySelector(".orange");
let brown = document.querySelector(".brown");
let golden = document.querySelector(".golden");
let transparent = document.querySelector(".transparent");
let filter_layer = document.querySelector(".filter-layer");
let color_of_filter = "transparent";

// import shortid from "shortid";
const constraints = {
  audio: true,
  video: true,
};
// jo bhi video banegi vo stream ke ander aayegi
// localStorage.clear();
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  console.log("Stream obtained:", stream);
  video.srcObject = stream; // Move this line here
  console.log("Video srcObject set:", video.srcObject);
  recording_instance = new MediaRecorder(stream);
  recording_instance.addEventListener("start", (e) => {
    chunks = [];
  });
  recording_instance.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
  });
  recording_instance.addEventListener("stop", (e) => {
    let blob = new Blob(chunks, { type: "video/mp4" });
    // let videoId = shortid.generate();
    if (db) {
      let dbTransaction = db.transaction("videos", "readwrite"); //transaction kerne ki request
      let video_id = Math.floor(Math.random() * 100000000 + 1);
      // dbTransaction me padi hai
      // dbTransaction ise directly object store ke pass ja sakte hai and uske access ker sakte hai
      let video_store = dbTransaction.objectStore("videos");
      let videoEntry = {
        id: `vid-id:${video_id}`,
        blobData: blob,
      };
      video_store.add(videoEntry);
    }
    let video_url = URL.createObjectURL(blob);
    let anchor = document.createElement("a");
    anchor.href = video_url;
    anchor.download = "stream.mp4";
    anchor.click();
  });
});
// capturing
record_btn_cont.addEventListener("click", (e) => {
  if (!recording_instance) return;
  filter_layer.style.backgroundColor = "transparent";
  color_of_filter = "transparent";
  record_flag = !record_flag;
  if (record_flag) {
    record_btn.classList.add("scale-record");
    recording_instance.start();
    start_Timer();
  } else {
    record_btn.classList.remove("scale-record");
    recording_instance.stop();
    stop_Timer();
  }
});
capture_btn_cont.addEventListener("click", () => {
  // Create a canvas element
  capture_btn.classList.add("scale-capture");
  setInterval(() => {
    capture_btn.classList.remove("scale-capture");
  }, 1000);
  let canvas = document.createElement("canvas");
  let canvasWidth = video.videoWidth;
  let canvasHeight = video.videoHeight;

  // Set the canvas dimensions
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Get 2D context
  let tool = canvas.getContext("2d");

  // Draw the video frame onto the canvas
  tool.drawImage(video, 0, 0, canvasWidth, canvasHeight);

  if (color_of_filter == "orange") {
    tool.fillStyle = "rgba(255, 166, 0, 0.229)";
  } else if (color_of_filter == "brown") {
    tool.fillStyle = "rgba(165, 42, 42, 0.257)";
  } else if (color_of_filter == "golden") {
    tool.fillStyle = "rgba(255, 217, 0, 0.251)";
  } else {
    tool.fillStyle = "transparent";
  }

  tool.fillRect(0, 0, canvasWidth, canvasHeight);

  // Convert the canvas content to a data URL
  let url = canvas.toDataURL("image/jpeg");
  if (db) {
    let dbTransaction = db.transaction("image", "readwrite"); //transaction kerne ki request
    let image_id = Math.floor(Math.random() * 100000000 + 1);
    // dbTransaction me padi hai
    // dbTransaction ise directly object store ke pass ja sakte hai and uske access ker sakte hai
    let image_store = dbTransaction.objectStore("image");
    let imageEntry = {
      id: `img-id:${image_id}`,
      image_url: url,
    };
    image_store.add(imageEntry);
  }
  // Create a link element to trigger the download
  let a = document.createElement("a");
  a.href = url;
  a.download = "image.jpg";

  // Simulate a click on the link to trigger the download
  a.click();
  // capture_btn.classList.remove("scale-capture");
});

let timerID;
let counter = 0; // Represents total seconds
let timer = document.querySelector(".timer");
function start_Timer() {
  timer.style.display = "block";
  timer.textContent = "00:00:00";
  function displayTimer() {
    let totalSeconds = counter;

    let hours = Number.parseInt(totalSeconds / 3600);
    totalSeconds = totalSeconds % 3600; // remaining value

    let minutes = Number.parseInt(totalSeconds / 60);
    totalSeconds = totalSeconds % 60; // remaining value

    let seconds = totalSeconds;

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    timer.innerText = `${hours}:${minutes}:${seconds}`;

    counter++;
  }

  timerID = setInterval(displayTimer, 1000);
}
function stop_Timer() {
  clearInterval(timerID);
  counter = 0;
  timer.innerText = "00:00:00";
  timer.style.display = "none";
}
orange.addEventListener("click", () => {
  filter_layer.style.backgroundColor = "rgba(255, 166, 0, 0.229)";
  color_of_filter = "orange";
});
brown.addEventListener("click", () => {
  filter_layer.style.backgroundColor = "rgba(165, 42, 42, 0.257)";
  color_of_filter = "brown";
});
golden.addEventListener("click", () => {
  filter_layer.style.backgroundColor = "rgba(255, 217, 0, 0.251)";
  color_of_filter = "golden";
});
transparent.addEventListener("click", () => {
  filter_layer.style.backgroundColor = "transparent";
  color_of_filter = "transparent";
});
