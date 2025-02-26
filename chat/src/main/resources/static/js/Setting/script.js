
let originalData = {};

document.addEventListener('DOMContentLoaded', function() {
    loadMemberData();
	setupImageUpload();
    
    document.querySelector('.nickName').addEventListener('click', function() {
        document.getElementById('nicknameModal').style.display = 'block';
        document.getElementById('newNickname').value = this.textContent;
    });
	
	// 新增生日和電話的事件監聽器
	document.querySelector('.birthday').addEventListener('click', function() {
	    document.getElementById('birthdayModal').style.display = 'block';
	    document.getElementById('newBirthday').value = originalData.birthday || '';
	});

	document.querySelector('.telephone').addEventListener('click', function() {
	    document.getElementById('telephoneModal').style.display = 'block';
	    document.getElementById('newTelephone').value = originalData.telephone || '';
	});
});

function loadMemberData() {
    fetch('/api/member/current')
        .then(response => {
            if (!response.ok) throw new Error('未登入或找不到用戶');
            return response.json();
        })
        .then(data => {
            originalData = data;
            
            // 載入基本資料
			document.querySelector('.nickName').textContent = data.membername;
			document.querySelector('.account').textContent = data.email;
			document.querySelector('.birthday').textContent = data.birthday || '';
			document.querySelector('.telephone').textContent = data.telephone || '';
			
            
            // 載入個人簡介
            document.querySelector('.about').value = data.introduce || '';
            
            // 載入性別選項
            const genderSelect = document.querySelector('.form-select');
            if (data.gender === '男') {
                genderSelect.value = '1';
            } else if (data.gender === '女') {
                genderSelect.value = '2';
            } else {
                genderSelect.value = 'default';
            }
            
            // 載入頭像
			const profilePic = document.querySelector('.profile-pic');
			if (data.memberphotobase64) {
			   profilePic.style.backgroundImage = `url(data:image/jpeg;base64,${data.memberphotobase64})`;
			} else {
			   profilePic.style.backgroundColor = 'gray';
			}
			profilePic.style.backgroundSize = 'cover';
			profilePic.style.backgroundPosition = 'center';
        })
        .catch(error => console.error('錯誤:', error));
}
function confirmNickname() {
    const newValue = document.getElementById('newNickname').value;
    if (newValue.trim() !== '') {
        document.querySelector('.nickName').textContent = newValue;
    }
    closeModal();
}

function confirmBirthday() {
    const newValue = document.getElementById('newBirthday').value;
    if (newValue.trim() !== '') {
        document.querySelector('.birthday').textContent = newValue;
    }
    closeModal('birthdayModal');
}

function confirmTelephone() {
    const newValue = document.getElementById('newTelephone').value;
    if (newValue.trim() !== '') {
        document.querySelector('.telephone').textContent = newValue;
    }
    closeModal('telephoneModal');
}

function setupImageUpload() {
   const fileInput = document.createElement('input');
   fileInput.type = 'file';
   fileInput.accept = 'image/*';
   fileInput.style.display = 'none';
   document.body.appendChild(fileInput);
   
   document.querySelector('.pic > .btn-primary').addEventListener('click', () => fileInput.click());
   
   let selectedFile = null;
   
   fileInput.addEventListener('change', (e) => {
       const file = e.target.files[0];
       if (!file) return;
       
       selectedFile = file;
       
       const reader = new FileReader();
       reader.onload = (e) => {
           const profilePic = document.querySelector('.profile-pic');
           profilePic.style.backgroundImage = `url(${e.target.result})`;
           profilePic.style.backgroundSize = 'cover';
           profilePic.style.backgroundPosition = 'center';
       };
       reader.readAsDataURL(file);
       
       fileInput.value = '';
   });

   // 在外部保存 selectedFile 供提交時使用
   window.getSelectedFile = () => selectedFile;
}

function closeModal(modalId = 'nicknameModal') {
    document.getElementById(modalId).style.display = 'none';
}

function submitChanges() {
    const updates = {
        membername: document.querySelector('.nickName').textContent,
        introduce: document.querySelector('.about').value,
        gender: document.querySelector('.form-select').value === '1' ? '男' : 
                document.querySelector('.form-select').value === '2' ? '女' : null,
        birthday: document.querySelector('.birthday').textContent,
        telephone: document.querySelector('.telephone').textContent
    };

    const promises = [];

    // 基本資料更新
    promises.push(
        fetch('/api/member/update', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updates)
        })
    );

    // 如果有選擇新圖片，上傳圖片
    const selectedFile = window.getSelectedFile?.();
    if (selectedFile) {
        const formData = new FormData();
        formData.append('memberphotofile', selectedFile);
        
        promises.push(
            fetch('/api/member/update-photo', {
                method: 'POST',
                body: formData
            })
        );
    }

    // 等待所有更新完成
    Promise.all(promises)
        .then(responses => {
            if (responses.some(res => !res.ok)) throw new Error('更新失敗');
            return Promise.all(responses.map(res => res.json()));
        })
        .then(([data]) => {
            originalData = data;
            alert('更新成功！');
            window.getSelectedFile = () => null; // 清除已上傳的文件
        })
        .catch(error => {
            console.error('錯誤:', error);
            alert('更新失敗，請稍後再試');
        });
}
// 點擊視窗外關閉
// 修改 window.onclick 事件
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    Array.from(modals).forEach(modal => {
        const modalContent = modal.querySelector('.modal-content');
        const clickX = event.clientX;
        const clickY = event.clientY;
        const windowCenterX = window.innerWidth / 2;
        const windowCenterY = window.innerHeight / 2;
        
        const distanceFromCenter = Math.sqrt(
            Math.pow(clickX - windowCenterX, 2) + 
            Math.pow(clickY - windowCenterY, 2)
        );
        
        const maxDistance = Math.sqrt(
            Math.pow(window.innerWidth, 2) + 
            Math.pow(window.innerHeight, 2)
        ) * 0.6;
        
        if (distanceFromCenter > maxDistance && !modalContent.contains(event.target)) {
            // 不做任何事情，保持視窗開啟
            return;
        }
    });
}

