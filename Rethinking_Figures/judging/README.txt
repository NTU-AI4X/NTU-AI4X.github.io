SIX-DIMENSIONAL FIGURE JUDGMENTS — LOCAL CODEX EXECUTION
======================================================

Purpose and scope
-----------------
This study evaluates visible communication in 371 figures from 200 papers.
The main collection contains 160 papers and 320 figures (160 Motivation, M;
160 Framework, F). The separately selected style-contrast collection contains
40 papers and 51 figures (11 M; 40 F). The style collection must not enter the
main-stage means. Its selection procedure differs from the main collection.

At the user's request, the original GPT-plus-Claude API plan was replaced by
the locally authenticated Codex CLI. The configured model is gpt-6-astra with
high reasoning effort. "Local Codex" refers to the local runner and existing
account authentication; it does not mean an offline model running on this Mac.
No API key is required by this runner. There are no Claude judgments and no
cross-model agreement measurement in this evaluation.

All 1,113 primary judgments completed on 2026-10-31: 371 figures × three fresh
requests. All 200 papers are represented. The final published batch completed
at 09:50:07 UTC (17:50:07 Asia/Singapore).
Eight separate pilot requests check the input and response procedure before
the primary batch. Pilot results are excluded from primary score summaries.
Retries and failed attempts are logged, but do not create additional research
samples or substitute for independent repeat slots.

Frozen inputs and rubric
------------------------
protocol.json identifies the frozen protocol and hashes. The six dimensions
are Communicative Clarity, Organization & Readability, Graphical Consistency,
Aesthetic Coherence, Purposeful Visual Inventiveness, and Design Specificity.
rubric.txt defines anchors at 1, 3, and 5; 2 and 4 are intermediate. A null
score requires a reason. Every dimension requires concrete visible evidence
and a limitation. The procedure does not create an overall quality score.

The model receives the frozen rubric, the M/F role, and three image files:
an exact copy of the anonymous full PNG and two mechanical crops along its
longer side. The crops overlap by 10% of that side, rounded outward to whole
pixels. They preserve the original pixels without resizing or enhancement.
All 371 source PNG hashes match the collection manifests; crop pixels are
checked against the full image. The maximum original side is 2,217 pixels.
These guarantees concern locally prepared input files. The CLI or model
service may internally encode or resize images; that internal representation
is not exposed by this run. The same full-view and detail-view policy is used
throughout to reduce, but not eliminate, this source of viewing uncertainty.

J0001–J0371 are assigned by a seeded shuffle (20261020) of sorted figure IDs.
input_manifest_PRIVATE.json contains the source mapping and must not be sent
to the judge. Source captions, titles, authors, years, venues, stages, cohort
labels, and previous judgments are excluded from the user prompt. Recognizable
content and labels already inside each original figure remain unchanged;
anonymization therefore cannot guarantee that a model cannot recognize a paper.
The pilot is balanced across stage × role and covers the four main topics.

Execution and audit trail
-------------------------
run_judge.py starts a new ephemeral Codex session for every repeat. The runner
disables web search, memories, shell tools, multi-agent tools, apps, plugins,
project-document loading, and host-skill discovery, and ignores user config.
Its request metadata records the exact CLI command. The isolated input folder
contains anonymous image views and the response schema. The runner rejects
unexpected tool use and validates the structured response. Inspect the actual
request_metadata and events for each attempt rather than assuming isolation.

The CLI still has system-level behavior and implicit context that this study
does not fully control. The model ID is a configured alias, not a guaranteed
immutable checkpoint. Fresh sessions prevent deliberate reuse of previous
ratings but do not establish statistical independence of a model's judgments.
The public CLI does not provide a guaranteed fixed sampling seed for this run.
Record runtime_metadata.json, runner_snapshots/, actual request timestamps,
returned events, and the requested model/reasoning settings when reporting it.
runner_provenance_corrections.json documents one first-batch metadata issue:
the runner read its on-disk code hash after the file had been edited, while
the process still executed its startup version. The audit sidecar identifies
the actual startup snapshot without changing any score or raw response.
After completion, the reusable runner was corrected to capture its source hash
once at process startup. The original execution snapshots remain unchanged.

