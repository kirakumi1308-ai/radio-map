// ========================================
// Supabase設定
// ========================================
const SUPABASE_URL = 'https://hhiwvbthsyiwkoiffvwp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_2we0MxN8UXNRyUz9sEy6eg_iK0L0b_v';

console.log('🔧 script.js 読み込み開始');

// Supabaseクライアントの初期化（一度だけ）
let supabase;
try {
  if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Supabase初期化完了');
  } else {
    console.error('❌ Supabase ライブラリが読み込まれていません');
  }
} catch (error) {
  console.error('❌ Supabase初期化エラー:', error);
}

// ========================================
// 定数定義
// ========================================
const EVENT_START = '2026-03-16';
const STATIONS_PER_SESSION = 1;
const DOCTOR_YELLOW_PROBABILITY = 0.03;
const MAX_SESSIONS = 3;
const GOAL_BRONZE = 1500;
const GOAL_SILVER = 2500;
const GOAL_GOLD = 3800;

// ========================================
// スタンプデータ（14個）
// ========================================
const STAMPS = [
  { name: '富士山', emoji: '🗻', km: 300 },
  { name: '京都', emoji: '⛩️', km: 600 },
  { name: '広島', emoji: '🦌', km: 900 },
  { name: '博多', emoji: '🍜', km: 1200 },
  { name: '札幌', emoji: '❄️', km: 1500 },
  { name: '仙台', emoji: '🌾', km: 1800 },
  { name: '金沢', emoji: '🦀', km: 2100 },
  { name: '名古屋', emoji: '🏯', km: 2400 },
  { name: '大阪', emoji: '🐙', km: 2700 },
  { name: '岡山', emoji: '🍑', km: 3000 },
  { name: '鹿児島', emoji: '🌋', km: 3300 },
  { name: '新潟', emoji: '🍶', km: 3600 },
  { name: '東京', emoji: '🗼', km: 3800 },
  { name: 'ゴール！', emoji: '🎉', km: 3800 }
];

