document.getElementById('extractBtn').addEventListener('click', async () => {
    const btn = document.getElementById('extractBtn');
    const status = document.getElementById('status');
    const result = document.getElementById('result');
    const copyBtn = document.getElementById('copyBtn');
    
    btn.disabled = true;
    btn.textContent = 'Extracting...';
    status.innerHTML = '';
    result.innerHTML = '';
    copyBtn.style.display = 'none';
    
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab.url.includes('youtube.com/watch')) {
            status.innerHTML = '<div class="status error">Please navigate to a YouTube video page</div>';
            btn.disabled = false;
            btn.textContent = 'Extract Transcript';
            return;
        }
        
        // Send message to content script instead of injecting code
        chrome.tabs.sendMessage(tab.id, { action: "extractTranscript" }, (response) => {
            if (chrome.runtime.lastError) {
                status.innerHTML = '<div class="status error">Error: Please refresh the YouTube page and try again</div>';
            } else if (response.message === "Successful") {
                status.innerHTML = '<div class="status success">✓ Transcript extracted successfully!</div>';
                result.textContent = response.Transcript;
                copyBtn.style.display = 'block';
                window.currentTranscript = response.Transcript;
            } else {
                status.innerHTML = `<div class="status error">✗ ${response.message}</div>`;
            }
            
            btn.disabled = false;
            btn.textContent = 'Extract Transcript';
        });
        
    } catch (error) {
        status.innerHTML = `<div class="status error">Error: ${error.message}</div>`;
        btn.disabled = false;
        btn.textContent = 'Extract Transcript';
    }
});

document.getElementById('copyBtn').addEventListener('click', () => {
    if (window.currentTranscript) {
        navigator.clipboard.writeText(window.currentTranscript).then(() => {
            const copyBtn = document.getElementById('copyBtn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓ Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    }
});
