const projects = {
  cmb: {
    title: "招商银行比赛：客户行为预测与主账户经营",
    desc: "基于脱敏客户行为序列构建候选召回与 LightGBM 排序模型，以 NDCG@20 优化下一日 Top20 行为预测，线上得分 0.604；进一步将预测结果转化为财富、借贷、支付三维主账户经营策略，形成从需求识别、客群分层到产品推荐与客户经理承接的完整闭环。",
    goals: [],
    strategyLabel: "方案亮点",
    techLabel: "方案关键词",
    visuals: [
      {
        type: "metrics",
        label: "建模结果",
        items: [
          { value: "0.604", label: "线上 NDCG@20" },
          { value: "632万+", label: "训练行为记录" },
          { value: "7.79万", label: "测试用户" },
          { value: "Top20", label: "推荐输出" }
        ]
      },
      {
        type: "pipeline",
        label: "经营逻辑",
        steps: [
          { title: "主账户诊断", detail: "围绕财富、借贷、支付识别当前关系强弱与提升空间" },
          { title: "需求解释", detail: "把银行侧经营策略转译成客户能理解的需求分析" },
          { title: "服务推荐", detail: "按预测模型优先级输出服务，并默认展示第一优先级" },
          { title: "行动闭环", detail: "通过积分、客户经理承接和产品路径完成转化" }
        ]
      },
      {
        type: "info",
        label: "交付重点",
        items: [
          { title: "首页入口", detail: "招行首页、小招 AI、生活页、我的页、积分页均可进入。" },
          { title: "隐私保护", detail: "总资产、涨跌金额、资产比例、业务数量默认隐藏，点击后再显示。" },
          { title: "推荐机制", detail: "按预测模型输出的财富/借贷/支付概率排序，避免硬推单一产品。" }
        ]
      }
    ],
    links: [],
    strategies: [
      { title: "序列预测", detail: "融合全局热门、用户历史、行为转移与同细类扩展完成候选召回，再用 LightGBM 学习排序。" },
      { title: "三维主账户", detail: "围绕财富、借贷、支付拆解客户关系，而不是只做单一营销入口。" },
      { title: "客户陪伴型文案", detail: "采用有温度、有尊敬感的表达，先讲需求，再讲服务建议。" },
      { title: "模型排序", detail: "让系统按主账户概率优先展示内容，降低打扰感，提高推荐命中率。" },
      { title: "积分联动", detail: "把完成服务动作后的激励并入招行既有积分体系，提升复访和行动完成率。" },
      { title: "灰态展示", detail: "对非主链路外部功能采用灰色蒙版，减少误点和流程干扰。" }
    ],
    techStack: ["Python", "LightGBM", "NDCG@20", "候选召回", "主账户经营", "推荐排序", "产品方案设计"]
  },
  behavior: {
    title: "竞赛项目：客户行为序列预测与推荐排序模型",
    desc: "基于脱敏客户历史行为序列，动态构建候选四元组池，预测下一日最可能发生的行为并按 NDCG@20 优化 Top20 排序，最终线上得分 0.604。",
    goals: [],
    strategyLabel: "核心优化策略",
    techLabel: "技术栈",
    visuals: [
      {
        type: "metrics",
        label: "结果与规模",
        items: [
          { value: "0.604", label: "线上 NDCG@20" },
          { value: "374", label: "可观测四元组" },
          { value: "632万+", label: "训练行为记录" },
          { value: "7.79万", label: "测试用户" }
        ]
      },
      {
        type: "pipeline",
        label: "两阶段流程",
        steps: [
          { title: "时间切分", detail: "3月行为作历史，4月1日作标签" },
          { title: "候选召回", detail: "热门、历史、转移、同细类扩展" },
          { title: "排序建模", detail: "LightGBM 预测候选命中概率" },
          { title: "Top20 输出", detail: "按分数排序生成提交文件" }
        ]
      },
      {
        type: "info",
        label: "面试讲法",
        items: [
          { title: "不是端到端生成", detail: "利用可观测四元组较少的特点，将问题转成候选项二分类排序。" },
          { title: "先保证召回", detail: "Top20 分数上不去时，先看候选集是否覆盖真实行为。" },
          { title: "未见组合兜底", detail: "若未来出现历史外四元组，可用合法产品维表扩候选，但要用召回率验证噪声。" }
        ]
      }
    ],
    flow: {
      label: "建模流程图",
      note: "374 表示训练与测试历史中可观测到的行为四元组，不是硬编码边界；工程上可用合法产品维表扩展未见组合，再由排序模型过滤。",
      groups: [
        {
          kicker: "DATA",
          title: "数据切分",
          detail: "统一字段与时间窗口，把 3 月历史行为和 4 月 1 日标签严格分开。",
          items: ["train/test 读取", "acs_tm 时间解析", "历史窗口与标签日"]
        },
        {
          kicker: "RECALL",
          title: "候选召回",
          detail: "先让真实行为尽量进入候选池，再交给模型排序。",
          items: ["全局热门 Top150", "用户历史四元组", "行为转移统计", "同产品细类扩展 24 个"]
        },
        {
          kicker: "FEATURE",
          title: "用户-候选特征",
          detail: "把每个用户和候选四元组组成样本，刻画偏好、近期性和转移关系。",
          items: ["global_score / user_score", "recent_rank / lastday_rank", "recent_trans", "same_sub / risk affinity"]
        },
        {
          kicker: "RANK",
          title: "排序与提交",
          detail: "LightGBM 输出命中概率，按 NDCG@20 目标选择 Top20。",
          items: ["LightGBM 二分类排序", "Holdout NDCG@20", "Recall@20/50/100 诊断", "生成 prediction.csv"]
        }
      ]
    },
    links: [],
    strategies: [
      { title: "问题建模", detail: "把行为类型、产品大类、产品细类、风险等级合并为一个行为四元组，预测用户下一日可能命中的 Top20 四元组。" },
      { title: "候选边界", detail: "374 来自训练与测试历史中实际出现过的四元组；若有历史外新组合，可用合法产品维表做兜底扩展。" },
      { title: "召回层", detail: "融合全局热门、用户历史出现项、最近行为转移和同产品细类扩展，解决真实行为未进入候选集的问题。" },
      { title: "排序特征", detail: "构造 global_score、user_score、recent_rank、lastday_rank、recent_trans、same_sub_affinity、risk_affinity 等用户-候选特征。" },
      { title: "排序模型", detail: "用 LightGBM 二分类模型学习候选是否会在标签日发生，输出概率作为排序分数；最终 blend=0，直接采用模型分。" },
      { title: "本地验证", detail: "按 user_id 做 holdout，使用 NDCG@20 评估排序，并用 Top20/50/100 召回诊断指导候选集扩展。" },
      { title: "参数选择", detail: "最终使用 neg-per-user=50、top-global-neg=150、train-user-mod=2、same-sub-candidates=24，在速度和效果间取得平衡。" }
    ],
    techStack: ["Python", "Counter 特征", "LightGBM", "NDCG@20", "Recall@K", "CSV 流式处理"]
  },
  byte: {
    title: "把算法做成可持续运行的生产力",
    desc: "围绕大模型训练数据质量与团队效率，完成从算法建模、自动化工具到信息运营平台的端到端交付。",
    goals: [],
    strategyLabel: "四条工作主线",
    techLabel: "技术栈",
    visuals: [
      {
        type: "metrics",
        label: "核心成果",
        items: [
          { value: "95.3%", label: "不合格样本 Precision" },
          { value: "≈4.7%", label: "待审核池混入率" },
          { value: "≈0.15s", label: "候选摘要耗时" },
          { value: "83%", label: "自动化工具提效" }
        ]
      },
      { label: "AI 资讯运营平台", image: "assets/bytedance/editor-console.png", alt: "字节跳动 AI 资讯运营平台界面" },
      { label: "多平台监测台", image: "assets/bytedance/monitor-console.png", alt: "多平台账号与话题监测台界面" },
      { label: "AI 资讯聚合门户", image: "assets/bytedance/ai-news-feed.png", alt: "AI 资讯聚合与分类推荐界面" },
      { label: "新人引导机器人", image: "assets/bytedance/onboarding-bot.png", alt: "新人引导机器人消息编辑与预览界面" }
    ],
    flow: {
      label: "端到端交付链路",
      note: "从质量问题识别到工具化与运营化落地，覆盖算法研发、工程可靠性、产品界面和团队实际使用。",
      groups: [
        { kicker: "QUALITY", title: "图像质量建模", detail: "把文字可读性扩展为真实性、清晰度与 3D 几何合理性判断。", items: ["35 维质量特征", "LightGBM", "阈值精调"] },
        { kicker: "RELIABILITY", title: "批处理自动化", detail: "让附件处理任务在令牌失效、限流和中断后仍能继续。", items: ["自动续期", "并行下载", "幂等恢复"] },
        { kicker: "SIGNAL", title: "信息聚合", detail: "统一多平台监测与 38 个资讯源，完成抓取、归一化和摘要。", items: ["多源抓取", "分类推荐", "亚秒级摘要"] },
        { kicker: "DELIVERY", title: "运营与触达", detail: "将选稿、编辑、配图、卡片预览和飞书推送收敛到一个工作台。", items: ["运营选稿", "真实预览", "定向发送"] }
      ]
    },
    links: [],
    strategies: [
      { title: "图像质检算法", detail: "融合 OCR 可读性、旋转镜像一致性、文字锐度、平面度与边界穿透等 35 维特征，将 Precision 从 91.0% 提升至 95.3%。" },
      { title: "可靠批处理", detail: "通过令牌自动续期、并行下载、断点重试与幂等去重，让长任务中断后无损恢复，单轮耗时由约 70 分钟降至 40 分钟。" },
      { title: "AI Signal 平台", detail: "统一多平台监测与 38 个资讯源，本地摘要替代大模型批处理，将候选生成由 10–15 分钟降至约 0.15 秒。" },
      { title: "运营与协作自动化", detail: "实现选稿、摘要编辑、配图、卡片预览、定向推送与新人引导，形成内容运营和团队协作闭环。" }
    ],
    techStack: ["Python", "OCR", "LightGBM", "Feature Engineering", "Concurrency", "Vue 3", "Feishu API"]
  },
  rag: {
    title: "个人项目1：汽车知识库 RAG 问答系统",
    desc: "基于汽车用户手册构建的 RAG 问答系统，支持汽车功能、配置及操作说明查询，提升用户检索效率与回答准确性。",
    goals: [],
    strategyLabel: "核心优化策略",
    techLabel: "技术栈",
    visuals: [
      {
        type: "info",
        label: "项目背景",
        items: [
          { title: "业务场景", detail: "面向汽车用户手册问答，覆盖功能说明、配置查询、故障提示和操作步骤等高频咨询。" },
          { title: "数据特点", detail: "原始 PDF 存在跨页表格、章节层级和专业术语，直接切分容易造成语义断裂。" },
          { title: "技术目标", detail: "构建本地知识库检索链路，让用户输入自然语言问题后获得可追溯、低幻觉的回答。" }
        ]
      },
      { label: "系统界面", image: "ppt_assets/image10.png", alt: "智能座舱问答系统界面" },
      { label: "RAG 检索流程", image: "ppt_assets/image9.png", alt: "汽车知识库 RAG 检索流程" }
    ],
    links: [],
    strategies: [
      { title: "多策略文本切分", detail: "结合页面规则与滑动窗口，有效减少跨页信息断裂，保证上下文完整性。" },
      { title: "混合检索", detail: "FAISS 向量检索 + BM25 关键词检索双路结合，提高专业术语与功能名称召回效果。" },
      { title: "重排序优化", detail: "使用 bge-reranker-large 对召回结果重排序，降低低相关文本干扰。" }
    ],
    techStack: ["PyPDF2", "LangChain", "FAISS", "BM25", "bge-reranker-large", "DashScope / Qwen API"]
  },
  agent: {
    title: "个人项目2：求职 Agent 智能助手",
    desc: "面向毕业生求职管理，把邮件、投递进度、待办任务、简历优化、天气节奏和长期偏好记忆整合成可恢复、可确认的个人智能助理。",
    goals: [],
    strategyLabel: "核心工作",
    techLabel: "关键技术",
    visuals: [
      { label: "系统界面", image: "assets/job-agent-preview.svg", alt: "求职备考行动台界面预览" },
      { label: "LangGraph 总体流程", image: "assets/agent-workflow.svg", alt: "求职 Agent LangGraph 总体流程图" }
    ],
    links: [],
    strategies: [
      { title: "Daily Companion Graph", detail: "加载 data.json 与 memory.json，分析今日任务、投递状态和天气节奏，生成每日规划。" },
      { title: "Resume PDF Graph", detail: "解析 JD、匹配个人经历与技能关键词，生成定制化简历内容。" },
      { title: "HIL Approval Graph", detail: "招聘邮件解析后进入 interrupt/resume，人工确认后再写入投递进度和待办。" }
    ],
    techStack: ["LangGraph", "PostgresSaver", "Python HTTP API", "Function Calling", "MCP", "IMAP", "memory.json", "data.json"]
  },
  aigc: {
    title: "实习项目：AIGC 图像编辑稳定性优化",
    desc: "面向三星手机相册原生编辑入口，建设系统级视觉 AIGC 能力，覆盖 10 个风格化模板、表情调整、局部编辑和图像合成等场景。",
    goals: [],
    strategyLabel: "核心工作",
    techLabel: "关键技术",
    visuals: [
      { label: "编辑流程", image: "ppt_assets/image3.jpeg", alt: "图像编辑流程图" },
      {
        type: "info",
        label: "技术背景",
        items: [
          { title: "能力范围", detail: "围绕相册原生入口，支持 10 个风格化模板、表情调整、局部重绘和多图合成。" },
          { title: "核心难点", detail: "生成式编辑容易出现人脸五官漂移、背景被误改、边缘融合突兀和风格强度不稳定。" },
          { title: "工程链路", detail: "通过 Prompt 模板、mask 区域控制、DINO 相似度筛选和泊松融合后处理提升稳定性。" }
        ]
      }
    ],
    links: [],
    strategies: [
      { title: "10 个风格化模板", detail: "整理风格化 Prompt 模板，约束主体、背景、色彩和风格强度，保证批量效果一致。" },
      { title: "表情调整与人像保真", detail: "针对微笑、闭眼等表情编辑，限制五官结构和脸部轮廓变化，减少人像变形。" },
      { title: "局部编辑稳定性", detail: "结合 Prompt 结构约束、mask 区域控制、DINO 背景相似度筛选和最多 3 轮重试。" },
      { title: "图像合成与融合", detail: "针对拼接边缘突兀问题引入泊松融合后处理，内部测试准确率由 65% 提升至 85%。" },
      { title: "模型评测选型", detail: "对比美图、快手、字节等厂商模型，从指令遵循、主体保真、结构保持和延迟维度评估。" }
    ],
    techStack: ["SeedDream 4.0", "Prompt Template", "Mask Editing", "DINO Similarity", "Poisson Blending", "Model Evaluation"]
  },
  wheelchair: {
    title: "科研项目：基于 EEG 解码的脑控抓取系统",
    desc: "基于 EEG 脑电信号解码实现机器人抓取控制，探索复杂视觉刺激与脑机交互场景下的目标识别能力。",
    goalLabel: "项目背景",
    goals: [
      "脑机接口通过 EEG 信号捕获用户注意与意图，为无接触机器人控制提供输入。",
      "复杂视觉刺激和遮挡场景会降低脑电响应稳定性，需要更强的特征提取与解码能力。",
      "项目目标是将脑电解码结果映射到机器人抓取控制，完成目标定位与执行闭环。"
    ],
    strategyLabel: "核心工作",
    techLabel: "关键技术",
    visuals: [
      {
        label: "项目背景图",
        images: [
          { src: "ppt_assets/image7.png", alt: "高密度刺激遮挡物体实验场景" },
          { src: "ppt_assets/image8.png", alt: "脑电信号频率与视觉刺激背景" }
        ]
      },
      { label: "创新点", image: "ppt_assets/innovation.png", alt: "系数点阵范式创新点与实验结果" },
      { label: "项目框架", image: "ppt_assets/image5.png", alt: "基于 EEG 解码的脑控抓取系统整体框架" },
      { label: "算法框架", image: "ppt_assets/image4.png", alt: "多尺度 STFT 与 Transformer 脑电解码算法框架" }
    ],
    links: [],
    strategies: [
      { title: "数据采集与预处理", detail: "参与高密度 EEG 数据采集，完成滤波、降噪、分段等预处理工作。" },
      { title: "时频特征提取", detail: "采用 STFT 提取多频段时频特征，提升脑电信号的可分性。" },
      { title: "脑电解码模型", detail: "基于 Transformer 架构构建解码模型，实现对抓取意图的分类识别。" },
      { title: "机器人控制集成", detail: "将解码结果映射为控制指令，驱动机械臂完成抓取动作执行。" },
      { title: "实验测试与分析", detail: "搭建实验场景，进行多轮测试，分析模型性能并持续优化算法效果。" }
    ],
    techStack: ["EEG", "STFT", "Transformer", "PyTorch", "Robot Arm", "OpenCV", "Socket (TCP/IP)"]
  }
};

