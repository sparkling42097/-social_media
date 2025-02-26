document.addEventListener('DOMContentLoaded', function () {
   // 全域變數聲明
   const uiState = {
       currentIndex: 0,
       selectedFiles: []
   };

   // 圖片裁切相關狀態
   let isDragging = false;
   let startX = 0;
   let startY = 0;
   let currentX = 0;
   let currentY = 0;
   let imageElement = null;
   let cropperInstance = null;
   let cropperActive = false;

   // 獲取 DOM 元素 
   const modal = document.getElementById('createPostModal');
   const uploadArea = document.getElementById('uploadArea');
   const carouselContainer = document.getElementById('carouselContainer');
   const carousel = document.getElementById('carousel');
   const prevBtn = document.getElementById('prevBtn');
   const nextBtn = document.getElementById('nextBtn');
   const indicators = document.getElementById('indicators');
   const fileInput = document.getElementById('fileInput');
   const createPostBtn = document.getElementById('createPostBtn');
   const shareBtn = document.querySelector('.share-btn');
   const cancelBtn = document.querySelector('.cancel-btn');
   const postText = document.getElementById('postText');
   const notificationsModal = document.getElementById('notificationsModal');

   // 通知系統初始化
   let notifications = [];
   const notificationBtn = document.querySelector('.menu-item[data-page="notifications"]');

   // 頁面切換相關
   const menuItems = document.querySelectorAll('.menu-item[data-page]');
   const pages = {
       'home': document.getElementById('home-content'),
       'search': document.getElementById('search-content'),
       'messages': document.getElementById('messages-content'),
       'notifications': document.getElementById('notifications-content'),
       'profile': document.getElementById('profile-content')
   };

   // 圖片裁切相關函數
   function initImageCropper(file) {
       const uploadContainer = document.querySelector('.upload-container');
       const cropContainer = document.createElement('div');
       cropContainer.className = 'crop-container';
       
       // 創建圖片元素
       imageElement = document.createElement('img');
       imageElement.className = 'movable-image';
       const imageUrl = URL.createObjectURL(file);
       
       imageElement.onload = function() {
           const containerWidth = cropContainer.offsetWidth;
           const containerHeight = cropContainer.offsetHeight;
           const imgAspectRatio = this.width / this.height;
           const containerAspectRatio = containerWidth / containerHeight;
           
           if (imgAspectRatio > containerAspectRatio) {
               this.style.width = '100%';
               this.style.height = 'auto';
               currentY = (containerHeight - this.offsetHeight) / 2;
           } else {
               this.style.height = '100%';
               this.style.width = 'auto';
               currentX = (containerWidth - this.offsetWidth) / 2;
           }
           
           updateImagePosition();
       };
       
       imageElement.src = imageUrl;
       
       // 創建裁切框
       const cropArea = document.createElement('div');
       cropArea.className = 'crop-area';
       
       // 添加到容器
       cropContainer.appendChild(imageElement);
       cropContainer.appendChild(cropArea);
       uploadContainer.innerHTML = '';
       uploadContainer.appendChild(cropContainer);
       
       // 添加拖曳事件
       cropContainer.addEventListener('mousedown', startDragging);
       document.addEventListener('mousemove', drag);
       document.addEventListener('mouseup', stopDragging);
       
       // 添加觸控事件
       cropContainer.addEventListener('touchstart', handleTouchStart);
       document.addEventListener('touchmove', handleTouchMove);
       document.addEventListener('touchend', handleTouchEnd);
       
       // 顯示操作按鈕
       const cropActions = document.querySelector('.crop-actions');
       if (cropActions) {
           cropActions.style.display = 'flex';
       }
       
       cropperActive = true;
       window.uiHelpers.selectedFiles = [file];
   }
   
   function startDragging(e) {
       if (!cropperActive) return;
       
       isDragging = true;
       startX = e.clientX - currentX;
       startY = e.clientY - currentY;
       imageElement.style.cursor = 'grabbing';
   }

   function drag(e) {
       if (!isDragging || !cropperActive) return;
       
       e.preventDefault();
       currentX = e.clientX - startX;
       currentY = e.clientY - startY;
       
       updateImagePosition();
   }

   function stopDragging() {
       isDragging = false;
       if (imageElement) {
           imageElement.style.cursor = 'grab';
       }
   }

   function handleTouchStart(e) {
       if (!cropperActive) return;
       
       const touch = e.touches[0];
       isDragging = true;
       startX = touch.clientX - currentX;
       startY = touch.clientY - currentY;
   }

   function handleTouchMove(e) {
       if (!isDragging || !cropperActive) return;
       
       e.preventDefault();
       const touch = e.touches[0];
       currentX = touch.clientX - startX;
       currentY = touch.clientY - startY;
       
       updateImagePosition();
   }

   function handleTouchEnd() {
       isDragging = false;
   }

   function updateImagePosition() {
       if (!imageElement) return;
       
       // 限制拖曳範圍
       const container = imageElement.parentElement;
       const cropArea = container.querySelector('.crop-area');
       
       const maxX = 0;
       const minX = cropArea.offsetWidth - imageElement.offsetWidth;
       const maxY = 0;
       const minY = cropArea.offsetHeight - imageElement.offsetHeight;
       
       currentX = Math.min(maxX, Math.max(minX, currentX));
       currentY = Math.min(maxY, Math.max(minY, currentY));
       
       imageElement.style.transform = `translate(${currentX}px, ${currentY}px)`;
   }

   function getCropData() {
       if (!imageElement || !cropperActive) return null;
       
       const container = imageElement.parentElement;
       const cropArea = container.querySelector('.crop-area');
       
       const rect = imageElement.getBoundingClientRect();
       const areaRect = cropArea.getBoundingClientRect();
       
       return {
           x: -currentX,
           y: -currentY,
           width: cropArea.offsetWidth,
           height: cropArea.offsetHeight,
           originalWidth: imageElement.naturalWidth,
           originalHeight: imageElement.naturalHeight,
           scale: imageElement.offsetWidth / imageElement.naturalWidth
       };
   }

   function destroyCropper() {
       cropperActive = false;
       imageElement = null;
       isDragging = false;
       currentX = 0;
       currentY = 0;
       
       const uploadArea = document.querySelector('.upload-area');
       uploadArea.innerHTML = `
           <i class="fas fa-cloud-upload-alt"></i>
           <p>拖放照片到這裡，或點擊選擇</p>
           <input type="file" id="fileInput" accept="image/*" style="display: none;">
           <button class="upload-btn">選擇照片</button>
       `;
       
       const cropActions = document.querySelector('.crop-actions');
       if (cropActions) {
           cropActions.style.display = 'none';
       }

       window.uiHelpers.selectedFiles = [];
   }
   
   // 頁面切換功能
   function switchPage(pageId) {
       Object.values(pages).forEach(page => {
           if (page) page.classList.remove('active');
       });

       const currentPage = pages[pageId];
       if (currentPage) currentPage.classList.add('active');

       menuItems.forEach(item => {
           item.classList.remove('active');
           if (item.dataset.page === pageId) {
               item.classList.add('active');
           }
       });

       localStorage.setItem('currentPage', pageId);
   }

   // 通知相關功能
   notificationBtn.addEventListener('click', (e) => {
       e.preventDefault();
       e.stopPropagation();
       notificationsModal.classList.toggle('active');
       e.target.closest('.menu-item').classList.remove('active');
   });

   document.addEventListener('click', (e) => {
       if (notificationsModal.classList.contains('active') &&
           !notificationsModal.querySelector('.notifications-wrapper').contains(e.target) &&
           !notificationBtn.contains(e.target)) {
           notificationsModal.classList.remove('active');
       }
   });

   // 監聽選單項目點擊
   menuItems.forEach(item => {
       item.addEventListener('click', (e) => {
           e.preventDefault();
           const pageId = item.dataset.page;
           if (pageId && pageId !== 'notifications') {
               switchPage(pageId);
           }
       });
   });

   // 添加新通知
   function addNotification(type, user, postId, content) {
       const notification = {
           id: Date.now(),
           type,
           user,
           postId,
           content,
           read: false,
           time: new Date()
       };

       notifications.unshift(notification);
       updateNotificationsUI();
       updateNotificationCount();
   }

   // 更新通知 UI
   function updateNotificationsUI() {
       const notificationsList = document.querySelector('.notifications-list');
       notificationsList.innerHTML = notifications.map(notification => `
           <div class="notification-item ${notification.read ? '' : 'unread'}" 
                data-notification-id="${notification.id}" 
                data-post-id="${notification.postId}">
               <img src="${notification.user.avatar}" class="notification-avatar" alt="${notification.user.name}">
               <div class="notification-content">
                   <div class="notification-text">
                       <strong>${notification.user.name}</strong> 
                       ${notification.type === 'like' ? '喜歡了你的貼文' : '評論了你的貼文'}
                       ${notification.content ? `："${notification.content}"` : ''}
                   </div>
                   <div class="notification-time">
                       ${formatTime(notification.time)}
                   </div>
               </div>
           </div>
       `).join('');

       addNotificationListeners();
   }

   // 更新通知數量
   function updateNotificationCount() {
       const hasUnread = notifications.some(n => !n.read);
       const heartIcon = notificationBtn.querySelector('i');
       
       if (hasUnread) {
           heartIcon.classList.remove('far');
           heartIcon.classList.add('fas');
           
           // 添加提示彈窗
           const notification = document.createElement('div');
           notification.style.cssText = `
               position: fixed;
               top: 20px;
               left: 50%;
               transform: translateX(-50%);
               background-color: #262626;
               color: white;
               padding: 12px 24px;
               border-radius: 8px;
               z-index: 9999;
               animation: fadeOut 3s forwards;
           `;
           notification.textContent = "您有新的未讀通知";
           document.body.appendChild(notification);

           // 3秒後自動移除提示
           setTimeout(() => {
               notification.remove();
           }, 3000);
           
       } else {
           heartIcon.classList.remove('fas');
           heartIcon.classList.add('far');
       }
   }

   // 通知監聽器
   function addNotificationListeners() {
       document.querySelectorAll('.notification-item').forEach(item => {
           item.addEventListener('click', () => {
               const notificationId = parseInt(item.dataset.notificationId);
               const postId = item.dataset.postId;
               
               markAsRead(notificationId);
               scrollToPost(postId);
               notificationsModal.classList.remove('active');
           });
       });
   }

   // 修改 resetModal 函數
   function resetModal() {
       postText.value = '';
       const cropActions = document.querySelector('.crop-actions');
       if (cropActions) {
           cropActions.style.display = 'none';
       }

       // 完全重置上傳區域
       const uploadContainer = document.querySelector('.upload-container');
       const uploadArea = document.querySelector('.upload-area');
       if (uploadContainer && uploadArea) {
           uploadContainer.innerHTML = '';
           uploadArea.style.display = 'block';
           uploadArea.innerHTML = `
               <i class="fas fa-cloud-upload-alt"></i>
               <p>拖放照片到這裡，或點擊選擇</p>
               <input type="file" id="fileInput" accept="image/*" style="display: none;">
               <button class="upload-btn">選擇照片</button>
           `;

           // 重新綁定文件輸入事件
           const newFileInput = uploadArea.querySelector('#fileInput');
           if (newFileInput) {
               newFileInput.addEventListener('change', (e) => {
                   if (e.target.files && e.target.files[0]) {
                       window.uiHelpers.showUploadOptions(e.target.files[0]);
                   }
               });
           }
       }

       // 重置所有狀態
       window.uiHelpers.selectedFiles = [];
       shareBtn.disabled = true;
   }
   
   // 設置貼文輪播功能
   function setupPostCarousel(postElement) {
       const carousel = postElement.querySelector('.carousel');
       const prevBtn = postElement.querySelector('.carousel-btn.prev');
       const nextBtn = postElement.querySelector('.carousel-btn.next');
       const indicators = postElement.querySelectorAll('.indicator');
       let currentSlide = 0;

       const images = postElement.querySelectorAll('.carousel img');
       images.forEach(img => {
           img.onload = function() {
               const imgAspectRatio = img.naturalWidth / img.naturalHeight;
               const containerAspectRatio = carousel.clientWidth / carousel.clientHeight;
               
               if (imgAspectRatio > containerAspectRatio) {
                   img.style.width = '100%';
                   img.style.height = 'auto';
               } else {
                   img.style.width = 'auto';
                   img.style.height = '100%';
               }
           };
       });

       if (images.length <= 1) {
           if (prevBtn) prevBtn.style.display = 'none';
           if (nextBtn) nextBtn.style.display = 'none';
           return;
       }

       function updateSlide() {
           carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
           indicators.forEach((indicator, index) => {
               indicator.classList.toggle('active', index === currentSlide);
           });
           if (prevBtn) prevBtn.style.display = currentSlide > 0 ? 'flex' : 'none';
           if (nextBtn) nextBtn.style.display = currentSlide < images.length - 1 ? 'flex' : 'none';
       }

       prevBtn?.addEventListener('click', (e) => {
		e.preventDefault();
		          e.stopPropagation();
		          if (currentSlide < images.length - 1) {
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
		  
		  // 其他工具函數
		  function markAsRead(notificationId) {
		      const notification = notifications.find(n => n.id === notificationId);
		      if (notification) {
		          notification.read = true;
		          updateNotificationsUI();
		          updateNotificationCount();
		      }
		  }

		  function scrollToPost(postId) {
		      const post = document.querySelector(`.post[data-post-id="${postId}"]`);
		      if (post) {
		          post.scrollIntoView({ behavior: 'smooth' });
		          post.classList.add('highlight');
		          setTimeout(() => post.classList.remove('highlight'), 2000);
		      }
		  }

		  function formatTime(date) {
		      const now = new Date();
		      const diff = now - date;
		      const minutes = Math.floor(diff / 60000);
		      const hours = Math.floor(minutes / 60);
		      const days = Math.floor(hours / 24);

		      if (minutes < 60) return `${minutes} 分鐘前`;
		      if (hours < 24) return `${hours} 小時前`;
		      return `${days} 天前`;
		  }

		  // 導出工具函數
		  window.uiHelpers = {
		      selectedFiles: [],  // 初始化為空數組
		      postText,
		      modal,
		      resetModal,
		      addNotification,
		      setupPostCarousel,
		      showUploadOptions: function(file) {  // 添加檔案上傳處理函數
		          const uploadArea = document.querySelector('.upload-area');
		          const modeSelect = document.querySelector('.mode-select');
		          
		          // 顯示選擇按鈕
		          modeSelect.style.display = 'flex';
		          uploadArea.style.display = 'none';
		          
		          // 裁切模式
		          document.querySelector('.crop-mode-btn').onclick = () => {
		              if (cropperInstance) {
		                  cropperInstance.destroy();
		                  cropperInstance = null;
		              }
		              initImageCropper(file);
		              modeSelect.style.display = 'none';
		          };
		          
		          // 直接上傳模式
		          document.querySelector('.direct-mode-btn').onclick = () => {
		              const preview = document.createElement('div');
		              preview.className = 'image-preview';
		              const img = document.createElement('img');
		              img.src = URL.createObjectURL(file);
		              preview.appendChild(img);
		              
		              const uploadContainer = document.querySelector('.upload-container');
		              uploadContainer.innerHTML = '';
		              uploadContainer.appendChild(preview);
		              
		              this.selectedFiles = [file];
		              modeSelect.style.display = 'none';
		              shareBtn.disabled = false;
		          };

		          // 保存當前文件
		          this.selectedFiles = [file];
		      }
		  };
		  
		  // 檔案上傳相關
		  createPostBtn?.addEventListener('click', () => {
		      modal.style.display = 'flex';
		  });

		  cancelBtn?.addEventListener('click', () => {
		      modal.style.display = 'none';
		      resetModal();
		  });

		  modal?.addEventListener('click', (e) => {
		      if (e.target === modal) {
		          modal.style.display = 'none';
		          resetModal();
		      }
		  });

		  uploadArea?.addEventListener('dragover', (e) => {
		      e.preventDefault();
		      uploadArea.style.border = '2px dashed #0095f6';
		  });

		  uploadArea?.addEventListener('dragleave', (e) => {
		      e.preventDefault();
		      uploadArea.style.border = 'none';
		  });

		  uploadArea?.addEventListener('drop', (e) => {
		      e.preventDefault();
		      uploadArea.style.border = 'none';
		      const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
		      if (files.length > 0) {
		          if (window.uiHelpers && typeof window.uiHelpers.showUploadOptions === 'function') {
		              window.uiHelpers.showUploadOptions(files[0]);
		          }
		      }
		  });

		  // 確認裁切按鈕事件監聽
		  const confirmCropBtn = document.querySelector('.crop-confirm');
		  if (confirmCropBtn) {
		      confirmCropBtn.addEventListener('click', () => {
		          // 取得裁切數據並繼續上傳流程
		          shareBtn.disabled = false;
		      });
		  }

		  // 取消裁切按鈕事件監聽
		  const cancelCropBtn = document.querySelector('.crop-cancel');
		  if (cancelCropBtn) {
		      cancelCropBtn.addEventListener('click', () => {
		          destroyCropper();
		          // 恢復上傳區域的原始狀態
		          uploadArea.style.display = 'block';
		      });
		  }

		  // 初始化
		  const savedPage = localStorage.getItem('currentPage');
		  if (savedPage && pages[savedPage]) {
		      switchPage(savedPage);
		  } else {
		      switchPage('home');
		  }
		});