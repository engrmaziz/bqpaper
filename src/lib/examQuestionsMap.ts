import { StudentAnswers } from "@/types/exam";
import { MCQ_QUESTIONS, SHORT_QUESTIONS, LONG_QUESTION, PRACTICAL_PROJECT_MILESTONES } from "@/data/examData";

export interface PairedQuestionAnswer {
  section: "Section A: Multiple Choice Questions" | "Section B: Short Questions" | "Section C: Long Scenario Questions" | "Section D: Practical AI Project";
  questionKey: string;
  questionTitle: string;
  questionPrompt: string;
  maxMarks: number;
  studentAnswer: string;
  correctAnswerOrRubric?: string;
}

/**
 * Pairs every single question on the Bano Qabil AI Midterm Exam with the candidate's exact submitted answer.
 * Stored permanently in Supabase alongside the submission so no question or answer context is ever lost.
 */
export function buildCompleteExamPaper(answers: StudentAnswers): PairedQuestionAnswer[] {
  const paper: PairedQuestionAnswer[] = [];

  // 1. SECTION A: MCQs (20 Questions, 1 Mark Each)
  MCQ_QUESTIONS.forEach((q) => {
    const studentAns = answers.mcqs?.[q.id] || "";
    paper.push({
      section: "Section A: Multiple Choice Questions",
      questionKey: `mcq_${q.id}`,
      questionTitle: `Question ${q.id} (MCQ)`,
      questionPrompt: `${q.question}\nOptions: A) ${q.options.A} | B) ${q.options.B} | C) ${q.options.C} | D) ${q.options.D}`,
      maxMarks: 1,
      studentAnswer: studentAns ? `${studentAns} (${q.options[studentAns] || ""})` : "(Unanswered)",
      correctAnswerOrRubric: `Correct: ${q.correct}. ${q.explanation}`,
    });
  });

  // 2. SECTION B: Short Questions (10 Marks Total)
  const sq = answers.shortQuestions || ({} as any);

  // Q1 Parts
  paper.push({
    section: "Section B: Short Questions",
    questionKey: "q1_a",
    questionTitle: "Q1 Part (a) - Supervised vs. Unsupervised Learning",
    questionPrompt: "Differentiate between Supervised and Unsupervised Learning using simple language.",
    maxMarks: 2,
    studentAnswer: sq.q1_a || "(Unanswered)",
    correctAnswerOrRubric: "Supervised: Training with answers/labels. Unsupervised: Training with no labels, clusters patterns automatically.",
  });

  paper.push({
    section: "Section B: Short Questions",
    questionKey: "q1_b_sup",
    questionTitle: "Q1 Part (b) - Supervised Pakistani Real-World Case",
    questionPrompt: "Provide one real-world Pakistani supervised machine learning example.",
    maxMarks: 1.5,
    studentAnswer: sq.q1_b_sup || "(Unanswered)",
    correctAnswerOrRubric: "Example: Easypaisa fraud detection, cotton leaf disease scanner, or spam message filter.",
  });

  paper.push({
    section: "Section B: Short Questions",
    questionKey: "q1_b_unsup",
    questionTitle: "Q1 Part (b) - Unsupervised Pakistani Real-World Case",
    questionPrompt: "Provide one real-world Pakistani unsupervised machine learning example.",
    maxMarks: 1.5,
    studentAnswer: sq.q1_b_unsup || "(Unanswered)",
    correctAnswerOrRubric: "Example: Daraz customer shopping basket clustering, unlabelled news grouping.",
  });

  // Q2 Parts
  paper.push({
    section: "Section B: Short Questions",
    questionKey: "q2_a",
    questionTitle: "Q2 Part (a) - Cause of Model Ratta (Overfitting)",
    questionPrompt: "Explain what caused the Teachable Machine model to memorize (ratta) instead of learning.",
    maxMarks: 2,
    studentAnswer: sq.q2_a || "(Unanswered)",
    correctAnswerOrRubric: "Taking photos in identical conditions (same angle, same desk, same lighting) makes the model memorize the background.",
  });

  paper.push({
    section: "Section B: Short Questions",
    questionKey: "q2_b",
    questionTitle: "Q2 Part (b) - Four Pillars of Good Data",
    questionPrompt: "State the 4 essential words/qualities that define high-quality training data.",
    maxMarks: 3,
    studentAnswer: sq.q2_b || "(Unanswered)",
    correctAnswerOrRubric: "Enough (Kaafi), Balanced (Mutawazin), Varied (Mutanawwo), Correct (Durust).",
  });

  // 3. SECTION C: Long Scenario Questions (20 Marks Total)
  const lq = answers.longQuestion || ({} as any);

  paper.push({
    section: "Section C: Long Scenario Questions",
    questionKey: "part_a_chain",
    questionTitle: "Q3 Scenario A - Voice Assistant Chained AI Architecture",
    questionPrompt: "Map the 'Ears', 'Brain', and 'Mouth' of a smart voice assistant to their exact technical AI technologies.",
    maxMarks: 3,
    studentAnswer: lq.part_a_chain || "(Unanswered)",
    correctAnswerOrRubric: "Ears = Speech-to-Text (STT), Brain = LLM / NLP Model, Mouth = Text-to-Speech (TTS).",
  });

  paper.push({
    section: "Section C: Long Scenario Questions",
    questionKey: "part_a_error",
    questionTitle: "Q3 Scenario A - Error Propagation Analysis",
    questionPrompt: "Explain what happens when the car navigates a noisy Pakistani road and how error cascades through the chain.",
    maxMarks: 3,
    studentAnswer: lq.part_a_error || "(Unanswered)",
    correctAnswerOrRubric: "STT (Ears) mishears due to road honking; feeds corrupted text to LLM (Brain); Brain hallucinatingly passes confident incorrect route to TTS (Mouth).",
  });

  paper.push({
    section: "Section C: Long Scenario Questions",
    questionKey: "part_b_sarcasm",
    questionTitle: "Q3 Scenario B - Sarcasm Trap in Customer Support AI",
    questionPrompt: "Why do superficial keyword-counting sentiment models misclassify sarcastic Pakistani customer reviews?",
    maxMarks: 3,
    studentAnswer: lq.part_b_sarcasm || "(Unanswered)",
    correctAnswerOrRubric: "Sarcasm masks complaints with positive words ('Bohot shukriya 3 ghante baad delivery dene ka'). Naive models count positive words and mistakenly classify as positive.",
  });

  paper.push({
    section: "Section C: Long Scenario Questions",
    questionKey: "part_b_slang",
    questionTitle: "Q3 Scenario B - Local Vernacular Slang Trap",
    questionPrompt: "Explain how youthful Pakistani slang words (e.g. 'aag', 'sick', 'tabahi') trick literal translation models.",
    maxMarks: 3,
    studentAnswer: lq.part_b_slang || "(Unanswered)",
    correctAnswerOrRubric: "Slang words like 'aag laga di' or 'sick performance' indicate excellence, but literal dictionaries classify them as dangerous or negative.",
  });

  paper.push({
    section: "Section C: Long Scenario Questions",
    questionKey: "part_c_strangers",
    questionTitle: "Q3 Scenario C - Real-World Testing with Strangers",
    questionPrompt: "Why does an AI model that tests 100% on family members fail when tested on strangers?",
    maxMarks: 3,
    studentAnswer: lq.part_c_strangers || "(Unanswered)",
    correctAnswerOrRubric: "Family tests share identical lighting, backgrounds, and familiar hand skin tones. Strangers introduce distribution shift exposing memorization.",
  });

  paper.push({
    section: "Section C: Long Scenario Questions",
    questionKey: "part_c_doctor_ethics",
    questionTitle: "Q3 Scenario C - Medical AI Ethics & 95% Accuracy",
    questionPrompt: "Analyze the ethical consequences of 95% accuracy in disease diagnosis. Contrast False Alarm vs. Miss.",
    maxMarks: 5,
    studentAnswer: lq.part_c_doctor_ethics || "(Unanswered)",
    correctAnswerOrRubric: "95% accuracy means 5 in 100 misdiagnosed. A False Alarm triggers harmless re-testing, but a Miss sends a dying patient home untreated. Doctors must make the final clinical decision.",
  });

  // 4. SECTION D: Practical Project (50 Marks Total)
  const pp = answers.practicalProject || ({} as any);

  paper.push({
    section: "Section D: Practical AI Project",
    questionKey: "m1_classes",
    questionTitle: "Milestone 1 - Canteen Vision Classifier Classes",
    questionPrompt: "Define 3 essential visual classes to train the canteen food item scanner.",
    maxMarks: 3,
    studentAnswer: pp.m1_classes || "(Unanswered)",
    correctAnswerOrRubric: "2 food classes (e.g. Roll, Samosa) + 1 critical 'Nothing / Empty Counter' safety class.",
  });

  paper.push({
    section: "Section D: Practical AI Project",
    questionKey: "m1_variations",
    questionTitle: "Milestone 1 - Training Photo Variations",
    questionPrompt: "List 3 realistic variations captured in training photos to prevent overfitting.",
    maxMarks: 4,
    studentAnswer: pp.m1_variations || "(Unanswered)",
    correctAnswerOrRubric: "Angles (top/side/diagonal), lighting (bright sun, dim evening, shadow), and different trays/hands.",
  });

  paper.push({
    section: "Section D: Practical AI Project",
    questionKey: "m1_privacy",
    questionTitle: "Milestone 1 - Camera Privacy Protocol",
    questionPrompt: "Formulate the golden privacy rule when placing cameras in the school cafeteria.",
    maxMarks: 3,
    studentAnswer: pp.m1_privacy || "(Unanswered)",
    correctAnswerOrRubric: "Point camera strictly down at counter/tray; never record student faces or private cards.",
  });

  paper.push({
    section: "Section D: Practical AI Project",
    questionKey: "m2_table_types",
    questionTitle: "Milestone 2 - Sales Data Table Columns & Data Types",
    questionPrompt: "Specify 5 structured table headers and their appropriate data types (Number, Category, Text, Date).",
    maxMarks: 8,
    studentAnswer: pp.m2_table_types || "(Unanswered)",
    correctAnswerOrRubric: "Order ID (Text/Number), Item Name (Category), Quantity (Number), Price (Number), Date (Date).",
  });

  paper.push({
    section: "Section D: Practical AI Project",
    questionKey: "m2_privacy_removal",
    questionTitle: "Milestone 2 - Data Minimization & PII Stripping",
    questionPrompt: "Why must student personal names and phone numbers be purged before sharing sales reports?",
    maxMarks: 2,
    studentAnswer: pp.m2_privacy_removal || "(Unanswered)",
    correctAnswerOrRubric: "Names and phones are sensitive PII; sales reports only require item quantities, not personal identities.",
  });

  paper.push({
    section: "Section D: Practical AI Project",
    questionKey: "m3_cleaning_fixes",
    questionTitle: "Milestone 3 - Data Cleaning & Anomaly Correction",
    questionPrompt: "Provide the 4 exact cleaning steps to fix the corrupted cafeteria dataset.",
    maxMarks: 10,
    studentAnswer: pp.m3_cleaning_fixes || "(Unanswered)",
    correctAnswerOrRubric: "Unify text case, remove duplicate rows, strip 'rs' currency suffix from numbers, delete test/garbage rows, and blank out-of-range ratings.",
  });

  paper.push({
    section: "Section D: Practical AI Project",
    questionKey: "m4_buttons",
    questionTitle: "Milestone 4 - Chatbot Action Buttons",
    questionPrompt: "Design 3 intuitive buttons for students opening the canteen chatbot on WhatsApp/Landbot.",
    maxMarks: 3,
    studentAnswer: pp.m4_buttons || "(Unanswered)",
    correctAnswerOrRubric: "Menu & Prices, Timings & Pre-order, and Talk to Human Staff.",
  });

  paper.push({
    section: "Section D: Practical AI Project",
    questionKey: "m4_prompt",
    questionTitle: "Milestone 4 - 4-Part System Prompt Recipe",
    questionPrompt: "Author the system prompt using the 4-part recipe: Who, What, Details (Roman Urdu/Prices), Length.",
    maxMarks: 5,
    studentAnswer: pp.m4_prompt || "(Unanswered)",
    correctAnswerOrRubric: "Who: Canteen helper. What: Book orders. Details: Polite Roman Urdu ('Aap'), exact official prices, never guess. Length: Max 2 lines.",
  });

  paper.push({
    section: "Section D: Practical AI Project",
    questionKey: "m4_safety",
    questionTitle: "Milestone 4 - Food Allergy Safety Protocol",
    questionPrompt: "What safety guardrail must trigger when a student asks about food allergies?",
    maxMarks: 2,
    studentAnswer: pp.m4_safety || "(Unanswered)",
    correctAnswerOrRubric: "Direct student immediately to speak in-person with human kitchen staff; never let AI guess allergen ingredients.",
  });

  paper.push({
    section: "Section D: Practical AI Project",
    questionKey: "m5_accuracy_math",
    questionTitle: "Milestone 5 - Computer Vision Accuracy Calculation",
    questionPrompt: "Calculate model accuracy from 20 test photos where 17 were correct. Show formula and result.",
    maxMarks: 3,
    studentAnswer: pp.m5_accuracy_math || "(Unanswered)",
    correctAnswerOrRubric: "Formula: (Correct / Total) * 100. Calculation: (17 / 20) * 100 = 85%.",
  });

  paper.push({
    section: "Section D: Practical AI Project",
    questionKey: "m5_insight",
    questionTitle: "Milestone 5 - What -> So What -> Now What Insight Schema",
    questionPrompt: "Extract an actionable decision from the sales report (Roll 85 sold, Soup 5 sold).",
    maxMarks: 4,
    studentAnswer: pp.m5_insight || "(Unanswered)",
    correctAnswerOrRubric: "What: Roll 85 sold, Soup 5 sold. So What: Finger foods preferred during short recess break. Now What: Double roll preparation and discontinue hot soup.",
  });

  paper.push({
    section: "Section D: Practical AI Project",
    questionKey: "m5_model_card",
    questionTitle: "Milestone 5 - 3-Line Model Card",
    questionPrompt: "Write a transparent 3-line Model Card disclosing purpose, training data, and known failure limitations.",
    maxMarks: 3,
    studentAnswer: pp.m5_model_card || "(Unanswered)",
    correctAnswerOrRubric: "Line 1: Identifies canteen food. Line 2: Trained on 200 webcam photos on school counter. Line 3: Fails in dim lighting or with foil wrappers.",
  });

  return paper;
}
