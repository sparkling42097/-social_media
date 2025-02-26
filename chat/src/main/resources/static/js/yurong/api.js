document.addEventListener('DOMContentLoaded', function () {
   let currentPage = 0;
   let loading = false;
   let hasMore = true;
   
   const shareBtn = document.querySelector('.share-btn');
   const { addNotification } = window.uiHelpers;

   // API路徑配置
   const API = {
       createPost: '/api/posts',                                     // 創建貼文
       getPost: (id) => `/api/posts/${id}`,                         // 獲取單一貼文
       getPosts: '/api/posts',                                      // 獲取貼文列表 
       updatePost: (id) => `/api/posts/${id}`,                      // 更新貼文
       deletePost: (id) => `/api/posts/${id}`,                      // 刪除貼文
       updateLike: (id) => `/api/posts/${id}/like`,                 // 更新貼文讚數
       addComment: (id) => `/api/posts/${id}/comments`,             // 新增評論
       deleteComment: (postId, commentId) => 
           `/api/posts/${postId}/comments/${commentId}`,            // 刪除評論
       uploadPhoto: '/api/posts/upload-photo'                       // 上傳照片
   };

   // 包含授權的fetch請求
   const fetchWithAuth = async (url, options = {}) => {
       const defaultOptions = {
           credentials: 'include',      // 包含cookie認證
           headers: {
               ...options.headers
           }
       };
       const response = await fetch(url, { ...defaultOptions, ...options });
       if (!response.ok) {
           throw new Error(await response.text());
       }
       return response;
   };

   // 裁切相關變量
   let cropperInstance = null;

   // 展示上傳選項
   function showUploadOptions(files) {
       const uploadContainer = document.querySelector('.upload-container');
       const uploadArea = document.querySelector('.upload-area');
       const modeSelect = document.querySelector('.mode-select');
       
       // 顯示選擇按鈕
       modeSelect.style.display = 'flex';
       uploadArea.style.display = 'none';
       
       // 裁切模式 - 只能選擇第一張圖片
       document.querySelector('.crop-mode-btn').onclick = () => {
           if (cropperInstance) {
               cropperInstance.destroy();
               cropperInstance = null;
           }
           initImageCropper(Array.isArray(files) ? files[0] : files);
           modeSelect.style.display = 'none';
       };
       
       // 直接上傳模式 - 支持多張圖片
       document.querySelector('.direct-mode-btn').onclick = () => {
           showDirectPreview(files);
           modeSelect.style.display = 'none';
           shareBtn.disabled = false;
       };

       window.uiHelpers.selectedFiles = Array.isArray(files) ? files : [files];
   }

   // 顯示直接預覽
   function showDirectPreview(files) {
       const uploadContainer = document.querySelector('.upload-container');
       const filesArray = Array.isArray(files) ? files : [files];
       
       // 創建輪播容器
       const carouselContainer = document.createElement('div');
       carouselContainer.className = 'carousel-container';
       carouselContainer.innerHTML = `
           <div class="carousel-wrapper">
               <div class="carousel"></div>
               ${filesArray.length > 1 ? `
                   <button class="carousel-btn prev" style="display: none;">
                       <i class="fas fa-chevron-left"></i>
                   </button>
                   <button class="carousel-btn next">
                       <i class="fas fa-chevron-right"></i>
                   </button>
                   <div class="carousel-indicators">
                       ${filesArray.map((_, i) => `
                           <div class="indicator ${i === 0 ? 'active' : ''}"></div>
                       `).join('')}
                   </div>
               ` : ''}
           </div>
       `;

       const carousel = carouselContainer.querySelector('.carousel');
       
       // 添加所有圖片到輪播
       filesArray.forEach(file => {
           const preview = document.createElement('div');
           preview.className = 'image-preview';
           const img = document.createElement('img');
           img.src = URL.createObjectURL(file);
           preview.appendChild(img);
           carousel.appendChild(preview);
       });

       // 清空並添加新的輪播
       uploadContainer.innerHTML = '';
       uploadContainer.appendChild(carouselContainer);
       
       window.uiHelpers.selectedFiles = filesArray;

       // 如果有多張圖片，初始化輪播功能
       if (filesArray.length > 1) {
           initPreviewCarousel(carouselContainer);
       }
   }

   // 初始化預覽輪播
   function initPreviewCarousel(container) {
       const carousel = container.querySelector('.carousel');
       const prevBtn = container.querySelector('.carousel-btn.prev');
       const nextBtn = container.querySelector('.carousel-btn.next');
       const indicators = container.querySelectorAll('.indicator');
       let currentSlide = 0;

       const updateSlide = () => {
           carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
           indicators.forEach((indicator, index) => {
               indicator.classList.toggle('active', index === currentSlide);
           });
           
           // 更新按鈕顯示狀態
           if (prevBtn) prevBtn.style.display = currentSlide > 0 ? 'flex' : 'none';
           if (nextBtn) nextBtn.style.display = currentSlide < indicators.length - 1 ? 'flex' : 'none';
       };

       // 綁定按鈕事件
       prevBtn?.addEventListener('click', (e) => {
           e.preventDefault();
           e.stopPropagation();
           if (currentSlide > 0) {
               currentSlide--;
               updateSlide();
           }
       });

       nextBtn?.addEventListener('click', (e) => {
           e.preventDefault();
           e.stopPropagation();
           if (currentSlide < indicators.length - 1) {
               currentSlide++;
               updateSlide();
           }
       });

       // 綁定指示器事件
       indicators.forEach((indicator, index) => {
           indicator.addEventListener('click', (e) => {
               e.preventDefault();
               e.stopPropagation();
               currentSlide = index;
               updateSlide();
           });
       });

       updateSlide();
   }

   // 初始化圖片裁切器
   function initImageCropper(file) {
       const uploadContainer = document.querySelector('.upload-container');
       
       // 清空容器
       uploadContainer.innerHTML = '';
       
       // 創建裁切區域
       const cropContainer = document.createElement('div');
       cropContainer.className = 'crop-container';
       
       const img = document.createElement('img');
       img.src = URL.createObjectURL(file);
       cropContainer.appendChild(img);
       
       uploadContainer.appendChild(cropContainer);
       
       // 初始化 Cropper
       cropperInstance = new Cropper(img, {
           aspectRatio: 1,
           viewMode: 1,
           dragMode: 'move',
           autoCropArea: 1,
           restore: false,
           guides: true,
           center: true,
           highlight: false,
           cropBoxMovable: true,
           cropBoxResizable: true,
           toggleDragModeOnDblclick: false,
           ready: function() {
               // 當 Cropper 準備好時顯示操作按鈕
               const cropActions = document.querySelector('.crop-actions');
               if (cropActions) {
                   cropActions.style.display = 'flex';
               }
               shareBtn.disabled = false;
           }
       });

       // 綁定裁切確認按鈕事件
       const confirmCropBtn = document.querySelector('.crop-confirm');
       if (confirmCropBtn) {
           confirmCropBtn.onclick = async () => {
               if (!cropperInstance) return;

               try {
                   const cropData = cropperInstance.getData(true); // true參數獲取實際像素值
                   
                   const formData = new FormData();
                   formData.append('image', file);
                   formData.append('x', Math.round(cropData.x));
                   formData.append('y', Math.round(cropData.y));
                   formData.append('width', Math.round(cropData.width));
                   formData.append('height', Math.round(cropData.height));

                   const response = await fetchWithAuth(API.uploadPhoto, {
                       method: 'POST',
                       body: formData
                   });

                   if (!response.ok) {
                       throw new Error('圖片處理失敗');
                   }

                   // 獲取處理後的圖片並創建預覽
                   const processedImage = await response.blob();
                   const croppedFile = new File([processedImage], 'cropped.jpg', {
                       type: 'image/jpeg'
                   });

                   // 更新選中的文件
                   window.uiHelpers.selectedFiles = [croppedFile];

                   // 創建預覽
                   const preview = document.createElement('div');
                   preview.className = 'image-preview';
                   const previewImg = document.createElement('img');
                   previewImg.src = URL.createObjectURL(croppedFile);
                   preview.appendChild(previewImg);

                   // 更新 UI
                   uploadContainer.innerHTML = '';
                   uploadContainer.appendChild(preview);

                   // 隱藏裁切操作按鈕
                   const cropActions = document.querySelector('.crop-actions');
                   if (cropActions) {
                       cropActions.style.display = 'none';
                   }

               } catch (error) {
                   console.error('裁切處理失敗:', error);
                   alert('圖片裁切失敗: ' + error.message);
               } finally {
                   // 清理裁切實例
                   if (cropperInstance) {
                       cropperInstance.destroy();
                       cropperInstance = null;
                   }
               }
           };
       }
   }

   // 重置模態框
   function resetModal() {
       // 清除文本內容和文件狀態
       postText.value = '';
       window.uiHelpers.selectedFiles = [];

       // 清除裁切相關狀態
       if (cropperInstance) {
           cropperInstance.destroy();
           cropperInstance = null;
       }

       const cropActions = document.querySelector('.crop-actions');
       if (cropActions) {
           cropActions.style.display = 'none';
       }

       // 重置上傳區域
       const uploadContainer = document.querySelector('.upload-container');
       if (uploadContainer) {
           // 使用初始的上傳界面 HTML
           uploadContainer.innerHTML = `
               <div class="upload-area" style="display: block;">
                   <i class="fas fa-images"></i>
                   <h3>拖放照片和影片到這裡</h3>
                   <label class="upload-btn">
                       從電腦選擇
                       <input type="file" multiple accept="image/*" id="fileInput" hidden>
                   </label>
               </div>
               <div class="mode-select" style="display: none;">
                   <button class="crop-mode-btn">裁切上傳</button>
                   <button class="direct-mode-btn">直接上傳</button>
               </div>
           `;

           // 重新綁定文件輸入事件
           const newFileInput = uploadContainer.querySelector('#fileInput');
           if (newFileInput) {
               newFileInput.addEventListener('change', (e) => {
                   if (e.target.files && e.target.files.length > 0) {
                       // 將 FileList 轉換為數組
                       const files = Array.from(e.target.files);
                       showUploadOptions(files);
                   }
               });
           }
       }

       // 重置分享按鈕狀態
       const shareBtn = document.querySelector('.share-btn');
       if (shareBtn) {
           shareBtn.disabled = true;
       }
   }

   // 創建貼文
   async function createPost() {
       try {
           const { postText, modal, selectedFiles } = window.uiHelpers;
           const formData = new FormData();
           formData.append('content', postText.value || '');

           if (!selectedFiles || selectedFiles.length === 0) {
               throw new Error('請選擇至少一張圖片');
           }

           selectedFiles.forEach(file => {
               formData.append('photos', file);
           });

           const response = await fetchWithAuth(API.createPost, {
               method: 'POST',
               body: formData
           });

           const post = await response.json();
           const container = document.getElementById('postContainer');
           if (!container) {
               throw new Error('找不到貼文容器');
           }

           const postElement = createPostElement(post);
           container.insertBefore(postElement, container.firstChild);

           // 完全重置模态框状态和上传区域
           modal.style.display = 'none';
           resetModal();
           
       } catch (error) {
           console.error('Error in createPost:', error);
           alert(error.message || '發布貼文失敗');
       }
   }

   // 創建貼文元素
   function createPostElement(post) {
       const postElement = document.createElement('div');
       postElement.className = 'post';
       postElement.dataset.postId = post.postId;

       postElement.innerHTML = `
          <div class="post-header">
                <div class="post-header-left">
                        <img src="${post.posterAvatar || 'https://via.placeholder.com/32'}" alt="${post.posterName}">
                           <span class="username">${post.posterName}</span>
                </div>
               <div class="post-header-right">
                   <span class="post-time">${post.postTime}</span>
                   ${post.ownPost ? `
                       <button class="edit-post-btn">
                           <i class="fas fa-edit"></i>
                       </button>
                       <button class="delete-post-btn">
                           <i class="fas fa-times"></i>
                       </button>
                   ` : ''}
               </div>
           </div>
           <div class="post-carousel">
               <div class="carousel-wrapper">
                   <div class="carousel">
                       ${post.photoUrls.map(url =>
                           `<img src="${url}" alt="Post Image">`
                       ).join('')}
                   </div>
                   ${post.photoUrls.length > 1 ? `
                       <button class="carousel-btn prev">
                           <i class="fas fa-chevron-left"></i>
                       </button>
                       <button class="carousel-btn next">
                           <i class="fas fa-chevron-right"></i>
                       </button>
                       <div class="carousel-indicators">
                           ${post.photoUrls.map((_, i) =>
							`<div class="indicator ${i === 0 ? 'active' : ''}"></div>`
							                           ).join('')}
							                       </div>` : ''}
							               </div>
							           </div>
							           <div class="post-actions">
							               <div class="action-buttons">
							                   <div class="action-buttons-left">
							                       <button class="like-btn">
							                           <i class="${post.isLiked ? 'fas' : 'far'} fa-heart"></i>
							                       </button>
							                       <button class="comment-btn">
							                           <i class="far fa-comment"></i>
							                       </button>
							                       <button class="share-post-btn">
							                           <i class="far fa-paper-plane"></i>
							                       </button>
							                   </div>
							                   <div class="action-buttons-right">
							                       <button class="bookmark-btn">
							                           <i class="${post.isCollected ? 'fas' : 'far'} fa-bookmark"></i>
							                       </button>
							                   </div>
							               </div>
							               <div class="likes-count">${post.likedCount || 0} 個讚</div>
							               <div class="post-caption">
							                   <span class="username">${post.posterName}</span>
							                   <span class="caption-text">${post.postContent}</span>
							               </div>
							           </div>
							           <div class="comments-section" style="display: none;">
							               <div class="comments-list"></div>
							               <div class="add-comment">
							                   <input type="text" placeholder="添加留言..." class="comment-input">
							                   <button class="post-comment-btn">發布</button>
							               </div>
							           </div>`;

							       // 為新貼文綁定事件
							       bindPostEvents(postElement, post);

							       return postElement;
							   }

							   // 綁定貼文事件處理
							   function bindPostEvents(postElement, post) {
							       // 編輯與刪除按鈕
							       if (post.ownPost) {
							           const deleteBtn = postElement.querySelector('.delete-post-btn');
							           const editBtn = postElement.querySelector('.edit-post-btn');

							           deleteBtn?.addEventListener('click', async (e) => {
							               e.preventDefault();
							               e.stopPropagation();
							               if (confirm('確定要刪除這篇貼文嗎？')) {
							                   try {
							                       await deletePost(post.postId);
							                       postElement.remove();
							                   } catch (error) {
							                       console.error('Error:', error);
							                       alert('刪除貼文失敗');
							                   }
							               }
							           });

							           editBtn?.addEventListener('click', async (e) => {
							               e.preventDefault();
							               e.stopPropagation();
							               const newContent = prompt('編輯貼文:', post.postContent);
							               if (newContent !== null && newContent !== post.postContent) {
							                   try {
							                       const updatedPost = await editPost(post.postId, newContent);
							                       const captionText = postElement.querySelector('.caption-text');
							                       if (captionText) {
							                           captionText.textContent = updatedPost.postContent;
							                       }
							                       post.postContent = updatedPost.postContent;
							                   } catch (error) {
							                       console.error('Error:', error);
							                       alert('更新貼文失敗');
							                   }
							               }
							           });
							       }

							       // 讚按鈕
							       const likeBtn = postElement.querySelector('.like-btn');
							       const likesCountElement = postElement.querySelector('.likes-count');
							       let likeCount = post.likedCount || 0;

							       likeBtn?.addEventListener('click', async () => {
							           try {
							               const icon = likeBtn.querySelector('i');
							               const isCurrentlyLiked = icon.classList.contains('fas');
							               
							               await updateLike(post.postId, !isCurrentlyLiked);
							               
							               if (!isCurrentlyLiked) {
							                   icon.classList.remove('far');
							                   icon.classList.add('fas');
							                   likeCount++;
							                   addNotification('like', {
							                       name: post.posterName,
							                       avatar: post.posterAvatar
							                   }, post.postId);
							               } else {
							                   icon.classList.remove('fas');
							                   icon.classList.add('far');
							                   likeCount--;
							               }
							               
							               likesCountElement.textContent = `${likeCount} 個讚`;
							           } catch (error) {
							               console.error('Like update failed:', error);
							               alert('更新讚數失敗');
							           }
							       });

							       // 評論功能
							       const commentBtn = postElement.querySelector('.comment-btn');
							       const commentsSection = postElement.querySelector('.comments-section');
							       const commentInput = postElement.querySelector('.comment-input');
							       const postCommentBtn = postElement.querySelector('.post-comment-btn');
							       const commentsList = postElement.querySelector('.comments-list');

							       commentBtn?.addEventListener('click', () => {
							           commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
							       });

							       // 添加評論函數
							       async function addComment(content) {
							           try {
							               const response = await fetchWithAuth(API.addComment(post.postId), {
							                   method: 'POST',
							                   headers: {
							                       'Content-Type': 'application/x-www-form-urlencoded',
							                   },
							                   body: new URLSearchParams({ content })
							               });
							               
							               const comment = await response.json();
							               const commentElement = document.createElement('div');
							               commentElement.className = 'comment';
							               commentElement.innerHTML = `
							                   <img src="${comment.memberAvatar || 'https://via.placeholder.com/24'}" alt="${comment.memberName}" style="width: 24px; height: 24px; border-radius: 50%;">
							                   <div class="comment-content">
							                       <span class="comment-username">${comment.memberName}</span>
							                       <span class="comment-text">${comment.content}</span>
							                       ${comment.isOwnComment ? `
							                           <button class="delete-comment-btn">
							                               <i class="fas fa-times"></i>
							                           </button>
							                       ` : ''}
							                   </div>
							               `;

							               if (comment.isOwnComment) {
							                   const deleteCommentBtn = commentElement.querySelector('.delete-comment-btn');
							                   deleteCommentBtn?.addEventListener('click', async () => {
							                       if (confirm('確定要刪除這則評論嗎？')) {
							                           try {
							                               await fetchWithAuth(API.deleteComment(post.postId, comment.id), {
							                                   method: 'DELETE'
							                               });
							                               commentElement.remove();
							                           } catch (error) {
							                               console.error('Error:', error);
							                               alert('刪除評論失敗');
							                           }
							                       }
							                   });
							               }

							               commentsList.appendChild(commentElement);
							               addNotification('comment', {
							                   name: comment.memberName,
							                   avatar: comment.memberAvatar
							               }, post.postId, content);
							           } catch (error) {
							               console.error('Error:', error);
							               alert('發布評論失敗');
							           }
							       }

							       postCommentBtn?.addEventListener('click', () => {
							           const commentText = commentInput.value.trim();
							           if (commentText) {
							               addComment(commentText);
							               commentInput.value = '';
							           }
							       });

							       // 分享按鈕
							       const shareBtn = postElement.querySelector('.share-post-btn');
							       shareBtn?.addEventListener('click', () => {
							           alert('已複製貼文連結！');
							       });

							       // 收藏按鈕
							       const bookmarkBtn = postElement.querySelector('.bookmark-btn');
							       bookmarkBtn?.addEventListener('click', () => {
							           const icon = bookmarkBtn.querySelector('i');
							           if (icon.classList.contains('far')) {
							               icon.classList.remove('far');
							               icon.classList.add('fas');
							               bookmarkBtn.setAttribute('title', '取消收藏');
							           } else {
							               icon.classList.remove('fas');
							               icon.classList.add('far');
							               bookmarkBtn.setAttribute('title', '收藏');
							           }
							       });

							       // 輪播功能
							       const carousel = postElement.querySelector('.carousel');
							       const prevBtn = postElement.querySelector('.carousel-btn.prev');
							       const nextBtn = postElement.querySelector('.carousel-btn.next');
							       const indicators = postElement.querySelectorAll('.indicator');
							       let currentSlide = 0;

							       if (carousel && post.photoUrls.length > 0) {
							           const updateSlide = () => {
							               carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
							               indicators.forEach((indicator, index) => {
							                   indicator.classList.toggle('active', index === currentSlide);
							               });
							               if (prevBtn) prevBtn.style.display = currentSlide > 0 ? 'flex' : 'none';
							               if (nextBtn) nextBtn.style.display = currentSlide < post.photoUrls.length - 1 ? 'flex' : 'none';
							           };

							           prevBtn?.addEventListener('click', (e) => {
							               e.preventDefault();
							               e.stopPropagation();
							               if (currentSlide > 0) {
							                   currentSlide--;
							                   updateSlide();
							               }
							           });

							           nextBtn?.addEventListener('click', (e) => {
							               e.preventDefault();
							               e.stopPropagation();
							               if (currentSlide < post.photoUrls.length - 1) {
							                   currentSlide++;
							                   updateSlide();
							               }
							           });

							           indicators.forEach((indicator, index) => {
							               indicator.addEventListener('click', (e) => {
							                   e.preventDefault();
							                   e.stopPropagation();
							                   currentSlide = index;
							                   updateSlide();
							               });
							           });

							           updateSlide();
							       }
							   }

							   // 編輯貼文
							   async function editPost(postId, content) {
							       const formData = new URLSearchParams();
							       formData.append('content', content);

							       try {
							           const response = await fetchWithAuth(API.updatePost(postId), {
							               method: 'PUT',
							               headers: {
							                   'Content-Type': 'application/x-www-form-urlencoded',
							               },
							               body: formData
							           });
							           return response.json();
							       } catch (error) {
							           throw new Error('Failed to update post');
							       }
							   }

							   // 刪除貼文
							   async function deletePost(postId) {
							       try {
							           await fetchWithAuth(API.deletePost(postId), {
							               method: 'DELETE'
							           });
							       } catch (error) {
							           throw new Error('Failed to delete post');
							       }
							   }

							   // 更新讚數
							   async function updateLike(postId, isLike) {
							       try {
							           await fetchWithAuth(API.updateLike(postId) + `?isLike=${isLike}`, {
							               method: 'PUT'
							           });
							       } catch (error) {
							           throw new Error('Failed to update like');
							       }
							   }

							   // 初始加載貼文列表
							   async function getPostList() {
							       if (loading || !hasMore) return;
							       
							       try {
							           loading = true;
							           console.log('獲取貼文列表，頁碼：', currentPage);
							           
							           const container = document.getElementById('postContainer');
							           if (!container) {
							               console.error('找不到 postContainer 元素');
							               return;
							           }

							           // 顯示載入動畫
							           const loadingSpinner = document.createElement('div');
							           loadingSpinner.className = 'loading-spinner';
							           container.appendChild(loadingSpinner);

							           const response = await fetchWithAuth(`${API.getPosts}?page=${currentPage}&size=10`);
							           const posts = await response.json();
							           
							           // 移除載入動畫
							           loadingSpinner.remove();
							           
							           if (posts.length === 0) {
							               hasMore = false;
							               if (currentPage === 0) {
							                   container.innerHTML = '<p>目前沒有貼文</p>';
							               }
							               return;
							           }

							           posts.forEach(post => {
							               const postElement = createPostElement(post);
							               container.appendChild(postElement);
							           });

							           currentPage++;
							       } catch (error) {
							           console.error('錯誤:', error);
							           alert('獲取貼文列表失敗');
							       } finally {
							           loading = false;
							       }
							   }

							   // 檔案上傳相關
							   const fileInput = document.getElementById('fileInput');
							   fileInput?.addEventListener('change', (e) => {
							       if (e.target.files && e.target.files.length > 0) {
							           // 將 FileList 轉換為數組
							           const files = Array.from(e.target.files);
							           showUploadOptions(files);
							       }
							   });

							   // 事件監聽
							   shareBtn?.addEventListener('click', createPost);

							   // 添加滾動監聽
							   window.addEventListener('scroll', () => {
							       if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100) {
							           getPostList();
							       }
							   });

							   // 初始加載
							   getPostList();

							   // 註冊模態框事件
							   const modal = document.querySelector('.modal');
							   const cancelBtn = document.querySelector('.cancel-btn');

							   // 在點擊取消按鈕時也觸發重置
							   cancelBtn?.addEventListener('click', () => {
							       modal.style.display = 'none';
							       resetModal();
							   });

							   // 在點擊模態框背景時也觸發重置
							   modal?.addEventListener('click', (e) => {
							       if (e.target === modal) {
							           modal.style.display = 'none';
							           resetModal();
							       }
							   });
							});