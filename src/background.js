const api = typeof browser !== 'undefined' ? browser : chrome;

api.commands.onCommand.addListener((command, tab) => {
  if (!tab) return;

  switch (command) {
    case 'open-tab-current-group':
      openTabCurrentGroup(tab);
      break;
    case 'open-tab-new-group':
      openTabNewGroup(tab);
      break;
    case 'move-tab-to-group':
      moveTabToGroup(tab);
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
  const sameGroupTabs = await api.tabs.query({ currentWindow: true, groupId: currentTab.groupId });

  const newTab = await api.tabs.create({ active: true, index: sameGroupTabs[sameGroupTabs.length - 1].index + 1 });
  api.tabs.group({
    tabIds: newTab.id,
    groupId: currentTab.groupId,
  });
}

async function openTabNewGroup(currentTab) {
  const newTab = await api.tabs.create({ active: true });
  api.tabs.group({
    tabIds: newTab.id,
    groupId: undefined,
  });
}

async function removeTabFromGroup(currentTab) {
  api.tabs.ungroup(currentTab.id);
}

async function toggleSound(currentTab) {
  let muted = !currentTab.mutedInfo.muted;
  api.tabs.update(currentTab.id, { muted });
}

async function duplicateCurrentTab(currentTab) {
  api.tabs.duplicate(currentTab.id);
}

async function moveTabToGroup(currentTab) {
  try {
    const groups = await api.tabGroups.query();

    if (groups.length === 0) {
      api.tabs.group({
        tabIds: currentTab.id,
        groupId: undefined,
      });
      return;
    }

    const newGroupIndex = currentTab.groupId ? groups.findIndex((group) => group.id === currentTab.groupId) : 0;
    api.tabs.group({
      tabIds: currentTab.id,
      groupId: groups[newGroupIndex].id,
    });
  } catch (e) {
    console.error(`${moveTabToGroup.name} Unknown error.`, e);
  }
}
