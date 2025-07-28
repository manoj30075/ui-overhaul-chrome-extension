(function(){class u{constructor(){this.customMenu=null,this.shadowHost=null,this.shadowRoot=null,this.isMenuVisible=!1}initialize(){this.setupEventListeners(),console.log("🎯 Context menu override system initialized")}setupEventListeners(){document.addEventListener("contextmenu",this.handleContextMenu.bind(this),!0),document.addEventListener("click",this.handleDocumentClick.bind(this),!0),document.addEventListener("keydown",this.handleKeydown.bind(this),!0),window.addEventListener("resize",this.hideMenu.bind(this))}handleContextMenu(e){e.shiftKey||(e.preventDefault(),e.stopPropagation(),this.showCustomMenu(e.pageX,e.pageY,e.target))}handleDocumentClick(e){this.isMenuVisible&&this.customMenu&&(this.customMenu.contains(e.target)||(this.hideMenu(),e.preventDefault(),e.stopPropagation()))}handleKeydown(e){e.key==="Escape"&&this.isMenuVisible&&(this.hideMenu(),e.preventDefault(),e.stopPropagation())}showCustomMenu(e,t,i){if(this.hideMenu(),this.customMenu=this.createMenuElement(i),this.positionMenu(e,t),document.body.appendChild(this.customMenu),this.isMenuVisible=!0,this.shadowRoot){const o=this.shadowRoot.querySelector(".customclick-menu");o&&o.focus()}}createMenuElement(e){this.shadowHost=document.createElement("div"),this.shadowHost.style.position="absolute",this.shadowHost.style.zIndex="2147483647",this.shadowRoot=this.shadowHost.attachShadow({mode:"closed"});const t=document.createElement("style");t.textContent=this.getMenuStyles(),this.shadowRoot.appendChild(t);const i=document.createElement("div");return i.className="customclick-menu",i.tabIndex=-1,this.addMenuItems(i,e),this.shadowRoot.appendChild(i),this.shadowHost}getMenuStyles(){return`
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
    `}addMenuItems(e,t){const i=this.getContextualMenuItems(t);i.forEach((o,c)=>{const s=document.createElement("div");if(s.className="customclick-menu-item",s.textContent=o.label,s.tabIndex=0,s.addEventListener("click",n=>{n.stopPropagation(),this.handleMenuItemClick(o,t),this.hideMenu()}),s.addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),this.handleMenuItemClick(o,t),this.hideMenu())}),e.appendChild(s),c<i.length-1){const n=document.createElement("div");n.className="customclick-menu-separator",e.appendChild(n)}})}getContextualMenuItems(e){const t=[];t.push({id:"inspect",label:"🔍 Inspect Element",action:()=>this.inspectElement(e)});const i=window.getSelection();i&&i.toString().trim()&&(t.push({id:"copy-text",label:"📋 Copy Text",action:()=>this.copySelectedText()}),t.push({id:"search-text",label:"🔎 Search Text",action:()=>this.searchSelectedText()}));const o=e.closest("a");if(o&&o.getAttribute("href")&&t.push({id:"copy-link",label:"🔗 Copy Link",action:()=>this.copyLink(o.getAttribute("href"))}),e.tagName==="IMG"){const c=e;t.push({id:"copy-image-url",label:"🖼️ Copy Image URL",action:()=>this.copyImageUrl(c.src)})}return t}positionMenu(e,t){if(!this.customMenu||!this.shadowRoot)return;const i=this.shadowRoot.querySelector(".customclick-menu");if(!i)return;const o={width:window.innerWidth,height:window.innerHeight,scrollX:window.scrollX,scrollY:window.scrollY};this.customMenu.style.left="-9999px",this.customMenu.style.top="-9999px",this.customMenu.style.visibility="hidden";const c=i.getBoundingClientRect(),s=c.width,n=c.height;let l=e,a=t;e+s>o.width+o.scrollX&&(l=o.width+o.scrollX-s-10),t+n>o.height+o.scrollY&&(a=o.height+o.scrollY-n-10),l=Math.max(10,l),a=Math.max(10,a),this.customMenu.style.left=`${l}px`,this.customMenu.style.top=`${a}px`,this.customMenu.style.visibility="visible"}hideMenu(){this.customMenu&&this.isMenuVisible&&(this.customMenu.remove(),this.customMenu=null,this.shadowHost=null,this.shadowRoot=null,this.isMenuVisible=!1)}handleMenuItemClick(e,t){console.log(`🎯 Menu item clicked: ${e.label}`);try{e.action()}catch(i){console.error("Error executing menu action:",i)}}inspectElement(e){const t=e.style.outline;e.style.outline="2px solid #3b82f6",setTimeout(()=>{e.style.outline=t},2e3),console.log("🔍 Inspecting element:",e)}copySelectedText(){const e=window.getSelection();if(e){const t=e.toString();navigator.clipboard.writeText(t).then(()=>{console.log("📋 Text copied to clipboard:",t)}).catch(i=>{console.error("Failed to copy text:",i)})}}searchSelectedText(){const e=window.getSelection();if(e){const t=e.toString().trim();if(t){const i=`https://www.google.com/search?q=${encodeURIComponent(t)}`;window.open(i,"_blank")}}}copyLink(e){navigator.clipboard.writeText(e).then(()=>{console.log("🔗 Link copied to clipboard:",e)}).catch(t=>{console.error("Failed to copy link:",t)})}copyImageUrl(e){navigator.clipboard.writeText(e).then(()=>{console.log("🖼️ Image URL copied to clipboard:",e)}).catch(t=>{console.error("Failed to copy image URL:",t)})}}console.log("🧹 Content script loaded");const r=new u;r.initialize();
})()
