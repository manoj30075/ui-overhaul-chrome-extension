import { MenuAction as MenuActionSchema } from '../shared/schema';

// Internal menu action type with action handler
interface MenuAction extends Omit<MenuActionSchema, 'enabled'> {
  action: () => void;
}

export class ContextMenuManager {
  private customMenu: HTMLElement | null = null;
  private shadowHost: HTMLElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private isMenuVisible = false;

  initialize(): void {
    this.setupEventListeners();
    console.log('🎯 Context menu override system initialized');
  }

  private setupEventListeners(): void {
    // Intercept right-click events
    document.addEventListener('contextmenu', this.handleContextMenu.bind(this), true);
    
    // Handle clicks outside menu to close it
    document.addEventListener('click', this.handleDocumentClick.bind(this), true);
    
    // Handle escape key to close menu
    document.addEventListener('keydown', this.handleKeydown.bind(this), true);
    
    // Handle window resize to reposition menu
    window.addEventListener('resize', this.hideMenu.bind(this));
  }

  private handleContextMenu(event: MouseEvent): void {
    // Allow native context menu when Shift key is held
    if (event.shiftKey) {
      return;
    }

    // Prevent default context menu
    event.preventDefault();
    event.stopPropagation();

    // Show custom menu at click position
    this.showCustomMenu(event.pageX, event.pageY, event.target as Element);
  }