Important files
---------------
protocol.json                 Frozen procedure and content hashes.
rubric.txt / schema.json       Frozen instructions and required response schema.
input_manifest_PRIVATE.json   Figure/source mapping; keep out of judge prompts.
assets/Jxxxx/                 full.png, view_1.png, view_2.png for each figure.
pilot_ids.json                Eight predetermined pilot figure IDs.
pilot_acceptance.json         Recorded pilot review tied to protocol fingerprint.
runs/pilot/                   Pilot results, not included in primary summaries.
runs/primary/                 Separate repeat folders, attempt inputs/metadata,
                              raw responses, events, failures, validated results.
runtime_metadata.json         CLI and Python versions and runner hash.
runner_snapshots/             Exact runner code snapshots indexed by hash.
execution_state.json          Batch state and last execution outcome.
progress.json                 Published logical-run completion counts.
scores.json                   Authentic primary responses and figure aggregates.
scores_long.csv               Primary dimension-level repeat records, when present.
figure_scores.csv             Figure × dimension medians, min/max and valid n.
figure_scores_wide.csv        One figure per row: all six medians, ranges,
                              valid counts, and three individual scores.
gallery_scores.js             Local-file-compatible data used by the gallery.
descriptive_summary.csv/json  Group summaries and figure-level descriptive data.
summary.html                  Readable descriptive tables; partial if incomplete.
evaluation_methods.tex        Reusable English methods text for this completed run.
final_validation.json          Independent validation of the completed primary run.

Run, resume, validate, publish
-----------------------------
Do not run a second batch while execution_state.json reports an active process.
The runner also holds a lock. Successful matching result slots are retained on
resume; failures are explicit. It stops the batch on detected account or quota
problems. Do not edit frozen inputs or settings during a run or silently change
model IDs. Any changed protocol requires a separately identified run directory.

Validate inputs and available primary results:

"/Users/zhaoxiaoqi/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3" \
  "/Users/zhaoxiaoqi/Documents/ChatGPT/画图评估论文 2/sample_library/judging/run_judge.py" validate

Run or resume the primary batch after accepted pilot review:

"/Users/zhaoxiaoqi/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3" \
  "/Users/zhaoxiaoqi/Documents/ChatGPT/画图评估论文 2/sample_library/judging/run_judge.py" \
  run --phase primary --workers 8 --timeout 360 --max-attempts 2

Refresh published scores after a stopped or completed batch:

"/Users/zhaoxiaoqi/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3" \
  "/Users/zhaoxiaoqi/Documents/ChatGPT/画图评估论文 2/sample_library/judging/run_judge.py" publish

Generate the descriptive summary from the current published snapshot:

"/Users/zhaoxiaoqi/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3" \
  "/Users/zhaoxiaoqi/Documents/ChatGPT/画图评估论文 2/sample_library/judging/summarize_results.py"

The existing gallery loads published results from judging/gallery_scores.js.
Reload sample_library/index.html to see the latest published results. Summary
generation does not call a model or edit the original collection or gallery.

Descriptive reporting rules
---------------------------
For each figure and dimension, take the median of available non-null repeat
scores and retain min, max, range, and n/3. A partially scored figure is clearly
marked; an unjudgeable dimension remains null, never zero. Group tables report
valid figures and unique papers, the mean/median of figure medians, quartiles,
and IQR. Quartiles use linear interpolation at (n−1)p (type 7). The means are
descriptive averages of ordinal ratings; they are not calibrated measurements.

Repeat-range histograms report max−min within a figure. Figures with only one
valid rating are excluded from this stability summary. Both n≥2 and n=3
histograms are provided. Pending/failed calls and valid null responses are
distinct. The summary retains incomplete medians and prominently marks partial
snapshots so that unequal completion cannot be mistaken for final evidence.

Tables separate main stages × M/F and style-contrast × M/F. Papers that supply
both M and F are shared units, so group paper counts are not simply additive.
The 1,113 repeat slots are not 1,113 independent samples. No significance tests
or confidence intervals are generated here; future uncertainty estimates must
account for clustering of figures within papers.

Interpretation limits
---------------------
These data describe one model's responses under one rubric and input procedure.
They do not establish human aesthetic preference, reviewer impressions, author
effort, actual AI usage, scientific correctness, or a causal effect of time.
The purposive style cohort differs in selection and topic composition. Stage
contrasts also retain the original collection's source and eligibility limits.
No semantic-faithfulness experiment, pairwise comparison, Claude evaluation,
or human validation is supplied by this primary scoring batch. No automated
research conclusion is generated by the descriptive summary script.
