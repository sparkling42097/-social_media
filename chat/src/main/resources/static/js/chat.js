let stompClient = null;
let currentUserId = null;  // 改為從伺服器端取得當前登入的用戶ID
let currentChatroomId = null;

// WebSocket 連接
function connectWebSocket() {
    console.log('開始建立WebSocket連接...');
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log('WebSocket連接成功:', frame);
        loadChatRooms();
    }, function (error) {
        console.error('WebSocket連接失敗:', error);
    });
}

// 初始化時先取得當前用戶ID
async function getCurrentUserId() {
    try {
        const response = await fetch('/api/chat/current-user');
        const data = await response.json();
        currentUserId = data.userId;

        // 新增日誌來確認目前使用者
        console.log('Current user ID:', currentUserId);

        connectWebSocket(); // 取得ID後再連接WebSocket
    } catch (error) {
        console.error('Error getting current user:', error);
    }
}

// 載入聊天室列表
async function loadChatRooms() {
    try {
        const response = await fetch(`/api/chat/rooms/${currentUserId}`);
        const chatrooms = await response.json();
        displayChatRooms(chatrooms);
    } catch (error) {
        console.error('Error loading chatrooms:', error);
    }
}

// 顯示聊天室列表
async function displayChatRooms(chatrooms) {
    const friendsList = document.getElementById('friendsList');
    friendsList.innerHTML = '';

    for (const room of chatrooms) {
        const otherUserId = room.membera === currentUserId ? room.memberb : room.membera;
        const otherUser = await fetchUserInfo(otherUserId);

        const friendItem = document.createElement('div');
        friendItem.className = 'friend-item';
        friendItem.onclick = () => selectChatRoom(room.chatroomid, otherUser);

        const avatar = document.createElement('div');
        avatar.className = 'friend-avatar';

        if (otherUser.memberphotobase64) {
            // 如果有頭像，創建img元素
            const img = document.createElement('img');
            img.src = `data:image/jpeg;base64,${otherUser.memberphotobase64}`;
            img.alt = otherUser.membername;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.borderRadius = '50%';
            img.style.objectFit = 'cover';
            avatar.appendChild(img);
        } else {
            // 如果沒有頭像，顯示名字首字
            avatar.textContent = otherUser.membername.charAt(0).toUpperCase();
        }

        const nameDiv = document.createElement('div');
        nameDiv.textContent = otherUser.membername;

        friendItem.appendChild(avatar);
        friendItem.appendChild(nameDiv);
        friendsList.appendChild(friendItem);
    }
}

