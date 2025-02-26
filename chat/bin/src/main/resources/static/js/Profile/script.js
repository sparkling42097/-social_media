
// 在 script.js 新增
async function loadMemberData() {
    try {
        const response = await fetch('/api/member/profile/current');
        if (!response.ok) throw new Error('Failed to fetch');
        const member = await response.json();
        
        // 更新頁面資料
        document.getElementById('blurName').textContent = member.membername;
        document.getElementById('blurPost').textContent = `${member.postcount || 0} 貼文 `;
        
        if (member.memberphotobase64) {
            document.querySelector('.profile-pic').style.backgroundImage = 
                `url(data:image/jpeg;base64,${member.memberphotobase64})`;
        }
        
        // 更新自我介紹
        document.querySelector('.about').textContent = member.introduce || '還沒有自我介紹';
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// 頁面載入時執行
document.addEventListener('DOMContentLoaded', loadMemberData);

async function uploadProfilePicture(event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('memberphotofile', file);

    try {
        const response = await fetch('/api/member/update-photo', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) throw new Error('Upload failed');
        
        // 重新載入會員資料以更新頭像
        loadMemberData();
        
    } catch (error) {
        console.error('Upload error:', error);
    }
}
