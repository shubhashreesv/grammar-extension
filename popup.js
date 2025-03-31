document.addEventListener("DOMContentLoaded", async function () {
    chrome.storage.local.get("selectedText", async function (data) {
        let text = data.selectedText || "No text selected.";
        document.getElementById("originalText").textContent = text;

        if (text !== "No text selected.") {
            let response = await fetch("https://api.languagetool.org/v2/check", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `text=${encodeURIComponent(text)}&language=en-US`
            });

            let result = await response.json();
            let highlightedText = text;

            if (result.matches.length > 0) {
                result.matches.forEach(match => {
                    let errorText = text.substring(match.offset, match.offset + match.length);
                    let tooltip = `<span class='highlight' title='${match.message}'>${errorText}</span>`;
                    highlightedText = highlightedText.replace(errorText, tooltip);
                });
                document.getElementById("results").innerHTML = highlightedText;
            } else {
                document.getElementById("results").innerHTML = "<p class='no-issues'>No issues found!</p>";
            }
        }
    });
});