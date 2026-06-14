/* ============================================================
   CampusPool — 公共模块（纯前端版，无后端依赖）
   ============================================================ */

const App = window.App = {};

// ==================== 认证 ====================
App.getUser = () => { try { const u=localStorage.getItem('carpool_user'); return u?JSON.parse(u):null; } catch{return null;} };
App.setUser = (u) => localStorage.setItem('carpool_user', JSON.stringify(u));
App.removeUser = () => localStorage.removeItem('carpool_user');
App.isLoggedIn = () => !!App.getUser();

App.login = (username, password) => {
  const result = Store.login(username, password);
  if (result.error) throw new Error(result.error);
  App.setUser(result.user);
  return result.user;
};

App.register = (data) => {
  const result = Store.register(data);
  if (result.error) throw new Error(result.error);
  App.setUser(result.user);
  return result.user;
};

App.logout = () => { App.removeUser(); window.location.href='/'; };

App.requireAuth = () => {
  if (!App.isLoggedIn()) {
    const path = window.location.pathname.replace('/','').replace('.html','')||'home';
    window.location.href = `/login.html?redirect=${path}`;
    return false;
  }
  return true;
};

// ==================== 导航 ====================
App.renderNav = () => {
  const user = App.getUser();
  const page = App.currentPage;
  const html = `
    <nav class="nav">
      <div class="container">
        <a href="/" class="nav-brand"><span class="logo-dot"></span><span>CampusPool</span></a>
        <button class="nav-toggle" id="navToggle">☰</button>
        <ul class="nav-links" id="navLinks">
          <li><a href="/" class="${page==='home'?'active':''}">首页</a></li>
          <li><a href="/square.html" class="${page==='square'?'active':''}">拼车广场</a></li>
          <li><a href="/publish.html" class="${page==='publish'?'active':''}">发布行程</a></li>
          <li><a href="/safety.html" class="${page==='safety'?'active':''}">安全提示</a></li>
        </ul>
        <div class="nav-actions">
          ${user ? `
            <a href="/profile.html" class="nav-user">
              <span class="nav-avatar">${(user.nickname||user.username)[0]}</span>
              <span>${user.nickname||user.username}${user.is_verified?' <span class="verified-dot" title="已认证"></span>':''}</span>
            </a>
            <button class="btn btn-ghost btn-sm" onclick="App.logout()">退出</button>
          ` : `
            <a href="/login.html" class="btn btn-outline btn-sm">登录</a>
            <a href="/login.html?tab=register" class="btn btn-primary btn-sm">注册</a>
          `}
        </div>
      </div>
    </nav>`;
  const ph = document.getElementById('nav-placeholder');
  if (ph) ph.outerHTML = html; else document.body.insertAdjacentHTML('afterbegin', html);
  const t=document.getElementById('navToggle'), l=document.getElementById('navLinks');
  if(t&&l) t.addEventListener('click',()=>l.classList.toggle('open'));
};

// ==================== Toast ====================
App.toast = (msg, type='info') => {
  let c = document.querySelector('.toast-container');
  if (!c) { c=document.createElement('div'); c.className='toast-container'; document.body.appendChild(c); }
  const t=document.createElement('div'); t.className=`toast toast-${type}`; t.textContent=msg; c.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity 0.3s'; setTimeout(()=>t.remove(),300); },3000);
};

// ==================== 格式化 ====================
App.fmt = (s) => { if(!s)return''; const d=new Date(s),p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; };
App.ago = (s) => { if(!s)return''; const m=Math.floor((Date.now()-new Date(s).getTime())/60000); if(m<1)return'刚刚'; if(m<60)return m+'分钟前'; const h=Math.floor(m/60); if(h<24)return h+'小时前'; return Math.floor(h/30)<1?Math.floor(h)+'天前':App.fmt(s); };

// ==================== 初始化 ====================
App.init = (page) => { App.currentPage=page; App.renderNav(); };
