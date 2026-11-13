import { StudentAnswers, QuestionFeedback } from "@/types/exam";
import { SHORT_QUESTIONS, LONG_QUESTION, PRACTICAL_PROJECT_MILESTONES } from "@/data/examData";

interface EvaluationOutput {
  sectionScores: {
    sectionB: number; // max 10
    sectionC: number; // max 20
    sectionD: number; // max 50
  };
  subjectiveFeedback: Record<string, QuestionFeedback>;
  generalFeedback: {
    strengths: string[];
    improvements: string[];
    summary: string;
  };
  evaluatedBy: "groq-ai" | "fallback-rubric";
  modelUsed: string;
}

export async function evaluateSubjectiveAnswersWithGroq(
  answers: StudentAnswers,
  customApiKey?: string
): Promise<EvaluationOutput> {
  const apiKey = (process.env.GROQ_API_KEY || customApiKey || "").trim();

  if (apiKey && apiKey.length > 10) {
    try {
      const groqResult = await callGroqAPI(answers, apiKey.trim());
      if (groqResult) {
        return groqResult;
      }
    } catch (err) {
      console.warn("Groq API evaluation encountered an issue, running fallback engine:", err);
    }
  }

  // Fallback Rule-Based Semantic Evaluator
  return runFallbackEvaluationEngine(answers);
}