// ========================================
// 駅データ（約100駅）
// ========================================
const WAYPOINTS = [
  { km: 0, name: '東京', emoji: '🗼', x: 72, y: 48 },
  { km: 50, name: '品川', emoji: '🚃', x: 72, y: 49 },
  { km: 100, name: '新横浜', emoji: '⚓', x: 73, y: 50 },
  { km: 150, name: '小田原', emoji: '🏔️', x: 71, y: 51 },
  { km: 200, name: '熱海', emoji: '♨️', x: 70, y: 52 },
  { km: 250, name: '三島', emoji: '🌸', x: 69, y: 53 },
  { km: 300, name: '新富士', emoji: '🗻', x: 68, y: 54 },
  { km: 350, name: '静岡', emoji: '🍵', x: 67, y: 55 },
  { km: 400, name: '掛川', emoji: '🏯', x: 66, y: 56 },
  { km: 450, name: '浜松', emoji: '🎹', x: 65, y: 57 },
  { km: 500, name: '豊橋', emoji: '🦅', x: 64, y: 58 },
  { km: 550, name: '三河安城', emoji: '🚗', x: 63, y: 57 },
  { km: 600, name: '名古屋', emoji: '🏯', x: 62, y: 56 },
  { km: 650, name: '岐阜羽島', emoji: '🎋', x: 61, y: 55 },
  { km: 700, name: '米原', emoji: '🌾', x: 60, y: 54 },
  { km: 750, name: '京都', emoji: '⛩️', x: 59, y: 53 },
  { km: 800, name: '新大阪', emoji: '🐙', x: 58, y: 52 },
  { km: 850, name: '新神戸', emoji: '⚓', x: 57, y: 51 },
  { km: 900, name: '西明石', emoji: '🏖️', x: 56, y: 50 },
  { km: 950, name: '姫路', emoji: '🏯', x: 55, y: 49 },
  { km: 1000, name: '相生', emoji: '🌊', x: 54, y: 48 },
  { km: 1050, name: '岡山', emoji: '🍑', x: 53, y: 47 },
  { km: 1100, name: '新倉敷', emoji: '🎨', x: 52, y: 46 },
  { km: 1150, name: '福山', emoji: '🌹', x: 51, y: 45 },
  { km: 1200, name: '新尾道', emoji: '🚲', x: 50, y: 44 },
  { km: 1250, name: '三原', emoji: '🐙', x: 49, y: 43 },
  { km: 1300, name: '広島', emoji: '🦌', x: 48, y: 42 },
  { km: 1350, name: '新岩国', emoji: '🌉', x: 47, y: 41 },
  { km: 1400, name: '徳山', emoji: '🏭', x: 46, y: 40 },
  { km: 1450, name: '新山口', emoji: '🍶', x: 45, y: 39 },
  { km: 1500, name: '厚狭', emoji: '🌾', x: 44, y: 38 },
  { km: 1550, name: '新下関', emoji: '🐡', x: 43, y: 37 },
  { km: 1600, name: '小倉', emoji: '🏯', x: 42, y: 36 },
  { km: 1650, name: '博多', emoji: '🍜', x: 41, y: 35 },
  { km: 1700, name: '新鳥栖', emoji: '🐦', x: 40, y: 34 },
  { km: 1750, name: '久留米', emoji: '🍜', x: 39, y: 33 },
  { km: 1800, name: '熊本', emoji: '🐻', x: 38, y: 32 },
  { km: 1850, name: '新水俣', emoji: '♨️', x: 37, y: 31 },
  { km: 1900, name: '出水', emoji: '🦢', x: 36, y: 30 },
  { km: 1950, name: '川内', emoji: '🌊', x: 35, y: 29 },
  { km: 2000, name: '鹿児島中央', emoji: '🌋', x: 34, y: 28 },
  { km: 2050, name: '新青森', emoji: '🍎', x: 70, y: 20 },
  { km: 2100, name: '七戸十和田', emoji: '🗻', x: 69, y: 21 },
  { km: 2150, name: '八戸', emoji: '🐟', x: 68, y: 22 },
  { km: 2200, name: '二戸', emoji: '🌲', x: 67, y: 23 },
  { km: 2250, name: '盛岡', emoji: '🏔️', x: 66, y: 24 },
  { km: 2300, name: '新花巻', emoji: '🌸', x: 65, y: 25 },
  { km: 2350, name: '北上', emoji: '🌾', x: 64, y: 26 },
  { km: 2400, name: '水沢江刺', emoji: '💧', x: 63, y: 27 },
  { km: 2450, name: '一ノ関', emoji: '🏯', x: 62, y: 28 },
  { km: 2500, name: '古川', emoji: '🌾', x: 61, y: 29 },
  { km: 2550, name: '仙台', emoji: '🌾', x: 60, y: 30 },
  { km: 2600, name: '白石蔵王', emoji: '🏔️', x: 61, y: 31 },
  { km: 2650, name: '福島', emoji: '🍑', x: 62, y: 32 },
  { km: 2700, name: '郡山', emoji: '🌸', x: 63, y: 33 },
  { km: 2750, name: '新白河', emoji: '🏯', x: 64, y: 34 },
  { km: 2800, name: '那須塩原', emoji: '♨️', x: 65, y: 35 },
  { km: 2850, name: '宇都宮', emoji: '🥟', x: 66, y: 36 },
  { km: 2900, name: '小山', emoji: '🌾', x: 67, y: 37 },
  { km: 2950, name: '大宮', emoji: '🚃', x: 68, y: 38 },
  { km: 3000, name: '上野', emoji: '🐼', x: 69, y: 39 },
  { km: 3050, name: '東京', emoji: '🗼', x: 70, y: 40 },
  { km: 3100, name: '高崎', emoji: '🗻', x: 68, y: 42 },
  { km: 3150, name: '上毛高原', emoji: '♨️', x: 67, y: 41 },
  { km: 3200, name: '越後湯沢', emoji: '⛷️', x: 66, y: 40 },
  { km: 3250, name: '浦佐', emoji: '🏔️', x: 65, y: 39 },
  { km: 3300, name: '長岡', emoji: '🎆', x: 64, y: 38 },
  { km: 3350, name: '燕三条', emoji: '🔧', x: 63, y: 37 },
  { km: 3400, name: '新潟', emoji: '🍶', x: 62, y: 36 },
  { km: 3450, name: '長野', emoji: '🍎', x: 67, y: 44 },
  { km: 3500, name: '飯山', emoji: '⛷️', x: 66, y: 43 },
  { km: 3550, name: '上越妙高', emoji: '🏔️', x: 65, y: 42 },
  { km: 3600, name: '糸魚川', emoji: '🌊', x: 64, y: 41 },
  { km: 3650, name: '黒部宇奈月温泉', emoji: '♨️', x: 63, y: 40 },
  { km: 3700, name: '富山', emoji: '🏔️', x: 62, y: 39 },
  { km: 3750, name: '新高岡', emoji: '🏯', x: 61, y: 38 },
  { km: 3800, name: '金沢', emoji: '🦀', x: 60, y: 37 }
];

