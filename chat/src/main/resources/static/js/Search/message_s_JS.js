let respondclass;
let i = 0;
let rid;
let respondid;
let drs;
let membername;
let memberphoto;
let memberid;
function pass1(value) {
	respondid = '#' + value;
}
function pass2(value) {
	respondclass = value;
}
function passmemberdata(pmembername, pmemberphoto, pmemberid) {
	membername = pmembername;
	memberphoto = pmemberphoto;
	memberid = pmemberid;
}

function seti(rid) {
	let x = rid.replace('rs', '');
	i = parseInt(x, 10);
	i++
	//console.log(i);
}

function settime() {
	$('.myTime').each(function() {
		var startTime = new Date($(this).attr('timeSet'));
		var save = startTime;  // 設定當前時間為起始秒數
		let y = timeSlip(save);
		// console.log(y);

		$(this).text(y);
	});
}

//發文or留言經過時間計算
function timeSlip(inputTime) {  //inputTime輸入時間要抓資料庫
	let currentTime = new Date();
	let y;
	calTime = Math.round((currentTime - inputTime) / 1000);
	if (calTime < 60) {
		// console.log(calTime + '秒');
		//y=calTime + '秒';
		y = '剛剛';
	} else if (calTime < 3600) {
		let x = Math.ceil(calTime / 60);
		// console.log(x + '分');
		y = x + '分'
	} else if (calTime < 86400) {
		let x = Math.floor(calTime / 3600);
		// console.log(x + '小時');
		y = x + '小時';
	} else if (calTime < 2592000) {
		let x = Math.floor(calTime / 86400);
		// console.log(x + '天');
		y = x + '天';
	} else {
		let x = Math.floor(calTime / 604800);
		// console.log(x + '週');
		y = x + '週';
	}
	return y;
}

//用戶留言區塊
function userRespond() {
	let a = $('.sendmsg').val();
	if (a != "") {
		if (a.match(/@[\w\u4e00-\u9fa5]+/g)) {
			a = mTag(a);
		}
		if (respondclass === 'pr') {
			drs = 'dfrespond';
			rid = 'rs' + i++;
			respondid = '.postContent';
		} else {
			drs = 'dcrespond';
			rid = respondid.replace('#', '');
		}
		let x = new Date(); //時間要改
		if (respondid === '.postContent') {
			$('.postStream').append(`
				<article id=${rid} iddata=${rid} class=${drs}>
				    <div class="memberphotospace">
				        <img class="memberphoto" src="data:image/png;base64,${memberphoto}">
				    </div>
				    <section mid=${memberid} class="username">${membername}</section>
				    <section class="memberrespond">${a}</section>
				    <div class="interaction-group">
				        <div class="love">♡</div>
				        <section class="myTime" id="timeslip" timeSet="${x}">剛剛</section>
				        <section class="respond">回覆</section>
				    </div>
				</article>
			`);
		} else {
			$(`${respondid}`).after(`
				<article id=${rid} iddata=${rid} class=${drs}>
					<div class="memberphotospace">
						<img class="memberphoto" src="data:image/png;base64,${memberphoto}">
					</div>
					<section mid=${memberid} class="username">${membername}</section>
					<section class="memberrespond">${a}</section>
					<div class="interaction-group">
						<div class="love">♡</div>
						<section class="myTime" id="timeslip" timeSet="${x}">剛剛</section>
						<section class="respond">回覆</section>
					</div>
				</article>
			`);
		}
	}
	$('#mytext').val('');
}

function mTag(mr) {
	let links = {};
	let matches = mr.match(/@[\w\u4e00-\u9fa5]+/g);
	for (let i = 0; i < matches.length; i++) {
		links[matches[i]] = "https://google.com";
	}
	for (let [keyword, url] of Object.entries(links)) {
		let linkHTML = `<a class="ra" href="${url}">${keyword}</a>`;
		let regex = new RegExp(`${keyword}`, 'g');  // 使用正則表達式來匹配整詞
		mr = mr.replace(regex, linkHTML);
	}
	return mr;
}

