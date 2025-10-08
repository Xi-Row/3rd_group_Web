/* script.js
   互动小游戏：建设之路：十大关系闯关记
   说明：将关卡数据内置，提供本地存档（localStorage）与结局判定。
*/

/* ---------- 数据：10 关（取自设计内容） ---------- */
const LEVELS = [
  {
    id: 1,
    title: "重工轻农的平衡难题",
    theme: "重工业和轻工业、农业的关系",
    scene: "东北重工业基地",
    story: '钢厂厂长反映“工人粮食供应紧张，部分车间因原料短缺停工”，农业部门汇报“农村粮食产量不足，农民种粮积极性待提高”。',
    choices: [
      { id: 'a', text: 'A: 优先调拨粮食给钢厂保生产', correct: false, outcome: '农民种粮积极性下降，下季度原料更短缺。需要补充“农业是工业基础”的观点。' },
      { id: 'b', text: 'B: 加大农业投入、保障农民口粮', correct: true, outcome: '农业丰收→原料充足→钢厂增产。达到平衡发展的期望。' }
    ],
    quiz: [
      { q: '处理重工业和轻工业、农业的关系时，核心原则是？',
        opts: ['只优先发展重工业', '优先发展重工业但不能忽视农业与轻工业，需调整投资比例', '完全放弃重工业'],
        ans: 1
      }
    ],
    reward: '农工协调者',
    point: '优先发展重工业，但不能忽视农业与轻工业，农业是工业的物质基础。'
  },
  {
    id: 2,
    title: "沿海与内地的布局之争",
    theme: "沿海工业和内地工业的关系",
    scene: "上海纺织厂与四川新厂",
    story: '沿海老厂设备老化但技术集中，内地新厂缺乏技术人员，如何平衡布局与人员调配？',
    choices: [
      { id: 'a', text: 'A: 停止沿海扩建，把设备全搬到内地', correct: false, outcome: '沿海技术流失→内地因缺乏配套无法开工，需学习“利用沿海支持内地”的观点。' },
      { id: 'b', text: 'B: 保留沿海并扩建，同时抽调技术人员支援内地', correct: true, outcome: '沿海产能提升→内地技术进步，双赢。' }
    ],
    quiz: [
      { q: '建国初期工业布局特点是什么？',
        opts: ['70%在沿海，30%在内地，需要平衡布局','全部在内地','全部在沿海'],
        ans: 0 }
    ],
    reward: '布局规划师',
    point: '利用沿海老底子支持内地，逐步平衡工业布局。'
  },
  {
    id: 3,
    title: "大炮与机床的取舍",
    theme: "经济建设和国防建设的关系",
    scene: "中央国防会议",
    story: '军方要求增加军费研发武器，经济部门担心影响工厂建设。',
    choices: [
      { id: 'a', text: 'A: 优先增加军费', correct: false, outcome: '工业发展滞后→国防缺乏经济支撑。' },
      { id: 'b', text: 'B: 降低军政费用、加大经济投入', correct: true, outcome: '经济发展→为国防提供更可靠的物质基础。' }
    ],
    quiz: [
      { q: '若预算总额为 X，军政费用从30%降到20%，可多投入多少到工厂建设？',
        opts: ['0.1X','0.5X','0.01X'],
        ans: 0 }
    ],
    reward: '战略平衡家',
    point: '经济是国防的基础，合理调整军政费用比例。'
  },
  {
    id: 4,
    title: "工厂与工人的利益平衡",
    theme: "国家、生产单位和生产者个人的关系",
    scene: "国营机械厂",
    story: '劳动生产率提高但工资未涨，工人福利不足；厂方担心利润上缴减少影响国家投资。',
    choices: [
      { id: 'a', text: 'A: 全额上缴利润，暂不涨工资', correct: false, outcome: '工人积极性下降→生产率反而降低。' },
      { id: 'b', text: 'B: 适当降低上缴比例，涨工资改善福利', correct: true, outcome: '工人积极性提高→生产率提升→总利润增加。' }
    ],
    quiz: [
      { q: '苏联处理国家与农民关系时的错误做法是？',
        opts: ['义务交售制，拿走农民过多产品','给予大量补贴','放任自流'],
        ans: 0 }
    ],
    reward: '利益协调者',
    point: '兼顾国家、集体与个人利益，保障劳动者积极性。'
  },
  {
    id: 5,
    title: "中央与地方的权力分配",
    theme: "中央和地方的关系",
    scene: "中央部门与广东代表",
    story: '地方希望发展特色农业但受制于中央指令，中央担心全国统一受到影响。',
    choices: [
      { id: 'a', text: 'A: 中央统一管控所有事项，地方无自主权', correct: false, outcome: '地方积极性低→特色农业停滞。' },
      { id: 'b', text: 'B: 中央统一规划，地方自主负责特色产业', correct: true, outcome: '地方发展特色→全国经济多样化。' }
    ],
    quiz: [
      { q: '处理中央和地方关系的原则是？',
        opts: ['巩固中央统一领导，扩大地方权力，发挥两个积极性','中央包办一切','地方独立无中央监督'],
        ans: 0 }
    ],
    reward: '权责规划师',
    point: '巩固中央统一领导，同时给地方发挥积极性的空间。'
  },
  {
    id: 6,
    title: "汉族与少数民族的互助",
    theme: "汉族和少数民族的关系",
    scene: "新疆牧区",
    story: '牧区缺乏医疗教育资源，少数民族希望技术帮扶但担心文化冲突。',
    choices: [
      { id: 'a', text: 'A: 只派技术人员，不关注文化沟通', correct: false, outcome: '文化差异导致帮扶效果差。' },
      { id: 'b', text: 'B: 派技术+医疗+教育团队，并开展民族文化交流', correct: true, outcome: '畜牧业增产、群众生活改善。' }
    ],
    quiz: [
      { q: '少数民族特点是？',
        opts: ['人数少、占地广、资源丰富，对历史有贡献','人数多、占地小','完全同质化'],
        ans: 0 }
    ],
    reward: '民族团结使者',
    point: '尊重民族文化，开展帮扶并进行文化交流。'
  },
  {
    id: 7,
    title: "党与非党的协商",
    theme: "党和非党的关系",
    scene: "全国政协座谈会",
    story: '民主党派希望更多参与政策讨论，部分党员担心影响党的领导。',
    choices: [
      { id: 'a', text: 'A: 限制民主党派意见，坚持党单独决策', correct: false, outcome: '民主党派积极性下降→政策缺乏多元参考。' },
      { id: 'b', text: 'B: 建立定期座谈会，认真听取民主党派意见', correct: true, outcome: '政策更贴合实际→企业发展提速。' }
    ],
    quiz: [
      { q: '中共与民主党派的关系方针是？',
        opts: ['长期共存、互相监督','互相对立','完全合并'],
        ans: 0 }
    ],
    reward: '协商民主推动者',
    point: '长期共存、互相监督，吸纳合理建议。'
  },
  {
    id: 8,
    title: "反革命的改造之路",
    theme: "革命和反革命的关系",
    scene: "改造基地",
    story: '部分反革命分子有悔改意愿，地方担心释放后再犯。',
    choices: [
      { id: 'a', text: 'A: 全部长期关押，不给予释放机会', correct: false, outcome: '改造积极性低，资源浪费。' },
      { id: 'b', text: 'B: 对悔改者劳动改造并安排就业', correct: true, outcome: '被改造者重返社会，成为守法公民。' }
    ],
    quiz: [
      { q: '我国对反革命分子的处理办法包括？',
        opts: ['杀、关、管、放（以改造为主）','只有严厉惩罚','不管不问'],
        ans: 0 }
    ],
    reward: '改造引导者',
    point: '以劳动改造和安置为主，给悔改者生活出路。'
  },
  {
    id: 9,
    title: "党内错误的纠正",
    theme: "是非关系",
    scene: "省委会议",
    story: '干部照搬苏联经验导致农业减产，有人主张严厉处分，有人主张帮助改正。',
    choices: [
      { id: 'a', text: 'A: 严厉处分，撤销职务', correct: false, outcome: '其他干部不敢创新，政策保守。' },
      { id: 'b', text: 'B: 帮助分析错误原因并指导其改正', correct: true, outcome: '干部改正错误→农业恢复增产。' }
    ],
    quiz: [
      { q: '对犯错误的同志，正确方针是？',
        opts: ['惩前毖后、治病救人','彻底开除','不做处理'],
        ans: 0 }
    ],
    reward: '纠错指导员',
    point: '惩前毖后、治病救人，帮助其改正错误。'
  },
  {
    id: 10,
    title: "向外国学习的取舍",
    theme: "中国和外国的关系",
    scene: "科研机构讨论",
    story: '研究员争论向外国学习的范围，应如何有选择、有批判地学习？',
    choices: [
      { id: 'a', text: 'A: 全盘学习苏联经验', correct: false, outcome: '照搬制度水土不服→科研效率下降。' },
      { id: 'b', text: 'B: 学先进技术与合理管理，拒绝不良制度和作风', correct: true, outcome: '科研水平提升→自主创新增强。' }
    ],
    quiz: [
      { q: '毛泽东向外国学习的原则是什么？',
        opts: ['有分析有批判地学，取长补短','全部照搬','拒绝一切外国经验'],
        ans: 0 }
    ],
    reward: '学习创新者',
    point: '有分析、有批判地学，取其长处，摒弃短处。'
  }
];

