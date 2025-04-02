document.addEventListener("DOMContentLoaded", async function () {
    chrome.storage.local.get("selectedText", async function (data) {
        let text = data.selectedText || "No text selected.";
        document.getElementById("originalText").textContent = text;

        if (text !== "No text selected.") {
            try {
                let response = await fetch("https://api.languagetool.org/v2/check", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `text=${encodeURIComponent(text)}&language=en-US`
                });

                let result = await response.json();
                let modifiedText = text.split(""); 

                if (result.matches.length > 0) {
                    result.matches.forEach(match => {
                        let start = match.offset;
                        let end = start + match.length;
                        let errorText = text.substring(start, end);
                        let tooltip = `<span class='highlight' title='${match.message}'>${errorText}</span>`;

                        modifiedText[start] = tooltip;
                        for (let i = start + 1; i < end; i++) {
                            modifiedText[i] = ""; 
                        }
                    });

                    document.getElementById("results").innerHTML = modifiedText.join(""); 
                } else {
                    document.getElementById("results").innerHTML = "<p class='no-issues'>No issues found!</p>";
                }
            } catch (error) {
                console.error("Error fetching LanguageTool API:", error);
                document.getElementById("results").innerHTML = "<p style='color: red;'>Error fetching results.</p>";
            }
        }
    });
});
