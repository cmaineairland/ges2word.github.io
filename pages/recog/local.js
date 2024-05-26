// 从HTML文档中选择视频输入元素和输出画布元素。
const video3 = document.getElementsByClassName('input_video')[0];
const out3 = document.getElementsByClassName('output')[0];

// 从HTML文档中选择控制面板元素。
const controlsElement = document.getElementsByClassName('control')[0];

// 获取输出画布的2D渲染上下文。
const canvasCtx3 = out3.getContext('2d');

// 创建一个FPS控制对象来监视和显示帧率。
const fpsControl = new FPS();

// 处理MediaPipe Hands模型的结果的回调函数。
function onResultsHands(results) {
    // 向文档的body元素添加'loaded'类。
    document.body.classList.add('loaded');

    // 更新FPS控制对象的帧数。
    fpsControl.tick();

    // 保存当前画布状态。
    canvasCtx3.save();

    // 清空输出画布。
    canvasCtx3.clearRect(0, 0, out3.width, out3.height);

    // 将视频帧绘制到输出画布上。
    canvasCtx3.drawImage(results.image, 0, 0, out3.width, out3.height);

    // 如果检测到多个手部和手的侧向信息，则进行绘制。
    if (results.multiHandLandmarks && results.multiHandedness) {
        for (let index = 0; index < results.multiHandLandmarks.length; index++) {
            const classification = results.multiHandedness[index];
            const isRightHand = classification.label === 'Right';
            const landmarks = results.multiHandLandmarks[index];
            const landmarksJSON = JSON.stringify(landmarks);
            console.log(landmarksJSON);
            // 绘制手部连接线。
            const color = isRightHand ? 'rgba(18, 194, 233, 1)' : 'rgba(246, 79, 89, 1)';
            const fillColor = isRightHand ? 'rgba(196, 113, 237, 1)' : 'rgba(196, 113, 237, 1)';
            drawConnectors(
                canvasCtx3, landmarks, HAND_CONNECTIONS,
                { color: isRightHand ? '#00FF00' : '#FF0000', lineWidth: 2 }),

                // 绘制手部关键点。
                drawLandmarks(canvasCtx3, landmarks, {
                    color: color,
                    fillColor: fillColor,
                    radius: (x) => {
                        return lerp(x.from.z, -0.15, .1, 5, 0.5);
                    }
                });
        }
    }

    // 恢复之前保存的画布状态。
    canvasCtx3.restore();
}

// 创建一个新的Hands对象，用于手部检测。
const hands = new Hands({
    // 配置用于加载MediaPipe Hands模型的文件路径。
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
    }
});

// 设置手部检测的结果处理函数。
hands.onResults(onResultsHands);

// 创建一个新的Camera对象，用于捕获视频帧。
const camera = new Camera(video3, {
    // 每帧处理的回调函数，发送视频帧给手部检测模型。
    onFrame: async () => {
        await hands.send({ image: video3 });
    },
    // 设置视频帧的宽度和高度。
    width: 580,
    height: 520
});

// 启动摄像头。
camera.start();

// 创建一个ControlPanel对象，用于控制手部检测的参数。
new ControlPanel(controlsElement, {
    // 初始参数设置。
    selfieMode: true,
    maxNumHands: 2,
    minDetectionConfidence: 0.9,
    minTrackingConfidence: 0.9
})
    // 添加各种控件到控制面板。
    .add([
        new StaticText({ title: 'MediaPipe Hands' }),
        fpsControl,
        new Toggle({ title: '自拍模式', field: 'selfieMode' }),
        new Slider(
            { title: '最大手部数', field: 'maxNumHands', range: [1, 4], step: 1 }),
        new Slider({
            title: '最小检测置信度',
            field: 'minDetectionConfidence',
            range: [0, 1],
            step: 0.01
        }),
        new Slider({
            title: '最小跟踪置信度',
            field: 'minTrackingConfidence',
            range: [0, 1],
            step: 0.01
        }),
    ])
    // 当控制面板参数变化时触发的回调函数。
    .on(options => {
        console.log(options)
        // 根据自拍模式参数切换视频元素的类。
        video3.classList.toggle('selfie', options.selfieMode);
        // 设置手部检测的参数。
        hands.setOptions(options);
    });
const options = {
    selfieMode: true, // 启用自拍模式
    maxNumHands: 2, // 检测最多2只手
    minDetectionConfidence: 0.5, // 最小检测置信度为0.5
    minTrackingConfidence: 0.5 // 最小跟踪置信度为0.5
};
hands.setOptions(options);