/* ---------- 状态 ---------- */
/* ---------- 状态 ---------- */
const TOTAL = LEVELS.length;
let state = {
  levelIndex: 0,
  score: 0,
  correctCount: 0,     // 每关是否选择正确计数
  titles: [],          // 已获得称号数组
  quizCorrectCount: 0, // 用于统计问答完全正确次数
};
// 新增：声明全局定时器变量（用于控制弹窗消失）
let badgeTimer = null; // 控制称号/得分弹窗的定时器
let backdropTimer = null; // 控制背景遮罩的定时器（已声明，无需重复）
/* ---------- DOM ---------- */
const el = {
  curLevel: document.getElementById('curLevel'),
  totalLevel: document.getElementById('totalLevel'),
  score: document.getElementById('score'),
  levelTitle: document.getElementById('levelTitle'),
  levelTheme: document.getElementById('levelTheme'),
  sceneStory: document.getElementById('sceneStory'),
  choiceList: document.getElementById('choiceList'),
  pointText: document.getElementById('pointText'),
  titlesList: document.getElementById('titlesList'),
  showEnding: document.getElementById('showEnding'),
  resetBtn: document.getElementById('resetBtn'),
  quizCard: document.getElementById('quizCard'),
  sceneCard: document.getElementById('sceneCard'),
  quizForm: document.getElementById('quizForm'),
  quizBack: document.getElementById('quizBack'),
  quizSubmit: document.getElementById('quizSubmit'),
  interCard: document.getElementById('interCard'),
  interText: document.getElementById('interText'),
  badgeToast: document.getElementById('badgeToast'),
  endingModal: document.getElementById('endingModal'),
  endingTitle: document.getElementById('endingTitle'),
  endingDesc: document.getElementById('endingDesc'),
  endingClose: document.getElementById('endingClose'),
  endingReset: document.getElementById('endingReset'),
  toastBackdrop: document.getElementById('toastBackdrop'), // 新增背景遮罩引用
  decision: document.getElementById('decision') // 新增背景遮罩引用

};

