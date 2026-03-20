// ========================================
// Supabase設定
// ========================================
const SUPABASE_URL = 'https://hhiwvbthsyiwkoiffvwp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_2we0MxN8UXNRyUz9sEy6eg_iK0L0b_v';

console.log('🔧 Supabase初期化開始...');

let supabase;
if (typeof window.supabase !== 'undefined') {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('✅ Supabaseクライアント作成完了');
} else {
  console.error('❌ Supabase ライブラリが読み込まれていません');
}

// ========================================
// 定数
// ========================================
const EVENT_START = '2026-03-16';
const STATIONS_PER_SESSION = 1;
const DOCTOR_YELLOW_PROBABILITY = 0.03;
const MAX_SESSIONS = 3;
const GOAL_BRONZE = 1500;
const GOAL_SILVER = 2500;
const GOAL_GOLD = 3800;

// 名所スタンプ定義（14個）
const STAMPS = [
  {km:123,emoji:'🏯',name:'名古屋城',desc:'天下の堅城！'},
  {km:248,emoji:'🌸',name:'兼六園',desc:'日本三名園のひとつ'},
  {km:456,emoji:'⛩️',name:'厳島神社',desc:'海に浮かぶ大鳥居'},
  {km:789,emoji:'🗻',name:'富士山',desc:'日本一高い山'},
  {km:1012,emoji:'🦌',name:'奈良公園',desc:'鹿がいっぱい！'},
  {km:1234,emoji:'🏰',name:'姫路城',desc:'白鷺城の愛称'},
  {km:1567,emoji:'🌊',name:'鳴門の渦潮',desc:'自然の神秘'},
  {km:1890,emoji:'🍜',name:'博多ラーメン',desc:'とんこつの本場'},
  {km:2123,emoji:'🌴',name:'沖縄美ら海',desc:'南国パラダイス'},
  {km:2456,emoji:'❄️',name:'札幌雪まつり',desc:'冬の風物詩'},
  {km:2789,emoji:'🍇',name:'山梨ぶどう',desc:'果物王国'},
  {km:3012,emoji:'🎋',name:'仙台七夕',desc:'東北の夏祭り'},
  {km:3345,emoji:'🦀',name:'金沢カニ',desc:'日本海の幸'},
  {km:3678,emoji:'🌅',name:'出雲大社',desc:'縁結びの神様'}
];

