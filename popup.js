hideSpam.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: removeSpam,
  });
});

function removeSpam() {
  let observer = null;
  const elementTagType = "yt-live-chat-text-message-renderer";
  const chatIframe = document.querySelector("#chatframe");
  const isSpam = (node) => {
    return node.textContent.toLowerCase().includes("naked");
  };

  let nodes =
    chatIframe.contentWindow.document.querySelectorAll(elementTagType);
  nodes.forEach((n) => {
    if (isSpam(n)) {
      n.remove();
    }
  });

  if (observer) return;

  observer = new MutationObserver(function (mutations_list) {
    mutations_list.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (added_node) {
        if (
          added_node.nodeName.toLowerCase() === elementTagType &&
          isSpam(added_node)
        ) {
          added_node.remove();
        }
      });
    });
  });

  observer.observe(chatIframe, {
    subtree: true,
    childList: true,
  });
}