/* ---------- 存档 ---------- */
const SAVE_KEY = 'ten_relations_game_v1';
function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}
function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      Object.assign(state, s);
    }
  } catch (e) { console.warn('load failed', e); }
}
function resetAll() {
  if (!confirm('确定重置所有进度？')) return;
  localStorage.removeItem(SAVE_KEY);
  state = { levelIndex:0, score:0, correctCount:0, titles:[], quizCorrectCount:0 };
  render();
}

/* ---------- 渲染 ---------- */
let ch = null;
function render() {
  // 保存当前关卡索引，避免重复获取
  const currentIndex = state.levelIndex;
  // 确保索引在有效范围内
  const safeIndex = Math.min(currentIndex, TOTAL - 1);
  const lv = LEVELS[safeIndex];
  
  // 基础信息更新
  el.curLevel.textContent = currentIndex + 1;
  el.totalLevel.textContent = TOTAL;
  el.score.textContent = state.score;
  
  // 称号列表渲染（优化空状态显示）
  el.titlesList.innerHTML = state.titles.length > 0 
    ? state.titles.map(t => `<li>${t}</li>`).join('') 
    : '<li class="muted">尚未获得称号</li>';

  // 区分"已完成所有关卡"和"未完成"状态
  if (currentIndex >= TOTAL - 1) {
    // 所有关卡完成状态
    el.decision.classList.add('hidden');

    el.levelTheme.textContent = '🎉 恭喜你完成全部关卡！';
    el.sceneStory.textContent = '你已成功通过全部十大关系闯关，现在可以查看你的结局。';
    el.pointText.textContent = '所有要点已解锁，恭喜达成全部学习目标！';
    el.choiceList.innerHTML = ''; // 清空选项
    
    // 解锁结局按钮
    el.showEnding.classList.remove('hidden');
    el.showEnding.disabled = false;
    el.showEnding.classList.add('highlight');
  } else {
    // 正常关卡状态
    el.levelTheme.textContent = lv.theme;
    el.sceneStory.textContent = lv.story;
    el.pointText.textContent = lv.point;
    el.decision.classList.remove('hidden');
    el.showEnding.classList.add('hidden');
    
    // 渲染选项列表（优化创建逻辑）
    el.choiceList.innerHTML = '';
    lv.choices.forEach((choice, index) => {
      const btn = document.createElement('div');
      btn.className = 'choice';
      btn.tabIndex = index; // 更合理的tab索引
      btn.innerHTML = `
        <div class="left">
          <div class="title">${choice.text}</div>
          ${choice.desc ? `<div class="desc">${choice.desc}</div>` : ''}
        </div>
      `;
      
      // 点击事件（使用箭头函数确保this指向正确）
      btn.addEventListener('click', () => onChoose(choice));
      // 键盘事件（支持Enter和空格选择）
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // 阻止空格的默认滚动行为
          onChoose(choice);
        }
      });
      
      el.choiceList.appendChild(btn);
    });
    
    // 锁定结局按钮
    el.showEnding.disabled = true;
    el.showEnding.classList.remove('highlight');
  }

  // 卡片显示状态控制（统一处理，避免重复代码）
  el.quizCard.classList.add('hidden');
  el.sceneCard.classList.remove('hidden');
  el.interCard.classList.add('hidden');

  // 保存状态（移至最后，确保所有渲染完成后再保存）
  save();
}


