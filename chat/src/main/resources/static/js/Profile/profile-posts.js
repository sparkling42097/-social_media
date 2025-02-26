const searchState = {
    page: 0,
    pageSize: 8,
    isLoading: false,
    hasMore: true,
    totalDisplayed: 0
};

const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(10px); }
    }
    
    .load-more-container:hover {
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }

`;
document.head.appendChild(style);

async function loadUserPosts(memberName) {
    if (searchState.isLoading || !searchState.hasMore) return;
    
    searchState.isLoading = true;
    updateLoadingState(true);
    
    const data = await PostsManager.loadUserPosts(memberName, searchState.page, searchState.pageSize);
    
    if (!data || !data.content || data.content.length === 0) {
        if (searchState.page === 0) {
            const container = document.querySelector('.middle-bottom');
            const noPostsMsg = document.createElement('div');
            noPostsMsg.style.cssText = `
                color: white;
                text-align: center;
                padding: 20px;
                font-size: 16px;
                font-family: "Noto Sans TC", serif;
				margin-left: -35px;
            `;
            noPostsMsg.textContent = '目前無貼文';
            container.innerHTML = '';
            container.appendChild(noPostsMsg);
        }
        searchState.hasMore = false;
        updateLoadingState(false);
        return;
    }

    const processedPosts = [];
    let postCount = 0;
    
    for (const post of data.content) {
        if (post.photoUrls && post.photoUrls.length > 0) {
            processedPosts.push({
                ...post,
                photoUrls: [post.photoUrls[0]]
            });
            postCount++;
            
            if (postCount >= searchState.pageSize) break;
        }
    }
    
    displayPosts(processedPosts);
    searchState.hasMore = !data.last && processedPosts.length === searchState.pageSize;
    searchState.page++;
    searchState.isLoading = false;
    updateLoadingState(false);
}

function displayPosts(posts) {
    const middle = document.querySelector('.middle');
    const container = document.querySelector('.middle-bottom');
    
    middle.style.cssText = `
        width: 50vw;
        height: 100vh;
        background-color: rgba(128, 128, 128, 0.1);
        border-radius: 40px 40px 0 0;
        color: white;
        overflow-x: hidden;
    `;
    
    container.style.cssText = `
        padding: 20px;
        width: 100%;
    `;
    
    if (searchState.page === 0) container.innerHTML = '';
    
    const postsGrid = document.createElement('div');
    postsGrid.className = 'grid-container';
    postsGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        width: 100%;
        max-width: 100%;
    `;
    
    posts.forEach(post => {
        if (post.photoUrls?.length > 0) {
            postsGrid.appendChild(createPostElement(post));
            searchState.totalDisplayed++;
        }
    });
    
    container.appendChild(postsGrid);
    
    // 移除舊的載入按鈕
    const oldLoadMore = container.querySelector('.load-more-container');
    if (oldLoadMore) oldLoadMore.remove();
    
    if (searchState.hasMore) {
        const loadMoreContainer = document.createElement('div');
        loadMoreContainer.className = 'load-more-container';
        loadMoreContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            cursor: pointer;
        `;
        
        const arrowIcon = document.createElement('div');
        arrowIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9l6 6 6-6"/>
            </svg>
        `;
        arrowIcon.style.color = 'white';
        
        loadMoreContainer.appendChild(arrowIcon);
        
        loadMoreContainer.addEventListener('click', async () => {
            if (!searchState.isLoading) {
                const memberName = document.getElementById('blurName').textContent;
                arrowIcon.style.animation = 'bounce 1s infinite';
                await loadUserPosts(memberName);
                if (!searchState.hasMore) {
                    loadMoreContainer.remove();
                } else {
                    arrowIcon.style.animation = '';
                }
            }
        });
        
        container.appendChild(loadMoreContainer);
    }
}

function createPostElement(post) {
    const postWrapper = document.createElement('div');
    postWrapper.className = 'image-wrapper';
    postWrapper.style.cssText = `
        position: relative;
        width: 100%;
        padding-top: 100%;
        overflow: hidden;
        cursor: pointer;
        background-color: #000;
    `;
    
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = `data:image/jpeg;base64,${post.photoUrls[0]}`;
    img.alt = post.content || '貼文圖片';
    img.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    `;
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'image-info';
    infoDiv.innerHTML = `
        <div class="image-header">
            <span class="member-name">@${post.memberName || '匿名'}</span>
        </div>
        <div class="image-content">${post.content || ''}</div>
        <div class="image-metadata">
            <span>❤️ ${post.likeCount || 0}</span>
            <span>💬 ${post.messageCount || 0}</span>
            <span>${formatPostTime(post.postTime)}</span>
        </div>
    `;
    
    postWrapper.appendChild(img);
    postWrapper.appendChild(infoDiv);
    
    postWrapper.addEventListener('click', () => {
        if (window.PostDisplay?.handleImageClick) {
            window.PostDisplay.handleImageClick({
                postId: post.postId,
                photoUrl: post.photoUrls[0],
                memberName: post.memberName,
                content: post.content,
                postTime: post.postTime,
                likeCount: post.likeCount,
                messageCount: post.messageCount
            });
        }
    });
    
    return postWrapper;
}

function updateLoadingState(isLoading) {
    const loadMoreContainer = document.querySelector('.load-more-container');
    if (loadMoreContainer) {
        const arrowIcon = loadMoreContainer.querySelector('div');
        if (isLoading) {
            arrowIcon.style.animation = 'bounce 1s infinite';
        } else if (searchState.hasMore) {
            arrowIcon.style.animation = '';
        } else {
            loadMoreContainer.remove();
        }
    }
}

function showError(message) {
    const container = document.querySelector('.middle-bottom');
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    container.appendChild(errorEl);
}

function formatPostTime(timestamp) {
    if (!timestamp) return '';
    try {
        return new Date(timestamp).toLocaleString('zh-TW', {
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

// 初始化時設置事件監聽
window.addEventListener('DOMContentLoaded', () => {
    // 監聽新貼文創建事件
    PostsManager.addEventListener('onPostCreated', () => {
        // 重置搜尋狀態
        searchState.page = 0;
        searchState.hasMore = true;
        searchState.totalDisplayed = 0;
        
        // 重新載入貼文
        const memberName = document.getElementById('blurName').textContent;
        loadUserPosts(memberName);
    });

    // 延遲初始載入
    setTimeout(() => {
        const memberName = document.getElementById('blurName').textContent;
        searchState.page = 0;
        searchState.hasMore = true;
        searchState.totalDisplayed = 0;
        loadUserPosts(memberName);
    }, 100);
});