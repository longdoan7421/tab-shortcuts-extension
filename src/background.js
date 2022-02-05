chrome.commands.onCommand.addListener((command, tab) => {
  if (!tab) return;

  switch (command) {
    case 'open-tab-current-group':
      openTabCurrentGroup(tab);
      break;
    case 'open-tab-new-group':
      openTabNewGroup(tab);
      break;
    case 'remove-tab-from-group':
      removeTabFromGroup(tab);
      break;
    case 'toggle-sound':
      toggleSound(tab);
      break;
    case 'duplicate-current-tab':
      duplicateCurrentTab(tab);
      break;
    default:
      break;
  }
});

async function openTabCurrentGroup(currentTab) {
  const sameGroupTabs = await chrome.tabs.query({ currentWindow: true, groupId: currentTab.groupId });

  const newTab = await chrome.tabs.create({ active: true, index: sameGroupTabs[sameGroupTabs.length - 1].index + 1 });
  chrome.tabs.group({
    tabIds: newTab.id,
    groupId: currentTab.groupId,
  });
}

async function openTabNewGroup(currentTab) {
  const newTab = await chrome.tabs.create({ active: true });
  chrome.tabs.group({
    tabIds: newTab.id,
    groupId: undefined,
  });
}

async function removeTabFromGroup(currentTab) {
  chrome.tabs.ungroup(currentTab.id);
}

async function toggleSound(currentTab) {
  let muted = !currentTab.mutedInfo.muted;
  chrome.tabs.update(currentTab.id, { muted });
}

async function duplicateCurrentTab(currentTab) {
  chrome.tabs.duplicate(currentTab);
}