// 獲取使用者資訊
async function fetchUserInfo(userId) {
    try {
        const response = await fetch(`/api/member/forchat/${userId}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user info:', error);
        return { membername: 'Unknown User' };
    }
}

// 選擇聊天室
async function selectChatRoom(chatroomId, otherUser) {
    if (currentChatroomId) {
        stompClient.unsubscribe(`sub-${currentChatroomId}`);
    }

    currentChatroomId = chatroomId;

    // 更新聊天室標題
    document.getElementById('chatName').textContent = otherUser.membername;

    const chatAvatar = document.getElementById('chatAvatar');
    chatAvatar.innerHTML = ''; // 清空現有內容
    chatAvatar.classList.add('active'); // 添加 active class 來顯示頭像

    if (otherUser.memberphotobase64) {
        // 如果有頭像，創建img元素
        const img = document.createElement('img');
        img.src = `data:image/jpeg;base64,${otherUser.memberphotobase64}`;
        img.alt = otherUser.membername;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        chatAvatar.appendChild(img);
    } else {
        // 如果沒有頭像，顯示名字首字
        chatAvatar.textContent = otherUser.membername.charAt(0).toUpperCase();
    }

    // 訂閱新的聊天室
    stompClient.subscribe(`/topic/messages/${chatroomId}`, onMessageReceived, { id: `sub-${chatroomId}` });

    // 載入歷史訊息
    loadChatHistory(chatroomId);
}

// 載入聊天記錄
async function loadChatHistory(chatroomId) {
    try {
        const response = await fetch(`/api/chat/history/${chatroomId}`);

        // 先取得原始回應內容並記錄
        const rawText = await response.text();
        console.log('Raw response:', rawText);

        // 將文字轉換為 JSON
        const messages = JSON.parse(rawText);
        console.log('Parsed messages:', messages);

        displayChatHistory(messages);
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

// 顯示聊天記錄
function displayChatHistory(messages) {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';

    let currentDate = '';

    messages.forEach(message => {
        // 從時間戳獲取日期
        const messageDate = new Date(message.inputtime);
        const dateStr = formatDate(messageDate);

        // 如果日期改變，添加日期分隔
        if (dateStr !== currentDate) {
            currentDate = dateStr;
            const dateDiv = document.createElement('div');
            dateDiv.className = 'date-separator';
            dateDiv.innerHTML = `<span>${dateStr}</span>`;
            chatMessages.appendChild(dateDiv);
        }

        displayMessage(message);
    });
    scrollToBottom();
}

// 格式化日期的函數
function formatDate(date) {
    const localDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // 比較年月日
    if (localDate.getFullYear() === today.getFullYear() &&
        localDate.getMonth() === today.getMonth() &&
        localDate.getDate() === today.getDate()) {
        return '今天';
    } else if (localDate.getFullYear() === yesterday.getFullYear() &&
        localDate.getMonth() === yesterday.getMonth() &&
        localDate.getDate() === yesterday.getDate()) {
        return '昨天';
    } else {
        return `${localDate.getFullYear()}年${localDate.getMonth() + 1}月${localDate.getDate()}日`;
    }
}

// 接收新訊息
function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    const messageDate = new Date(message.inputtime);
    const dateStr = formatDate(messageDate);

    // 修正: 獲取所有日期分隔線，取最後一個
    const dateSeparators = document.querySelectorAll('.date-separator span');
    const lastDateStr = dateSeparators.length > 0 ?
        dateSeparators[dateSeparators.length - 1].textContent : '';

    // 只有當日期真的不同時才添加新的分隔線
    if (dateStr !== lastDateStr) {
        const chatMessages = document.getElementById('chatMessages');
        const dateDiv = document.createElement('div');
        dateDiv.className = 'date-separator';
        dateDiv.innerHTML = `<span>${dateStr}</span>`;
        chatMessages.appendChild(dateDiv);
    }

    displayMessage(message);
    scrollToBottom();
}

// 顯示訊息
function displayMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');

    // 添加日誌來除錯
    console.log('Message sender:', message.senderid);
    console.log('Current user:', currentUserId);
    
    messageDiv.className = `message ${message.senderid === currentUserId ? 'sent' : 'received'}`;

    // 訊息內容
    messageDiv.textContent = message.roommessage;

    // 時間戳
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = formatTime(message.inputtime);
    messageDiv.appendChild(timeDiv);

    chatMessages.appendChild(messageDiv);
}

// 修改格式化時間的函數，只顯示時間部分
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 使用24小時制
    });
}

// 發送訊息
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message && currentChatroomId) {
        const chatMessage = {
            chatroomid: currentChatroomId,
            senderid: currentUserId,
            roommessage: message
        };

        // 加入日誌
        console.log('準備發送訊息:', chatMessage);
        console.log('WebSocket 連接狀態:', stompClient.connected);

        try {
            stompClient.send("/app/chat/" + currentChatroomId, {}, JSON.stringify(chatMessage));
            console.log('訊息發送成功');
            messageInput.value = '';
        } catch (error) {
            console.error('發送訊息時發生錯誤:', error);
        }
    }
}

// Enter 鍵發送訊息
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// 滾動到最底部
function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 修改初始化部分
document.addEventListener('DOMContentLoaded', function () {
    getCurrentUserId();
});