// ========================================
// グローバル変数
// ========================================
let currentUser = null;

// ========================================
// 登録画面の初期化
// ========================================
async function initializeRegistrationPage() {
  console.log('📝 登録画面を初期化中...');
  await loadUserStats();
  await loadTodayMembers();
  updateSessionDots();
}

// ========================================
// ユーザー統計を読み込む
// ========================================
async function loadUserStats() {
  console.log('📊 ユーザー統計を読み込み中...');
  const name = localStorage.getItem('userName');
  
  if (!name) {
    console.log('👤 ユーザー名が保存されていません');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('participations')
      .select('*')
      .eq('name', name)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (data && data.length > 0) {
      currentUser = {
        name: name,
        totalSessions: data.length,
        totalDistance: data.reduce((sum, p) => sum + (p.station_progress || 0) * 50, 0),
        stationsVisited: data.reduce((sum, p) => sum + (p.station_progress || 0), 0)
      };

      // 統計表示を更新
      document.getElementById('stat-name').textContent = `${name} さん`;
      document.getElementById('stat-distance').textContent = `${currentUser.totalDistance} km`;
      document.getElementById('stat-stations').textContent = `${currentUser.stationsVisited}駅進行`;

      console.log('✅ 統計読み込み完了:', currentUser);
    }
  } catch (error) {
    console.error('❌ 統計読み込みエラー:', error);
  }
}

// ========================================
// 本日のメンバーを読み込む
// ========================================
async function loadTodayMembers() {
  console.log('👥 本日のメンバーを読み込み中...');
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('participations')
      .select('name, comment, created_at')
      .gte('created_at', `${today}T00:00:00`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    const memberList = document.getElementById('today-members');
    if (memberList && data) {
      memberList.innerHTML = data.map(p => 
        `<div class="member-item">
          <span class="member-name">${p.name}</span>
          ${p.comment ? `<span class="member-comment">: ${p.comment}</span>` : ''}
        </div>`
      ).join('');
      
      console.log(`✅ ${data.length}名のメンバーを表示`);
    }
  } catch (error) {
    console.error('❌ メンバー読み込みエラー:', error);
  }
}

// ========================================
// セッションドットを更新
// ========================================
function updateSessionDots() {
  const today = new Date().toISOString().split('T')[0];
  const sessionKey = `sessions_${today}`;
  const sessions = parseInt(localStorage.getItem(sessionKey) || '0');

  const dotsContainer = document.getElementById('session-dots');
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < MAX_SESSIONS; i++) {
      const dot = document.createElement('div');
      dot.className = 'session-dot';
      if (i < sessions) {
        dot.classList.add('done');
      }
      dotsContainer.appendChild(dot);
    }
  }
}

