// Content script entrypoint
console.log('🧹 Content script loaded');

import { ContextMenuManager } from './contextMenuManager';

// Initialize context menu override system
const contextMenuManager = new ContextMenuManager();
contextMenuManager.initialize();

// TODO: Initialize MutationObserver for DOM diff
// TODO: Apply patches via patcher.applyPatches()
