chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const word = request.word;
  if (word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(response => response.json())
      .then(data => {
        let meaning = "Definition not found.";
        if (Array.isArray(data) && data.length > 0 && data[0].meanings && data[0].meanings.length > 0) {
          meaning = data[0].meanings[0].definitions[0]?.definition || meaning;
        }
        document.getElementById('result').innerText = meaning;
      })
      .catch(err => {
        document.getElementById('result').innerText = "Error fetching definition.";
        console.error("Error fetching definition in popup:", err);
      });
  }
});