// The buttons to start & stop stream and to capture the image
var btnStart = document.getElementById("btn-start");
var btnRegister = document.getElementById("btn-register");

// The stream & capture
var stream = document.getElementById("stream");
var capture = document.getElementById("capture");
var snapshot = document.getElementById("snapshot");

// The video stream
var cameraStream = null;

function promisify(xhr, failNon2xx = true) {
  const oldSend = xhr.send;
  xhr.send = function () {
    const xhrArguments = arguments;
    return new Promise(function (resolve, reject) {
      xhr.onload = function () {
        if (failNon2xx && (xhr.status < 200 || xhr.status >= 300)) {
          reject({ request: xhr });
        } else {
          resolve(xhr);
        }
      };
      xhr.onerror = function () {
        reject({ request: xhr });
      };
      oldSend.apply(xhr, xhrArguments);
    });
  };
}

function animate(response) {
  $("#tracking, #report, #analysis").empty();
  setTimeout(function () {
    $(".view").removeClass("filter-red_blur");
  }, 500);

  var analysis =
    "^1000<h2>analysis:</h2>^1000<p>6546546465461</p>^200<p>8989000054545</p>^200<p>5699878225255</p>^200<p>0233255714589</p><p>9412323687985<br/><br/></p><p>8885575522255</p><p>5646484513248</p><p>6546626233653</p>";

  var tracking =
    response._label === "unknown"
      ? `^1500identity unknown<span class='square'>&#9632;</span>`
      : `^1500Welcome ${response._label} <span class='square'>&#9632;</span>`;

  $(function () {
    var typed = new Typed("#report", {
      strings: [
        `^1000<p>scan mode 43894</p>size assement<br/><br/>^1000<p><p>assesment complete<br/><br/></p>
        ^500<p>gender ${
          response.gender
        }<br/>gender probability ${response.genderProbability.toFixed(
          2
        )}<br/>age ${response.age.toFixed(2)}<br/><br/></p>
            ^500<p>face expression ${response.expression.expression}</p>
            <p>probability ${response.expression.probability.toFixed(
              2
            )}</p><p>active status</p><p>level 2347923 max</p>`,
      ],
      showCursor: false,
      loop: false,
    });
    var typed = new Typed("#analysis", {
      strings: [analysis],
      loop: false,
      showCursor: false,
      typeSpeed: 0,
      onComplete: function () {
        var typed = new Typed("#tracking", {
          strings: [tracking],
          loop: false,
          showCursor: false,
          typeSpeed: 0,
        });
      },
    });
  });
}

function startStreamingRegister() {
  // var mediaSupport = "mediaDevices" in navigator;

  // if (mediaSupport && null == cameraStream) {
  //   navigator.mediaDevices
  //     .getUserMedia({ video: true })
  //     .then(function (mediaStream) {
  //       cameraStream = mediaStream;

  //       stream.srcObject = mediaStream;

  //       stream.play();
  //       setTimeout(() => {
  //         captureSnapshotsRegister();
  //       }, 1000);
  //     })
  //     .catch(function (err) {
  //       alert(
  //         "Thiết bị của bạn không hỗ trợ camera hoặc chưa được cấp quyền. Vui lòng kiểm tra lại"
  //       );
  //       console.log("Unable to access camera: " + err);
  //     });
  // } else {
  //   if (
  //     window.confirm(
  //       `Quá trình đăng nhập thất bại do không tìm thấy khuôn mặt hoặc có lỗi xảy ra - OK để reload lại trang`
  //     )
  //   ) {
  //     location.reload();
  //   } else {
  //     // They clicked no
  //   }

  //   return;
  // }

  try {
    stream.srcObject = cameraStream;
    stream.play();
    setTimeout(() => {
      captureSnapshotsRegister();
    }, 1000);
  } catch (error) {
    alert(
      "Thiết bị của bạn không hỗ trợ camera hoặc chưa được cấp quyền. Vui lòng kiểm tra lại"
    );
    console.log("Unable to access camera: " + err);
  }
}

