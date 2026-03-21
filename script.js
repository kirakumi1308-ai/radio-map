// ========================================
// Supabase設定
// ========================================
const SUPABASE_URL = 'https://hhiwvbthsyiwkoiffvwp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_2we0MxN8UXNRyUz9sEy6eg_iK0L0b_v';

console.log('🔧 script.js 読み込み開始');

// Supabaseクライアントの初期化
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
const GOAL_BRONZE = 30;   // 30駅
const GOAL_SILVER = 60;   // 60駅
const GOAL_GOLD = 125;    // 125駅（全駅）

// ========================================
// スタンプデータ（14個）
// ========================================
const STAMPS = [
  { name: '新大阪', emoji: '🍜', stations: 1 },
  { name: '金沢', emoji: '🥢', stations: 12 },
  { name: '新潟', emoji: '🍚', stations: 20 },
  { name: '東京', emoji: '🗼', stations: 33 },
  { name: '仙台', emoji: '🌸', stations: 43 },
  { name: '新青森', emoji: '🍎', stations: 56 },
  { name: '新函館北斗', emoji: '🦑', stations: 59 },
  { name: '札幌', emoji: '🦀', stations: 60 },
  { name: '稚内', emoji: '🦭', stations: 62 },
  { name: '博多', emoji: '🍜', stations: 104 },
  { name: '熊本', emoji: '🏯', stations: 118 },
  { name: '鹿児島中央', emoji: '🌋', stations: 125 },
  { name: '那覇', emoji: '🌺', stations: 126 },
  { name: 'ゴール！', emoji: '🎉', stations: 126 }
];

