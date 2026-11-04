/* Codex six-dimension evaluation. Compatible with local file:// galleries. */
(function () {
  "use strict";
  const gallery = document.getElementById("gallery");
  if (!gallery) return;
  const english = /^en\b/i.test(document.documentElement.lang || "");
  const T = (zh, en) => english ? en : zh;
  const metrics = window.FIGURE_SCORE_METRICS;
  const data = window.FIGURE_JUDGE_DATA || null;
  const judgingBase = document.currentScript && document.currentScript.src
    ? new URL(".", document.currentScript.src) : null;
  const defaultDimensions = [
    {key: "clarity", label_en: "Communicative Clarity", label_zh: "表达清晰度"},
    {key: "organization", label_en: "Organization & Readability", label_zh: "信息组织与可读性"},
    {key: "consistency", label_en: "Graphical Consistency", label_zh: "图示语义一致性"},
    {key: "aesthetics", label_en: "Aesthetic Coherence", label_zh: "视觉协调性"},
    {key: "inventiveness", label_en: "Purposeful Visual Inventiveness", label_zh: "表达巧思"},
    {key: "specificity", label_en: "Design Specificity", label_zh: "设计特异性"}
  ];
  const dimensions = data && Array.isArray(data.dimensions) && data.dimensions.length === 6
    ? data.dimensions : defaultDimensions;
  const dimensionName = dim => english ? dim.label_en || dim.key : dim.label_zh || dim.label_en || dim.key;
  const progress = data && data.progress || {};
  const repeats = Number.isInteger(progress.repeats) && progress.repeats > 0 ? progress.repeats : 3;
  const records = data && data.figures || {};
  const count = (value, fallback) => Number.isInteger(value) && value >= 0 ? value : fallback;
  const score = value => typeof value === "number" && Number.isFinite(value) && value >= 1 && value <= 5;
  const format = value => Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  };
  const cards = Array.from(gallery.querySelectorAll("article"));
  const labelled = (parent, label, value) => {
    const p = el("p", "judge-evidence");
    p.append(el("strong", "", label + T("：", ": ")), document.createTextNode(value || T("未提供", "Not provided")));
    parent.append(p);
  };
  const completed = record => record ? count(record.completed_runs, Array.isArray(record.runs) ? record.runs.length : 0) : 0;
  const summary = el("section", "judge-summary");
  summary.id = "figure-judge-summary";
  summary.append(el("h2", "", T("Codex 六维图像评价", "Six-dimensional model evaluation")));
  const model = data && data.model || {};
  const modelText = [model.id, model.reasoning_effort && T("推理设置：", "Reasoning: ") + model.reasoning_effort,
    model.runner && T("运行方式：", "Runner: ") + model.runner].filter(Boolean).join(" · ");
  summary.append(el("p", "judge-meta", modelText || T("本机 Codex · 模型与运行参数尚未记录", "Local Codex · model settings not recorded")));
  if (data) {
    const allFigures = count(progress.figures_total, 371);
    const allPapers = count(progress.papers_total, 200);
    const expected = count(progress.expected_runs, allFigures * repeats);
    const doneRuns = count(progress.completed_runs, 0);
    const doneFigures = count(progress.completed_figures, 0);
    summary.append(el("p", "judge-progress", T(
      `全库 ${allPapers} 篇 / ${allFigures} 图：已记录 ${doneRuns} / ${expected} 次独立评分；已完成 ${doneFigures} / ${allFigures} 图。`,
      `${allPapers} papers / ${allFigures} figures: ${doneRuns} / ${expected} independent ratings recorded; ${doneFigures} / ${allFigures} figures complete.`)));
    const statusNames = {complete: "全部完成", completed: "全部完成", running: "评分中", in_progress: "评分中",
      pending: "待开始", partial: "部分完成", blocked: "等待继续", failed: "运行中断", not_started: "待开始"};
    summary.append(el("p", "judge-meta", T("状态：", "Status: ") + (english ? progress.status || "not recorded" : statusNames[progress.status] || progress.status || "未记录") +
      (data.protocol_id ? T(" · 评分协议：", " · Protocol: ") + data.protocol_id : "")));
  } else {
    summary.append(el("p", "judge-progress", T("尚未评分：未读取到评分结果。空白项不代表 0 分。", "No ratings loaded. Missing values do not represent zero.")));
  }
  const layerCounts = {main: {total: 0, complete: 0}, style: {total: 0, complete: 0}};
  cards.forEach(card => {
    const image = card.querySelector("img");
    const record = image && records[image.alt];
    const layer = card.dataset.stage === "S4-AI-Style" ? layerCounts.style : layerCounts.main;
    layer.total += 1;
    if (completed(record) >= repeats) layer.complete += 1;
  });
  const layerText = [];
  if (layerCounts.main.total) layerText.push(T("主样本：", "Main cohort: ") + layerCounts.main.complete + " / " + layerCounts.main.total + T(" 图完成全部重复", " figures with all repeats"));
  if (layerCounts.style.total) layerText.push(T("风格对照：", "Style contrast: ") + layerCounts.style.complete + " / " + layerCounts.style.total + T(" 图完成全部重复", " figures with all repeats"));
  summary.append(el("p", "judge-meta", layerText.join("; ") + T("。两层分别保留，不合并计算阶段评分。", ". The two cohorts remain separate for stage-level analysis.")));
  summary.append(el("p", "judge-note", T(
    "每次仅以匿名原图和 M/F 功能标签评分。各维度为 1–5 分，展示三次评分的中位数、范围和有效次数。新增六维均分是六个中位数的等权算术平均，仅作浏览与描述性比较，不替代分维分析，也不是已验证的综合量表。模型评价不等于人类偏好，不判断实际绘图工具。",
    "Each request uses only an anonymous figure and its M/F role. Each dimension is rated from 1 to 5; medians, ranges, and valid counts summarize three ratings. The six-dimension mean is the unweighted arithmetic mean of the six medians, provided for descriptive comparison. It is not a validated composite scale and does not replace dimension-level analysis. Model ratings do not establish human preferences or identify drawing tools.")));
  if (judgingBase) {
    const finished = Number.isInteger(progress.expected_runs) && progress.expected_runs > 0 &&
      progress.completed_runs === progress.expected_runs;
    const links = el("nav", "judge-links");
    links.setAttribute("aria-label", T("评分结果与方法文件", "Rating data and methods"));
    const destinations = [
      ["summary.html", T(finished ? "结果概览（全部评分完成）" : "结果概览（当前可能为部分结果）", "Original-rating overview (Chinese)")],
      ["figure_scores.csv", T("每图 × 维度汇总 CSV", "Per-figure dimension summaries (CSV)")],
      ["scores_long.csv", T("三次评分明细 CSV", "All three ratings (CSV)")],
      ["rubric.txt", T("评分量表", "Frozen rating rubric")],
      ["README.txt", T("方法与局限", "Archived methods and limitations")]
    ];
    if (finished) destinations.splice(1, 0, ["figure_scores_wide.csv", T("每图一行：六维完整评分 CSV", "One row per figure (CSV)")]);
    if (finished) destinations.push(["final_validation.json", T("最终校验记录", "Final validation record")]);
    destinations.forEach(([file, label]) => {
      const link = el("a", "", label);
      link.href = new URL(file, judgingBase).href;
      links.append(link);
    });
    summary.append(links);
  }
  const priorSummary = document.getElementById(summary.id);
  if (priorSummary) priorSummary.replaceWith(summary);
  else gallery.before(summary);

  cards.forEach(card => {
    const image = card.querySelector("img");
    if (!image || !image.alt) return;
    const ident = image.alt;
    if (!card.id) card.id = "figure-" + ident;
    const record = records[ident] || null;
    const done = completed(record);
    const panel = el("div", "judge-panel");
    panel.dataset.figureId = ident;
    panel.append(el("h4", "", T("原图六维评分 · Codex", "Original figure · six-dimensional ratings")));
    panel.append(el("p", "judge-meta", done ? T(`已记录 ${done} / ${repeats} 次独立评分`, `${done} / ${repeats} independent ratings recorded`) : T("尚未评分", "Not rated")));
    const table = el("table", "judge-table");
    const thead = el("thead");
    const head = el("tr");
    [T("维度", "Dimension"), T("中位数", "Median"), T("范围", "Range"), T("有效次数", "Valid ratings")].forEach(label => head.append(el("th", "", label)));
    thead.append(head); table.append(thead);
    const tbody = el("tbody");
    dimensions.forEach(dim => {
      const values = record && record.dimensions && record.dimensions[dim.key] || {};
      const n = count(values.n, 0);
      const valid = score(values.median) && n > 0;
      const tr = el("tr");
      const name = el("th", "judge-dimension", dimensionName(dim));
      name.scope = "row";
      name.title = dim.label_en || dim.key;
      tr.append(name,
        el("td", valid ? "judge-score" : "judge-empty", valid ? format(values.median) : done ? T("无法判断", "Unable to judge") : T("待评", "Not rated")),
        el("td", "", score(values.min) && score(values.max) && n > 0 ? format(values.min) + "–" + format(values.max) : "—"),
        el("td", "", n + " / " + repeats));
      tbody.append(tr);
    });
    table.append(tbody); panel.append(table);
    if (metrics) {
      const average = metrics.mean(record);
      const line = el("p", "score-average judge-average");
      line.append(el("span", "", T("六维平均分", "Six-dimension mean")),
        el("strong", "score-average-value", average === null ? "—" : average.toFixed(2) + " / 5"));
      if (average !== null) line.dataset.mean = String(average);
      else line.title = T("须有全部六项有效中位数才计算均分。", "A mean requires a valid median for all six dimensions.");
      panel.append(line);
    }
    if (record && Array.isArray(record.runs) && record.runs.length) {
      const details = el("details", "judge-run-details");
      details.append(el("summary", "", T("查看每次评分的视觉依据与局限", "Evidence and limitations for each rating")));
      let loaded = false;
      details.addEventListener("toggle", () => {
        if (!details.open || loaded) return;
        loaded = true;
        record.runs.slice().sort((a, b) => (a.repeat || 0) - (b.repeat || 0)).forEach((run, index) => {
          const block = el("div", "judge-run");
          block.append(el("h5", "", T(`第 ${run.repeat || index + 1} 次评分`, `Rating ${run.repeat || index + 1}`)));
          if (run.run_id) block.append(el("p", "judge-run-id", run.run_id));
          dimensions.forEach(dim => {
            const result = run.scores && run.scores[dim.key] || {};
            const item = el("div", "judge-run-dimension");
            item.append(el("p", "judge-dimension-title", dimensionName(dim) + " · " +
              (score(result.score) ? format(result.score) + " / 5" : T("无法判断", "Unable to judge"))));
            labelled(item, T("视觉依据", "Visual evidence"), result.evidence);
            labelled(item, T("局限", "Limitation"), result.limitation);
            if (!score(result.score)) labelled(item, T("无法判断原因", "Reason for missing rating"), result.unable_reason);
            block.append(item);
          });
          details.append(block);
        });
      });
      panel.append(details);
    }
    const old = card.querySelector(".judge-panel");
    if (old) old.replaceWith(panel);
    else card.append(panel);
  });
})();