// ========================================
// 参加処理
// ========================================
async function participate() {
  console.log('🚄 participate 開始');
  
  const nameInput = document.getElementById('input-name');
  const commentInput = document.getElementById('input-comment');
  
  if (!nameInput) {
    console.error('❌ input-name 要素が見つかりません');
    alert('エラー: 入力フォームが見つかりません');
    return;
  }

  const name = nameInput.value.trim();
  const comment = commentInput ? commentInput.value.trim() : '';

  console.log('📝 入力値:', { name, comment });

  if (!name) {
    alert('運転手名を入力してください');
    return;
  }

  // 参加制限チェック
  const today = new Date().toISOString().split('T')[0];
  const sessionKey = `sessions_${today}`;
  const sessions = parseInt(localStorage.getItem(sessionKey) || '0');

  if (sessions >= MAX_SESSIONS) {
    alert(`本日の参加は${MAX_SESSIONS}回までです。また明日お越しください！🌅`);
    return;
  }

  try {
    console.log('💾 Supabaseに保存中...');

    // ドクターイエロー判定
    const isDoctorYellow = Math.random() < DOCTOR_YELLOW_PROBABILITY;
    const stationsToAdd = isDoctorYellow ? 2 : 1;

    // データベースに保存
    const { data, error } = await supabase
      .from('participations')
      .insert([{
        name: name,
        comment: comment || null,
        station_progress: stationsToAdd,
        is_doctor_yellow: isDoctorYellow
      }])
      .select();

    if (error) throw error;

    console.log('✅ 保存成功:', data);

    // セッション数を更新
    localStorage.setItem(sessionKey, (sessions + 1).toString());
    localStorage.setItem('userName', name);

    // ドクターイエロー通知
    if (isDoctorYellow) {
      const alertBox = document.getElementById('doctor-yellow-alert');
      if (alertBox) {
        alertBox.style.display = 'block';
        setTimeout(() => {
          alertBox.style.display = 'none';
        }, 5000);
      }
      alert(`🎉 ドクターイエロー出現！ 2駅進みました！ 🎉`);
    } else {
      alert(`✅ 乗車報告完了！ 1駅進みました！`);
    }

    // UIを更新
    await loadUserStats();
    await loadTodayMembers();
    updateSessionDots();

    // 入力フォームをクリア
    nameInput.value = name; // 名前は保持
    if (commentInput) commentInput.value = '';

  } catch (error) {
    console.error('❌ 保存エラー:', error);
    alert('エラーが発生しました: ' + error.message);
  }
}

// ========================================
// 地図画面の初期化
// ========================================
async function initializeMapPage() {
  console.log('🗾 地図画面を初期化中...');
  await loadProgress();
  renderMap();
  renderStamps();
  await loadRanking();
}

// ========================================
// 進捗を読み込む
// ========================================
async function loadProgress() {
  console.log('📈 進捗を読み込み中...');
  
  try {
    const { data, error } = await supabase
      .from('participations')
      .select('station_progress');

    if (error) throw error;

    const totalStations = data.reduce((sum, p) => sum + (p.station_progress || 0), 0);
    const totalDistance = totalStations * 50;
    const currentWaypoint = WAYPOINTS.find(w => w.km >= totalDistance) || WAYPOINTS[WAYPOINTS.length - 1];

    // 進捗バーを更新
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      const percentage = Math.min((totalDistance / GOAL_GOLD) * 100, 100);
      progressBar.style.width = `${percentage}%`;
    }

    // 統計を更新
    document.getElementById('total-distance').textContent = `${totalDistance} km`;
    document.getElementById('visited-stations').textContent = `${totalStations}駅`;
    document.getElementById('current-location').textContent = currentWaypoint.name;

    console.log('✅ 進捗読み込み完了:', { totalStations, totalDistance });
  } catch (error) {
    console.error('❌ 進捗読み込みエラー:', error);
  }
}

