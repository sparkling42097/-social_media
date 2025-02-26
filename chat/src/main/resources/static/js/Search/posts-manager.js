// posts-manager.js
const PostsManager = {
    // 事件監聽器集合
    eventListeners: {
        onPostCreated: [],
        onPostsLoaded: [],
        onError: []
    },

    // 註冊事件監聽器
    addEventListener(eventName, callback) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName].push(callback);
        }
    },

    // 觸發事件
    triggerEvent(eventName, data) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName].forEach(callback => callback(data));
        }
    },

    // 建立貼文
    async createPost(formData) {
        try {
            const response = await fetch('/api/posts/create', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const newPost = await response.json();
                this.triggerEvent('onPostCreated', newPost);
                return true;
            }
            throw new Error('發布失敗');
        } catch (error) {
            console.error('發布失敗:', error);
            this.triggerEvent('onError', '發布失敗，請稍後再試');
            return false;
        }
    },

    // 載入用戶貼文
    async loadUserPosts(memberName, page, pageSize) {
        try {
            const params = new URLSearchParams({
                keyword: memberName,
                page: page,
                size: pageSize,
                sortBy: 'newest'
            });
            
            const response = await fetch(`/api/search/photos?${params}`);
            const data = await response.json();
            
            this.triggerEvent('onPostsLoaded', data);
            return data;
        } catch (error) {
            console.error('載入失敗:', error);
            this.triggerEvent('onError', '載入貼文失敗，請稍後再試');
            return null;
        }
    }
};

// 導出 PostsManager
window.PostsManager = PostsManager;