async function captureSnapshotsRegister() {
  if (null != cameraStream) {
    const directions = [
      "Nhìn thẳng vào camera và ấn OK",
      "Nhìn một chút sang trái và ấn OK",
    ];
    var data = new FormData();
    const queryParams = new URLSearchParams(window.location.search);
    const username = queryParams.get("username");
    console.log(username);
    const label = username;
    if (label === null) {
      stopStreaming();
      return alert("Có lỗi xảy ra trong quá trình đăng kí");
    }
    data.append("label", label);

    for (i = 0; i < 2; i++) {
      alert(`${directions[i]}`);
      var ctx = capture.getContext("2d");
      var img = new Image();

      ctx.drawImage(stream, 0, 0, capture.width, capture.height);

      img.src = capture.toDataURL("image/jpeg");
      img.width = 240;

      const res = await fetch(img.src);
      const blob = await res.blob();

      const file = new File([blob], `${i + 1}.jpg`, blob);

      data.append("image", file);
    }

    var xhr = new XMLHttpRequest();
    promisify(xhr);

    xhr.open("POST", "http://localhost:5000/register");
    xhr.send(data).then((res) => {
      stopStreaming();
      alert(`Đăng ký thành công`);
      window.location.href = "/";
    }).catch((err) => {
      stopStreaming();
      alert(`Đăng ký không thành công - ${err}`);
    });
  }
}

// Start Streaming
function startStreaming() {
  // var mediaSupport = "mediaDevices" in navigator;

  // if (mediaSupport && null == cameraStream) {
  //   navigator.mediaDevices
  //     .getUserMedia({ video: true })
  //     .then(function (mediaStream) {
  //       cameraStream = mediaStream;

  //       stream.srcObject = mediaStream;

  //       stream.play();
  //       setTimeout(() => {
  //         captureSnapshot();
  //       }, 1000);
  //     })
  //     .catch(function (err) {
  //       console.log("Unable to access camera: " + err);
  //     });
  // } else {
  //   if (
  //     window.confirm(
  //       `Quá trình đăng nhập thất bại do không tìm thấy khuôn mặt hoặc có lỗi xảy ra - OK để reload lại trang`
  //     )
  //   ) {
  //     location.reload();
  //   } else {
  //     // They clicked no
  //   }

  //   return;
  // }
  try {
    stream.srcObject = cameraStream;
    stream.play();
    setTimeout(() => {
      captureSnapshot();
    }, 1000);
  } catch (error) {
    console.log("Unable to access camera: " + err);
    
  }

  return;
}

// Stop Streaming
function stopStreaming() {
  if (null != cameraStream) {
    var track = cameraStream.getTracks()[0];
    track.stop();
    stream.load();
    cameraStream = null;
  }
}

async function captureSnapshot() {
  if (null != cameraStream) {
    var ctx = capture.getContext("2d");
    var img = new Image();

    ctx.drawImage(stream, 0, 0, capture.width, capture.height);

    img.src = capture.toDataURL("image/jpeg");
    img.width = 240;

    fetch(img.src)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "dot.jpg", blob);
        var data = new FormData();
        data.append("image", file);

        var xhr = new XMLHttpRequest();
        promisify(xhr);

        xhr.open("POST", "http://localhost:5000/");
        xhr
          .send(data)
          .then((res) => {
            const result = JSON.parse(res.response);
            // const expression = Object.keys(result.expressions).sort(function (a, b) { return result.expressions[b] - result.expressions[a] })[0]
            // result.expression = { expression, probability: result.expressions[expression] }
            // animate(result);
            if (
              window.confirm(
                `Welcome ${result.fullname} - Click Ok to continue Login`
              )
            ) {
              window.location.href = `https://learn-online-web.web.app/login-by-face?token=${result.token}`;
              window.close();
            } else {
              // They clicked no
            }
          })
          .catch((err) => {
            if (
              window.confirm(
                `Quá trình đăng nhập thất bại do không tìm thấy khuôn mặt hoặc có lỗi xảy ra - OK để reload lại trang`
              )
            ) {
              location.reload();
            } else {
              // They clicked no
            }
          });
      });
  }
}

function start() {
  var mediaSupport = "mediaDevices" in navigator;

  if (mediaSupport && null == cameraStream) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (mediaStream) {
        cameraStream = mediaStream;

        stream.srcObject = mediaStream;

        stream.play();
      })
      .catch(function (err) {
        console.log("Unable to access camera: " + err);
      });
  }

    return; 
}


start();
