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

// 更新按讚按鈕樣式
function updateLikeButtonStyle(button, isLiked, likeCount) {
    const heartEmoji = button.querySelector('.heart-emoji');
    const likeCountElement = button.querySelector('.likeCount');
    
    if (isLiked) {
        button.classList.add('liked');
        heartEmoji.textContent = '❤️';
        button.style.color = '#ff4444';
    } else {
        button.classList.remove('liked');
        heartEmoji.textContent = '🤍';
        button.style.color = 'white';
    }
    
    if (likeCountElement && likeCount !== undefined) {
        likeCountElement.textContent = likeCount;
    }
}

// 處理按讚請求
async function handleLike(postId, isLiking) {
    const response = await fetch(`/api/likes/${postId}?isLiking=${isLiking}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'  // 確保包含 cookies 和 session 資訊
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || '請先登入');
    }

    return await response.json();
}

// 新增：從後端獲取最新貼文資訊
async function fetchLatestPostData(postId) {
    try {
        const response = await fetch(`/api/posts/${postId}`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('獲取貼文資訊失敗');
        }
        return await response.json();
    } catch (error) {
        console.error('獲取貼文資訊失敗:', error);
        return null;
    }
}

// 創建貼文頁面的函數
async function createPostPage(postData) {
    // 檢查是否已存在貼文頁面
    let existingPostPage = document.querySelector('.postPage');
    if (existingPostPage) {
        existingPostPage.remove();
    }

    const postPage = document.createElement('div');
    postPage.className = 'postPage';
    
	const latestData = await fetchLatestPostData(postData.postId);
	    if (latestData) {
	        // 更新按讚數和其他可能改變的資訊
	        postData = {
	            ...postData,
	            likeCount: latestData.likeCount,
	            messageCount: latestData.messageCount
	        };
	    }
	
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
                    <div iddata="${postData.postId}" class="pr" style="color: white; padding: 10px 20px; display: flex; align-items: center; height: 100%;">
                        <input class="sendmsg" type="text" placeholder="留言..." style="width: 100%; padding: 8px 12px; border-radius: 20px; background-color: #333; border: none; color: white; outline: none;">
                    </div>
                </div>

                <div class="postStreamBox" style="position: relative; width: 100%; height: 40%; overflow: auto;">
                    <div class="postStream"></div>
                </div>
            </div>
        </div>
    `;

    // 找到按讚按鈕並處理點擊事件
    const likeButton = postPage.querySelector('.likeButton');
    let isLiked = false;
    let isProcessing = false;

	likeButton.addEventListener('click', async (e) => {
	        e.preventDefault();
	        
	        if (isProcessing) return;

	        try {
	            isProcessing = true;
	            console.log('處理按讚，目前狀態:', isLiked);
	            
	            const result = await handleLike(postData.postId, !isLiked);
	            
	            isLiked = !isLiked;
	            console.log('按讚成功，新狀態:', result);
	            
	            updateLikeButtonStyle(likeButton, isLiked, result.likeCount);
	            
	            likeButton.style.transform = 'scale(1.2)';
	            setTimeout(() => {
	                likeButton.style.transform = 'scale(1)';
	            }, 200);

	        } catch (error) {
	            console.error('按讚失敗:', error);
	            if (error.message.includes('請先登入')) {
	                const confirmed = confirm('請先登入才能按讚，是否前往登入頁面？');
	                if (confirmed) {
	                    window.location.href = '/login'; // 替換成您的登入頁面路徑
	                }
	            } else {
	                alert(error.message);
	            }
	        } finally {
	            isProcessing = false;
	        }
	    });

    // 綁定關閉按鈕事件
    const closeButton = postPage.querySelector('.close');
    closeButton.addEventListener('click', () => {
        postPage.remove();
    });

    // ESC鍵關閉
    const escHandler = function(e) {
        if (e.key === 'Escape') {
            postPage.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    document.body.appendChild(postPage);
	
	//enter訊息
	$('.commentInput').keydown(function (event) {
	      if (event.key === "Enter") {
	        //event.preventDefault(); // 防止 textarea 換行（如果適用）
	        sendMessage();
	      }
	});
	//變數區
	var idName='p1';
	var className='pr';
	//送出訊息
	function sendMessage() {
	      let messagein = $('.sendmsg').val();
	      if (messagein != "") {
			pass1(idName);
			pass2(className);
			userRespond();
	        $('.sendmsg').val(""); // 清空輸入框
			idName='p1'
			className='pr'
	      }
	}
	//回覆
	$('.postContent').on('mouseenter', '.respond', function () {
	    $(this).css({
		    'color': 'aqua',
		    'cursor': 'pointer'
	    });
	}).on('mouseleave', '.respond', function () {
	    $(this).css({
	        'color': '',
	        'cursor': ''
	    });
	}).on('click', '.respond', function () {
	    var resN = $(this).parent().find('.username').text();
	    let t = $('.sendmsg').val();
	    $('.sendmsg').val(t + '@' + resN + ' ');
	    className = $(this).parent().attr('class');
	    idName = $(this).parent().attr('iddata');
		$('.sendmsg').focus();
	});
	
	
	
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