/* ============================================================
   CampusPool — 客户端数据层 (localStorage + 演示数据)
   ============================================================ */

const Store = window.Store = {};

// --- 内置高校列表 ---
Store.SCHOOLS = [
  '北京大学','清华大学','中国人民大学','北京航空航天大学','北京理工大学',
  '北京邮电大学','北京师范大学','中国农业大学','复旦大学','上海交通大学',
  '同济大学','华东师范大学','南京大学','东南大学','浙江大学','中国科学技术大学',
  '武汉大学','华中科技大学','中山大学','华南理工大学','四川大学','电子科技大学',
  '西安交通大学','西北工业大学','哈尔滨工业大学','吉林大学','山东大学','厦门大学',
  '南开大学','天津大学','中南大学','湖南大学','重庆大学','大连理工大学','兰州大学',
  '其他院校'
];

// --- 内置演示数据 ---
Store.DEMO_USERS = [
  { id:1, username:'xiaoming', password:'123456', nickname:'小明', avatar:'', school:'清华大学', student_id:'2021001001', real_name:'张明', phone:'13800001001', is_verified:true, created_at:'2026-06-01T08:00:00.000Z' },
  { id:2, username:'xiaohong', password:'123456', nickname:'小红', avatar:'', school:'北京大学', student_id:'2021002001', real_name:'李红', phone:'13800001002', is_verified:true, created_at:'2026-06-02T08:00:00.000Z' },
  { id:3, username:'david', password:'123456', nickname:'David', avatar:'', school:'浙江大学', student_id:'2021003001', real_name:'王伟', phone:'13800001003', is_verified:true, created_at:'2026-06-03T08:00:00.000Z' }
];

Store.DEMO_TRIPS = [
  { id:1, user_id:1, departure:'清华大学', destination:'北京南站', depart_time:'2026-06-15 14:00', seats:3, seats_remaining:2, note:'有行李箱，顺路的同学一起~', trip_type:'offer', status:'active', created_at:'2026-06-10T08:00:00.000Z' },
  { id:2, user_id:2, departure:'北京大学', destination:'首都国际机场', depart_time:'2026-06-15 16:30', seats:2, seats_remaining:1, note:'去机场接人，可带1人', trip_type:'offer', status:'active', created_at:'2026-06-11T08:00:00.000Z' },
  { id:3, user_id:3, departure:'浙江大学（紫金港）', destination:'杭州东站', depart_time:'2026-06-16 09:00', seats:4, seats_remaining:3, note:'周末回家，顺路带人，车费AA', trip_type:'offer', status:'active', created_at:'2026-06-12T08:00:00.000Z' },
  { id:4, user_id:1, departure:'北京南站', destination:'清华大学', depart_time:'2026-06-16 18:00', seats:2, seats_remaining:2, note:'从南站回学校，有人一起吗', trip_type:'seek', status:'active', created_at:'2026-06-12T10:00:00.000Z' },
  { id:5, user_id:2, departure:'首都国际机场', destination:'北京大学', depart_time:'2026-06-15 20:00', seats:1, seats_remaining:1, note:'晚上航班到达，求拼车回学校', trip_type:'seek', status:'active', created_at:'2026-06-13T08:00:00.000Z' }
];

Store.DEMO_TIPS = [
  { id:1, title:'出行前确认身份', content:'拼车前请确认对方的学生身份，可要求查看学生证或校园卡。建议通过学校官方渠道验证对方身份。', category:'identity' },
  { id:2, title:'选择公共场所集合', content:'建议在校门口、教学楼、图书馆等人流量大的公共场所集合上车，避免在偏僻地点等候。', category:'location' },
  { id:3, title:'分享行程给朋友', content:'出发前将拼车信息（车牌号、出发地、目的地、预计到达时间）分享给室友或好友，保持通讯畅通。', category:'share' },
  { id:4, title:'保持手机畅通', content:'出行期间确保手机电量充足，保持与家人朋友的联系。如遇紧急情况，第一时间拨打110报警。', category:'emergency' },
  { id:5, title:'结伴出行更安全', content:'尽量与熟悉的同学一起拼车，避免单独与陌生人同行。如条件允许，优先选择同性拼车。', category:'companion' },
  { id:6, title:'注意车辆信息', content:'上车前核对车辆品牌、颜色、车牌号是否与发布信息一致，拍照留存车辆信息。', category:'vehicle' },
  { id:7, title:'拒绝不合理要求', content:'如对方提出绕路、加价、改变目的地等不合理要求，应果断拒绝并终止拼车。', category:'refuse' },
  { id:8, title:'使用正规平台', content:'建议通过学校官方渠道或信誉良好的平台发布和获取拼车信息，避免使用不明来源的拼车群。', category:'platform' }
];

// --- localStorage 读写 ---
Store._key = 'carpool_data';

