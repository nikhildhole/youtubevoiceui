if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    console.log("content js started");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    if ('interimResults' in recognition) {
        recognition.interimResults = true;  // Enable interim results for faster feedback
    } else {
        console.warn('interimResults is not supported in this browser');
    }
    
    recognition.onstart = () => {
        console.log("Speech recognition started");
    };

    recognition.onend = () => {
        console.log("Speech recognition ended");
        setTimeout(() => recognition.start(), 100);
    };
    

    recognition.onresult = (event) => {
        console.log("onresult triggered");
        const interimTranscript = event.results[event.resultIndex][0].transcript;
        const finalTranscript = event.results[event.results.length - 1][0].transcript;

        console.log("Interim Transcript: ", interimTranscript);
        console.log("Final Transcript: ", finalTranscript);
        if(finalTranscript){
            handleCommand(finalTranscript.toLowerCase());
            recognition.stop();
        }
    };

    recognition.onerror = (event) => {
        console.error("Error occurred in recognition: ", event.error);
    };

    // Start recognition when the extension is clicked
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message === "start-recognition") {
            recognition.start();
            console.log("Voice recognition started.");
            // sendResponse("Recognition started");
        } else if (message === "stop-recognition") {
            recognition.stop();
            console.log("Voice recognition stopped.");
            // sendResponse("Recognition stopped");
        }
    });
}

function handleCommand(command) {
    const video = document.querySelector("video");
    const player = document.querySelector(".html5-video-player"); // YouTube player container

    if (!video) {
        console.log("Video element not found");
        return;
    }

    // Play / Start video
    if (command.includes("play") || command.includes("start")) {
        video.play();
    }
    
    // Pause / Stop video
    else if (command.includes("pause") || command.includes("stop")) {
        video.pause();
    }

    // Mute video
    else if (command.includes("mute")) {
        const muteButton = player.querySelector(".ytp-mute-button");
        if (muteButton && muteButton.getAttribute("data-title-no-tooltip") === "Mute") {
            muteButton.click(); // Mute the video
        }
    }

    // Unmute video
    else if (command.includes("unmute")) {
        const muteButton = player.querySelector(".ytp-mute-button");
        if (muteButton && muteButton.getAttribute("data-title-no-tooltip") === "Unmute") {
            muteButton.click(); // Unmute the video
        }
    }

    // Volume Up
    else if (command.includes("volume up") || command.includes("volume increase")) {
        if (player) {
            player.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowUp", key: "ArrowUp" }));
        }
    }

    // Volume Down
    else if (command.includes("volume down") || command.includes("volume decrease")) {
        if (player) {
            player.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowDown", key: "ArrowDown" }));
        }
    }

    // Rewind / Back video
    else if (command.includes("rewind") || command.includes("back")) {
        video.currentTime = Math.max(video.currentTime - 10, 0);
    }

    // Forward / Skip video
    else if (command.includes("forward") || command.includes("skip")) {
        video.currentTime = Math.min(video.currentTime + 10, video.duration);
    }

    // YouTube player controls: Next video
    else if (command.includes("next video")) {
        const nextButton = document.querySelector(".ytp-next-button");
        if (nextButton) nextButton.click();
    }

    // YouTube player controls: Previous video
    else if (command.includes("previous video")) {
        const prevButton = document.querySelector(".ytp-prev-button");
        if (prevButton) prevButton.click();
    }

    // Fullscreen
    else if (command.includes("full screen")) {
        const fullscreenButton = player.querySelector(".ytp-fullscreen-button");
        if (fullscreenButton && fullscreenButton.getAttribute("data-title-no-tooltip") === "Full screen") {
            fullscreenButton.click();
        }
    }

    // Exit fullscreen
    else if (command.includes("exit") || command.includes("back from fullscreen")) {
        const fullscreenButton = player.querySelector(".ytp-fullscreen-button");
        if (fullscreenButton && fullscreenButton.getAttribute("data-title-no-tooltip") === "Exit full screen") {
            fullscreenButton.click();
        }
    }

    // Minimize video (YouTube mini-player)
    else if (command.includes("minimize video")) {
        const minimizeButton = player.querySelector(".ytp-miniplayer-button");
        if (minimizeButton) minimizeButton.click();
    }
}
