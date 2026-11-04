/* Study-generated derivatives; original figures and judgments are read-only. */
(function () {
  "use strict";
  const gallery = document.getElementById("gallery");
  const script = document.currentScript;
  if (!gallery || !script || !script.src) return;
  const english = /^en\b/i.test(document.documentElement.lang || "");
  const T = (zh, en) => english ? en : zh;
  const metrics = window.FIGURE_SCORE_METRICS;
  const originals = (window.FIGURE_JUDGE_DATA || {}).figures || {};
  const base = new URL(".", script.src);
  const data = window.FIGURE_IMPROVEMENT_DATA || {};
  const records = data.figures || {};
  const dims = [
    ["clarity", T("表达清晰度", "Communicative Clarity")], ["organization", T("信息组织与可读性", "Organization & Readability")],
    ["consistency", T("图示语义一致性", "Graphical Consistency")], ["aesthetics", T("视觉协调性", "Aesthetic Coherence")],
    ["inventiveness", T("表达巧思", "Purposeful Visual Inventiveness")], ["specificity", T("设计特异性", "Design Specificity")]
  ];
  const names = {pending: T("待生成", "Not generated"), generating: T("生成中", "Generating"), failed: T("生成失败", "Generation failed"), fidelity_rejected: T("内容核查未通过", "Fidelity review failed"),
    fidelity_pending: T("待内容核查", "Awaiting fidelity review"), ready: T("改图就绪 · 待独立评分", "Ready · awaiting independent ratings"), scoring: T("独立评分中", "Rating in progress"), scored: T("独立评分已完成", "Independent ratings complete")};
  const node = (tag, cls, text) => {
    const x = document.createElement(tag);
    if (cls) x.className = cls;
    if (text !== undefined && text !== null) x.textContent = String(text);
    return x;
  };
  const numeric = x => typeof x === "number" && Number.isFinite(x) && x >= 1 && x <= 5;
  const fmt = x => Number.isInteger(x) ? String(x) : String(Number(x.toFixed(2)));
  const count = x => Number.isInteger(x) && x >= 0 ? x : 0;
  const local = path => {
    if (typeof path !== "string" || !path.trim()) return null;
    try {
      const u = new URL(path, base);
      return u.protocol === base.protocol && u.href.startsWith(base.href) ? u.href : null;
    } catch (_) { return null; }
  };
  const addText = (parent, label, text) => {
    if (!text) return;
    const p = node("p", "improvement-evidence");
    p.append(node("strong", "", label + T("：", ": ")), document.createTextNode(String(text)));
    parent.append(p);
  };
  const cards = Array.from(gallery.querySelectorAll("article"));
  const totals = {};
  const cohorts = {main: {total: 0, scored: 0}, style: {total: 0, scored: 0}};
  let judgedRuns = 0;
  cards.forEach(card => {
    const original = card.querySelector("img");
    if (!original || !original.alt) return;
    const id = original.alt;
    const originalJudgment = originals[id] || null;
    const record = records[id] || {};
    const status = Object.prototype.hasOwnProperty.call(names, record.status) ? record.status : "pending";
    totals[status] = (totals[status] || 0) + 1;
    const cohort = card.dataset.stage === "S4-AI-Style" ? cohorts.style : cohorts.main;
    cohort.total += 1;
    if (status === "scored") cohort.scored += 1;
    const judgment = record.judgment || {};
    const runs = Array.isArray(judgment.runs) ? judgment.runs : [];
    const completed = Math.min(3, count(judgment.completed_runs));
    judgedRuns += completed;
    const panel = node("section", "improvement-panel");
    panel.dataset.originalFigureId = id;
    panel.id = "improvement-" + id;
    panel.append(node("h4", "", T("本研究生成的改图", "Study-generated revision")));
    panel.append(node("p", "improvement-status improvement-status-" + status, names[status]));
    panel.append(node("p", "improvement-note", T("这是本研究生成的衍生图，非原论文作者提供的图。生成接口未披露实际后端版本，不标注为 Image 2。", "This derivative was generated for this study and was not provided by the paper's authors. The generation interface did not disclose its backend version; no Image 2 attribution is made.")));
    const imageUrl = local(record.image_path);
    if (imageUrl) {
      const anchor = node("a", "improvement-image-link");
      anchor.href = imageUrl;
      const image = node("img", "improvement-image");
      image.src = imageUrl;
      image.alt = T("本研究生成的衍生图 · ", "Study-generated derivative · ") + id;
      image.loading = "lazy";
      image.addEventListener("error", () => {
        anchor.hidden = true;
        panel.insertBefore(node("p", "improvement-error", T("改图文件无法载入；此处不显示替代图片。", "The derivative image could not be loaded. No substitute is displayed.")), anchor);
      }, {once: true});
      anchor.append(image); panel.append(anchor);
    } else {
      panel.append(node("p", "improvement-empty", status === "failed" ? T("本次没有可用的改图文件。", "No derivative file is available for this attempt.") : T("尚无可展示的改图文件。", "No derivative image is available yet.")));
    }
    const fidelity = record.fidelity || {};
    if (fidelity.note || fidelity.reason) addText(panel, T("内容核查", "Fidelity review"), fidelity.note || fidelity.reason);
    if (record.error) addText(panel, T("处理记录", "Processing record"), typeof record.error === "string" ? record.error : record.error.message || JSON.stringify(record.error));
    const report = local(fidelity.report_path || record.fidelity_report_path);
    if (report) {
      const link = node("a", "improvement-report", T("查看内容核查记录", "View fidelity review record"));
      link.href = report; panel.append(link);
    }
    panel.append(node("h5", "", T("改图的独立六维评分", "Independent ratings of the revision")));
    const model = data.model || {};
    panel.append(node("p", "improvement-note", completed ?
      [T(`已记录 ${completed} / 3 次独立请求`, `${completed} / 3 independent ratings recorded`), model.id, model.reasoning_effort].filter(Boolean).join(" · ") :
      (status === "fidelity_rejected" ? T("内容核查未通过，未纳入质量评分。", "Excluded from quality ratings because fidelity review failed.") : T("尚未获得独立评分；不预设满分。", "Independent ratings are not yet available. No score is assumed."))));
    const table = node("table", "improvement-table");
    const head = node("thead"); const hr = node("tr");
    [T("维度", "Dimension"), T("中位数 · 相比原图", "Median · change vs. original"), T("范围", "Range"), T("有效次数", "Valid ratings")].forEach(label => hr.append(node("th", "", label)));
    head.append(hr); table.append(head);
    const body = node("tbody");
    dims.forEach(([key, label]) => {
      const d = judgment.dimensions && judgment.dimensions[key] || {};
      const n = count(d.n); const valid = n > 0 && numeric(d.median);
      const tr = node("tr"); const name = node("th", "", label); name.scope = "row";
      tr.dataset.dimension = key;
      const cell = node("td", valid ? "improvement-score" : "improvement-empty");
      cell.append(node("span", "score-number", valid ? fmt(d.median) : completed ? T("无法判断", "Unable to judge") : T("未评分", "Not rated")));
      if (valid && metrics) cell.append(metrics.deltaBadge(d.median, metrics.median(originalJudgment, key), english));
      tr.append(name, cell,
        node("td", "", n > 0 && numeric(d.min) && numeric(d.max) ? fmt(d.min) + "–" + fmt(d.max) : "—"),
        node("td", "", n + " / 3"));
      body.append(tr);
    });
    table.append(body); panel.append(table);
    if (metrics) {
      const average = metrics.mean(judgment);
      const originalAverage = metrics.mean(originalJudgment);
      const line = node("p", "score-average improvement-average");
      line.append(node("span", "", T("六维平均分", "Six-dimension mean")),
        node("strong", "score-average-value", average === null ? "—" : average.toFixed(2) + " / 5"));
      if (average !== null) {
        line.dataset.mean = String(average);
        line.append(metrics.deltaBadge(average, originalAverage, english));
      } else line.title = T("须有全部六项有效中位数才计算均分。", "A mean requires a valid median for all six dimensions.");
      panel.append(line);
    }
    if (runs.length) {
      const details = node("details", "improvement-runs");
      details.append(node("summary", "", T("查看每次评分的视觉依据与局限", "Evidence and limitations for each rating")));
      let loaded = false;
      details.addEventListener("toggle", () => {
        if (!details.open || loaded) return;
        loaded = true;
        runs.slice().sort((a, b) => a.repeat - b.repeat).forEach(run => {
          const block = node("div", "improvement-run");
          block.append(node("h5", "", T(`第 ${run.repeat} 次独立评分`, `Independent rating ${run.repeat}`)));
          if (run.run_id) block.append(node("p", "improvement-run-id", run.run_id));
          dims.forEach(([key, label]) => {
            const d = run.scores && run.scores[key] || {};
            block.append(node("h6", "", label + " · " + (numeric(d.score) ? fmt(d.score) + " / 5" : T("无法判断", "Unable to judge"))));
            addText(block, T("视觉依据", "Visual evidence"), d.evidence);
            addText(block, T("局限", "Limitation"), d.limitation);
            if (!numeric(d.score)) addText(block, T("无法判断原因", "Reason for missing rating"), d.unable_reason);
          });
          addText(block, T("整体局限", "General limitations"), run.general_limitations);
          details.append(block);
        });
      });
      panel.append(details);
    }
    const old = card.querySelector(".improvement-panel");
    if (old) old.replaceWith(panel);
    else {
      const originalScore = card.querySelector(".judge-panel");
      if (originalScore) originalScore.after(panel);
      else card.append(panel);
    }
  });
  const summary = node("section", "improvement-summary");
  summary.id = "figure-improvement-summary";
  summary.append(node("h2", "", T("原图与本研究改图对照", "Original figures and study-generated revisions")));
  summary.append(node("p", "", T("每张原图及其原评分下方展示对应改图与独立评分。原库共 200 篇 / 371 图；生成、内容核查和评分分别记录，未完成项不会显示为已完成。", "Each original figure and its ratings are followed by the corresponding revision and independent ratings. The collection contains 200 papers and 371 figures. Generation, fidelity review, and rating status are tracked separately.")));
  summary.append(node("p", "improvement-progress", Object.keys(names).filter(k => totals[k]).map(k => names[k] + " " + totals[k]).join("; ") + "."));
  summary.append(node("p", "improvement-note", T(
    `主样本：${cohorts.main.scored} / ${cohorts.main.total} 图已评分；风格对照：${cohorts.style.scored} / ${cohorts.style.total} 图已评分。改图独立请求：${judgedRuns}。两组保持分开。`,
    `Main cohort: ${cohorts.main.scored} / ${cohorts.main.total} figures rated; style contrast: ${cohorts.style.scored} / ${cohorts.style.total} figures rated. Independent derivative ratings: ${judgedRuns}. The two cohorts remain separate.`)));
  summary.append(node("p", "improvement-note", T(
    "每项右侧的变化 = 改图中位数 − 原图中位数，↑ 为提升、↓ 为降低、→ 为不变，单位均为分。六维均分为六个中位数的算术平均；先按未四舍五入的值计算变化，再保留两位小数。六项不全则不计算均分。均分仅作描述性比较，不能取代六维分析。空值不代表零分。",
    "The change beside each score is the revised median minus the original median: ↑ increase, ↓ decrease, → unchanged, all in score points. The six-dimension mean is the arithmetic mean of the six medians. Changes are calculated before rounding and displayed to two decimal places. All six medians are required. This descriptive mean does not replace dimension-level analysis; missing values are not zero.")));
  const links = node("nav", "improvement-links");
  for (const [path, label] of [["registry.json", T("生成与核查登记表", "Generation and review registry")], ["README.txt", T("方法与状态说明", "Archived methods and status")], ["completion_report.txt", T("完成记录与未通过项", "Completion record and exclusions (Chinese)")]]) {
    const a = node("a", "", label); a.href = new URL(path, base).href; links.append(a);
  }
  summary.append(links);
  const old = document.getElementById(summary.id);
  if (old) old.replaceWith(summary);
  else gallery.before(summary);
})();