Store._load = function() {
  try {
    const raw = localStorage.getItem(this._key);
    return raw ? JSON.parse(raw) : null;
  } catch(e) { return null; }
};

Store._save = function(data) {
  localStorage.setItem(this._key, JSON.stringify(data));
};

// 初始化（首次访问时写入演示数据）
Store._init = function() {
  let data = this._load();
  if (!data) {
    data = {
      users: JSON.parse(JSON.stringify(this.DEMO_USERS)),
      trips: JSON.parse(JSON.stringify(this.DEMO_TRIPS)),
      messages: [],
      participants: [],
      _nextId: { users:3, trips:5, messages:0, participants:0 }
    };
    this._save(data);
  }
  // 确保有 _nextId 字段
  if (!data._nextId) {
    data._nextId = {
      users: data.users.length,
      trips: data.trips.length,
      messages: (data.messages||[]).length,
      participants: (data.participants||[]).length
    };
    this._save(data);
  }
  if (!data.messages) { data.messages = []; this._save(data); }
  if (!data.participants) { data.participants = []; this._save(data); }
  return data;
};

// 获取数据
Store.get = function() { return this._init(); };

// 通用 CRUD
Store._nextId = function(table) {
  const data = this.get();
  const key = { users:'users', trips:'trips', messages:'messages', participants:'participants' }[table];
  return ++data._nextId[key];
};

Store.add = function(table, record) {
  const data = this.get();
  const id = this._nextId(table);
  const r = { ...record, id, created_at: new Date().toISOString() };
  data[table].push(r);
  this._save(data);
  return r;
};

Store.update = function(table, id, updates) {
  const data = this.get();
  const idx = data[table].findIndex(r => r.id === id);
  if (idx === -1) return null;
  data[table][idx] = { ...data[table][idx], ...updates };
  this._save(data);
  return data[table][idx];
};

Store.remove = function(table, id) {
  const data = this.get();
  const idx = data[table].findIndex(r => r.id === id);
  if (idx === -1) return false;
  data[table].splice(idx, 1);
  this._save(data);
  return true;
};

// ==================== 用户 ====================
Store.register = function({ username, password, nickname, school, real_name, student_id }) {
  const data = this.get();
  if (data.users.find(u => u.username === username)) return { error: '用户名已被注册' };
  if (data.users.find(u => u.student_id === student_id && u.school === school)) return { error: '该学校已存在相同学号' };

  const user = this.add('users', {
    username, password, nickname, avatar:'', school,
    student_id, real_name, phone:'', is_verified: !!real_name
  });
  const { password: _, ...safe } = user;
  return { user: safe };
};

Store.login = function(username, password) {
  const data = this.get();
  const user = data.users.find(u => u.username === username && u.password === password);
  if (!user) return { error: '用户名或密码错误' };
  const { password: _, ...safe } = user;
  return { user: safe };
};

Store.getUser = function(id) {
  const data = this.get();
  const user = data.users.find(u => u.id === id);
  if (!user) return null;
  const { password: _, ...safe } = user;
  return safe;
};

Store.updateProfile = function(userId, updates) {
  const data = this.get();
  const user = data.users.find(u => u.id === userId);
  if (!user) return null;
  Object.assign(user, updates);
  if (updates.student_id && updates.real_name) user.is_verified = true;
  this._save(data);
  const { password: _, ...safe } = user;
  return safe;
};

// ==================== 行程 ====================
Store.getTrips = function(filters = {}) {
  const data = this.get();
  let trips = data.trips.filter(t => t.status === 'active');

  if (filters.type && ['offer','seek'].includes(filters.type)) trips = trips.filter(t => t.trip_type === filters.type);
  if (filters.departure) trips = trips.filter(t => t.departure.includes(filters.departure));
  if (filters.destination) trips = trips.filter(t => t.destination.includes(filters.destination));
  if (filters.date) trips = trips.filter(t => t.depart_time.startsWith(filters.date));

  trips = trips.map(t => {
    const u = this.getUser(t.user_id);
    return { ...t, nickname: u?.nickname||'未知', school: u?.school||'', avatar: u?.avatar||'', msg_count: data.messages.filter(m => m.trip_id === t.id).length };
  });

  switch(filters.sort) {
    case 'earliest': trips.sort((a,b) => a.depart_time.localeCompare(b.depart_time)); break;
    case 'latest': trips.sort((a,b) => b.depart_time.localeCompare(a.depart_time)); break;
    case 'seats': trips.sort((a,b) => b.seats_remaining - a.seats_remaining); break;
    default: trips.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  }

  const page = filters.page || 1, limit = filters.limit || 20;
  const total = trips.length;
  return { trips: trips.slice((page-1)*limit, page*limit), total, page, totalPages: Math.ceil(total/limit) };
};