let currentOutcome = ''
/* ---------- 交互：选择 ---------- */
function onChoose(choice) {
    ch = choice;
  // 播放反馈：展示 outcome，然后切入 quiz
  el.sceneCard.classList.add('hidden');
  el.interCard.classList.remove('hidden');
  // el.interText.textContent = choice.outcome;
  currentOutcome = choice.outcome;
  // 如果选择正确，加分、称号
   if (choice.correct) {
    state.score += 10;
    state.correctCount += 1;
    const reward = LEVELS[state.levelIndex].reward;
    if (reward && !state.titles.includes(reward)) {
      state.titles.push(reward);
      // 称号弹窗：不传递第二个参数，保持原有底部样式
      showBadge(`获得称号：${reward}`); 
    }
  } else {
    // 选择错误给提示分（或不加分）
    state.score += 0;
  }
  save();
    // 进入问答
  showQuiz();

}

/* ---------- 问答 ---------- */
let currentQuizAnswers = {};

function showQuiz() {
  const lv = LEVELS[state.levelIndex];
  el.interCard.classList.add('hidden');
  el.quizCard.classList.remove('hidden');
  el.sceneCard.classList.add('hidden');
  const quizOutcome = document.getElementById('quizOutcome');
  quizOutcome.textContent = `${currentOutcome}`; // 显示选择结果
  // build quiz form
  el.quizForm.innerHTML = '';
  currentQuizAnswers = {};
  lv.quiz.forEach((q, idx) => {
    const block = document.createElement('div');
    block.className = 'quiz-item';
    const qHtml = document.createElement('div');
    qHtml.className = 'q';
    qHtml.textContent = `${idx + 1}. ${q.q}`;
    block.appendChild(qHtml);

    q.opts.forEach((opt, optIdx) => {
      const id = `q-${idx}-opt-${optIdx}`;
      const label = document.createElement('label');
      label.style.display = 'block';
      label.style.marginTop = '8px';
      label.innerHTML = `
        <input type="radio" name="q-${idx}" value="${optIdx}" id="${id}" />
        <span style="margin-left:8px">${opt}</span>
      `;
      block.appendChild(label);
      label.querySelector('input').addEventListener('change', () => {
        currentQuizAnswers[idx] = optIdx;
      });
    });

    el.quizForm.appendChild(block);
  });

  // scroll to top of quiz
  el.quizCard.scrollIntoView({behavior:'smooth', block:'center'});
}

el.quizBack.addEventListener('click', () => {
  el.quizCard.classList.add('hidden');
  el.sceneCard.classList.remove('hidden');
});

el.quizSubmit.addEventListener('click', (ev) => {
  ev.preventDefault();
  gradeQuiz();
});

