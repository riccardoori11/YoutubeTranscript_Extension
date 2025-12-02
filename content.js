function WaitforTranscript(){

	    return new Promise(resolve => {
        let tries = 0

        const check = () => {
            const segments = document.querySelectorAll('ytd-transcript-segment-renderer')

            if (segments.length > 0) {
                resolve(segments)
            } else if (tries > 50) {
                resolve([]) 
            } else {
                tries++
                setTimeout(check, 100)
            }
        };

        check();
    });	
}

async function ExtractTranscript(){
		
		
		
		const button_transcript = find_TranscriptButton()
		if (button_transcript){
				button_transcript.click()

				const transcript = await WaitforTranscript()


				if (transcript.length == 0){
						
						return {
								message: "Successfully found transcript button but transcript was unavailable"
					}


				}
				else{

						let plaintext = ''
						transcript.forEach(segment=>{
				
						const text = segment.querySelector('.segment-text')?.textContent
						if (text){
						
						
							plaintext += text

								}


						})

						return {

								message: "Successful",
								Transcript: plaintext
						}				

				}
				
		}
		else{

				return {
						message: "Could not find error"
				}
		}
	
}

function find_TranscriptButton(){

		
		let button = document.querySelector('button[aria-label = "Show transcript"]')
		if (button){
				return button
		}
		


}



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractTranscript") {
        ExtractTranscript().then(result => {
            sendResponse(result);
        });
        return true; // Required for async response
    }
});