const tabs = document.querySelectorAll(".project-tab");
const projectSnapshots = {
  rag: ["汽车手册专业问答", "独立开发", "混合检索 + 重排序", "回答可追溯"],
  agent: ["毕业生求职管理", "产品设计与全栈开发", "多智能体 + 人工确认", "任务状态可恢复"],
  cmb: ["银行主账户经营", "算法与产品方案", "召回排序 + 分层经营", "NDCG@20 0.604"],
  aigc: ["手机相册原生编辑", "AIGC 应用开发", "筛选重试 + 融合后处理", "准确率 65% → 85%"],
  wheelchair: ["脑机控制与医疗陪护", "算法与工作流开发", "EEG 解码 + Agent", "识别率 99.7%"],
  byte: ["大模型训练数据质量", "提效算法实习生", "质检模型 + 自动化平台", "Precision 95.3%"]
};
const projectTitle = document.querySelector("#projectTitle");
const projectDesc = document.querySelector("#projectDesc");
const projectVisuals = document.querySelector("#projectVisuals");
const projectStrategies = document.querySelector("#projectStrategies");
const projectTechStack = document.querySelector("#projectTechStack");
const projectStrategyLabel = document.querySelector("#projectStrategyLabel");
const projectTechLabel = document.querySelector("#projectTechLabel");
const projectLinks = document.querySelector("#projectLinks");
const projectFlowSection = document.querySelector("#projectFlowSection");
const projectFlowLabel = document.querySelector("#projectFlowLabel");
const projectFlowBody = document.querySelector("#projectFlowBody");
const projectFlowNote = document.querySelector("#projectFlowNote");
const projectSnapshot = document.querySelector("#projectSnapshot");
const currentProjectIndex = document.querySelector("#currentProjectIndex");
const projectDetail = document.querySelector("#projectDetail");