// 路線の駅データ（約100駅）
const WAYPOINTS = [
  {km:0,name:'東京',emoji:'🏢',pref:'13',x:54,y:45},
  {km:50,name:'横浜',emoji:'⚓',pref:'14',x:55,y:46},
  {km:100,name:'静岡',emoji:'🍵',pref:'22',x:52,y:52},
  {km:150,name:'浜松',emoji:'🎹',pref:'22',x:50,y:53},
  {km:200,name:'豊橋',emoji:'🌉',pref:'23',x:49,y:54},
  {km:250,name:'名古屋',emoji:'🏯',pref:'23',x:48,y:55},
  {km:300,name:'岐阜',emoji:'⛰️',pref:'21',x:47,y:54},
  {km:350,name:'米原',emoji:'🚄',pref:'25',x:47,y:53},
  {km:400,name:'京都',emoji:'⛩️',pref:'26',x:48,y:52},
  {km:450,name:'大阪',emoji:'🏙️',pref:'27',x:48,y:53},
  {km:500,name:'神戸',emoji:'🌉',pref:'28',x:47,y:54},
  {km:550,name:'姫路',emoji:'🏰',pref:'28',x:46,y:55},
  {km:600,name:'岡山',emoji:'🍑',pref:'33',x:45,y:56},
  {km:650,name:'倉敷',emoji:'🏞️',pref:'33',x:44,y:56},
  {km:700,name:'福山',emoji:'🌹',pref:'34',x:43,y:56},
  {km:750,name:'広島',emoji:'⚾',pref:'34',x:42,y:57},
  {km:800,name:'宮島口',emoji:'⛩️',pref:'34',x:41,y:57},
  {km:850,name:'岩国',emoji:'🌉',pref:'35',x:40,y:58},
  {km:900,name:'徳山',emoji:'🏭',pref:'35',x:39,y:58},
  {km:950,name:'防府',emoji:'🏯',pref:'35',x:38,y:59},
  {km:1000,name:'山口',emoji:'🏛️',pref:'35',x:37,y:59},
  {km:1050,name:'下関',emoji:'🐡',pref:'35',x:36,y:60},
  {km:1100,name:'門司',emoji:'🚢',pref:'40',x:36,y:61},
  {km:1150,name:'小倉',emoji:'🏰',pref:'40',x:37,y:61},
  {km:1200,name:'博多',emoji:'🍜',pref:'40',x:38,y:62},
  {km:1250,name:'鳥栖',emoji:'🚄',pref:'41',x:38,y:63},
  {km:1300,name:'久留米',emoji:'🍜',pref:'40',x:38,y:64},
  {km:1350,name:'佐賀',emoji:'🏮',pref:'41',x:37,y:64},
  {km:1400,name:'長崎',emoji:'⛪',pref:'42',x:35,y:65},
  {km:1450,name:'諫早',emoji:'🌉',pref:'42',x:36,y:64},
  {km:1500,name:'熊本',emoji:'🏯',pref:'43',x:39,y:65},
  {km:1550,name:'八代',emoji:'🌊',pref:'43',x:39,y:66},
  {km:1600,name:'人吉',emoji:'⛰️',pref:'43',x:40,y:66},
  {km:1650,name:'宮崎',emoji:'🌴',pref:'45',x:42,y:67},
  {km:1700,name:'都城',emoji:'🌸',pref:'45',x:41,y:67},
  {km:1750,name:'鹿児島',emoji:'🌋',pref:'46',x:40,y:68},
  {km:1800,name:'指宿',emoji:'♨️',pref:'46',x:40,y:69},
  {km:1850,name:'鹿児島中央',emoji:'🚄',pref:'46',x:40,y:68},
  {km:1900,name:'出水',emoji:'🦩',pref:'46',x:39,y:67},
  {km:1950,name:'川内',emoji:'🏭',pref:'46',x:39,y:66},
  {km:2000,name:'串木野',emoji:'🐟',pref:'46',x:38,y:66},
  {km:2050,name:'大分',emoji:'♨️',pref:'44',x:42,y:63},
  {km:2100,name:'別府',emoji:'♨️',pref:'44',x:43,y:63},
  {km:2150,name:'松山',emoji:'🍊',pref:'38',x:44,y:59},
  {km:2200,name:'今治',emoji:'🌉',pref:'38',x:45,y:59},
  {km:2250,name:'高松',emoji:'🌸',pref:'37',x:46,y:57},
  {km:2300,name:'徳島',emoji:'🌊',pref:'36',x:47,y:58},
  {km:2350,name:'和歌山',emoji:'🍊',pref:'30',x:49,y:54},
  {km:2400,name:'田辺',emoji:'🏖️',pref:'30',x:48,y:56},
  {km:2450,name:'新宮',emoji:'⛩️',pref:'30',x:48,y:57},
  {km:2500,name:'熊野',emoji:'⛰️',pref:'24',x:48,y:56},
  {km:2550,name:'津',emoji:'🏛️',pref:'24',x:49,y:54},
  {km:2600,name:'四日市',emoji:'🏭',pref:'24',x:49,y:53},
  {km:2650,name:'桑名',emoji:'🌸',pref:'24',x:49,y:52},
  {km:2700,name:'豊田',emoji:'🚗',pref:'23',x:49,y:54},
  {km:2750,name:'岡崎',emoji:'🏯',pref:'23',x:50,y:54},
  {km:2800,name:'豊川',emoji:'⛩️',pref:'23',x:50,y:55},
  {km:2850,name:'蒲郡',emoji:'🏖️',pref:'23',x:51,y:54},
  {km:2900,name:'掛川',emoji:'🏯',pref:'22',x:51,y:52},
  {km:2950,name:'焼津',emoji:'🐟',pref:'22',x:52,y:51},
  {km:3000,name:'富士',emoji:'🗻',pref:'22',x:53,y:50},
  {km:3050,name:'沼津',emoji:'🏖️',pref:'22',x:53,y:49},
  {km:3100,name:'熱海',emoji:'♨️',pref:'22',x:54,y:48},
  {km:3150,name:'小田原',emoji:'🏯',pref:'14',x:54,y:47},
  {km:3200,name:'平塚',emoji:'🌸',pref:'14',x:54,y:46},
  {km:3250,name:'藤沢',emoji:'🏖️',pref:'14',x:55,y:46},
  {km:3300,name:'鎌倉',emoji:'⛩️',pref:'14',x:55,y:47},
  {km:3350,name:'川崎',emoji:'🏭',pref:'14',x:55,y:46},
  {km:3400,name:'品川',emoji:'🚄',pref:'13',x:54,y:45},
  {km:3450,name:'新宿',emoji:'🏙️',pref:'13',x:54,y:45},
  {km:3500,name:'池袋',emoji:'🦉',pref:'13',x:54,y:44},
  {km:3550,name:'赤羽',emoji:'🍺',pref:'13',x:54,y:44},
  {km:3600,name:'大宮',emoji:'🚄',pref:'11',x:54,y:43},
  {km:3650,name:'浦和',emoji:'⚽',pref:'11',x:54,y:43},
  {km:3700,name:'川口',emoji:'🏭',pref:'11',x:54,y:44},
  {km:3750,name:'草加',emoji:'🌾',pref:'11',x:55,y:44},
  {km:3800,name:'東京（ゴール）',emoji:'🎉',pref:'13',x:54,y:45}
];

