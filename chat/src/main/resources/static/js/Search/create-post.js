(function() {
    let cropper = null;
    let croppedImages = [];
    let pendingImages = [];
    let isInitialized = false;

    const PostSystem = {
        checkDependencies() {
            if (typeof Cropper === 'undefined') {
                console.error('Cropper.js 未載入');
                return false;
            }
            if (typeof PostsManager === 'undefined') {
                console.error('PostsManager 未載入');
                return false;
            }
            return true;
        },

        async waitForDependencies() {
            return new Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = 20;
                const interval = setInterval(() => {
                    if (this.checkDependencies()) {
                        clearInterval(interval);
                        resolve();
                    } else if (attempts >= maxAttempts) {
                        clearInterval(interval);
                        reject(new Error('依賴項加載超時'));
                    }
                    attempts++;
                }, 250);
            });
        },

        initializeCreatePostButton() {
            if (isInitialized) return;

            const createButtons = document.querySelectorAll('.menu-item a[href="#"]');
            createButtons.forEach(button => {
                const text = button.textContent.trim();
                if (text.includes('建立')) {
                    button.removeAttribute('onclick');
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (this.checkDependencies()) {
                            openCreatePost();
                        } else {
                            console.error('必要組件未載入');
                            alert('系統初始化中，請稍後再試');
                        }
                    });
                }
            });
            isInitialized = true;
        },

        async initialize() {
            try {
                await this.waitForDependencies();
                this.initializeCreatePostButton();
                console.log('建立貼文功能初始化成功');
            } catch (error) {
                console.error('初始化失敗:', error);
            }
        }
    };