async function callGroqAPI(answers: StudentAnswers, apiKey: string): Promise<EvaluationOutput | null> {
  const systemPrompt = `You are a Senior AI Examiner grading an 8th-grade Midterm Paper for "Essentials of AI" (Bano Qabil Pakistan).
Your job is to assess the student's subjective answers strictly according to the official Marking Rubric.

Be fair, encouraging, yet rigorous. The student is an 8th standard student in Pakistan.
Grade Section B (10 marks total), Section C (20 marks total), and Section D (50 marks total).

MARKING RUBRIC REFERENCE:
- Section B Q1 (5 Marks):
  * q1_a (2 Mks): Explain Supervised = training with answers/labels (like solved past papers); Unsupervised = no answers/labels, model clusters on its own.
  * q1_b_sup (1.5 Mks): Real Pakistani supervised case (e.g. Easypaisa fraud filter, cotton leaf disease scanner, spam filter).
  * q1_b_unsup (1.5 Mks): Real Pakistani unsupervised case (e.g. Daraz clustering customer buying habits, unlabelled news grouping).
- Section B Q2 (5 Marks):
  * q2_a (2 Mks): Cause of Ratta = identical unvaried photos (same angle, same desk, same light) causing background memorization.
  * q2_b (3 Mks): 4 Words of Good Data = Enough (Kaafi), Balanced (Mutawazin), Varied (Mutanawwo), Correct (Durust). (0.75 mk each).

- Section C Q3 (20 Marks):
  * part_a_chain (3 Mks): Ears = Speech-to-Text (STT), Brain = LLM / NLP Model, Mouth = Text-to-Speech (TTS). (1 mk each).
  * part_a_error (3 Mks): Ears/STT break first on noisy road; wrong text fed to Brain; Mouth speaks irrelevant, confident wrong location/answer.
  * part_b_sarcasm (3 Mks): Sarcasm uses praise words (Shukriya) masking complaints; model counts positive words and falsely labels positive.
  * part_b_slang (3 Mks): Cricket/youth slang ('aag', 'sick', 'tabahi') means brilliant, but literal models classify as fire/illness/destruction (Negative).
  * part_c_strangers (3 Mks): Model memorized familiar backgrounds/hands; strangers bring new angles, hands, and lighting that expose memorization.
  * part_c_doctor_ethics (5 Mks): 95% accuracy means 5 in 100 misdiagnosed; False alarm = re-test; A Miss = sick patient sent home untreated (fatal). Doctor must make final medical decision.

- Section D Practical Project (50 Marks):
  * m1_classes (3 Mks): 2 food classes (Roll, Samosa) + 1 safety class ('Nothing' / Empty counter).
  * m1_variations (4 Mks): 3 realistic variations (angles, light levels, backgrounds/hands).
  * m1_privacy (3 Mks): Point camera down at counter; never record student faces or private cards.
  * m2_table_types (8 Mks): 5 valid column headers with correct data types (Number, Category, Text, Date).
  * m2_privacy_removal (2 Mks): Student names/phones are PII; sales reports only need item counts, not personal identities.
  * m3_cleaning_fixes (10 Mks): Row 1&2 (unify case, remove duplicate); Row 3 (mark blank Qty, strip 'rs' from price); Row 4 (delete test row); Row 5 (blank invalid 15 rating, record in log, never guess). (2.5 mks each).
  * m4_buttons (3 Mks): 3 logical buttons (Menu, Timings, Talk to Staff).
  * m4_prompt (5 Mks): Who (canteen helper), What (order booking), Details (polite Roman Urdu 'Aap', official prices only, never guess), Length (max 2 lines).
  * m4_safety (2 Mks): Emergency allergy fallback to human staff / phone.
  * m5_accuracy_math (3 Mks): (17 / 20) * 100 = 85%.
  * m5_insight (4 Mks): What = Roll 85, Soup 5 (1.5 mks); So What = quick finger food preferred in short break (1.5 mks); Now What = double rolls, discontinue soup (1 mk).
  * m5_model_card (3 Mks): Line 1 (what it does), Line 2 (data used), Line 3 (where it fails/limitations). (1 mk each).

OUTPUT FORMAT: Return STRICT JSON ONLY with this exact structure:
{
  "sectionScores": {
    "sectionB": number,
    "sectionC": number,
    "sectionD": number
  },
  "subjectiveFeedback": {
    "<question_key>": {
      "marksAwarded": number,
      "maxMarks": number,
      "feedback": "Concise 1-2 sentence explanation"
    }
  },
  "generalFeedback": {
    "strengths": ["string", "string"],
    "improvements": ["string", "string"],
    "summary": "2-3 sentences of encouraging student summary"
  }
}`;

  const userPayload = JSON.stringify(answers, null, 2);

  // 1. Live dynamic discovery: Query Groq's official /v1/models endpoint to find currently active models
  let discoveredModels: string[] = [];
  try {
    const catalogRes = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { 
        "Authorization": `Bearer ${apiKey}`,
        "User-Agent": "BQ-Platform/1.0 (Bano Qabil Examination System)"
      },
    });
    if (catalogRes.ok) {
      const catalogData = await catalogRes.json();
      if (Array.isArray(catalogData?.data)) {
        discoveredModels = catalogData.data.map((m: any) => m.id);
      }
    }
  } catch (err) {
    console.warn("Dynamic Groq model catalog query skipped:", err);
  }

  // 2. Priority model candidates
  const PREFERRED_MODELS = [
    process.env.GROQ_MODEL,
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.8-27b",
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
  ].filter(Boolean) as string[];

  // 3. Assemble active models to try
  const modelsToTry: string[] = [];
  if (discoveredModels.length > 0) {
    // Priority preferred models that exist on this account
    for (const pref of PREFERRED_MODELS) {
      if (discoveredModels.includes(pref) && !modelsToTry.includes(pref)) {
        modelsToTry.push(pref);
      }
    }
    // Any other available chat models (llama, gpt, qwen, mixtral)
    for (const id of discoveredModels) {
      const lower = id.toLowerCase();
      if (
        (lower.includes("llama") || lower.includes("gpt") || lower.includes("qwen") || lower.includes("mixtral")) &&
        !lower.includes("whisper") &&
        !lower.includes("guard") &&
        !modelsToTry.includes(id)
      ) {
        modelsToTry.push(id);
      }
    }
  }

  // Fallback to static preferred list if discovery was empty
  if (modelsToTry.length === 0) {
    modelsToTry.push(...PREFERRED_MODELS);
  }

  for (const model of modelsToTry) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "BQ-Platform/1.0 (Bano Qabil Examination System)",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Grade these student answers according to the rubric:\n${userPayload}` },
          ],
          temperature: 0.1,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Groq model ${model} failed (HTTP ${response.status}): ${errorText}. Trying next candidate model...`);
        continue;
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent) continue;

      const parsed = JSON.parse(rawContent);
      return {
        sectionScores: {
          sectionB: Math.min(10, Math.max(0, Number(parsed.sectionScores?.sectionB) || 0)),
          sectionC: Math.min(20, Math.max(0, Number(parsed.sectionScores?.sectionC) || 0)),
          sectionD: Math.min(50, Math.max(0, Number(parsed.sectionScores?.sectionD) || 0)),
        },
        subjectiveFeedback: parsed.subjectiveFeedback || {},
        generalFeedback: {
          strengths: parsed.generalFeedback?.strengths || ["Demonstrated good fundamental grasp of AI concepts."],
          improvements: parsed.generalFeedback?.improvements || ["Review technical terms and precision in prompt recipes."],
          summary: parsed.generalFeedback?.summary || "Good effort overall. Keep applying AI to practical problems!",
        },
        evaluatedBy: "groq-ai",
        modelUsed: model,
      };
    } catch (err) {
      console.warn(`Error attempting Groq model ${model}:`, err);
    }
  }

  return null;
}