tabs.forEach((tab) => tab.setAttribute("aria-controls", "projectDetail"));

function selectAdjacentProject(direction) {
  const tabList = [...tabs];
  const activeIndex = tabList.findIndex((tab) => tab.classList.contains("active"));
  const nextIndex = (activeIndex + direction + tabList.length) % tabList.length;
  tabList[nextIndex]?.click();
  tabList[nextIndex]?.focus();
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const project = projects[tab.dataset.project];
    tabs.forEach((item) => {
      item.classList.toggle("active", item === tab);
      item.setAttribute("aria-selected", item === tab ? "true" : "false");
      item.tabIndex = item === tab ? 0 : -1;
    });
    const selectedIndex = [...tabs].indexOf(tab);
    if (currentProjectIndex) currentProjectIndex.textContent = String(selectedIndex + 1).padStart(2, "0");
    document.querySelectorAll(".project-outline [data-project-link]").forEach((link) => {
      link.classList.toggle("outline-current", link.dataset.projectLink === tab.dataset.project);
    });
    const tabList = tab.parentElement;
    if (tabList && tabList.scrollWidth > tabList.clientWidth) {
      tabList.scrollTo({ left: tab.offsetLeft - tabList.offsetLeft - 14, behavior: "smooth" });
    }
    projectTitle.textContent = project.title;
    projectDesc.textContent = project.desc;
    renderProjectSnapshot(tab.dataset.project);
    projectVisuals.dataset.project = tab.dataset.project;
    projectVisuals.classList.toggle("with-goals", Boolean(project.goals?.length));
    projectVisuals.classList.toggle("wide-visuals", Boolean(project.goals?.length && project.visuals.length >= 3));
    projectVisuals.classList.toggle("three-columns", !project.goals?.length && project.visuals.length >= 3);
    projectVisuals.replaceChildren(
      ...(project.goals?.length ? [createGoalCard(project.goals, project.goalLabel)] : []),
      ...project.visuals.map(createVisualCard)
    );
    renderProjectFlow(project.flow);
    projectStrategyLabel.textContent = project.strategyLabel || "核心工作";
    projectTechLabel.textContent = project.techLabel || "关键技术";
    projectStrategies.replaceChildren(
      ...project.strategies.map((strategy) => {
        const card = document.createElement("article");
        const title = document.createElement("strong");
        const detail = document.createElement("span");
        title.textContent = strategy.title;
        detail.textContent = strategy.detail;
        card.append(title, detail);
        return card;
      })
    );
    projectTechStack.replaceChildren(
      ...project.techStack.map((item) => {
        const tag = document.createElement("span");
        tag.textContent = item;
        return tag;
      })
    );
    projectLinks.replaceChildren(
      ...(project.links || []).map((link) => {
        const anchor = document.createElement("a");
        anchor.className = "demo-link";
        anchor.href = link.href;
        anchor.target = "_blank";
        anchor.rel = "noreferrer";
        anchor.textContent = link.label;
        return anchor;
      })
    );
    projectLinks.hidden = !(project.links || []).length;
    if (projectDetail) {
      projectDetail.classList.remove("is-updating");
      void projectDetail.offsetWidth;
      projectDetail.classList.add("is-updating");
    }
  });
  tab.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectAdjacentProject(1);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectAdjacentProject(-1);
    }
  });
});