function saveboarddata() {
	let data = [];
	let pId = $('.post').attr('id');
	data.push({
		"postId": pId
	});
	$(".dfrespond, .dcrespond").each(function() {
		let className = $(this).attr("class");  // 取得 class
		let iddata = $(this).attr("iddata");   // 取得 iddata 屬性
		let mid = $(this).find(".username").attr("mid");//取得留言者ID
		let content = $(this).find(".memberrespond").text().trim()//取得留言內容
		let time = $(this).find(".myTime").attr("timeSet");//取得留言時間

		data.push({
			"class": className,
			"iddata": iddata,
			"mid": mid,
			"content": content,
			"myTime": time
		});
	});
	$.ajax({
		url: `/postData/savePostData/${pId}`,  // 後端 API 端點
		type: "POST",
		contentType: "application/json; charset=UTF-8",
		data: JSON.stringify(data),  // 轉 JSON 字串
	});
}

function getboarddata(postId) {
	$.ajax({
		url: `/postData/getPostData/${postId}`,
		type: "GET"
	}).done(async function(response) {
		i=0;
		let rid;
		response = JSON.parse(response);
		for (let item of response) {
			if (item.postId) {
				continue;
			} else {
				let drs = item.class;
				rid = item.iddata;
				let mid = item.mid;
				let content = item.content;
				let myTime = item.myTime;
				//console.log(rid)
				// 使用 await 等待 findmember(mid) 完成
				let member = await findmember(mid);
				let memberphoto = member ? member.memberphoto : null;
				let membername = member ? member.membername : null;

				loadRespond(drs, rid, mid, content, myTime, memberphoto, membername);
			}
		}
		seti(rid);
	}).fail(function(error) {
		console.log("請求失敗:", getboarddataError);
	});
}

function findmember(mid) {
	return $.ajax({
		url: `/api/member/${mid}`,
		type: "GET"
	}).then(response => {
		return {
			memberphoto: response.memberphoto,
			membername: response.membername
		};
	}).fail(function(error) {
		console.log("請求失敗:", findmemberError);
		return null;
	});
}

function loadRespond(drs, rid, mid, content, myTime, memberphoto, membername) {
	if (content.match(/@[\w\u4e00-\u9fa5]+/g)) {
		content = mTag(content);
	}
	if (drs === 'dfrespond') {
		$('.postStream').append(`
			<article id=${rid} iddata=${rid} class=${drs}>
				<div class="memberphotospace">
					<img class="memberphoto" src="data:image/png;base64,${memberphoto}">
				</div>
				<section mid=${mid} class="username">${membername}</section>
				<section class="memberrespond">${content}</section>
				<div class="interaction-group">
					<div class="love">♡</div>
					<section class="myTime" id="timeslip" timeSet="${myTime}">剛剛</section>
					<section class="respond">回覆</section>
				</div>
			</article>
	`);
	} else {
		$(`[iddata='${rid}']`).last().after(`
			<article id=${rid} iddata=${rid} class=${drs}>
				<div class="memberphotospace">
					<img class="memberphoto" src="data:image/png;base64,${memberphoto}">
				</div>
				<section mid=${mid} class="username">${membername}</section>
				<section class="memberrespond">${content}</section>
				<div class="interaction-group">
					<div class="love">♡</div>
					<section class="myTime" id="timeslip" timeSet="${myTime}">剛剛</section>
					<section class="respond">回覆</section>
				</div>
			</article>
	`);
	}
	settime();
}

function initWebSocket() {
	const socket = new WebSocket('ws://localhost:8080/ws');

	socket.onmessage = function(event) {
		const message = event.data;  // 預期接收的是變動的 id
		console.log("MessageFile 更新 - id: " + message);  // 顯示變動的 id
	};
}
function initWebSocketII() {
	const socket = new WebSocket("ws://localhost:8080/ws");

	socket.onopen = () => console.log("✅ WebSocket 已連線");
	socket.onerror = (error) => console.error("❌ WebSocket 連線錯誤:", error);
	socket.onclose = () => console.log("❌ WebSocket 連線關閉");
}
