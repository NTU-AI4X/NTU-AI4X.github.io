/* Presentation-only summaries. Never writes or replaces source judgments. */
(function () {
  "use strict";
  const keys = ["clarity", "organization", "consistency", "aesthetics", "inventiveness", "specificity"];
  const valid = value => typeof value === "number" && Number.isFinite(value) && value >= 1 && value <= 5;
  const median = (record, key) => {
    const d = record && record.dimensions && record.dimensions[key];
    return d && Number.isInteger(d.n) && d.n > 0 && valid(d.median) ? d.median : null;
  };
  const mean = record => {
    const values = keys.map(key => median(record, key));
    return values.every(valid) ? values.reduce((sum, value) => sum + value, 0) / keys.length : null;
  };
  const difference = (revised, original) => valid(revised) && valid(original) ? revised - original : null;
  const deltaBadge = (revised, original, english) => {
    const delta = difference(revised, original);
    const badge = document.createElement("span");
    const direction = delta === null ? "missing" : delta > 0 ? "up" : delta < 0 ? "down" : "same";
    badge.className = "score-delta score-delta-" + direction;
    if (delta === null) {
      badge.textContent = english ? "Δ N/A" : "变化不可用";
      badge.title = english ? "Both original and revised scores are required." : "原图与改图均有有效得分时才计算变化。";
    } else {
      badge.dataset.delta = String(delta);
      const amount = Math.abs(delta).toFixed(2);
      badge.textContent = delta > 0 ? "↑ +" + amount : delta < 0 ? "↓ −" + amount : "→ 0.00";
      const state = english ? (delta > 0 ? "Increase" : delta < 0 ? "Decrease" : "Unchanged") :
        (delta > 0 ? "提升" : delta < 0 ? "降低" : "不变");
      badge.title = english ? `${state}: revised − original; original = ${original.toFixed(2)}.` :
        `${state}：改图 − 原图；原图为 ${original.toFixed(2)} 分。`;
      badge.setAttribute("aria-label", badge.title);
    }
    return badge;
  };
  window.FIGURE_SCORE_METRICS = Object.freeze({keys, valid, median, mean, difference, deltaBadge});
})();