document.querySelector("#previousProject")?.addEventListener("click", () => selectAdjacentProject(-1));
document.querySelector("#nextProject")?.addEventListener("click", () => selectAdjacentProject(1));

document.querySelectorAll("[data-project-link]").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(`.project-tab[data-project="${link.dataset.projectLink}"]`)?.click();
  });
});

function renderProjectSnapshot(projectKey) {
  if (!projectSnapshot) return;
  const labels = ["业务场景", "我的角色", "核心方案", "关键结果"];
  const values = projectSnapshots[projectKey] || [];
  projectSnapshot.replaceChildren(...labels.map((label, index) => {
    const card = document.createElement("article");
    const caption = document.createElement("span");
    const value = document.createElement("strong");
    caption.textContent = label;
    value.textContent = values[index] || "—";
    card.append(caption, value);
    return card;
  }));
}

const activeTab = document.querySelector(".project-tab.active") || tabs[0];
if (activeTab) {
  activeTab.click();
}

function renderProjectFlow(flow) {
  if (!projectFlowSection || !projectFlowBody) {
    return;
  }
  projectFlowSection.hidden = !flow;
  if (!flow) {
    projectFlowBody.replaceChildren();
    if (projectFlowNote) {
      projectFlowNote.textContent = "";
    }
    return;
  }
  projectFlowLabel.textContent = flow.label || "流程图";
  const groups = flow.groups || flow.stages || [];
  projectFlowBody.replaceChildren(
    ...groups.map((stage) => {
      const article = document.createElement("article");
      const kicker = document.createElement("span");
      const title = document.createElement("strong");
      const detail = document.createElement("p");
      kicker.textContent = stage.kicker;
      title.textContent = stage.title;
      detail.textContent = stage.detail;
      article.append(kicker, title, detail);
      if (stage.items?.length) {
        const list = document.createElement("ul");
        stage.items.forEach((text) => {
          const item = document.createElement("li");
          item.textContent = text;
          list.appendChild(item);
        });
        article.appendChild(list);
      }
      return article;
    })
  );
  if (projectFlowNote) {
    projectFlowNote.textContent = flow.note || "";
  }
}

