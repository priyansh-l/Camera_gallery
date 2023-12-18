let gallery_cont = document.querySelector(".gallery-cont");

setTimeout(() => {
  if (db) {
    let dbTransaction = db.transaction("videos", "readonly");
    let videoStore = dbTransaction.objectStore("videos");
    let videoRequest = videoStore.getAll(); //eventDriven
    videoRequest.onsuccess = (e) => {
      //   console.log(videoRequest.result);
      let all_videos = videoRequest.result;
      all_videos.forEach((videoObject) => {
        let videos = document.createElement("div");
        videos.setAttribute("class", "media-cont");
        videos.setAttribute("id", videoObject.id);
        let url = URL.createObjectURL(videoObject.blobData);
        videos.innerHTML = `
        <div class="image-video">
                 
                  <video autoplay loop muted src="${url}"></video> 
            </div>
            <div class="delete action-btn">Delete</div>
            <div class="download action-btn">Download</div>
        `;
        gallery_cont.appendChild(videos);
        let download_btn = videos.querySelector(".download");
        download_function(download_btn);
        let delete_btn = videos.querySelector(".delete");
        delete_function(delete_btn);
      });
    };

    let dbTransaction_image = db.transaction("image", "readonly");
    let imageStore = dbTransaction_image.objectStore("image");
    let imageRequest = imageStore.getAll(); //eventDriven
    imageRequest.onsuccess = (e) => {
      //   console.log(imageRequest.result);
      let all_image = imageRequest.result;
      all_image.forEach((imageObject) => {
        let images = document.createElement("div");
        images.setAttribute("class", "media-cont");
        images.setAttribute("id", imageObject.id);
        // here images is the content-cont
        let url = imageObject.image_url;
        images.innerHTML = `
        <div class="image-video">
                  <img src="${url}">
            </div>
            <div class="delete action-btn">Delete</div>
            <div class="download action-btn">Download</div>
        `;
        gallery_cont.appendChild(images);
        let download_btn = images.querySelector(".download");
        download_function(download_btn);
        let delete_btn = images.querySelector(".delete");
        delete_function(delete_btn);
      });
    };
  }
}, 100);
function download_function(download_btn) {
  download_btn.addEventListener("click", (e) => {
    let id = e.target.parentElement.getAttribute("id");
    if (id[0] === "v") {
      let dbTransaction = db.transaction("videos", "readwrite");
      let videoStore = dbTransaction.objectStore("videos");
      let videoRequest = videoStore.get(id); //eventDriven
      videoRequest.onsuccess = (e) => {
        // console.log(videoRequest.result.blobData);
        let url = URL.createObjectURL(videoRequest.result.blobData);
        let anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "stream.mp4";
        anchor.click();
      };
    } else {
      let dbTransaction_image = db.transaction("image", "readwrite");
      let imageStore = dbTransaction_image.objectStore("image");
      let imageRequest = imageStore.get(id); //eventDriven
      imageRequest.onsuccess = (e) => {
        // console.log(imageRequest);
        let url = imageRequest.result.image_url;
        let anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "image.jpeg";
        anchor.click();
      };
    }
  });
}
function delete_function(delete_btn) {
  delete_btn.addEventListener("click", (e) => {
    // let parent_node = delete_btn.parentNode;
    // gallery_cont.removeChild(parent_node);
    let id = e.target.parentElement.getAttribute("id");
    gallery_cont.removeChild(e.target.parentElement);
    if (id[0] === "i") {
      let dbTransaction_image = db.transaction("image", "readwrite");
      let image_Store = dbTransaction_image.objectStore("image");
      image_Store.delete(id);
    } else {
      let dbTransaction = db.transaction("videos", "readwrite");
      let video_Store = dbTransaction.objectStore("videos");
      video_Store.delete(id);
    }
  });
}