// ========================================
// 地図を描画
// ========================================
function renderMap() {
  console.log('🗺️ 地図を描画中...');
  
  const mapContainer = document.getElementById('map-container');
  if (!mapContainer) return;

  mapContainer.innerHTML = '';

  WAYPOINTS.forEach((waypoint, index) => {
    const marker = document.createElement('div');
    marker.className = 'map-marker';
    marker.style.left = `${waypoint.x}%`;
    marker.style.top = `${waypoint.y}%`;
    marker.textContent = waypoint.emoji;
    marker.title = `${waypoint.name} (${waypoint.km}km)`;

    // 現在地を強調
    if (index === 0) {
      marker.classList.add('current');
    }

    mapContainer.appendChild(marker);
  });

  console.log('✅ 地図描画完了');
}

// ========================================
// スタンプを描画
// ========================================
function renderStamps() {
  console.log('🏅 スタンプを描画中...');
  
  const stampGrid = document.getElementById('stamp-grid');
  if (!stampGrid) return;

  stampGrid.innerHTML = '';

  STAMPS.forEach((stamp, index) => {
    const stampCard = document.createElement('div');
    stampCard.className = 'stamp-card';
    stampCard.innerHTML = `
      <div class="stamp-emoji">${stamp.emoji}</div>
      <div class="stamp-name">${stamp.name}</div>
      <div class="stamp-km">${stamp.km}km</div>
    `;
    stampGrid.appendChild(stampCard);
  });

  console.log('✅ スタンプ描画完了');
}

// ========================================
// ランキングを読み込む
// ========================================
async function loadRanking() {
  console.log('🏆 ランキングを読み込み中...');
  
  try {
    const { data, error } = await supabase
      .from('participations')
      .select('name, station_progress')
      .order('station_progress', { ascending: false });

    if (error) throw error;

    // 名前ごとに集計
    const userStats = {};
    data.forEach(p => {
      if (!userStats[p.name]) {
        userStats[p.name] = 0;
      }
      userStats[p.name] += p.station_progress || 0;
    });

    // 配列に変換してソート
    const ranking = Object.entries(userStats)
      .map(([name, stations]) => ({ name, stations, distance: stations * 50 }))
      .sort((a, b) => b.distance - a.distance)
      .slice(0, 10);

    // ランキング表示を更新
    const rankingList = document.getElementById('ranking-list');
    if (rankingList) {
      rankingList.innerHTML = ranking.map((user, index) => `
        <div class="ranking-item">
          <span class="rank">${index + 1}位</span>
          <span class="rank-name">${user.name}</span>
          <span class="rank-distance">${user.distance} km (${user.stations}駅)</span>
        </div>
      `).join('');
    }

    console.log('✅ ランキング読み込み完了');
  } catch (error) {
    console.error('❌ ランキング読み込みエラー:', error);
  }
}

// ========================================
// ページ読み込み時の初期化
// ========================================
window.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 DOMContentLoaded');

  // 登録画面の初期化
  if (document.getElementById('my-stats')) {
    await initializeRegistrationPage();

    // 参加ボタンのイベントリスナー
    const btn = document.getElementById('btn-participate');
    console.log('🔘 ボタン要素:', btn);
    
    if (btn) {
      btn.addEventListener('click', () => {
        console.log('🖱️ ボタンがクリックされました！');
        participate();
      });
      console.log('✅ ボタンイベントリスナー登録完了');
    } else {
      console.error('❌ btn-participate 要素が見つかりません');
    }
  }

  // 地図画面の初期化
  if (document.getElementById('stamp-grid')) {
    await initializeMapPage();
  }

  console.log('✅ 初期化完了');
});
