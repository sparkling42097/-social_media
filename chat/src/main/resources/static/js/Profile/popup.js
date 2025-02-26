// popup.js
class PopupManager {
    constructor() {
        this.loadStylesSync();
        
        this.currentSortType = 'time';
        this.currentSortOrder = 'desc';
        this.currentPosts = [];
        this.isLoading = false;
        this.currentPage = 0;
        this.pageSize = 5;
        this.totalPosts = 17;
        this.hasMore = true;
        this.isEditMode = false;
        this.selectedPosts = new Set();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

	loadStylesSync() {
	    // 檢查是否已經存在樣式
	    if (document.getElementById('popup-styles')) return;

	    // 內聯關鍵樣式以避免閃爍
	    const criticalStyles = `
	        .popup {
				position: fixed;  /* 改為相對定位，作為刪除遮罩的參考點 */
				overflow: hidden;
	            top: 50%;
	            left: 50%;
	            transform: translate(-50%, -50%);
	            width: 800px;
	            height: 80vh;
	            max-height: 800px;
	            background: #262626;
	            color: #ffffff;
	            border-radius: 12px;
	            z-index: 1001;
	            display: flex;
	            flex-direction: column;
	            visibility: hidden;
	            opacity: 0;
	            transition: opacity 0.3s ease;
	        }

	        .popup.active {
	            visibility: visible;
	            opacity: 1;
	        }

			.popup-header {
			    flex-shrink: 0;
			    display: flex;
			    align-items: center;
			    padding: 16px 20px;
			    border-bottom: 1px solid #363636;
			}
			
			.sort-bar {
			    flex-shrink: 0;
			    padding: 12px 20px;
			    border-bottom: 1px solid #363636;
			}

	        .content-list {
	            flex: 1;
	            overflow-y: auto;
	            min-height: 0;
				padding: 0;
				position: relative;
	            max-height: calc(80vh - 140px);
	            background: #262626;
				z-index: 1;
	        }

			.popup-overlay {
			    position: fixed;
			    top: 0;
			    left: 0;
			    width: 100%;
			    height: 100%;
			    background: rgba(0, 0, 0, 0.65);
			    visibility: hidden;
			    opacity: 0;
			    transition: 0.3s;
			    z-index: 999;
			}

	        .popup-overlay.active {
	            visibility: visible;
	            opacity: 1;
	        }
	    `;

        // 添加關鍵樣式
		const styleElement = document.createElement('style');
		    styleElement.id = 'popup-critical-styles';
		    styleElement.textContent = criticalStyles;
		    document.head.appendChild(styleElement);

        // 非同步載入完整樣式表
		const link = document.createElement('link');
		    link.id = 'popup-styles';
		    link.rel = 'stylesheet';
		    link.href = '/css/Profile/popup-styles.css';
		    document.head.appendChild(link);
        
        // 監聽樣式表載入完成事件
        link.onload = () => {
            console.log('Popup styles loaded');
        };
        
        link.onerror = (error) => {
            console.error('Failed to load popup styles:', error);
        };

        document.head.appendChild(link);
    }

    init() {
        // 先建立基本結構
        this.setupOverlay();
        this.setupPopups();
        
        // 確保 DOM 完全準備好後再綁定事件
        requestAnimationFrame(() => {
            this.bindEvents();
        });
    }

    setupOverlay() {
        let overlay = document.querySelector('.popup-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'popup-overlay';
            document.body.appendChild(overlay);
        }
    }

	setupPopups() {
	        const popupConfigs = {
	            post: {
	                title: '我的貼文',
	                type: 'list'
	            },
	            save: {
	                title: '收藏列表',
	                type: 'list'
	            }
	        };

			Object.entries(popupConfigs).forEach(([key, config]) => {
			            this.createPopup(key, config);
			        });
			    }
		
		createPopup(id, config) {
		    const popupId = `popup${id.charAt(0).toUpperCase() + id.slice(1)}`;
		    let popup = document.getElementById(popupId);
		    
		    if (popup) {
		        popup.remove();
		    }

		    popup = document.createElement('div');
		    popup.id = popupId;
		    popup.className = 'popup';
		    
			popup.innerHTML = `
			        <div class="popup-header">
			            <div class="button-group">
			                <button class="edit-mode-btn">編輯</button>
			                <button class="delete-btn" disabled>刪除選取項目</button>
			            </div>
			            <h3>${config.title}</h3>
			            <button class="close">
			                <svg width="24" height="24" viewBox="0 0 24 24">
			                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
			                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
			                </svg>
			            </button>
			        </div>
			        ${config.type === 'list' ? `
			            <div class="sort-bar">
			                <div class="sort-controls">
			                    <select class="sort-type-select" data-popup-id="${id}">
			                        <option value="time">依時間</option>
			                        <option value="likes">依讚數</option>
			                        <option value="comments">依留言數</option>
			                    </select>
			                    <select class="sort-order-select" data-popup-id="${id}">
			                        <option value="desc">由大到小</option>
			                        <option value="asc">由小到大</option>
			                    </select>
			                </div>
			            </div>
			            <div class="content-list"></div>
			        ` : ''}
			        <div class="delete-overlay"></div>
			        <div class="delete-confirmation">
			            <p>確定要刪除選取的貼文嗎？</p>
			            <div class="buttons">
			                <button class="cancel">取消</button>
			                <button class="confirm">確定刪除</button>
			            </div>
			        </div>
			    `;

		        document.body.appendChild(popup);
		        this.bindEditModeEvents(popup);
		    }
			
			bindEditModeEvents(popup) {
			    const editBtn = popup.querySelector('.edit-mode-btn');
			    const deleteBtn = popup.querySelector('.delete-btn');
			    const confirmation = popup.querySelector('.delete-confirmation');
			    const overlay = popup.querySelector('.delete-overlay');
			    
			    if (editBtn) {
			        editBtn.addEventListener('click', () => {
			            this.toggleEditMode(popup);
			        });
			    }

			    if (deleteBtn) {
			        deleteBtn.addEventListener('click', () => {
			            if (this.selectedPosts.size > 0) {
			                overlay.classList.add('show');
			                confirmation.classList.add('show');
			            }
			        });
			    }

			    if (confirmation) {
			        const hideConfirmation = () => {
			            overlay.classList.remove('show');
			            confirmation.classList.remove('show');
			        };

			        confirmation.querySelector('.cancel').addEventListener('click', hideConfirmation);

			        confirmation.querySelector('.confirm').addEventListener('click', () => {
			            this.deleteSelectedPosts();
			            hideConfirmation();
			        });

			        // 點擊遮罩層關閉確認視窗
			        overlay.addEventListener('click', hideConfirmation);
			    }
			}
				toggleEditMode(popup) {
				        this.isEditMode = !this.isEditMode;
				        const editBtn = popup.querySelector('.edit-mode-btn');
				        const deleteBtn = popup.querySelector('.delete-btn');

				        editBtn.textContent = this.isEditMode ? '完成' : '編輯';
				        deleteBtn.style.display = this.isEditMode ? 'block' : 'none';

				        // 重置選取狀態
				        if (!this.isEditMode) {
				            this.selectedPosts.clear();
				        }

				        // 重新渲染以更新事件綁定
				        this.sortAndRenderPosts();
				        this.updateDeleteButton(popup);
				    }
				
				updateDeleteButton(popup) {
				    const deleteBtn = popup.querySelector('.delete-btn');
				    if (deleteBtn) {
				        // 如果有選中的貼文，啟用刪除按鈕
				        deleteBtn.disabled = this.selectedPosts.size === 0;
				    }
				}
				
    bindEvents() {
        // 綁定遮罩層點擊事件
        const overlay = document.querySelector('.popup-overlay');
        overlay.addEventListener('click', () => this.closeAll());

        // 綁定關閉按鈕點擊事件
        document.querySelectorAll('.popup .close').forEach(button => {
            button.addEventListener('click', () => this.closeAll());
        });

        // 綁定排序事件
        document.querySelectorAll('.sort-type-select, .sort-order-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const typeSelect = e.target.closest('.sort-controls').querySelector('.sort-type-select');
                const orderSelect = e.target.closest('.sort-controls').querySelector('.sort-order-select');
                
                this.currentSortType = typeSelect.value;
                this.currentSortOrder = orderSelect.value;
                this.sortAndRenderPosts();
            });
        });

        // 綁定滾動事件
        document.querySelectorAll('.content-list').forEach(list => {
            list.addEventListener('scroll', (e) => {
                if (this.shouldLoadMore(e.target)) {
                    this.loadContent('post');
                }
            });
        });
    }

    shouldLoadMore(container) {
        if (this.isLoading) return false;
        if (this.currentPosts.length >= this.totalPosts) return false;

        const { scrollTop, scrollHeight, clientHeight } = container;
        return scrollHeight - scrollTop - clientHeight < 50;
    }

	async loadContent(id) {
	    if (id !== 'post' || this.isLoading) return;
	    if (!this.hasMore) return;

	    const contentList = document.querySelector('#popupPost .content-list');
	    const isInitialLoad = this.currentPage === 0;
	    
	    try {
	        this.isLoading = true;

	        if (isInitialLoad) {
	            contentList.innerHTML = '<div class="loading">載入中...</div>';
	        }

	        // 取得會員名稱
	        const memberName = document.getElementById('blurName').textContent;
	        
	        const params = new URLSearchParams({
	            keyword: memberName,
	            page: this.currentPage,
	            size: this.pageSize,
	            sortBy: 'newest'
	        });
	        
	        const response = await fetch(`/api/search/photos?${params}`);
	        
	        if (!response.ok) throw new Error('載入失敗');
	        
	        const data = await response.json();
	        
	        if (!data || !data.content || data.content.length === 0) {
	            if (isInitialLoad) {
	                contentList.innerHTML = '<div class="no-content">目前無貼文</div>';
	            }
	            this.hasMore = false;
	            return;
	        }

	        // 處理貼文資料，確保包含 postId
	        const newPosts = data.content.map(post => ({
	            postId: post.postId,  // 新增這行
	            content: post.content,
	            postTime: post.postTime,
	            likeCount: post.likeCount,
	            messageCount: post.messageCount,
	            photoUrls: post.photoUrls,
	            memberName: post.memberName
	        }));

	        // 如果是初始載入，清空現有貼文
	        if (isInitialLoad) {
	            this.currentPosts = newPosts;
	        } else {
	            this.currentPosts = [...this.currentPosts, ...newPosts];
	        }
	        
	        this.hasMore = !data.last;
	        this.currentPage++;

	        // 重新渲染前先清空選取狀態
	        if (isInitialLoad) {
	            this.selectedPosts.clear();
	        }

	        this.sortAndRenderPosts();

	    } catch (error) {
	        console.error('載入失敗:', error);
	        if (isInitialLoad) {
	            contentList.innerHTML = '<div class="error">載入失敗，請稍後再試</div>';
	        }
	    } finally {
	        this.isLoading = false;
	    }
	}
	
    sortAndRenderPosts() {
        if (!this.currentPosts.length) return;

        const sortedPosts = [...this.currentPosts].sort((a, b) => {
            let valueA, valueB;
            
            switch (this.currentSortType) {
                case 'time':
                    valueA = new Date(a.postTime).getTime();
                    valueB = new Date(b.postTime).getTime();
                    break;
                case 'likes':
                    valueA = a.likeCount || 0;
                    valueB = b.likeCount || 0;
                    break;
                case 'comments':
                    valueA = a.messageCount || 0;
                    valueB = b.messageCount || 0;
                    break;
                default:
                    return 0;
            }

            return this.currentSortOrder === 'desc' ? valueB - valueA : valueA - valueB;
        });

        const contentList = document.querySelector('#popupPost .content-list');
        this.renderPosts(contentList, sortedPosts);
    }

	renderPosts(contentList, posts) {
	        if (!posts || posts.length === 0) {
	            contentList.innerHTML = '<div class="no-content">沒有找到相關貼文</div>';
	            return;
	        }

	        contentList.innerHTML = posts.map(post => `
	            <div class="list-item ${this.isEditMode ? 'edit-mode' : ''} ${this.selectedPosts.has(post.postId) ? 'selected' : ''}" 
	                 data-post-id="${post.postId}">
	                <div class="checkbox ${this.selectedPosts.has(post.postId) ? 'checked' : ''}"></div>
	                <div class="item-info">
	                    <div class="post-date">${this.formatDate(post.postTime)}</div>
	                    <div class="description">${post.content || ''}</div>
	                    <div class="post-stats">
	                        <span>讚 ${post.likeCount || 0}</span>
	                        <span>留言 ${post.messageCount || 0}</span>
	                    </div>
	                </div>
	                ${post.photoUrls && post.photoUrls[0] ? `
	                    <div class="post-image">
	                        <img src="data:image/jpeg;base64,${post.photoUrls[0]}" 
	                             alt="貼文圖片"
	                             onerror="this.style.display='none'">
	                    </div>
	                ` : ''}
	            </div>
	        `).join('');

	    // 重新綁定事件
		contentList.querySelectorAll('.list-item').forEach((item) => {
		            const postId = item.dataset.postId;
		            
		            // 移除現有的點擊事件監聽器
		            const newItem = item.cloneNode(true);
		            item.parentNode.replaceChild(newItem, item);
		            
		            if (this.isEditMode) {
		                // 在編輯模式下綁定選擇事件
		                newItem.addEventListener('click', (e) => {
		                    e.stopPropagation();  // 防止事件冒泡
		                    this.togglePostSelection(newItem, postId);
		                });
		            } else {
		                // 在非編輯模式下綁定貼文顯示事件
		                newItem.addEventListener('click', () => {
		                    const post = posts.find(p => p.postId === postId);
		                    if (post) {
		                        const postData = {
		                            postId: post.postId,
		                            memberName: post.memberName,
		                            content: post.content,
		                            postTime: post.postTime,
		                            likeCount: post.likeCount,
		                            messageCount: post.messageCount,
		                            photoUrl: post.photoUrls ? post.photoUrls[0] : null
		                        };
		                        window.PostDisplay.createPostPage(postData);
		                    }
		                });
		            }
		        });
		    }

		
			togglePostSelection(item, postId) {
			        // 確保我們有正確的 postId
			        if (!postId) {
			            console.error('No postId provided for selection toggle');
			            return;
			        }

			        // 更新選取狀態
			        if (this.selectedPosts.has(postId)) {
			            this.selectedPosts.delete(postId);
			            item.classList.remove('selected');
			            item.querySelector('.checkbox').classList.remove('checked');
			        } else {
			            this.selectedPosts.add(postId);
			            item.classList.add('selected');
			            item.querySelector('.checkbox').classList.add('checked');
			        }
			        
			        // 更新刪除按鈕狀態
			        const popup = item.closest('.popup');
			        this.updateDeleteButton(popup);
			    }

				async deleteSelectedPosts() {
				    try {
				        const postIds = Array.from(this.selectedPosts);
				        
				        const response = await fetch('/api/delete/posts', {
				            method: 'POST',
				            headers: {
				                'Content-Type': 'application/json'
				            },
				            body: JSON.stringify({ postIds })
				        });

				        if (!response.ok) {
				            const errorMessage = await response.text();
				            throw new Error(errorMessage || '刪除失敗');
				        }

				        // 重置狀態
				        this.selectedPosts.clear();
				        this.currentPosts = [];
				        this.currentPage = 0;
				        this.isLoading = false;
				        this.hasMore = true;
				        
				        // 更新貼文總數
				        this.totalPosts = Math.max(0, this.totalPosts - postIds.length);
				        
				        // 重新載入貼文列表
				        await this.loadContent('post');
				        
				        // 退出編輯模式
				        const popup = document.querySelector('#popupPost');
				        this.isEditMode = false;
				        this.toggleEditMode(popup);

				        // 如果有更新用戶資料的函數，則調用它
				        if (window.updateUserPostCount) {
				            window.updateUserPostCount();
				        }

				        // 顯示成功訊息
				        const successToast = document.createElement('div');
				        successToast.className = 'toast success';
				        successToast.textContent = '刪除成功';
				        document.body.appendChild(successToast);
				        
				        // 3秒後移除提示
				        setTimeout(() => {
				            successToast.remove();
				        }, 3000);
				        
				    } catch (error) {
				        console.error('刪除失敗:', error);
				        // 顯示錯誤提示
				        const errorToast = document.createElement('div');
				        errorToast.className = 'toast error';
				        errorToast.textContent = error.message || '刪除失敗，請稍後再試';
				        document.body.appendChild(errorToast);
				        
				        // 3秒後移除提示
				        setTimeout(() => {
				            errorToast.remove();
				        }, 3000);
				    }
				}
	
	

	
	shouldLoadMore(container) {
	    if (this.isLoading) return false;
	    if (!this.hasMore) return false;

	    const { scrollTop, scrollHeight, clientHeight } = container;
	    return scrollHeight - scrollTop - clientHeight < 50;
	}

	toggle(id) {
	        const popupId = `popup${id.charAt(0).toUpperCase() + id.slice(1)}`;
	        const popup = document.getElementById(popupId);
	        const overlay = document.querySelector('.popup-overlay');
	        
	        if (!popup || !overlay) {
	            console.error('找不到彈窗元素', { popupId, popup, overlay });
	            return;
	        }

	        const isActive = popup.classList.contains('active');
	        
	        // 先關閉所有彈窗
	        this.closeAll();

	        if (!isActive) {
	            // 確保元素存在再添加 class
	            if (popup && overlay) {
	                popup.classList.add('active');
	                overlay.classList.add('active');
	                
	                // 重置狀態
	                this.currentPosts = [];
	                this.currentPage = 0;
	                this.isLoading = false;
	                
	                // 載入內容
	                this.loadContent(id);
	            }
	        }
	    }

    closeAll() {
        document.querySelectorAll('.popup').forEach(popup => {
            popup.classList.remove('active');
        });
        document.querySelector('.popup-overlay').classList.remove('active');
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    }
}



// 初始化並導出全域函數
window.popupManager = new PopupManager();
window.togglePost = () => window.popupManager.toggle('post');
window.toggleSave = () => window.popupManager.toggle('save');