// ========================================
// グローバル変数
// ========================================
let currentKm = 0;
let collectedStamps = [];
let currentWaypointIndex = 0;

// ========================================
// ユーティリティ関数
// ========================================
function getCurrentUserName() {
  return localStorage.getItem('currentUserName') || '';
}
function setCurrentUserName(name) {
  localStorage.setItem('currentUserName', name);
}

// ========================================
// 初期化
// ========================================
window.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 DOMContentLoaded');
  
  if (document.getElementById('my-stats')) {
    console.log('📝 登録画面を初期化');
    await initializeRegistrationPage();
    
    const btn = document.getElementById('btn-participate');
    if (btn) {
      btn.addEventListener('click', participate);
      console.log('✅ ボタンイベント登録完了');
    }
  }
  
  if (document.getElementById('stamp-grid')) {
    console.log('🗾 地図画面を初期化');
    await initializeMapPage();
  }
});

// ========================================
// 登録画面
// ========================================
async function initializeRegistrationPage() {
  await loadUserStats();
  await loadTodayMembers();
}

async function loadUserStats() {
  const userName = getCurrentUserName();
  if (!userName) {
    document.getElementById('my-stats-name').textContent = 'あなたの累計';
    document.getElementById('my-stats-km').textContent = '0 km';
    document.getElementById('my-stats-count').textContent = '0駅進行';
    return;
  }
  
  const { data, error } = await supabase
    .from('participations')
    .select('*')
    .eq('user_name', userName)
    .eq('participated', true);
  
  if (error) {
    console.error('統計エラー:', error);
    return;
  }
  
  let totalStations = 0;
  data.forEach(p => {
    totalStations += p.station_progress || 1;
  });
  
  const totalKm = totalStations * 50;
  
  document.getElementById('my-stats-name').textContent = userName + ' さん';
  document.getElementById('my-stats-km').textContent = totalKm.toLocaleString() + ' km';
  document.getElementById('my-stats-count').textContent = totalStations + '駅進行';
}