Store.getTrip = function(id) {
  const data = this.get();
  const trip = data.trips.find(t => t.id === id);
  if (!trip) return null;

  const author = this.getUser(trip.user_id);
  const participants = data.participants.filter(p => p.trip_id === id).map(p => {
    const u = this.getUser(p.user_id);
    return { ...p, nickname: u?.nickname||'未知', school: u?.school||'' };
  });
  const messages = data.messages.filter(m => m.trip_id === id)
    .sort((a,b) => new Date(a.created_at)-new Date(b.created_at))
    .map(m => {
      const u = this.getUser(m.sender_id);
      return { ...m, sender_name: u?.nickname||'未知' };
    });

  return { trip: { ...trip, nickname: author?.nickname||'未知', school: author?.school||'' }, participants, messages };
};

Store.createTrip = function(userId, tripData) {
  return this.add('trips', { user_id: userId, ...tripData, seats_remaining: tripData.seats, status:'active' });
};

Store.updateTrip = function(id, userId, updates) {
  const data = this.get();
  const trip = data.trips.find(t => t.id === id);
  if (!trip || trip.user_id !== userId) return null;
  return this.update('trips', id, updates);
};

Store.deleteTrip = function(id, userId) {
  const data = this.get();
  const trip = data.trips.find(t => t.id === id);
  if (!trip || trip.user_id !== userId) return false;
  data.messages = data.messages.filter(m => m.trip_id !== id);
  data.participants = data.participants.filter(p => p.trip_id !== id);
  this.remove('trips', id);
  this._save(data);
  return true;
};

// ==================== 参与者 ====================
Store.joinTrip = function(userId, tripId) {
  const data = this.get();
  const trip = data.trips.find(t => t.id === tripId);
  if (!trip) return { error: '行程不存在' };
  if (trip.user_id === userId) return { error: '不能加入自己发布的行程' };
  if (trip.status !== 'active') return { error: '行程已结束' };
  if (trip.seats_remaining <= 0) return { error: '已满员' };
  if (data.participants.find(p => p.trip_id === tripId && p.user_id === userId)) return { error: '您已申请加入' };
  this.add('participants', { trip_id: tripId, user_id: userId, status:'pending' });
  return { success: true };
};

Store.handleParticipant = function(tripId, participantId, userId, status) {
  const data = this.get();
  const trip = data.trips.find(t => t.id === tripId);
  if (!trip || trip.user_id !== userId) return { error: '无权操作' };

  const p = data.participants.find(p => p.id === participantId && p.trip_id === tripId);
  if (!p) return { error: '申请不存在' };

  p.status = status;
  if (status === 'accepted') {
    trip.seats_remaining = Math.max(0, trip.seats_remaining - 1);
    if (trip.seats_remaining <= 0) trip.status = 'full';
  }
  this._save(data);
  return { success: true };
};

// ==================== 消息 ====================
Store.sendMessage = function(userId, tripId, content) {
  const data = this.get();
  const trip = data.trips.find(t => t.id === tripId);
  if (!trip) return { error: '行程不存在' };
  const msg = this.add('messages', { trip_id: tripId, sender_id: userId, receiver_id: trip.user_id, content, msg_type:'chat' });
  const sender = this.getUser(userId);
  return { message: { ...msg, sender_name: sender?.nickname||'未知' } };
};

// ==================== 用户行程 ====================
Store.getUserTrips = function(userId) {
  const data = this.get();
  const myTrips = data.trips.filter(t => t.user_id === userId).sort((a,b) => new Date(b.created_at)-new Date(a.created_at)).map(t => ({
    ...t, msg_count: data.messages.filter(m => m.trip_id===t.id).length,
    pending_count: data.participants.filter(p => p.trip_id===t.id && p.status==='pending').length
  }));

  const joinedTrips = data.participants.filter(p => p.user_id === userId).sort((a,b) => new Date(b.created_at)-new Date(a.created_at)).map(p => {
    const t = data.trips.find(t => t.id === p.trip_id);
    if (!t) return null;
    const u = this.getUser(t.user_id);
    return { ...t, nickname: u?.nickname||'', school: u?.school||'', join_status: p.status };
  }).filter(Boolean);

  return { myTrips, joinedTrips };
};

// ==================== 统计 ====================
Store.getStats = function() {
  const data = this.get();
  const today = new Date().toISOString().slice(0,10);
  return {
    totalTrips: data.trips.filter(t => t.status==='active').length,
    totalUsers: data.users.length,
    todayTrips: data.trips.filter(t => t.status==='active' && t.depart_time.startsWith(today)).length
  };
};

// ==================== 安全提示 ====================
Store.getSafetyTips = function() {
  const data = this.get();
  return data._hasCustomTips ? data._customTips || this.DEMO_TIPS : this.DEMO_TIPS;
};

// 初始化
Store._init();
