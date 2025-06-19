document.addEventListener("dblclick", async (e) => {
  const selectedWord = window.getSelection().toString().trim();
  if (selectedWord) {
    const existing = document.getElementById("definition-card");
    if (existing) existing.remove();
    await lookupAndShowDefinition(selectedWord, e.pageX, e.pageY);
  }
});

async function lookupAndShowDefinition(word, x, y) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const entry = data[0];
      const meaning = entry.meanings?.[0];
      const definition = meaning?.definitions?.[0]?.definition || "No definition found.";
      const audioUrl = entry.phonetics?.find(p => p.audio)?.audio || null;

      showDefinitionCard(word, definition, audioUrl, x, y);
    }
  } catch (err) {
    console.error("Failed to fetch definition:", err);
  }
}

function showDefinitionCard(word, definition, audioUrl, x, y) {
  const card = document.createElement("div");
  card.id = "definition-card";
  card.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <strong style="font-size: 18px; color: white;">${word}</strong>
      ${audioUrl ? `<button id="play-audio" style="background:none;border:none;cursor:pointer;"><img src="${chrome.runtime.getURL('audio_button.png')}" alt="Play Audio" style="width: 24px; height: 24px;"/></button>` : ""}
    </div>
    <p style="margin: 6px 0 10px 0; line-height: 1.4; color: white;">${definition}</p>
    <a href="https://www.google.com/search?q=define+${word}" target="_blank" style="font-size: 12px; color: #ccc;">See all definitions</a>
  `;

  card.style.position = "absolute";
  card.style.visibility = "hidden";
  card.style.maxWidth = "300px";
  document.body.appendChild(card);

  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  const range = window.getSelection().getRangeAt(0);
  const rect = range.getBoundingClientRect();

  let top = rect.bottom + window.scrollY + 10;
  let left = rect.left + window.scrollX;

  if (rect.bottom + cardHeight + 20 > viewportHeight) {
    top = rect.top + window.scrollY - cardHeight - 10;
  }


  if (left + cardWidth > viewportWidth) {
    left = viewportWidth - cardWidth - 10;
  }
  if (left < 10) {
    left = 10;
  }

  card.style.top = `${top}px`;
  card.style.left = `${left}px`;
  card.style.visibility = "visible";
  card.style.background = "#333";
  card.style.color = "white";
  card.style.padding = "12px";
  card.style.borderRadius = "8px";
  card.style.fontFamily = "sans-serif";
  card.style.fontSize = "14px";
  card.style.zIndex = "999999";
  card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";

  if (audioUrl) {
    card.querySelector("#play-audio").onclick = () => new Audio(audioUrl).play();
  }

  //setTimeout(() => card.remove(), 5000);

  setTimeout(() => {
    document.addEventListener("click", function clickAway(event) {
      if (!card.contains(event.target)) {
        card.remove();
        document.removeEventListener("click", clickAway);
      }
    });
  }, 50);
}
