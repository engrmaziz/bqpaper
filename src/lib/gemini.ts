import { StudentAnswers, QuestionFeedback } from "@/types/exam";

export interface EvaluationOutput {
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
  evaluatedBy: "groq-ai" | "gemini-ai" | "fallback-rubric";
  modelUsed: string;
}

const GEMINI_SYSTEM_PROMPT = `You are a Senior AI Examiner grading a Midterm Paper for "Essentials of AI" (Bano Qabil Pakistan).
Your job is to assess the student's subjective answers strictly according to the official Marking Rubric.

Be fair, encouraging, yet rigorous. The student is an AI student in Pakistan.
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

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash"
];

export async function evaluateSubjectiveAnswersWithGemini(
  answers: StudentAnswers,
  customApiKey?: string
): Promise<EvaluationOutput | null> {
  const apiKey = (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    customApiKey ||
    ""
  ).trim();

  if (!apiKey || apiKey.length < 10) {
    return null;
  }

  const userPrompt = `Grade these student answers according to the marking rubric:\n${JSON.stringify(answers, null, 2)}`;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "BQ-Platform/1.0 (Bano Qabil Examination System)",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: GEMINI_SYSTEM_PROMPT }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        }),
        signal: AbortSignal.timeout(4500),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[Gemini AI] Model ${model} returned HTTP ${response.status}: ${errorText.substring(0, 150)}`);
        continue;
      }

      const data = await response.json();
      const rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawContent) continue;

      const parsed = JSON.parse(rawContent);

      const secB = Math.min(10, Math.max(0, Number(parsed.sectionScores?.sectionB) || 0));
      const secC = Math.min(20, Math.max(0, Number(parsed.sectionScores?.sectionC) || 0));
      const secD = Math.min(50, Math.max(0, Number(parsed.sectionScores?.sectionD) || 0));

      console.log(`[Gemini AI] Successfully graded answers with ${model} (Sec B: ${secB}, Sec C: ${secC}, Sec D: ${secD})`);

      return {
        sectionScores: {
          sectionB: Math.round(secB * 10) / 10,
          sectionC: Math.round(secC * 10) / 10,
          sectionD: Math.round(secD * 10) / 10,
        },
        subjectiveFeedback: parsed.subjectiveFeedback || {},
        generalFeedback: {
          strengths: parsed.generalFeedback?.strengths || ["Solid demonstration of practical AI and machine learning concepts."],
          improvements: parsed.generalFeedback?.improvements || ["Ensure all prompt constraints and edge-case handling rules are stated precisely."],
          summary: parsed.generalFeedback?.summary || "Commendable performance on the Midterm Examination. Keep exploring applied AI!",
        },
        evaluatedBy: "gemini-ai",
        modelUsed: model,
      };
    } catch (err: any) {
      console.warn(`[Gemini AI] Attempt with model ${model} failed:`, err?.message || err);
    }
  }

  return null;
}
