const video3 = document.getElementsByClassName('input_video')[0];
const out3 = document.getElementsByClassName('output')[0];
const controlsElement = document.getElementsByClassName('control')[0];
const canvasCtx3 = out3.getContext('2d');
const fpsControl = new FPS();


let intervalId;
let currentInterval = 5000; // 默认每5秒执行一次
let lastUpdateTime = Date.now();

function updateInterval() {
    const slider = document.getElementById('slider');
    currentInterval = (11 - slider.value) * 1000;
    if (intervalId) {
        clearInterval(intervalId);
    }
    intervalId = setInterval(printLandmarksJSON, currentInterval);
}

let latestLandmarksJSON = null;

function getVector(isRightHand, landmarks) {
    const vector = [];
    const handSign = isRightHand ? 1 : -1;
    vector.push(handSign);
    for (let i = 0; i < landmarks.length; i++) {
        vector.push((landmarks[i].x));
        vector.push((landmarks[i].y));
        vector.push((landmarks[i].z));
    }
    return vector;
}

function onResultsHands(results) {
    document.body.classList.add('loaded');
    fpsControl.tick();
    canvasCtx3.save();
    canvasCtx3.clearRect(0, 0, out3.width, out3.height);
    canvasCtx3.drawImage(results.image, 0, 0, out3.width, out3.height);

    if (results.multiHandLandmarks && results.multiHandedness) {
        for (let index = 0; index < results.multiHandLandmarks.length; index++) {
            const classification = results.multiHandedness[index];
            const isRightHand = classification.label === 'Right';
            const landmarks = results.multiHandLandmarks[index];
            const vector = getVector(isRightHand, landmarks)
            latestLandmarksJSON = JSON.stringify(vector); // 存储最新的landmarksJSON

            const color = isRightHand ? 'rgba(18, 194, 233, 1)' : 'rgba(246, 79, 89, 1)';
            const fillColor = isRightHand ? 'rgba(196, 113, 237, 1)' : 'rgba(196, 113, 237, 1)';
            drawConnectors(canvasCtx3, landmarks, HAND_CONNECTIONS, { color: isRightHand ? '#00FF00' : '#FF0000', lineWidth: 2 });
            drawLandmarks(canvasCtx3, landmarks, {
                color: color,
                fillColor: fillColor,
                radius: (x) => {
                    return lerp(x.from.z, -0.15, .1, 5, 0.5);
                }
            });
        }
        // 更新最后一次更新的时间戳
        lastUpdateTime = Date.now();
    }
    canvasCtx3.restore();
}

function selectedModel() {
    return '默认模型'
}

// 定时器回调函数
function printLandmarksJSON() {
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime <= currentInterval && canFetch) {
        // 在允许的时间范围内，打印最新的 landmarksJSON
        const model = selectedModel()
        const data = {
            type: 'Landmarks',
            value: latestLandmarksJSON,
            selectedModel: model
        };
        try {
            fetch(serversIp, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data) // 添加请求体
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Request failed');
                }
            }).then(data => {
                // 在此处理后端返回的响应数据
                updateWord(data.result);

            }).catch(error => {
                console.error('Request error:', error.message);
            });
        } catch (error) {
            console.error('Fetch error:', error.message);
        }
    }
}

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
    }
});
hands.onResults(onResultsHands);

const camera = new Camera(video3, {
    onFrame: async () => {
        await hands.send({ image: video3 });
    },
});

function updateWord(newchar) {
    const outputWord = document.getElementById('output');
    let currentText = outputWord.textContent;

    if (newchar === 'space') {
        newchar = ' ';
    } else if (newchar === 'del') {
        // 如果 newchar 为 'del'，删除最后一个字符
        currentText = currentText.slice(0, -1);
    } else {
        currentText = currentText + newchar;
    }

    outputWord.textContent = currentText;
}

camera.start();


new ControlPanel(controlsElement, {
    selfieMode: false,
    maxNumHands: 2,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
})
    .add([
        new StaticText({ title: 'MediaPipe Hands' }),
        fpsControl,
        new Toggle({ title: '自拍模式', field: 'selfieMode' }),
        new Slider({ title: '最大手部数', field: 'maxNumHands', range: [1, 4], step: 1 }),
        new Slider({ title: '最小检测置信度', field: 'minDetectionConfidence', range: [0, 1], step: 0.01 }),
        new Slider({ title: '最小跟踪置信度', field: 'minTrackingConfidence', range: [0, 1], step: 0.01 })
    ])
    .on(options => {
        video3.classList.toggle('selfie', options.selfieMode);
        hands.setOptions(options);
    });
const options = {
    selfieMode: true,
    maxNumHands: 1,
    minDetectionConfidence: 0.9,
    minTrackingConfidence: 0.9
};
hands.setOptions(options);

function getSliderValue() {
    const slider = document.getElementById('slider');
    const sliderValue = document.getElementById('sliderValue');

    slider.addEventListener('input', function () {
        sliderValue.textContent = slider.value;
        updateInterval();
    });

    // 初始化时设置一次interval
    updateInterval();
}

getSliderValue();