function createVisualCard(visual) {
  const figure = document.createElement("figure");
  const caption = document.createElement("figcaption");
  figure.className = "visual-card";
  caption.textContent = visual.label;

  if (visual.type === "info") {
    const content = document.createElement("div");
    content.className = "visual-info-content";
    visual.items.forEach((item) => {
      const article = document.createElement("article");
      const title = document.createElement("strong");
      const detail = document.createElement("span");
      title.textContent = item.title;
      detail.textContent = item.detail;
      article.append(title, detail);
      content.appendChild(article);
    });
    figure.classList.add("visual-info-card");
    figure.append(caption, content);
    return figure;
  }

  if (visual.type === "metrics") {
    const content = document.createElement("div");
    content.className = "metric-grid";
    visual.items.forEach((item) => {
      const article = document.createElement("article");
      const value = document.createElement("strong");
      const label = document.createElement("span");
      value.textContent = item.value;
      label.textContent = item.label;
      article.append(value, label);
      content.appendChild(article);
    });
    figure.classList.add("visual-metric-card");
    figure.append(caption, content);
    return figure;
  }

  if (visual.type === "pipeline") {
    const content = document.createElement("div");
    content.className = "pipeline-flow";
    visual.steps.forEach((step) => {
      const article = document.createElement("article");
      const title = document.createElement("strong");
      const detail = document.createElement("span");
      title.textContent = step.title;
      detail.textContent = step.detail;
      article.append(title, detail);
      content.appendChild(article);
    });
    figure.classList.add("visual-pipeline-card");
    figure.append(caption, content);
    return figure;
  }

  if (visual.images?.length) {
    const collage = document.createElement("div");
    collage.className = "visual-collage";
    visual.images.forEach((item) => {
      const image = document.createElement("img");
      image.src = item.src;
      image.alt = item.alt;
      collage.appendChild(image);
    });
    figure.append(caption, collage);
    return figure;
  }

  const image = document.createElement("img");
  image.src = visual.image;
  image.alt = visual.alt;
  figure.append(caption, image);
  return figure;
}