// Robust Heuristic Fallback Engine
function runFallbackEvaluationEngine(answers: StudentAnswers): EvaluationOutput {
  const fb: Record<string, QuestionFeedback> = {};
  const sq = answers?.shortQuestions || ({} as any);
  const lq = answers?.longQuestion || ({} as any);
  const pp = answers?.practicalProject || ({} as any);

  // --- SECTION B (10 Marks) ---
  // Q1_a (2 marks)
  const q1a_text = (sq.q1_a || "").toLowerCase();
  let q1a_score = 0;
  if (q1a_text.includes("label") || q1a_text.includes("answer") || q1a_text.includes("past paper") || q1a_text.includes("teacher")) {
    q1a_score += 1;
  }
  if (q1a_text.includes("cluster") || q1a_text.includes("group") || q1a_text.includes("no label") || q1a_text.includes("pattern") || q1a_text.includes("shelf")) {
    q1a_score += 1;
  }
  fb["q1_a"] = {
    marksAwarded: q1a_score,
    maxMarks: 2,
    feedback: q1a_score === 2 ? "Spot-on! Clearly distinguished labels in supervised learning from automatic clustering in unsupervised learning." : "Review the concept of 'labels' (answers) being present in supervised learning and absent in unsupervised."
  };

  // Q1_b_sup (1.5 marks)
  const q1b_sup = (sq.q1_b_sup || "").toLowerCase();
  let q1b_sup_score = 0;
  if (q1b_sup.includes("easypaisa") || q1b_sup.includes("fraud") || q1b_sup.includes("leaf") || q1b_sup.includes("spam") || q1b_sup.includes("cotton") || q1b_sup.includes("disease") || q1b_sup.includes("teachable")) {
    q1b_sup_score = 1.5;
  } else if (q1b_sup.length > 5) {
    q1b_sup_score = 1.0;
  }
  fb["q1_b_sup"] = {
    marksAwarded: q1b_sup_score,
    maxMarks: 1.5,
    feedback: q1b_sup_score === 1.5 ? "Excellent real-world supervised learning example with clear ground truth." : "Mention a specific app or case (e.g. Easypaisa fraud detection or plant disease scanning)."
  };

  // Q1_b_unsup (1.5 marks)
  const q1b_unsup = (sq.q1_b_unsup || "").toLowerCase();
  let q1b_unsup_score = 0;
  if (q1b_unsup.includes("group") || q1b_unsup.includes("customer") || q1b_unsup.includes("cluster") || q1b_unsup.includes("daraz") || q1b_unsup.includes("shop") || q1b_unsup.includes("news")) {
    q1b_unsup_score = 1.5;
  } else if (q1b_unsup.length > 5) {
    q1b_unsup_score = 1.0;
  }
  fb["q1_b_unsup"] = {
    marksAwarded: q1b_unsup_score,
    maxMarks: 1.5,
    feedback: q1b_unsup_score === 1.5 ? "Great example of grouping or clustering without predefined labels." : "An example like customer segmentation on Daraz or clustering news articles illustrates this well."
  };

  // Q2_a (2 marks)
  const q2a_text = (sq.q2_a || "").toLowerCase();
  let q2a_score = 0;
  if (q2a_text.includes("same") || q2a_text.includes("memoriz") || q2a_text.includes("desk") || q2a_text.includes("background") || q2a_text.includes("angle") || q2a_text.includes("epoch") || q2a_text.includes("variety")) {
    q2a_score = 2;
  } else if (q2a_text.length > 5) {
    q2a_score = 1;
  }
  fb["q2_a"] = {
    marksAwarded: q2a_score,
    maxMarks: 2,
    feedback: q2a_score === 2 ? "Accurately identified that lack of variety and background memorization causes overfitting." : "Explain how taking photos in identical conditions causes the model to memorize the background."
  };

  // Q2_b (3 marks)
  const q2b_text = (sq.q2_b || "").toLowerCase();
  let q2b_score = 0;
  if (q2b_text.includes("enough") || q2b_text.includes("kaafi") || q2b_text.includes("کافی")) q2b_score += 0.75;
  if (q2b_text.includes("balance") || q2b_text.includes("mutawazin") || q2b_text.includes("متوازن")) q2b_score += 0.75;
  if (q2b_text.includes("vari") || q2b_text.includes("mutanawwo") || q2b_text.includes("متنوع")) q2b_score += 0.75;
  if (q2b_text.includes("correct") || q2b_text.includes("durust") || q2b_text.includes("درست")) q2b_score += 0.75;
  fb["q2_b"] = {
    marksAwarded: q2b_score,
    maxMarks: 3,
    feedback: q2b_score >= 2.5 ? "All four pillars of good data correctly identified!" : "Remember the 4 words: Enough (Kaafi), Balanced (Mutawazin), Varied (Mutanawwo), and Correct (Durust)."
  };

  const secBTotal = q1a_score + q1b_sup_score + q1b_unsup_score + q2a_score + q2b_score;

  // --- SECTION C (20 Marks) ---
  // part_a_chain (3 marks)
  const pa_chain = (lq.part_a_chain || "").toLowerCase();
  let pa_chain_score = 0;
  if (pa_chain.includes("stt") || pa_chain.includes("speech to text") || pa_chain.includes("listen")) pa_chain_score += 1;
  if (pa_chain.includes("llm") || pa_chain.includes("language model") || pa_chain.includes("nlp") || pa_chain.includes("brain")) pa_chain_score += 1;
  if (pa_chain.includes("tts") || pa_chain.includes("text to speech") || pa_chain.includes("speak")) pa_chain_score += 1;
  fb["part_a_chain"] = {
    marksAwarded: pa_chain_score,
    maxMarks: 3,
    feedback: pa_chain_score === 3 ? "Complete and accurate technical mapping: STT -> LLM -> TTS." : "Ensure all three terms (Speech-to-Text, LLM/Language Model, Text-to-Speech) are specified."
  };

  // part_a_error (3 marks)
  const pa_error = (lq.part_a_error || "").toLowerCase();
  let pa_error_score = 0;
  if (pa_error.includes("ear") || pa_error.includes("stt") || pa_error.includes("speech to text") || pa_error.includes("listen") || pa_error.includes("hear")) pa_error_score += 1.5;
  if (pa_error.includes("wrong") || pa_error.includes("brain") || pa_error.includes("mouth") || pa_error.includes("confident") || pa_error.includes("fail")) pa_error_score += 1.5;
  fb["part_a_error"] = {
    marksAwarded: pa_error_score,
    maxMarks: 3,
    feedback: pa_error_score === 3 ? "Superb understanding of error propagation across chained AI components." : "Point out that the 'Ears' (STT) mishear first, feeding corrupt text to the Brain."
  };

  // part_b_sarcasm (3 marks)
  const pb_sarcasm = (lq.part_b_sarcasm || "").toLowerCase();
  let pb_sarcasm_score = 0;
  if (pb_sarcasm.includes("praise") || pb_sarcasm.includes("word") || pb_sarcasm.includes("wah") || pb_sarcasm.includes("shukriya") || pb_sarcasm.includes("positive") || pb_sarcasm.includes("literal")) pb_sarcasm_score += 1.5;
  if (pb_sarcasm.includes("tone") || pb_sarcasm.includes("complaint") || pb_sarcasm.includes("hidden") || pb_sarcasm.includes("anger") || pb_sarcasm.includes("opposite")) pb_sarcasm_score += 1.5;
  fb["part_b_sarcasm"] = {
    marksAwarded: pb_sarcasm_score,
    maxMarks: 3,
    feedback: pb_sarcasm_score === 3 ? "Clear explanation of why literal word-counting fails on sarcastic comments." : "Highlight that superficial praise words mask complaints, tricking basic sentiment models."
  };

  // part_b_slang (3 marks)
  const pb_slang = (lq.part_b_slang || "").toLowerCase();
  let pb_slang_score = 0;
  if (pb_slang.includes("aag") || pb_slang.includes("sick") || pb_slang.includes("tabahi") || pb_slang.includes("fire") || pb_slang.includes("slang")) pb_slang_score += 1.5;
  if (pb_slang.includes("negative") || pb_slang.includes("literal") || pb_slang.includes("illness") || pb_slang.includes("burn") || pb_slang.includes("great")) pb_slang_score += 1.5;
  fb["part_b_slang"] = {
    marksAwarded: pb_slang_score,
    maxMarks: 3,
    feedback: pb_slang_score === 3 ? "Brilliant distinction between literal vocabulary meaning and local vernacular slang." : "Explain how slang words like 'aag' or 'sick' mean great performance, but literal tools interpret them as danger/illness."
  };

  // part_c_strangers (3 marks)
  const pc_strangers = (lq.part_c_strangers || "").toLowerCase();
  let pc_strangers_score = 0;
  if (pc_strangers.includes("memoriz") || pc_strangers.includes("background") || pc_strangers.includes("angle") || pc_strangers.includes("desk") || pc_strangers.includes("hand") || pc_strangers.includes("light")) pc_strangers_score += 1.5;
  if (pc_strangers.includes("new") || pc_strangers.includes("stranger") || pc_strangers.includes("unseen") || pc_strangers.includes("shift")) pc_strangers_score += 1.5;
  fb["part_c_strangers"] = {
    marksAwarded: pc_strangers_score,
    maxMarks: 3,
    feedback: pc_strangers_score === 3 ? "Correctly identified data leakage and distribution shift when testing with strangers." : "Mention that training photos share the same desk and lighting, which the model memorizes."
  };

  // part_c_doctor_ethics (5 marks)
  const pc_doc = (lq.part_c_doctor_ethics || "").toLowerCase();
  let pc_doc_score = 0;
  if (pc_doc.includes("5") || pc_doc.includes("100") || pc_doc.includes("mistake") || pc_doc.includes("error")) pc_doc_score += 1.5;
  if (pc_doc.includes("miss") || pc_doc.includes("false") || pc_doc.includes("untreated") || pc_doc.includes("home") || pc_doc.includes("die")) pc_doc_score += 2;
  if (pc_doc.includes("doctor") || pc_doc.includes("human") || pc_doc.includes("final") || pc_doc.includes("flag") || pc_doc.includes("responsib")) pc_doc_score += 1.5;
  fb["part_c_doctor_ethics"] = {
    marksAwarded: pc_doc_score,
    maxMarks: 5,
    feedback: pc_doc_score >= 4 ? "Comprehensive ethical analysis of False Alarms vs. Misses in clinical AI." : "Crucially contrast 'A Miss' (sending sick patient home untreated) with 'A False Alarm' and emphasize that AI flags while doctors decide."
  };

  const secCTotal = pa_chain_score + pa_error_score + pb_sarcasm_score + pb_slang_score + pc_strangers_score + pc_doc_score;

  // --- SECTION D (50 Marks) ---
  // m1_classes (3 marks)
  const m1_cls = (pp.m1_classes || "").toLowerCase();
  let m1_cls_score = 0;
  if (m1_cls.includes("roll") || m1_cls.includes("samosa") || m1_cls.includes("biryani") || m1_cls.includes("chaat") || m1_cls.includes("plate") || m1_cls.includes("burger")) m1_cls_score += 2;
  if (m1_cls.includes("nothing") || m1_cls.includes("empty") || m1_cls.includes("clear") || m1_cls.includes("desk")) m1_cls_score += 1;
  fb["m1_classes"] = {
    marksAwarded: m1_cls_score,
    maxMarks: 3,
    feedback: m1_cls_score === 3 ? "Both food classes and the critical 'Nothing' class included!" : "Be sure to include the 'Nothing/Empty Counter' class to prevent false triggers."
  };

  // m1_variations (4 marks)
  const m1_var = (pp.m1_variations || "").toLowerCase();
  let m1_var_score = 0;
  if (m1_var.includes("angle") || m1_var.includes("top") || m1_var.includes("side")) m1_var_score += 1.33;
  if (m1_var.includes("light") || m1_var.includes("sun") || m1_var.includes("dim") || m1_var.includes("shadow")) m1_var_score += 1.33;
  if (m1_var.includes("hand") || m1_var.includes("tray") || m1_var.includes("plate") || m1_var.includes("background")) m1_var_score += 1.34;
  m1_var_score = Math.round(m1_var_score * 10) / 10;
  fb["m1_variations"] = {
    marksAwarded: m1_var_score,
    maxMarks: 4,
    feedback: m1_var_score >= 3.5 ? "Realistic, practical photo variations that ensure robust classification." : "Include variations across angles, lighting conditions, and different hands/trays."
  };

  // m1_privacy (3 marks)
  const m1_priv = (pp.m1_privacy || "").toLowerCase();
  let m1_priv_score = 0;
  if (m1_priv.includes("face") || m1_priv.includes("consent") || m1_priv.includes("permission") || m1_priv.includes("counter") || m1_priv.includes("down") || m1_priv.includes("id")) m1_priv_score = 3;
  else if (m1_priv.length > 5) m1_priv_score = 1.5;
  fb["m1_privacy"] = {
    marksAwarded: m1_priv_score,
    maxMarks: 3,
    feedback: m1_priv_score === 3 ? "Excellent privacy rule: pointing strictly at food trays and protecting student faces." : "Emphasize asking permission and keeping human faces/ID cards out of training datasets."
  };

  // m2_table_types (8 marks)
  const m2_tbl = (pp.m2_table_types || "").toLowerCase();
  let m2_tbl_score = 0;
  if (m2_tbl.includes("category")) m2_tbl_score += 2;
  if (m2_tbl.includes("number")) m2_tbl_score += 2;
  if (m2_tbl.includes("date")) m2_tbl_score += 2;
  if (m2_tbl.includes("order") || m2_tbl.includes("item") || m2_tbl.includes("qty") || m2_tbl.includes("price")) m2_tbl_score += 2;
  fb["m2_table_types"] = {
    marksAwarded: m2_tbl_score,
    maxMarks: 8,
    feedback: m2_tbl_score === 8 ? "Table architecture is clean, structured, and properly typed." : "Ensure you have 5 headers spanning Number, Category, Text, and Date types."
  };

  // m2_privacy_removal (2 marks)
  const m2_priv = (pp.m2_privacy_removal || "").toLowerCase();
  let m2_priv_score = 0;
  if (m2_priv.includes("private") || m2_priv.includes("pii") || m2_priv.includes("identity") || m2_priv.includes("secret") || m2_priv.includes("protect") || m2_priv.includes("total")) m2_priv_score = 2;
  else if (m2_priv.length > 5) m2_priv_score = 1;
  fb["m2_privacy_removal"] = {
    marksAwarded: m2_priv_score,
    maxMarks: 2,
    feedback: m2_priv_score === 2 ? "Great understanding of data minimization ('collect less, share less')." : "Explain that council reports only require sales numbers, not personal student identities."
  };

  // m3_cleaning_fixes (10 marks)
  const m3_clean = (pp.m3_cleaning_fixes || "").toLowerCase();
  let m3_score = 0;
  if (m3_clean.includes("case") || m3_clean.includes("duplicate")) m3_score += 2.5;
  if (m3_clean.includes("blank") || m3_clean.includes("rs") || m3_clean.includes("250")) m3_score += 2.5;
  if (m3_clean.includes("delete") || m3_clean.includes("test")) m3_score += 2.5;
  if (m3_clean.includes("rating") || m3_clean.includes("15") || m3_clean.includes("clear") || m3_clean.includes("log")) m3_score += 2.5;
  fb["m3_cleaning_fixes"] = {
    marksAwarded: m3_score,
    maxMarks: 10,
    feedback: m3_score >= 7.5 ? "Exceptional data cleaning troubleshooting across duplicates, text formats, and bogus values." : "Review how to handle duplicates (unify case), text in prices (strip 'rs'), test rows (delete), and out-of-range ratings (clear)."
  };

  // m4_buttons (3 marks)
  const m4_btn = (pp.m4_buttons || "").toLowerCase();
  let m4_btn_score = 0;
  if (m4_btn.includes("menu") || m4_btn.includes("price")) m4_btn_score += 1;
  if (m4_btn.includes("time") || m4_btn.includes("order") || m4_btn.includes("food")) m4_btn_score += 1;
  if (m4_btn.includes("staff") || m4_btn.includes("human") || m4_btn.includes("contact") || m4_btn.includes("help")) m4_btn_score += 1;
  fb["m4_buttons"] = {
    marksAwarded: m4_btn_score,
    maxMarks: 3,
    feedback: m4_btn_score === 3 ? "Clean 3-button Landbot navigation with clear human contact option." : "Include Menu, Timings, and an option to reach a human."
  };

  // m4_prompt (5 marks)
  const m4_prm = (pp.m4_prompt || "").toLowerCase();
  let m4_prm_score = 0;
  if (m4_prm.includes("who") || m4_prm.includes("you are") || m4_prm.includes("helper") || m4_prm.includes("assistant")) m4_prm_score += 1.25;
  if (m4_prm.includes("what") || m4_prm.includes("lunch") || m4_prm.includes("order") || m4_prm.includes("menu")) m4_prm_score += 1.25;
  if (m4_prm.includes("roman urdu") || m4_prm.includes("aap") || m4_prm.includes("never guess") || m4_prm.includes("exact") || m4_prm.includes("price")) m4_prm_score += 1.25;
  if (m4_prm.includes("length") || m4_prm.includes("line") || m4_prm.includes("short")) m4_prm_score += 1.25;
  m4_prm_score = Math.round(m4_prm_score * 10) / 10;
  fb["m4_prompt"] = {
    marksAwarded: m4_prm_score,
    maxMarks: 5,
    feedback: m4_prm_score >= 4 ? "Well-engineered prompt strictly adhering to Who, What, Details, Length!" : "Check all 4 recipe parts: Who (role), What (task), Details (prices, Roman Urdu), Length (2 lines)."
  };

  // m4_safety (2 marks)
  const m4_safe = (pp.m4_safety || "").toLowerCase();
  let m4_safe_score = 0;
  if (m4_safe.includes("counter") || m4_safe.includes("staff") || m4_safe.includes("human") || m4_safe.includes("call") || m4_safe.includes("emergency") || m4_safe.includes("phone")) m4_safe_score = 2;
  else if (m4_safe.length > 5) m4_safe_score = 1;
  fb["m4_safety"] = {
    marksAwarded: m4_safe_score,
    maxMarks: 2,
    feedback: m4_safe_score === 2 ? "Crucial safety guardrail directing medical/allergy concerns to human staff." : "Ensure the bot directs allergy inquiries straight to a human."
  };

  // m5_accuracy_math (3 marks)
  const m5_acc = (pp.m5_accuracy_math || "").toLowerCase();
  let m5_acc_score = 0;
  if (m5_acc.includes("85") || m5_acc.includes("17/20") || m5_acc.includes("17 / 20")) m5_acc_score = 3;
  else if (m5_acc.includes("correct") || m5_acc.includes("total")) m5_acc_score = 1.5;
  fb["m5_accuracy_math"] = {
    marksAwarded: m5_acc_score,
    maxMarks: 3,
    feedback: m5_acc_score === 3 ? "Accurate math: (17 / 20) * 100 = 85%." : "Formula is Accuracy = (Correct / Total) * 100. (17/20)*100 = 85%."
  };

  // m5_insight (4 marks)
  const m5_ins = (pp.m5_insight || "").toLowerCase();
  let m5_ins_score = 0;
  if (m5_ins.includes("what") || m5_ins.includes("85") || m5_ins.includes("roll")) m5_ins_score += 1.5;
  if (m5_ins.includes("so what") || m5_ins.includes("finger") || m5_ins.includes("recess") || m5_ins.includes("break") || m5_ins.includes("prefer")) m5_ins_score += 1.5;
  if (m5_ins.includes("now what") || m5_ins.includes("double") || m5_ins.includes("prepare") || m5_ins.includes("stop") || m5_ins.includes("waste")) m5_ins_score += 1.0;
  fb["m5_insight"] = {
    marksAwarded: m5_ins_score,
    maxMarks: 4,
    feedback: m5_ins_score >= 3.5 ? "Actionable insight following the What -> So What -> Now What schema!" : "Ensure all 3 parts are covered: the data fact (What), why it matters (So What), and what action to take (Now What)."
  };

  // m5_model_card (3 marks)
  const m5_mc = (pp.m5_model_card || "").toLowerCase();
  let m5_mc_score = 0;
  if (m5_mc.includes("does") || m5_mc.includes("classif") || m5_mc.includes("roll") || m5_mc.includes("canteen")) m5_mc_score += 1;
  if (m5_mc.includes("data") || m5_mc.includes("photo") || m5_mc.includes("webcam")) m5_mc_score += 1;
  if (m5_mc.includes("fail") || m5_mc.includes("foil") || m5_mc.includes("dim") || m5_mc.includes("dark") || m5_mc.includes("far")) m5_mc_score += 1;
  fb["m5_model_card"] = {
    marksAwarded: m5_mc_score,
    maxMarks: 3,
    feedback: m5_mc_score === 3 ? "Transparent Model Card with honest limitation disclosure." : "State what it does, what data trained it, and honestly admit where it fails."
  };

  const secDTotal = m1_cls_score + m1_var_score + m1_priv_score + m2_tbl_score + m2_priv_score + m3_score + m4_btn_score + m4_prm_score + m4_safe_score + m5_acc_score + m5_ins_score + m5_mc_score;

  return {
    sectionScores: {
      sectionB: Math.min(10, Math.round(secBTotal * 10) / 10),
      sectionC: Math.min(20, Math.round(secCTotal * 10) / 10),
      sectionD: Math.min(50, Math.round(secDTotal * 10) / 10),
    },
    subjectiveFeedback: fb,
    generalFeedback: {
      strengths: [
        "Strong conceptual clarity on supervised vs. unsupervised paradigms.",
        "Demonstrated solid ethical intuition regarding healthcare AI and student privacy.",
        "Accurately tackled data cleaning anomalies and practical prompt engineering."
      ],
      improvements: [
        "Be even more specific with data variation rules (lighting and angle diversity).",
        "Keep practicing 4-part prompt constraints to eliminate hallucinated pricing."
      ],
      summary: "Commendable performance! You showed real engineering mindset across vision, NLP, and data cleaning."
    },
    evaluatedBy: "fallback-rubric",
    modelUsed: "deterministic-rubric-engine",
  };
}