async function loadTodayMembers() {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('participations')
    .select('user_name, comment, is_doctor_yellow')
    .eq('date', today)
    .eq('participated', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('メンバーエラー:', error);
    return;
  }
  
  const list = document.getElementById('member-list');
  if (!data || data.length === 0) {
    list.innerHTML = '<span style="color:#bbb;font-size:0.85rem;">まだ誰も乗務していません</span>';
    return;
  }
  
  list.innerHTML = data.map(m => {
    const badge = m.is_doctor_yellow ? '<span style="color:#FFD700;">🌟</span>' : '';
    return `<div>${badge} ${m.user_name}${m.comment ? ': ' + m.comment : ''}</div>`;
  }).join('');
}

async function participate() {
  console.log('🚄 participate 開始');
  
  const name = document.getElementById('input-name').value.trim();
  const comment = document.getElementById('input-comment').value.trim();
  
  if (!name) {
    alert('運転手の名前を入力してください');
    return;
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  const { data: todayData, error: checkError } = await supabase
    .from('participations')
    .select('*')
    .eq('user_name', name)
    .eq('date', today);
  
  if (checkError) {
    console.error('チェックエラー:', checkError);
    alert('エラーが発生しました');
    return;
  }
  
  if (todayData && todayData.length >= MAX_SESSIONS) {
    alert(`今日はもう${MAX_SESSIONS}回参加済みです！`);
    return;
  }
  
  const isDoctorYellow = Math.random() < DOCTOR_YELLOW_PROBABILITY;
  const stationProgress = isDoctorYellow ? 2 : STATIONS_PER_SESSION;
  
  const { error: insertError } = await supabase
    .from('participations')
    .insert([{
      user_name: name,
      date: today,
      comment: comment || null,
      participated: true,
      station_progress: stationProgress,
      is_doctor_yellow: isDoctorYellow
    }]);
  
  if (insertError) {
    console.error('登録エラー:', insertError);
    alert('登録に失敗しました');
    return;
  }
  
  if (isDoctorYellow) {
    const alertBox = document.getElementById('doctor-yellow-alert');
    if (alertBox) {
      alertBox.style.display = 'block';
      setTimeout(() => {
        alertBox.style.display = 'none';
      }, 5000);
    }
  }
  
  setCurrentUserName(name);
  
  alert(`✅ 乗車報告完了！\n${isDoctorYellow ? '🌟 ドクターイエロー！2駅進みました！' : '1駅進みました！'}\n\n現在: ${(stationProgress * 50)}km 進行`);
  
  document.getElementById('input-comment').value = '';
  
  await loadUserStats();
  await loadTodayMembers();
}

// ========================================
// 地図画面
// ========================================
async function initializeMapPage() {
  await loadProgress();
  renderMap();
  renderStamps();
  loadRanking();
}

async function loadProgress() {
  const { data, error } = await supabase
    .from('participations')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('データエラー:', error);
    return;
  }
  
  let totalStations = 0;
  data.forEach(p => {
    if (p.participated) {
      totalStations += p.station_progress || 1;
    }
  });
  
  currentKm = totalStations * 50;
  currentWaypointIndex = Math.min(Math.floor(currentKm / 50), WAYPOINTS.length - 1);
  collectedStamps = STAMPS.filter(s => currentKm >= s.km).map(s => s.name);
  
  updateMapUI();
}

function updateMapUI() {
  const percent = Math.min((currentKm / GOAL_GOLD) * 100, 100);
  document.getElementById('progress-fill').style.width = percent + '%';
  document.getElementById('distance-text').textContent = `${currentKm.toLocaleString()} / ${GOAL_GOLD.toLocaleString()} km`;
  
  const currentStation = WAYPOINTS[currentWaypointIndex];
  document.getElementById('current-station').textContent = currentStation ? currentStation.name : 'スタート地点';
  document.getElementById('current-location').textContent = currentStation ? currentStation.name : '東京';
  
  document.getElementById('total-distance').textContent = currentKm.toLocaleString() + ' km';
  document.getElementById('visited-stations').textContent = currentWaypointIndex;
  
  let goalMessage = '';
  if (currentKm >= GOAL_GOLD) goalMessage = '🎉 ゴール達成！';
  else if (currentKm >= GOAL_SILVER) goalMessage = '🥈 シルバー達成！';
  else if (currentKm >= GOAL_BRONZE) goalMessage = '🥉 ブロンズ達成！';
  
  if (goalMessage) {
    document.getElementById('progress-fill').innerHTML = `<span style="padding-right:8px;">${goalMessage}</span>`;
  }
  
  document.getElementById('stamp-progress').textContent = `収集: ${collectedStamps.length}/${STAMPS.length}`;
}