function openCreatePost() {
    const modalHTML = `
        <div id="createPostModal" class="create-post-modal">
            <div class="create-post-container">
                <div class="create-post-content">
                    <div class="create-post-header">
                        <div class="header-left">
                            <button id="backButton" class="back-arrow" style="display: none;">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="white">
                                    <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
                                </svg>
                            </button>
                            <h2>建立貼文</h2>
                        </div>
                        <span class="create-post-close">&times;</span>
                    </div>

                    <div class="create-post-pages">
                        <div class="post-page active" id="image-upload-page">
                            <div class="create-post-body">
                                <div class="image-upload-area" id="dropArea">
                                    <div id="uploadControls">
                                        <button type="button" class="file-select-button">選擇圖片</button>
                                        <input type="file" id="postImages" accept="image/*" multiple style="display: none;">
                                        <p class="upload-hint">或將圖片拖曳至此</p>
                                    </div>
                                    <div id="cropperContainer" style="display: none;">
                                        <div class="cropper-wrapper">
                                            <img id="cropperImage" src="">
                                        </div>
                                        <div class="cropper-controls">
                                            <button class="crop-button" onclick="applyCrop()">確認裁切</button>
                                            <button class="cancel-crop-button" onclick="cancelCrop()">取消</button>
                                        </div>
                                    </div>
                                </div>
                                <div id="imagePreview" class="create-post-preview"></div>
                            </div>
                            <div class="create-post-footer">
                                <div class="footer-content">
                                    <span class="page-number">1/2</span>
                                    <button class="next-button" onclick="nextStep()">下一步</button>
                                </div>
                            </div>
                        </div>

                        <div class="post-page" id="content-input-page">
                            <div class="create-post-body">
                                <textarea class="create-post-textarea" id="postContent" placeholder="分享你的想法..."></textarea>
                                <div class="selected-images-preview" id="selectedImagesPreview"></div>
                            </div>
                            <div class="create-post-footer">
                                <div class="footer-content">
                                    <span class="page-number">2/2</span>
                                    <button class="create-post-button" onclick="submitPost()">發布</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    initializeCreatePost();
}

function initializeCreatePost() {
    const modal = document.getElementById('createPostModal');
    const closeBtn = modal.querySelector('.create-post-close');
    const fileBtn = modal.querySelector('.file-select-button');
    const fileInput = modal.querySelector('#postImages');
    const dropArea = document.getElementById('dropArea');
    const backButton = document.getElementById('backButton');
    const uploadControls = document.getElementById('uploadControls');

    croppedImages = [];
    pendingImages = [];

    backButton.onclick = prevStep;
    closeBtn.onclick = () => {
        if (cropper) {
            cropper.destroy();
        }
        modal.remove();
    };

    fileBtn.onclick = () => fileInput.click();
    
    fileInput.onchange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            return ['jpg', 'jpeg', 'png'].includes(ext);
        });
        
        if (validFiles.length === 0) {
            alert('請選擇 jpg、jpeg 或 png 格式的圖片');
            return;
        }
        
        handleFileSelect({target: {files: validFiles}});
    };

    dropArea.ondragover = (e) => {
        e.preventDefault();
        dropArea.classList.add('dragover');
    };

    dropArea.ondragleave = () => {
        dropArea.classList.remove('dragover');
    };

    dropArea.ondrop = (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        const validFiles = files.filter(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            return ['jpg', 'jpeg', 'png'].includes(ext);
        });
        
        if (validFiles.length === 0) {
            alert('請選擇 jpg、jpeg 或 png 格式的圖片');
            return;
        }
        
        handleFileSelect({target: {files: validFiles}});
    };
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    if (files.length === 0) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        showCropper(e.target.result);
        pendingImages = pendingImages.concat(Array.from(files).slice(1));
    };
    reader.readAsDataURL(files[0]);
}

function showCropper(imageData) {
    const uploadControls = document.getElementById('uploadControls');
    const cropperContainer = document.getElementById('cropperContainer');
    const cropperImage = document.getElementById('cropperImage');
    
    uploadControls.style.display = 'none';
    cropperContainer.style.display = 'block';
    cropperImage.src = imageData;

    if (cropper) {
        cropper.destroy();
    }

    cropper = new Cropper(cropperImage, {
        aspectRatio: NaN,
        viewMode: 1,
        autoCropArea: 0.9,
        dragMode: 'move',
        guides: true,
        center: true,
        highlight: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: true
    });
}

function applyCrop() {
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas();
    const croppedImage = canvas.toDataURL('image/jpeg');
    croppedImages.push(croppedImage);

    updateImagePreview();
    resetCropper();

    if (pendingImages.length > 0) {
        const nextImage = pendingImages.shift();
        const reader = new FileReader();
        reader.onload = (e) => showCropper(e.target.result);
        reader.readAsDataURL(nextImage);
    }
}

function updateImagePreview() {
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = croppedImages
        .map((img, index) => `
            <div class="preview-image-container">
                <img src="${img}" class="create-post-preview-image">
                <button class="remove-image-btn" onclick="removeImage(${index})">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="white">
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                    </svg>
                </button>
            </div>
        `)
        .join('');
}

function removeImage(index) {
    croppedImages.splice(index, 1);
    updateImagePreview();
    if (croppedImages.length === 0 && !cropper) {
        const uploadControls = document.getElementById('uploadControls');
        uploadControls.style.display = 'block';
    }
}

function resetCropper() {
    const uploadControls = document.getElementById('uploadControls');
    const cropperContainer = document.getElementById('cropperContainer');

    uploadControls.style.display = 'block';
    cropperContainer.style.display = 'none';

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
}

function cancelCrop() {
    resetCropper();
    
    if (pendingImages.length > 0) {
        const nextImage = pendingImages.shift();
        const reader = new FileReader();
        reader.onload = (e) => showCropper(e.target.result);
        reader.readAsDataURL(nextImage);
    }
}

function nextStep() {
    if (croppedImages.length === 0) {
        alert('請先上傳並裁切圖片');
        return;
    }

    const pages = document.querySelectorAll('.post-page');
    const backButton = document.getElementById('backButton');
    
    pages[0].classList.remove('active');
    pages[1].classList.add('active');
    backButton.style.display = 'block';

    const selectedImagesPreview = document.getElementById('selectedImagesPreview');
    selectedImagesPreview.innerHTML = croppedImages
        .map(img => `<img src="${img}" class="selected-preview-image">`)
        .join('');
}

function prevStep() {
    const pages = document.querySelectorAll('.post-page');
    const backButton = document.getElementById('backButton');
    
    pages[1].classList.remove('active');
    pages[0].classList.add('active');
    backButton.style.display = 'none';
}

async function submitPost() {
    const content = document.getElementById('postContent').value;
    if (!content.trim() || croppedImages.length === 0) {
        alert('請填寫內容並確認已上傳圖片');
        return;
    }

    const formData = new FormData();
    formData.append('content', content);
    
    for (let i = 0; i < croppedImages.length; i++) {
        const response = await fetch(croppedImages[i]);
        const blob = await response.blob();
        formData.append('images', blob, `image${i}.jpg`);
    }

    const success = await PostsManager.createPost(formData);
    if (success) {
        const modal = document.getElementById('createPostModal');
        modal.remove();
    }
}

// 暴露必要的全局函數
window.openCreatePost = openCreatePost;
window.removeImage = removeImage;
window.applyCrop = applyCrop;
window.cancelCrop = cancelCrop;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.submitPost = submitPost;

function initOnce() {
        if (!isInitialized) {
            PostSystem.initialize();
        }
    }

    // DOMContentLoaded 事件監聽
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOnce);
    } else {
        initOnce();
    }

const style = document.createElement('style');
style.textContent = `
    .preview-image-container {
        position: relative;
        display: inline-block;
        margin: 5px;
    }

    .remove-image-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        background: rgba(0, 0, 0, 0.5);
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        padding: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s;
    }

    .remove-image-btn:hover {
        background: rgba(0, 0, 0, 0.8);
    }

    .create-post-preview-image {
        display: block;
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 4px;
    }

    .footer-content {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 15px;
    }

    .page-number {
        font-family: "Noto Sans TC", serif;
        color: #888;
        font-size: 18px;
        font-weight: 500;
    }

    .create-post-preview {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 15px;
    }
`;
document.head.appendChild(style);
})();