// 搜尋相關狀態管理
const searchState = {
    page: 0,
    pageSize: 10,
    isLoading: false,
    hasMore: true,
    currentSearchTerm: '',
    totalDisplayed: 0,
    lastPageItemCount: 0
};

// 初始化搜尋功能
function initializeSearch() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.querySelector('.search__input');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    const throttledSearch = throttle(startNewSearch, 500);
    
    if (searchButton) {
        searchButton.addEventListener('click', throttledSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                throttledSearch();
            }
        });
        searchInput.focus();
    }
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMore);
    }
}

// 節流函數
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 執行搜尋
async function startNewSearch() {
    const searchInput = document.querySelector('.search__input');
    if (!searchInput) return;
    
    const keyword = searchInput.value.trim();
    
    // 重置搜尋狀態
    Object.assign(searchState, {
        currentSearchTerm: keyword,
        page: 0,
        totalDisplayed: 0,
        hasMore: true,
        lastPageItemCount: 0
    });
    
    const container = document.getElementById('gridContainer');
    
    // 如果關鍵字為空，清空容器並返回
    if (keyword === '') {
        container.innerHTML = '';
        searchState.hasMore = false;
        updateLoadMoreButton();
        return;
    }
    
    container.innerHTML = '<div class="loading">搜尋中...</div>';
    
    try {
        const results = await searchImages(keyword, 0);
        container.innerHTML = '';
        
        if (!results || results.length === 0) {
            container.innerHTML = '<div class="no-results">沒有找到相關貼文</div>';
            searchState.hasMore = false;
            updateLoadMoreButton();
            return;
        }
        
        displayImages(results);
    } catch (error) {
        console.error('搜尋錯誤:', error);
        container.innerHTML = '<div class="error">搜尋失敗，請稍後再試</div>';
    }
}

// 搜尋圖片
async function searchImages(keyword, pageNum) {
    if (searchState.isLoading) return [];
    
    searchState.isLoading = true;
    updateLoadingState(true);
    
    try {
        const params = new URLSearchParams({
            keyword,
            page: pageNum,
            size: searchState.pageSize,
            sortBy: 'newest'
        });
        
        const response = await fetch(`/api/search/photos?${params}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`搜尋失敗: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('返回的數據:', data); // 用於調試
        
        if (!data || typeof data.last === 'undefined' || !Array.isArray(data.content)) {
            throw new Error('無效的伺服器響應格式');
        }

        // 更新分頁狀態
        searchState.hasMore = !data.last;
        
        // 處理返回的內容，確保每頁固定數量
        const processedContent = [];
        let imageCount = 0;
        
        // 遍歷貼文，計算實際圖片數量
        for (const post of data.content) {
            if (post.photoUrls && post.photoUrls.length > 0) {
                // 只取每個貼文的第一張圖片
                const photoUrl = post.photoUrls[0];
                processedContent.push({
                    ...post,
                    photoUrls: [photoUrl]
                });
                imageCount++;
                
                if (imageCount >= searchState.pageSize) {
                    break;
                }
            }
        }
        
        // 更新分頁狀態
        if (processedContent.length === 0) {
            searchState.hasMore = false;
        }
        
        if (processedContent.length < searchState.pageSize) {
            searchState.hasMore = false;
        }
        
        return processedContent;
        
    } catch (error) {
        console.error('搜尋失敗:', error);
        throw error;
    } finally {
        searchState.isLoading = false;
        updateLoadingState(false);
    }
}

// 顯示圖片
function displayImages(posts) {
    const container = document.getElementById('gridContainer');
    const fragment = document.createDocumentFragment();
    let displayedCount = 0;
    
    for (const post of posts) {
        if (post.photoUrls?.length > 0 && displayedCount < searchState.pageSize) {
            const imgWrapper = createImageElement(post, post.photoUrls[0]);
            fragment.appendChild(imgWrapper);
            displayedCount++;
            searchState.totalDisplayed++;
        }
    }
    
    container.appendChild(fragment);
    
    // 如果這一頁顯示的圖片數量少於 pageSize，說明沒有更多圖片了
    if (displayedCount < searchState.pageSize) {
        searchState.hasMore = false;
    }
    
    updateLoadMoreButton();
}

// 創建圖片元素
function createImageElement(post, photoUrl) {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'image-wrapper';
    
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = `data:image/jpeg;base64,${photoUrl}`;
    img.alt = post.content || '圖片';
    
    imgWrapper.addEventListener('click', () => {
        window.PostDisplay.handleImageClick({
			postId: post.postId,  // 確保這裡正確傳遞 postId
			photoUrl,
            memberName: post.memberName,
            content: post.content,
            postTime: post.postTime,
            likeCount: post.likeCount,
            messageCount: post.messageCount  // 新增這行
        });
    });
    
    img.onerror = () => {
        console.error('圖片載入失敗');
        img.src = '/api/placeholder/400/400';
    };
    
    img.onload = () => imgWrapper.classList.add('loaded');
    
    const infoDiv = createInfoElement(post);
    
    imgWrapper.appendChild(img);
    imgWrapper.appendChild(infoDiv);
    
    return imgWrapper;
}

// 創建資訊元素
function createInfoElement(post) {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'image-info';
    infoDiv.innerHTML = `
        <div class="image-header">
            <span class="member-name">@${post.memberName || '匿名'}</span>
        </div>
        <div class="image-content">${post.content || ''}</div>
        <div class="image-metadata">
            <span class="like-count">❤️ ${post.likeCount || 0}</span>
            <span class="message-count">💬 ${post.messageCount || 0}</span>
            <span class="post-time">${formatPostTime(post.postTime)}</span>
        </div>
    `;
    return infoDiv;
}

// 載入更多
async function loadMore() {
    if (searchState.isLoading || !searchState.hasMore) return;
    
    try {
        searchState.page += 1;
        const results = await searchImages(searchState.currentSearchTerm, searchState.page);
        
        if (results && results.length > 0) {
            displayImages(results);
        } else {
            searchState.hasMore = false;
        }
        
        updateLoadMoreButton();
    } catch (error) {
        console.error('載入更多失敗:', error);
        const container = document.getElementById('gridContainer');
        container.appendChild(createErrorElement('載入更多失敗，請稍後再試'));
    }
}

// UI 更新函數
function updateLoadingState(isLoading) {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const searchButton = document.getElementById('search-button');
    
    if (loadMoreBtn) {
        loadMoreBtn.disabled = isLoading;
    }
    
    if (searchButton) {
        searchButton.disabled = isLoading;
    }
    
    const searchInput = document.querySelector('.search__input');
    if (searchInput) {
        searchInput.disabled = isLoading;
    }
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = searchState.hasMore ? 'block' : 'none';
        loadMoreBtn.disabled = searchState.isLoading;
        
        if (searchState.isLoading) {
            loadMoreBtn.innerHTML = `
                <svg class="loading-icon" viewBox="0 0 1024 1024">
                    <path d="M240-440l56-56 184 183 184-183 56 56-240 240-240-240Z"/>
                </svg>
            `;
        } else if (searchState.hasMore) {
            loadMoreBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                    <path d="M480-200 240-440l56-56 184 183 184-183 56 56-240 240Z"/>
                </svg>
            `;
        }
    }
}

function createErrorElement(message) {
    const div = document.createElement('div');
    div.className = 'error-message';
    div.textContent = message;
    return div;
}

function formatPostTime(timestamp) {
    if (!timestamp) return '';
    try {
        const date = new Date(timestamp);
        return date.toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return timestamp;
    }
}

// 初始化應用
document.addEventListener('DOMContentLoaded', initializeSearch);