// ========================================
// 駅データ（125駅）
// ========================================
const WAYPOINTS = [
  { km:    0, name:'新大阪',   emoji:'🍜', prefCode:'27', mapX:54.5, mapY:51.5 },
  { km:   14, name:'京都',     emoji:'⛩️',  prefCode:'26', mapX:57.5, mapY:49.5 },
  { km:   64, name:'米原',     emoji:'🏔️',  prefCode:'25', mapX:62.0, mapY:48.0 },
  { km:   98, name:'岐阜羽島', emoji:'🦅', prefCode:'21', mapX:65.5, mapY:49.5 },
  { km:  123, name:'名古屋',   emoji:'🏯', prefCode:'23', mapX:67.5, mapY:50.5 },
  { km:  153, name:'敦賀',           emoji:'⚓', prefCode:'18', mapX:57.0, mapY:44.0 },
  { km:  168, name:'越前たけふ',     emoji:'🌾', prefCode:'18', mapX:54.5, mapY:43.0 },
  { km:  183, name:'福井',           emoji:'🦕', prefCode:'18', mapX:55.5, mapY:42.5 },
  { km:  199, name:'芦原温泉',       emoji:'♨️',  prefCode:'18', mapX:56.5, mapY:42.0 },
  { km:  215, name:'加賀温泉',       emoji:'♨️',  prefCode:'17', mapX:57.5, mapY:41.5 },
  { km:  231, name:'小松',           emoji:'🔧', prefCode:'17', mapX:58.5, mapY:41.0 },
  { km:  248, name:'金沢',           emoji:'🥢', prefCode:'17', mapX:59.5, mapY:40.5 },
  { km:  265, name:'新高岡',         emoji:'🌸', prefCode:'16', mapX:61.5, mapY:39.5 },
  { km:  282, name:'富山',           emoji:'💊', prefCode:'16', mapX:62.5, mapY:39.0 },
  { km:  305, name:'黒部宇奈月温泉', emoji:'♨️',  prefCode:'16', mapX:64.0, mapY:38.5 },
  { km:  331, name:'糸魚川',         emoji:'🦕', prefCode:'15', mapX:65.5, mapY:38.0 },
  { km:  357, name:'上越妙高',       emoji:'🌊', prefCode:'15', mapX:67.0, mapY:38.5 },
  { km:  393, name:'長岡',           emoji:'🎆', prefCode:'15', mapX:72.0, mapY:37.5 },
  { km:  417, name:'燕三条',         emoji:'🔨', prefCode:'15', mapX:71.5, mapY:36.5 },
  { km:  442, name:'新潟',           emoji:'🍚', prefCode:'15', mapX:71.0, mapY:35.5 },
  { km:  472, name:'浦佐',           emoji:'🌿', prefCode:'15', mapX:73.0, mapY:38.5 },
  { km:  499, name:'越後湯沢',       emoji:'⛷️',  prefCode:'15', mapX:74.5, mapY:39.5 },
  { km:  524, name:'上毛高原',       emoji:'🏔️',  prefCode:'10', mapX:76.5, mapY:40.5 },
  { km:  542, name:'高崎',           emoji:'🥊', prefCode:'10', mapX:77.5, mapY:42.0 },
  { km:  560, name:'安中榛名',       emoji:'♨️',  prefCode:'10', mapX:76.0, mapY:42.0 },
  { km:  578, name:'軽井沢',         emoji:'🏔️',  prefCode:'20', mapX:74.5, mapY:41.5 },
  { km:  597, name:'佐久平',         emoji:'🌾', prefCode:'20', mapX:73.0, mapY:41.5 },
  { km:  617, name:'上田',           emoji:'🏯', prefCode:'20', mapX:71.5, mapY:41.5 },
  { km:  638, name:'本庄早稲田',     emoji:'📚', prefCode:'11', mapX:78.5, mapY:43.0 },
  { km:  645, name:'長野',           emoji:'🏔️',  prefCode:'20', mapX:70.0, mapY:40.0 },
  { km:  650, name:'熊谷',           emoji:'🌺', prefCode:'11', mapX:79.5, mapY:43.5 },
  { km:  656, name:'大宮',           emoji:'🌸', prefCode:'11', mapX:81.0, mapY:44.0 },
  { km:  668, name:'東京',           emoji:'🗼', prefCode:'13', mapX:81.5, mapY:45.5 },
  { km:  670, name:'上野',           emoji:'🐼', prefCode:'13', mapX:81.5, mapY:45.0 },
  { km:  692, name:'大宮',           emoji:'🌸', prefCode:'11', mapX:81.0, mapY:44.0 },
  { km:  733, name:'小山',           emoji:'🏰', prefCode:'09', mapX:82.0, mapY:43.5 },
  { km:  760, name:'宇都宮',         emoji:'🥟', prefCode:'09', mapX:82.5, mapY:42.5 },
  { km:  791, name:'那須塩原',       emoji:'♨️',  prefCode:'09', mapX:82.5, mapY:41.5 },
  { km:  824, name:'新白河',         emoji:'⛩️',  prefCode:'07', mapX:82.5, mapY:40.5 },
  { km:  864, name:'郡山',           emoji:'🌸', prefCode:'07', mapX:83.0, mapY:39.5 },
  { km:  905, name:'福島',           emoji:'🍑', prefCode:'07', mapX:83.0, mapY:38.0 },
  { km:  937, name:'白石蔵王',       emoji:'⛷️',  prefCode:'04', mapX:82.5, mapY:37.0 },
  { km:  997, name:'仙台',           emoji:'🌸', prefCode:'04', mapX:82.0, mapY:36.0 },
  { km: 1036, name:'古川',           emoji:'🌾', prefCode:'04', mapX:82.0, mapY:34.5 },
  { km: 1057, name:'くりこま高原',   emoji:'🦌', prefCode:'04', mapX:82.5, mapY:33.5 },
  { km: 1085, name:'一ノ関',         emoji:'⛩️',  prefCode:'03', mapX:83.0, mapY:32.0 },
  { km: 1116, name:'水沢江刺',       emoji:'🌿', prefCode:'03', mapX:83.0, mapY:31.0 },
  { km: 1137, name:'北上',           emoji:'🌸', prefCode:'03', mapX:83.0, mapY:30.0 },
  { km: 1159, name:'新花巻',         emoji:'🌸', prefCode:'03', mapX:83.0, mapY:29.0 },
  { km: 1197, name:'盛岡',           emoji:'🍲', prefCode:'03', mapX:83.0, mapY:28.0 },
  { km: 1237, name:'いわて沼宮内',   emoji:'🌿', prefCode:'03', mapX:82.5, mapY:26.5 },
  { km: 1272, name:'二戸',           emoji:'🌿', prefCode:'03', mapX:82.0, mapY:25.0 },
  { km: 1312, name:'八戸',           emoji:'🐙', prefCode:'02', mapX:82.0, mapY:23.5 },
  { km: 1348, name:'七戸十和田',     emoji:'🌊', prefCode:'02', mapX:80.5, mapY:22.5 },
  { km: 1379, name:'新青森',         emoji:'🍎', prefCode:'02', mapX:79.5, mapY:21.5 },
  { km: 1419, name:'奥津軽いまべつ', emoji:'🌊', prefCode:'02', mapX:77.5, mapY:20.5 },
  { km: 1470, name:'木古内',         emoji:'❄️',  prefCode:'01', mapX:75.0, mapY:20.0 },
  { km: 1512, name:'新函館北斗',     emoji:'🦑', prefCode:'01', mapX:73.5, mapY:19.5 },
  { km: 1643, name:'札幌',           emoji:'🦀', prefCode:'01', mapX:70.5, mapY:15.0 },
  { km: 1783, name:'旭川',           emoji:'❄️',  prefCode:'01', mapX:66.5, mapY:11.5 },
  { km: 1903, name:'稚内',           emoji:'🦭', prefCode:'01', mapX:62.5, mapY: 7.0 },
  { km: 2003, name:'旭川',           emoji:'🔄', prefCode:'01', mapX:66.5, mapY:11.5 },
  { km: 2103, name:'札幌',           emoji:'🔄', prefCode:'01', mapX:70.5, mapY:15.0 },
  { km: 2193, name:'新函館北斗',     emoji:'🔄', prefCode:'01', mapX:73.5, mapY:19.5 },
  { km: 2275, name:'新青森',         emoji:'🍎', prefCode:'02', mapX:79.5, mapY:21.5 },
  { km: 2315, name:'八戸',           emoji:'🐙', prefCode:'02', mapX:82.0, mapY:23.5 },
  { km: 2355, name:'盛岡',           emoji:'🍲', prefCode:'03', mapX:83.0, mapY:28.0 },
  { km: 2395, name:'仙台',           emoji:'🌸', prefCode:'04', mapX:82.0, mapY:36.0 },
  { km: 2458, name:'福島',           emoji:'🍑', prefCode:'07', mapX:83.0, mapY:38.0 },
  { km: 2498, name:'郡山',           emoji:'🌸', prefCode:'07', mapX:83.0, mapY:39.5 },
  { km: 2558, name:'宇都宮',         emoji:'🥟', prefCode:'09', mapX:82.5, mapY:42.5 },
  { km: 2598, name:'大宮',           emoji:'🌸', prefCode:'11', mapX:81.0, mapY:44.0 },
  { km: 2620, name:'東京',           emoji:'🗼', prefCode:'13', mapX:81.5, mapY:45.5 },
  { km: 2634, name:'品川',           emoji:'🐟', prefCode:'13', mapX:81.5, mapY:46.0 },
  { km: 2646, name:'新横浜',         emoji:'⚽', prefCode:'14', mapX:81.0, mapY:47.0 },
  { km: 2674, name:'小田原',         emoji:'🏯', prefCode:'14', mapX:79.5, mapY:48.5 },
  { km: 2696, name:'熱海',           emoji:'♨️',  prefCode:'22', mapX:78.5, mapY:49.5 },
  { km: 2715, name:'三島',           emoji:'♨️',  prefCode:'22', mapX:77.5, mapY:50.0 },
  { km: 2736, name:'新富士',         emoji:'🗻', prefCode:'22', mapX:76.5, mapY:50.5 },
  { km: 2766, name:'静岡',           emoji:'🗻', prefCode:'22', mapX:75.0, mapY:51.5 },
  { km: 2796, name:'掛川',           emoji:'🍵', prefCode:'22', mapX:73.5, mapY:52.0 },
  { km: 2835, name:'豊橋',           emoji:'🍊', prefCode:'23', mapX:71.5, mapY:51.5 },
  { km: 2877, name:'三河安城',       emoji:'🌸', prefCode:'23', mapX:69.5, mapY:51.0 },
  { km: 2907, name:'名古屋',         emoji:'🏯', prefCode:'23', mapX:67.5, mapY:50.5 },
  { km: 2932, name:'岐阜羽島',       emoji:'🦅', prefCode:'21', mapX:65.5, mapY:49.5 },
  { km: 2966, name:'米原',           emoji:'🏔️',  prefCode:'25', mapX:62.0, mapY:48.0 },
  { km: 3016, name:'京都',           emoji:'⛩️',  prefCode:'26', mapX:57.5, mapY:49.5 },
  { km: 3030, name:'新大阪',         emoji:'🍜', prefCode:'27', mapX:54.5, mapY:51.5 },
  { km: 3043, name:'新神戸',         emoji:'🌉', prefCode:'28', mapX:52.0, mapY:52.0 },
  { km: 3075, name:'西明石',         emoji:'⚓', prefCode:'28', mapX:48.5, mapY:53.0 },
  { km: 3100, name:'姫路',           emoji:'🏯', prefCode:'28', mapX:46.0, mapY:52.5 },
  { km: 3143, name:'相生',           emoji:'🌿', prefCode:'28', mapX:43.5, mapY:53.5 },
  { km: 3173, name:'岡山',           emoji:'🍑', prefCode:'33', mapX:41.0, mapY:52.0 },
  { km: 3200, name:'新倉敷',         emoji:'🎨', prefCode:'33', mapX:39.5, mapY:52.5 },
  { km: 3226, name:'福山',           emoji:'🌹', prefCode:'34', mapX:38.0, mapY:52.5 },
  { km: 3238, name:'新尾道',         emoji:'🌊', prefCode:'34', mapX:37.0, mapY:52.5 },
  { km: 3254, name:'三原',           emoji:'🐙', prefCode:'34', mapX:36.0, mapY:52.0 },
  { km: 3275, name:'東広島',         emoji:'🍺', prefCode:'34', mapX:38.5, mapY:51.5 },
  { km: 3311, name:'広島',           emoji:'🕊️',  prefCode:'34', mapX:40.5, mapY:52.5 },
  { km: 3347, name:'新岩国',         emoji:'🌉', prefCode:'35', mapX:38.0, mapY:53.5 },
  { km: 3379, name:'徳山',           emoji:'🏭', prefCode:'35', mapX:36.0, mapY:54.0 },
  { km: 3408, name:'新山口',         emoji:'🐡', prefCode:'35', mapX:33.5, mapY:54.5 },
  { km: 3439, name:'厚狭',           emoji:'🌿', prefCode:'35', mapX:31.5, mapY:54.5 },
  { km: 3467, name:'新下関',         emoji:'🐡', prefCode:'35', mapX:30.0, mapY:55.0 },
  { km: 3489, name:'小倉',           emoji:'🍜', prefCode:'40', mapX:29.5, mapY:55.5 },
  { km: 3528, name:'博多',           emoji:'🍜', prefCode:'40', mapX:27.5, mapY:57.0 },
  { km: 3561, name:'新鳥栖',         emoji:'⚽', prefCode:'41', mapX:26.5, mapY:58.5 },
  { km: 3591, name:'久留米',         emoji:'🎪', prefCode:'40', mapX:26.0, mapY:60.0 },
  { km: 3630, name:'筑後船小屋',     emoji:'🌾', prefCode:'40', mapX:26.5, mapY:61.5 },
  { km: 3665, name:'新大牟田',       emoji:'🏭', prefCode:'40', mapX:27.0, mapY:63.0 },
  { km: 3707, name:'新玉名',         emoji:'♨️',  prefCode:'43', mapX:28.5, mapY:64.5 },
  { km: 3763, name:'熊本',           emoji:'🏯', prefCode:'43', mapX:29.5, mapY:66.5 },
  { km: 3822, name:'新八代',         emoji:'🥁', prefCode:'43', mapX:30.0, mapY:68.5 },
  { km: 3855, name:'新水俣',         emoji:'🌊', prefCode:'43', mapX:29.0, mapY:70.0 },
  { km: 3890, name:'出水',           emoji:'🦩', prefCode:'46', mapX:29.5, mapY:71.5 },
  { km: 3936, name:'川内',           emoji:'⚡', prefCode:'46', mapX:30.0, mapY:73.5 },
  { km: 3990, name:'鹿児島中央',     emoji:'🌋', prefCode:'46', mapX:31.5, mapY:76.0 },
  { km: 4200, name:'那覇',           emoji:'🌺', prefCode:'47', mapX:16.0, mapY:89.5 },
];