function renderMap() {
  const canvas = document.getElementById('map-canvas');
  canvas.innerHTML = '';
  
  WAYPOINTS.forEach((wp, i) => {
    const dot = document.createElement('div');
    dot.className = 'waypoint';
    dot.textContent = wp.emoji;
    dot.style.left = wp.x + '%';
    dot.style.top = wp.y + '%';
    dot.title = `${wp.name} (${wp.km}km)`;
    
    if (i === currentWaypointIndex) {
      dot.classList.add('current-train');
    }
    
    canvas.appendChild(dot);
  });
}

function renderStamps() {
  const grid = document.getElementById('stamp-grid');
  grid.innerHTML = '';
  
  STAMPS.forEach(stamp => {
    const item = document.createElement('div');
    item.className = 'stamp-item';
    if (collectedStamps.includes(stamp.name)) {
      item.classList.add('collected');
    }
    
    const emoji = document.createElement('span');
    emoji.className = 'stamp-emoji';
    emoji.textContent = stamp.emoji;
    
    const name = document.createElement('div');
    name.className = 'stamp-name';
    name.textContent = stamp.name;
    
    item.appendChild(emoji);
    item.appendChild(name);
    item.title = stamp.desc;
    item.onclick = () => showStampDetail(stamp);
    grid.appendChild(item);
  });
}

function showStampDetail(stamp) {
  const modal = document.getElementById('stamp-modal');
  document.getElementById('modal-icon').textContent = stamp.emoji;
  document.getElementById('modal-title').textContent = stamp.name;
  
  if (collectedStamps.includes(stamp.name)) {
    document.getElementById('modal-info').innerHTML = `
      <p><strong>説明:</strong> ${stamp.desc}</p>
      <p><strong>到達距離:</strong> ${stamp.km.toLocaleString()}km</p>
      <p><strong>状態:</strong> ✅ 獲得済み</p>
    `;
  } else {
    document.getElementById('modal-info').innerHTML = `
      <p><strong>説明:</strong> ${stamp.desc}</p>
      <p><strong>到達条件:</strong> ${stamp.km.toLocaleString()}km</p>
      <p><strong>状態:</strong> 🔒 未獲得</p>
    `;
  }
  
  modal.classList.add('show');
}

function closeStampModal() {
  document.getElementById('stamp-modal').classList.remove('show');
}

async function loadRanking() {
  const { data, error } = await supabase
    .from('participations')
    .select('user_name')
    .eq('participated', true);
  
  if (error) {
    console.error('ランキングエラー:', error);
    return;
  }
  
  const counts = {};
  data.forEach(p => {
    counts[p.user_name] = (counts[p.user_name] || 0) + 1;
  });
  
  const ranking = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  const list = document.getElementById('ranking-list');
  if (ranking.length === 0) {
    list.innerHTML = '<li style="text-align:center;color:#999;">まだ参加者がいません</li>';
    return;
  }
  
  list.innerHTML = '';
  ranking.forEach((r, i) => {
    const li = document.createElement('li');
    li.className = 'ranking-item';
    
    const rank = document.createElement('div');
    rank.className = 'ranking-rank';
    rank.textContent = i + 1;
    
    const name = document.createElement('div');
    name.className = 'ranking-name';
    name.textContent = r.name;
    
    const distance = document.createElement('div');
    distance.className = 'ranking-distance';
    distance.textContent = `${r.count} 回`;
    
    li.appendChild(rank);
    li.appendChild(name);
    li.appendChild(distance);
    list.appendChild(li);
  });
}

if (document.getElementById('stamp-modal')) {
  document.getElementById('stamp-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      closeStampModal();
    }
  });
}

console.log('✅ script.js 読み込み完了');
