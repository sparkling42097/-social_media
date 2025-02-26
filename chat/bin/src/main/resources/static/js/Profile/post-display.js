// 確保頁面加載完成後才執行腳本
document.addEventListener('DOMContentLoaded', function() {
    // 添加必要的樣式
    const style = document.createElement('style');
    style.textContent = `
        .postPage {
            animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        .postStreamBox::-webkit-scrollbar {
            width: 0.45rem;
        }

        .postStreamBox::-webkit-scrollbar-track {
            background: rgb(63, 63, 63);
        }

        .postStreamBox::-webkit-scrollbar-thumb {
            background: gray;
        }
        
        .image-wrapper {
            cursor: pointer;
            transition: transform 0.2s ease-in-out;
        }
        
        .image-wrapper:hover {
            transform: scale(1.02);
        }

        .likeButton:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        .likeButton {
            transition: transform 0.2s, background-color 0.2s;
        }

        .likeButton.liked .heart-emoji {
            color: #ff4444;
        }
    `;
    document.head.appendChild(style);
});

// 添加檢查按讚狀態的函數
async function checkLikeStatus(postId) {
    try {
        const response = await fetch(`/api/likes/${postId}/status`);
        if (response.ok) {
            return await response.json();
        }
        return false;
    } catch (error) {
        console.error('檢查按讚狀態失敗:', error);
        return false;
    }
}

// 更新按讚按鈕樣式
function updateLikeButtonStyle(button, isLiked) {
    if (isLiked) {
        button.classList.add('liked');
        button.querySelector('.heart-emoji').textContent = '❤️';
    } else {
        button.classList.remove('liked');
        button.querySelector('.heart-emoji').textContent = '🤍';
    }
}