  private handleDocumentClick(event: MouseEvent): void {
    if (this.isMenuVisible && this.customMenu) {
      // Check if click is outside the custom menu
      if (!this.customMenu.contains(event.target as Node)) {
        this.hideMenu();
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isMenuVisible) {
      this.hideMenu();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private showCustomMenu(x: number, y: number, target: Element): void {
    // Hide existing menu if visible
    this.hideMenu();

    // Create custom menu element
    this.customMenu = this.createMenuElement(target);
    
    // Position menu with edge detection
    this.positionMenu(x, y);
    
    // Add to DOM
    document.body.appendChild(this.customMenu);
    this.isMenuVisible = true;

    // Focus menu for keyboard navigation
    if (this.shadowRoot) {
      const menu = this.shadowRoot.querySelector('.customclick-menu') as HTMLElement;
      if (menu) {
        menu.focus();
      }
    }
  }

  private createMenuElement(target: Element): HTMLElement {
    // Create shadow host for CSS isolation
    this.shadowHost = document.createElement('div');
    this.shadowHost.style.position = 'absolute';
    this.shadowHost.style.zIndex = '2147483647';
    
    // Create shadow root for complete style isolation
    this.shadowRoot = this.shadowHost.attachShadow({ mode: 'closed' });
    
    // Add isolated styles
    const style = document.createElement('style');
    style.textContent = this.getMenuStyles();
    this.shadowRoot.appendChild(style);

    // Create menu container
    const menu = document.createElement('div');
    menu.className = 'customclick-menu';
    menu.tabIndex = -1;

    // Add menu items based on context
    this.addMenuItems(menu, target);

    this.shadowRoot.appendChild(menu);
    return this.shadowHost;
  }

  private getMenuStyles(): string {
    return `
      .customclick-menu {
        position: relative;
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        padding: 8px;
        min-width: 200px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 14px;
        line-height: 1.5;
        outline: none;
        user-select: none;
      }

      .customclick-menu-item {
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 4px;
        display: flex;
        align-items: center;
        transition: background-color 0.1s ease;
        outline: none;
      }

      .customclick-menu-item:hover,
      .customclick-menu-item:focus {
        background-color: #f3f4f6;
      }

      .customclick-menu-item:active {
        background-color: #e5e7eb;
      }

      .customclick-menu-separator {
        height: 1px;
        background-color: #e5e7eb;
        margin: 4px 0;
      }

      /* Reset all possible inherited styles */
      .customclick-menu * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        border: none;
        background: none;
        font: inherit;
        color: inherit;
        text-decoration: none;
        text-align: left;
        vertical-align: baseline;
      }
    `;
  }

  private addMenuItems(menu: HTMLElement, target: Element): void {
    const items = this.getContextualMenuItems(target);
    
    items.forEach((item, index) => {
      const menuItem = document.createElement('div');
      menuItem.className = 'customclick-menu-item';
      menuItem.textContent = item.label;
      menuItem.tabIndex = 0;

      // Add click handler
      menuItem.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleMenuItemClick(item, target);
        this.hideMenu();
      });

      // Add keyboard navigation
      menuItem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleMenuItemClick(item, target);
          this.hideMenu();
        }
      });

      menu.appendChild(menuItem);

      // Add separator after items (except last)
      if (index < items.length - 1) {
        const separator = document.createElement('div');
        separator.className = 'customclick-menu-separator';
        menu.appendChild(separator);
      }
    });
  }

  private getContextualMenuItems(target: Element): MenuAction[] {
    const items: MenuAction[] = [];

    // Always add basic actions
    items.push({
      id: 'inspect',
      label: '🔍 Inspect Element',
      action: () => this.inspectElement(target)
    });

    // Add text-specific actions if text is selected
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      items.push({
        id: 'copy-text',
        label: '📋 Copy Text',
        action: () => this.copySelectedText()
      });
      
      items.push({
        id: 'search-text',
        label: '🔎 Search Text',
        action: () => this.searchSelectedText()
      });
    }

    // Add link-specific actions
    const link = target.closest('a');
    if (link && link.getAttribute('href')) {
      items.push({
        id: 'copy-link',
        label: '🔗 Copy Link',
        action: () => this.copyLink(link.getAttribute('href')!)
      });
    }

    // Add image-specific actions
    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      items.push({
        id: 'copy-image-url',
        label: '🖼️ Copy Image URL',
        action: () => this.copyImageUrl(img.src)
      });
    }

    return items;
  }

  private positionMenu(x: number, y: number): void {
    if (!this.customMenu || !this.shadowRoot) return;

    const menu = this.shadowRoot.querySelector('.customclick-menu') as HTMLElement;
    if (!menu) return;
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };

    // Temporarily position shadow host to measure dimensions
    this.customMenu.style.left = '-9999px';
    this.customMenu.style.top = '-9999px';
    this.customMenu.style.visibility = 'hidden';

    const rect = menu.getBoundingClientRect();
    const menuWidth = rect.width;
    const menuHeight = rect.height;

    // Calculate position with edge detection
    let finalX = x;
    let finalY = y;

    // Adjust horizontal position if menu would overflow
    if (x + menuWidth > viewport.width + viewport.scrollX) {
      finalX = viewport.width + viewport.scrollX - menuWidth - 10;
    }

    // Adjust vertical position if menu would overflow
    if (y + menuHeight > viewport.height + viewport.scrollY) {
      finalY = viewport.height + viewport.scrollY - menuHeight - 10;
    }

    // Ensure menu doesn't go off the left or top edge
    finalX = Math.max(10, finalX);
    finalY = Math.max(10, finalY);

    // Apply final position to shadow host
    this.customMenu.style.left = `${finalX}px`;
    this.customMenu.style.top = `${finalY}px`;
    this.customMenu.style.visibility = 'visible';
  }

  private hideMenu(): void {
    if (this.customMenu && this.isMenuVisible) {
      this.customMenu.remove();
      this.customMenu = null;
      this.shadowHost = null;
      this.shadowRoot = null;
      this.isMenuVisible = false;
    }
  }

  private handleMenuItemClick(item: MenuAction, target: Element): void {
    console.log(`🎯 Menu item clicked: ${item.label}`);
    try {
      item.action();
    } catch (error) {
      console.error('Error executing menu action:', error);
    }
  }

  // Menu action implementations
  private inspectElement(target: Element): void {
    // Highlight the element temporarily
    const originalOutline = (target as HTMLElement).style.outline;
    (target as HTMLElement).style.outline = '2px solid #3b82f6';
    
    setTimeout(() => {
      (target as HTMLElement).style.outline = originalOutline;
    }, 2000);

    console.log('🔍 Inspecting element:', target);
  }

  private copySelectedText(): void {
    const selection = window.getSelection();
    if (selection) {
      const text = selection.toString();
      navigator.clipboard.writeText(text).then(() => {
        console.log('📋 Text copied to clipboard:', text);
      }).catch(err => {
        console.error('Failed to copy text:', err);
      });
    }
  }

  private searchSelectedText(): void {
    const selection = window.getSelection();
    if (selection) {
      const text = selection.toString().trim();
      if (text) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
        window.open(searchUrl, '_blank');
      }
    }
  }

  private copyLink(href: string): void {
    navigator.clipboard.writeText(href).then(() => {
      console.log('🔗 Link copied to clipboard:', href);
    }).catch(err => {
      console.error('Failed to copy link:', err);
    });
  }

  private copyImageUrl(src: string): void {
    navigator.clipboard.writeText(src).then(() => {
      console.log('🖼️ Image URL copied to clipboard:', src);
    }).catch(err => {
      console.error('Failed to copy image URL:', err);
    });
  }
}