// グローバル変数
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
      .eq('user_name', name)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (data && data.length > 0) {
      const totalStations = data.reduce((sum, p) => sum + (p.station_progress || 0), 0);
      const currentWaypoint = WAYPOINTS[Math.min(totalStations, WAYPOINTS.length - 1)];
      
      currentUser = {
        name: name,
        totalSessions: data.length,
        stationsVisited: totalStations
      };

      // 統計表示を更新
      document.getElementById('stat-name').textContent = `${name} さん`;
      document.getElementById('stat-distance').textContent = `${currentUser.stationsVisited}駅`;
      document.getElementById('stat-stations').textContent = currentWaypoint.name;

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
      .select('user_name, comment, created_at')
      .gte('created_at', `${today}T00:00:00`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    const memberList = document.getElementById('today-members');
    if (memberList && data) {
      memberList.innerHTML = data.map(p => 
        `<div class="member-item">
          <span class="member-name">${p.user_name}</span>
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
  const countSpan = document.getElementById('session-count');
  
  if (countSpan) {
    countSpan.textContent = sessions;
  }
  
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
        user_name: name,
        comment: comment || null,
        station_progress: stationsToAdd,
        is_doctor_yellow: isDoctorYellow,
        date: new Date().toISOString().split('T')[0]
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
      alert(`🎉 ドクターイエロー出現！ ${stationsToAdd}駅進みました！ 🎉`);
    } else {
      alert(`✅ 乗車完了！ ${stationsToAdd}駅進みました！`);
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
    const currentWaypoint = WAYPOINTS[Math.min(totalStations, WAYPOINTS.length - 1)];

    // 進捗バーを更新
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      const percentage = Math.min((totalStations / GOAL_GOLD) * 100, 100);
      progressBar.style.width = `${percentage}%`;
    }

    // 統計を更新
    const distanceText = document.getElementById('total-distance');
    const stationsText = document.getElementById('visited-stations');
    const locationText = document.getElementById('current-location');
    
    if (distanceText) distanceText.textContent = `${totalStations}駅`;
    if (stationsText) stationsText.textContent = currentWaypoint.name;
    if (locationText) locationText.textContent = `${WAYPOINTS.length}駅中`;

    console.log('✅ 進捗読み込み完了:', { totalStations });
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
    marker.style.left = `${waypoint.mapX}%`;
    marker.style.top = `${waypoint.mapY}%`;
    marker.textContent = waypoint.emoji;
    marker.title = `${waypoint.name}`;

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
      <div class="stamp-km">${stamp.stations}駅</div>
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
      .select('user_name, station_progress')
      .order('station_progress', { ascending: false });

    if (error) throw error;

    // 名前ごとに集計
    const userStats = {};
    data.forEach(p => {
      if (!userStats[p.user_name]) {
        userStats[p.user_name] = 0;
      }
      userStats[p.user_name] += p.station_progress || 0;
    });

    // 配列に変換してソート
    const ranking = Object.entries(userStats)
      .map(([name, stations]) => ({ name, stations }))
      .sort((a, b) => b.stations - a.stations)
      .slice(0, 10);

    // ランキング表示を更新
    const rankingList = document.getElementById('ranking-list');
    if (rankingList) {
      rankingList.innerHTML = ranking.map((user, index) => `
        <div class="ranking-item">
          <span class="rank">${index + 1}位</span>
          <span class="rank-name">${user.name}</span>
          <span class="rank-distance">${user.stations}駅</span>
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