function showBadge(text, isScoreToast = false) {
  const toast = el.badgeToast;
  const backdrop = el.toastBackdrop;
  
  // 1. 重置弹窗样式（避免样式残留）
  toast.className = 'toast hidden'; // 清空原有类名，恢复默认
  backdrop.classList.remove('active'); // 隐藏背景遮罩
  
  // 2. 区分弹窗内容和样式
  if (isScoreToast) {
    // 得分弹窗：居中样式 + 复杂HTML结构
    toast.classList.add('score-toast'); // 添加得分弹窗专属类
    toast.innerHTML = `
      <div class="toast-title">得分提示</div>
      <div class="toast-detail">${text}</div>
    `;
    backdrop.classList.add('active'); // 显示背景遮罩
  } else {
    // 称号弹窗：保留原有底部样式 + 纯文本内容
    toast.textContent = text; // 不使用innerHTML，避免样式冲突
    // 不添加 score-toast 类，保持原有底部定位
  }
  
  // 3. 显示弹窗
  toast.classList.remove('hidden');
  
  // 4. 清除旧定时器，避免多个弹窗叠加
  clearTimeout(badgeTimer);
  clearTimeout(backdropTimer);
  
  // 5. 定时隐藏弹窗
  badgeTimer = setTimeout(() => {
    toast.classList.add('hidden');
    // 得分弹窗需延迟隐藏背景遮罩，称号弹窗无需遮罩
    if (isScoreToast) {
      backdropTimer = setTimeout(() => {
        backdrop.classList.remove('active');
      }, 300);
    }
  }, 100);
}
// 修改gradeQuiz函数中的得分弹窗调用
function gradeQuiz() {
  const lv = LEVELS[state.levelIndex];
  let correctCountLocal = 0;
  lv.quiz.forEach((q, idx) => {
    if (currentQuizAnswers[idx] === q.ans) correctCountLocal++;
  });

  const gained = correctCountLocal * 5;
  let totalLevelScore = gained;
  state.score += gained;
  const isPerfect = correctCountLocal === lv.quiz.length;
  if (isPerfect) {
    state.quizCorrectCount++;
  }
  save();

  // ✅ 居中弹窗显示得分
  showBadge(`
    决策得分：<strong>${ch.correct ? '10' : '0'}</strong> 分<br>
    ${isPerfect ? '🎉 答对奖励：+ 5 分' : '答错不得分！'}
  `, true);

  // ✅ 延迟执行下一步
setTimeout(() => {
  // 最后一关的特殊处理
  if (state.levelIndex >= TOTAL - 1) {
    state.levelIndex = TOTAL - 1; // 保持在最后一关
    // ✅ 再手动修改 DOM（这一步 render 不会覆盖）
    render(); // ✅ 先渲染一次界面
    el.sceneCard.classList.remove('hidden');
    el.interCard.classList.add('hidden');
    el.quizCard.classList.add('hidden');
    el.decision.classList.add('hidden');
    el.levelTitle.textContent = '🎉 恭喜你完成全部关卡！';
    el.sceneStory.textContent = '你已成功通过全部十大关系闯关，现在可以查看你的结局。';
    el.choiceList.innerHTML = '';

    // ✅ 解锁结局按钮
    if (el.showEnding) {
      el.showEnding.classList.remove('hidden');
      el.showEnding.disabled = false;
      el.showEnding.classList.add('highlight');
    }
    return;
  }

  // 否则进入下一关
  state.levelIndex++;
  render();
}, 100);
}


/* ---------- 结局判定 ---------- */
function getEnding() {
  // 条件：
  // 完美：所有关卡选择正确（state.correctCount === TOTAL）且问答正确率高（按 quizCorrectCount）
  // 普通：错误 3-5，问答率>=60%
  // 探索：错误 >=6 或 低答题率
  const chosenCorrect = state.correctCount;
  const wrong = TOTAL - chosenCorrect;
  // 简单计算问答正确率（按每关是否全答对计）
  const quizRate = Math.round((state.quizCorrectCount / TOTAL) * 100);

  if (chosenCorrect === TOTAL && quizRate >= 90) {
    return { title: '完美结局', desc: '你被评为“优秀政策研究员”，获得“建设先锋”勋章。中央采纳你的十大关系方案。' };
  }
  if (wrong <= 5 && quizRate >= 60) {
    return { title: '普通结局', desc: '你在部分关卡中决策有偏差但总体表现合格，获得“合格研究员”称号。' };
  }
  else{
  return { title: '探索结局', desc: '多次决策失误或答题率低，建议重新学习《论十大关系》核心内容并重闯。' };
  }
}

function showEndingDialog() {
  const res = getEnding();
  el.endingTitle.textContent = res.title;
  el.endingDesc.textContent = res.desc;
  el.endingModal.classList.remove('hidden');
}

/* ---------- 事件绑定 ---------- */
el.resetBtn.addEventListener('click', resetAll);
el.showEnding.addEventListener('click', showEndingDialog);
document.getElementById('endingClose').addEventListener('click', () => {
  el.endingModal.classList.add('hidden');
});
document.getElementById('endingReset').addEventListener('click', () => {
  el.endingModal.classList.add('hidden');
  resetAll();
});

/* ---------- 初始化 ---------- */
function init() {
  load();
  // If saved state says completed, keep index at TOTAL to show finish
  if (state.levelIndex >= TOTAL) state.levelIndex = TOTAL;
  render();
}
init();
