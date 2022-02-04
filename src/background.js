chrome.commands.onCommand.addListener((command) => {
  let openWithNewGroup = false;
  if (command === 'open-tab-new-group') {
    openWithNewGroup = true;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const selectingTab = tabs[0];
    chrome.tabs.create({ active: true, index: selectingTab.index + 1 }, (newTab) => {
      chrome.tabs.group({
        tabIds: newTab.id,
        groupId: openWithNewGroup ? undefined : selectingTab.groupId,
      });
    });
  });
});
