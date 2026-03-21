console.log('✅ script.js 読み込み開始');

const SUPABASE_URL = 'https://hhiwvbthsyiwkoiffvwp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_2we0MxN8UXNRyUz9sEy6eg_iK0L0b_v';

const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);

if (supabase) {
  console.log('✅ Supabase接続成功');
} else {
  console.error('❌ Supabase接続失敗');
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOMContentLoaded');
  
  const btn = document.getElementById('btn-participate');
  if (btn) {
    btn.addEventListener('click', async () => {
      alert('ボタンがクリックされました！（テスト）');
      console.log('🚄 ボタンクリック');
    });
    console.log('✅ ボタンイベント登録完了');
  } else {
    console.error('❌ ボタンが見つかりません');
  }
});