// 創建貼文頁面的函數
async function createPostPage(postData) {
    // 檢查是否已存在貼文頁面
    let existingPostPage = document.querySelector('.postPage');
    if (existingPostPage) {
        existingPostPage.remove();
    }

    // 先檢查按讚狀態
    const initialLikeStatus = await checkLikeStatus(postData.postId);
    
    const postPage = document.createElement('div');
    postPage.className = 'postPage';
    
    // 設置基本樣式
    postPage.style.position = 'fixed';
    postPage.style.top = '0';
    postPage.style.left = '0';
    postPage.style.width = '100%';
    postPage.style.height = '100%';
    postPage.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    postPage.style.display = 'flex';
    postPage.style.justifyContent = 'center';
    postPage.style.alignItems = 'center';
    postPage.style.zIndex = '1000';

    // 更新的內容結構
    postPage.innerHTML = `
        <div class="post" style="position: relative; width: 65%; height: 95%; background-color: black; border: 2px solid rgb(145, 144, 144); border-radius: 10px; display: flex;">
            <button class="close" style="position: absolute; top: 0; right: 0; width: 45px; height: 45px; background: #575757c7; border: none; border-bottom-left-radius: 25px; cursor: pointer; z-index: 1001;">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
            </button>
            
            <div class="carousel" style="width: 55%; height: 100%; background-color: black; padding: 0.5px;">
                <img src="data:image/jpeg;base64,${postData.photoUrl}" style="width: 100%; height: 100%; object-fit: contain;" alt="Post Image">
            </div>

            <div class="postContent" style="width: 45%; height: 100%; border-left: 1px solid rgb(145, 144, 144);">
                <div class="postMember" style="position: relative; width: 100%; height: 8%; border-bottom: 1px solid rgb(145, 144, 144);">
                    <div class="postMember2" style="position: absolute; top: 20px; left: 20px; color: white; font-size: 20px;">
                        @${postData.memberName || '匿名'}
                    </div>
                </div>
                
                <div class="postMain" style="width: 100%; height: 36%; border-bottom: 1px solid rgb(145, 144, 144); display: flex; flex-direction: column; justify-content: space-between;">
                    <div style="color: white; padding: 20px; overflow-y: auto; flex-grow: 1; word-wrap: break-word; word-break: break-all;">
                        ${postData.content || ''}
                    </div>
                </div>
                
                <div class="goodList" style="width: 100%; height: 8%; border-bottom: 1px solid rgb(145, 144, 144);">
                    <div style="color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="color: #888;">
                            發布時間：${formatPostTime(postData.postTime)}
                        </div>
                        <div style="display: flex; gap: 15px;">
                            <button class="likeButton" style="background: none; border: none; color: white; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 4px;">
                                <span class="heart-emoji">🤍</span>
                                <span class="likeCount">${postData.likeCount || 0}</span>
                            </button>
                            <span>💬 ${postData.messageCount || 0}</span>
                        </div>
                    </div>
                </div>

                <div class="commentInput" style="width: 100%; height: 8%; border-bottom: 1px solid rgb(145, 144, 144);">
                    <div style="color: white; padding: 10px 20px; display: flex; align-items: center; height: 100%;">
                        <input type="text" placeholder="留言..." style="width: 100%; padding: 8px 12px; border-radius: 20px; background-color: #333; border: none; color: white; outline: none;">
                    </div>
                </div>

                <div class="postStreamBox" style="position: relative; width: 100%; height: 40%; overflow: auto;">
                    <div class="postStream"></div>
                </div>
            </div>
        </div>
    `;

	
	const buttonHTML = `
	        <button class="likeButton" style="background: none; border: none; color: white; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 4px;">
	            <span class="heart-emoji">🤍</span>
	            <span class="likeCount">${postData.likeCount || 0}</span>
	        </button>
	    `;
		
	// 找到按讚按鈕
	    const likeButton = postPage.querySelector('.likeButton');
		let isLiked = false;  // 初始狀態設為未按讚
		    let isProcessing = false;  // 防止重複點擊

		    likeButton.addEventListener('click', async () => {
		        if (isProcessing) return;  // 如果正在處理中，直接返回
		        
		        try {
		            isProcessing = true;  // 開始處理
		            
		            const response = await fetch(`/api/likes/${postData.postId}?isLiking=${!isLiked}`, {
		                method: 'PUT',
		                headers: {
		                    'Content-Type': 'application/json',
		                }
		            });

		            const result = await response.json();
		            
		            if (!response.ok) {
		                throw new Error(result.error || '請先登入');
		            }
		            
		            // 更新狀態
		            isLiked = !isLiked;
		            
		            // 更新按讚數
		            const likeCountElement = likeButton.querySelector('.likeCount');
		            likeCountElement.textContent = result.likeCount;
		            
		            // 更新按鈕外觀
		            const heartEmoji = likeButton.querySelector('.heart-emoji');
		            if (isLiked) {
		                heartEmoji.textContent = '❤️';
		                likeButton.style.color = '#ff4444';
		            } else {
		                heartEmoji.textContent = '🤍';
		                likeButton.style.color = 'white';
		            }
		            
		            // 添加動畫效果
		            likeButton.style.transform = 'scale(1.2)';
		            setTimeout(() => {
		                likeButton.style.transform = 'scale(1)';
		            }, 200);
		            
		        } catch (error) {
		            console.error('按讚請求失敗:', error);
		            alert(error.message);
		        } finally {
		            isProcessing = false;  // 完成處理
		        }
		    });
			
    // 綁定關閉按鈕事件
    const closeButton = postPage.querySelector('.close');
    closeButton.addEventListener('click', () => {
        postPage.remove();
    });

    // ESC鍵關閉
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            postPage.remove();
        }
    });
	
	document.body.appendChild(postPage);
}

// 修改顯示圖片函數，添加點擊事件處理
function handleImageClick(postData) {
    createPostPage(postData);
}

// 暴露給外部使用的函數
window.PostDisplay = {
    createPostPage,
    handleImageClick
};