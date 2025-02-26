// FansPopup.js
class FansPopup {
    constructor() {
        this.popupId = 'popupFans';
        this.currentPage = 0;
        this.pageSize = 10;
        this.fans = [];
        this.hasMore = true;
        this.isLoading = false;
        this.totalFans = 0;

        this.init();
    }

    init() {
        this.setupFansPopup();
        this.bindFansButton();
        this.updateFansCount();

        // 確保 DOM 載入完成後重新綁定事件
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bindFansButton());
        }
        // 處理動態加載的情況
        window.addEventListener('load', () => this.bindFansButton());
    }

    setupFansPopup() {
        // 創建 overlay 如果不存在
        let overlay = document.querySelector('.popup-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'popup-overlay';
            document.body.appendChild(overlay);
            
            // 綁定 overlay 點擊事件
            overlay.addEventListener('click', () => this.close());
        }

        // 移除可能存在的舊彈窗
        const oldPopup = document.getElementById(this.popupId);
        if (oldPopup) {
            oldPopup.remove();
        }

        // 創建彈窗元素
        const popup = document.createElement('div');
        popup.id = this.popupId;
        popup.className = 'popup';
        
        // 設置較小的視窗大小
        popup.style.width = '400px';
        popup.style.maxWidth = '80%';
        popup.style.height = '60vh';
        
        popup.innerHTML = `
            <div class="popup-header" style="padding: 12px;">
                <h3>好友列表</h3>
                <button class="close">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
            </div>
            <div class="content-list" style="padding: 12px;"></div>
        `;

        document.body.appendChild(popup);
        this.popup = popup;
        this.contentList = popup.querySelector('.content-list');

        // 添加基本樣式
        const style = document.createElement('style');
        style.textContent = `
            .popup-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .popup-overlay.active {
                display: block;
                opacity: 1;
            }
            
            .popup {
                display: none;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1001;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .popup.active {
                display: block;
                opacity: 1;
            }
            
            .fan-item {
                padding: 8px;
                border-bottom: 1px solid #eee;
            }
            
            .fan-item img {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                margin-right: 8px;
            }
            
            #${this.popupId} .content-list {
                overflow-y: auto;
                height: calc(100% - 48px);
            }
            
            .close {
                border: none;
                background: none;
                cursor: pointer;
                padding: 4px;
            }
            
            .close:hover {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
        
        // 綁定滾動加載
        this.contentList.addEventListener('scroll', (e) => {
            if (this.shouldLoadMore(e.target)) {
                this.loadFans();
            }
        });

        // 綁定關閉按鈕
        const closeButton = popup.querySelector('.close');
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.close();
        });
    }

    bindFansButton() {
        const fansButton = document.getElementById('blurFans');
        if (fansButton) {
            // 移除所有現有的事件監聽器
            const newButton = fansButton.cloneNode(true);
            fansButton.parentNode.replaceChild(newButton, fansButton);
            
            // 直接添加點擊事件，不使用 onclick 屬性
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggle();
            });

            // 移除可能存在的 onclick 屬性
            newButton.removeAttribute('onclick');
        }
    }

	async updateFansCount() {
	    try {
	        const memberName = document.getElementById('blurName').textContent;
	        const response = await fetch(`/api/fans/count?memberName=${memberName}`);
	        
	        if (!response.ok) throw new Error('獲取好友數失敗');
	        
	        const data = await response.json();
	        this.totalFans = data.count;
	        
	        // 更新粉絲數顯示
	        const fansButton = document.getElementById('blurFans');
	        if (fansButton) {
	            // 當粉絲數為 0 時也顯示「0 位粉絲」
	            fansButton.textContent = `${this.totalFans} 位好友`;
	        }
	        
	        // 如果沒有粉絲，直接顯示提示訊息
	        if (this.totalFans === 0) {
	            this.contentList.innerHTML = '<div class="no-content" style="text-align: center; padding: 20px; color: #666;">目前無粉絲</div>';
	            this.hasMore = false;
	        }
	    } catch (error) {
	        console.error('更新粉絲數失敗:', error);
	        const fansButton = document.getElementById('blurFans');
	        if (fansButton) {
	            fansButton.textContent = '0 位好友';
	        }
	    }
	}

    shouldLoadMore(container) {
        if (this.isLoading || !this.hasMore) return false;
        
        const { scrollTop, scrollHeight, clientHeight } = container;
        return scrollHeight - scrollTop - clientHeight < 50;
    }

	async loadFans() {
	    if (this.isLoading || !this.hasMore) return;

	    try {
	        this.isLoading = true;
	        const memberName = document.getElementById('blurName').textContent;
	        
	        const response = await fetch(`/api/fans?memberName=${memberName}&page=${this.currentPage}&size=${this.pageSize}`);
	        
	        if (!response.ok) throw new Error('載入失敗');
	        
	        const data = await response.json();
	        
	        // 檢查是否有粉絲數據
	        if (!data.content || data.content.length === 0) {
	            this.hasMore = false;
	            this.contentList.innerHTML = '<div class="no-content" style="text-align: center; padding: 20px; color: #666;">目前無粉絲</div>';
	            return;
	        }

	        this.fans = [...this.fans, ...data.content];
	        this.currentPage++;
	        this.hasMore = !data.last;
	        
	        this.renderFans();

	    } catch (error) {
	        console.error('載入好友失敗:', error);
	        this.contentList.innerHTML = '<div class="error" style="text-align: center; padding: 20px; color: #666;">目前無好友</div>';
	    } finally {
	        this.isLoading = false;
	    }
	}

	renderFans() {
	    if (!this.fans.length) {
	        this.contentList.innerHTML = '<div class="no-content" style="text-align: center; padding: 20px; color: #666;">目前無好友</div>';
	        return;
	    }

	    const fansHtml = this.fans.map(fan => `
	        <div class="fan-item" style="display: flex; align-items: center;">
	            <img src="${fan.profilePic || '/images/default-avatar.png'}" 
	                 alt="頭像"
	                 onerror="this.src='/images/default-avatar.png'">
	            <div>
	                <div style="font-weight: 500;">${fan.memberName}</div>
	                <div style="color: #666; font-size: 14px;">${fan.nickname || ''}</div>
	            </div>
	        </div>
	    `).join('');

	    if (this.currentPage === 1) {
	        this.contentList.innerHTML = fansHtml;
	    } else {
	        this.contentList.insertAdjacentHTML('beforeend', fansHtml);
	    }
	}


    toggle() {
        const popup = document.getElementById(this.popupId);
        const overlay = document.querySelector('.popup-overlay');
        
        if (!popup || !overlay) {
            console.error('找不到必要的 DOM 元素');
            return;
        }

        const isActive = popup.classList.contains('active');
        
        // 關閉所有其他彈窗
        document.querySelectorAll('.popup').forEach(p => {
            p.classList.remove('active');
        });
        
        if (isActive) {
            this.close();
        } else {
            // 重置狀態
            this.fans = [];
            this.currentPage = 0;
            this.hasMore = true;
            this.isLoading = false;
            
            // 顯示彈窗
            popup.classList.add('active');
            overlay.classList.add('active');
            
            // 加載數據
            this.loadFans();
            this.updateFansCount();
        }
    }

    close() {
        const popup = document.getElementById(this.popupId);
        const overlay = document.querySelector('.popup-overlay');
        
        if (popup) popup.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// 初始化並確保全局可用
window.fansPopup = new FansPopup();

// 重新定義全局函數
window.toggleFans = () => {
    if (window.fansPopup) {
        window.fansPopup.toggle();
    }
};