function createGoalCard(goals, labelText = "项目目标") {
  const card = document.createElement("section");
  const label = document.createElement("div");
  const list = document.createElement("div");
  card.className = "goal-card";
  label.className = "project-section-label";
  label.textContent = labelText;
  list.className = "goal-list";
  goals.forEach((goal) => {
    const item = document.createElement("article");
    const icon = document.createElement("span");
    const text = document.createElement("p");
    icon.textContent = "◎";
    text.textContent = goal;
    item.append(icon, text);
    list.appendChild(item);
  });
  card.append(label, list);
  return card;
}

const contactMenu = document.querySelector(".contact-menu");
document.addEventListener("click", (event) => {
  if (contactMenu?.open && !contactMenu.contains(event.target)) {
    contactMenu.removeAttribute("open");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && contactMenu?.open) {
    contactMenu.removeAttribute("open");
    contactMenu.querySelector("summary")?.focus();
  }
});

const sectionLinks = [...document.querySelectorAll('.topbar nav a[href^="#"]')];
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    sectionLinks.forEach((link) => {
      link.classList.toggle("nav-current", link.getAttribute("href") === `#${visible.target.id}`);
    });
  }, { rootMargin: "-20% 0px -60%", threshold: [0.05, 0.25, 0.5] });
  observedSections.forEach((section) => sectionObserver.observe(section));
}
