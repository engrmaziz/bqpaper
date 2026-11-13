import { MCQQuestion, ShortQuestion, LongQuestion, PracticalMilestone, ExamInfo } from "@/types/exam";

export const EXAM_INFO: ExamInfo = {
  title: "Bano Qabil Pakistan • Essentials of AI",
  subtitle: "Midterm Examination (Weeks 1 to 6)",
  courseCode: "BQ-009",
  patron: "Hafiz Naeem ur Rehman",
  instructors: "Musharraf Aziz & Adv. Sir Usman Yaseen Sb",
  targetGrade: "8th Standard",
  timeAllowedMinutes: 80,
  totalMarks: 100,
};

export const MCQ_QUESTIONS: MCQQuestion[] = [
  {
    id: 1,
    question: "In traditional computer programming, humans write the rules. In Machine Learning (AI):",
    options: {
      A: "The computer learns the rules itself from examples and answers",
      B: "A programmer still types every rule by hand",
      C: "The computer guesses randomly forever",
      D: "Rules are never needed"
    },
    correct: "A",
    explanation: "In traditional coding, Rules + Data = Answers. In Machine Learning, Examples + Answers = Rules (the model)."
  },
  {
    id: 2,
    question: "An AI model that only does one specific job (like recognizing doodles or translating words) is called:",
    options: {
      A: "Artificial Narrow Intelligence (ANI)",
      B: "Artificial General Intelligence (AGI)",
      C: "Artificial Super Intelligence (ASI)",
      D: "Robot Intelligence"
    },
    correct: "A",
    explanation: "ANI (Narrow AI) excels in a single specialized domain, unlike theoretical human-level AGI or future ASI."
  },
  {
    id: 3,
    question: "What is the continuous learning cycle of an AI algorithm during training?",
    options: {
      A: "Guess -> Check -> Measure Error -> Adjust",
      B: "Code -> Copy -> Paste -> Run",
      C: "Type -> Save -> Print -> Close",
      D: "Install -> Crash -> Restart -> Delete"
    },
    correct: "A",
    explanation: "Training is an iterative loop: Guess, Check against label, Measure loss/error, and Adjust internal weights."
  },
  {
    id: 4,
    question: "You train a Teachable Machine model on 'Thumbs Up' and 'Thumbs Down'. Shown an empty desk, it says 'Thumbs Up 97%'. Why?",
    options: {
      A: "The desk secretly looks like a thumb",
      B: "The AI can only pick from the classes it has been taught",
      C: "The webcam lens is dirty",
      D: "The laptop is too old"
    },
    correct: "B",
    explanation: "Without a 'Nothing' or background class, the model is mathematically forced to distribute confidence between known classes."
  },
  {
    id: 5,
    question: "A supermarket software groups shoppers with similar buying habits without anyone telling it what groups to make. This is:",
    options: {
      A: "Supervised Learning",
      B: "Unsupervised Learning",
      C: "Speech Recognition",
      D: "Voice Typing"
    },
    correct: "B",
    explanation: "Unsupervised learning groups or clusters similar unlabelled data without pre-existing answer keys (labels)."
  },
  {
    id: 6,
    question: "Which dataset will train the most reliable image model to recognize a pen?",
    options: {
      A: "300 photos of the exact same pen on one brown desk in morning sunlight",
      B: "60 photos of different pens held by different people, at different angles and lights",
      C: "300 photos of a pen and 5 photos of a book",
      D: "10 photos downloaded from Google"
    },
    correct: "B",
    explanation: "Good data must be Varied (diverse angles, hands, lighting) and Balanced, rather than repetitive."
  },
  {
    id: 7,
    question: "A student's model scores 99% on its training photos, but drops to 50% on new photos taken by classmates. This model is:",
    options: {
      A: "A 'Ratta' (Overfitted) Model",
      B: "A perfectly learned model",
      C: "A Super Intelligence",
      D: "An Unsupervised Model"
    },
    correct: "A",
    explanation: "Overfitting (ratta) happens when a model memorizes specific training photos instead of generalizable features."
  },
  {
    id: 8,
    question: "How do Large Language Models (like ChatGPT or Gemini) write responses?",
    options: {
      A: "They copy and paste pre-written paragraphs from Google",
      B: "They predict the most likely next word based on patterns learned from text",
      C: "A human worker secretly types the answers",
      D: "They read our mind"
    },
    correct: "B",
    explanation: "LLMs are statistical next-word prediction models trained on massive text corpora."
  },
  {
    id: 9,
    question: "When an AI chatbot generates an answer that sounds confident and fluent, but is completely made up, it is called a:",
    options: {
      A: "Token",
      B: "Pixel",
      C: "Hallucination",
      D: "Shortcut"
    },
    correct: "C",
    explanation: "A hallucination is when an AI fabricates plausible-sounding but factually false information."
  },
  {
    id: 10,
    question: "What is the 4-part recipe for writing an effective, high-quality prompt?",
    options: {
      A: "Who • What • Details • Length",
      B: "Short • Fast • Easy • Urdu",
      C: "Copy • Paste • Run • Stop",
      D: "Name • City • Phone • Address"
    },
    correct: "A",
    explanation: "The prompt recipe defines Who (persona/audience), What (objective), Details (constraints), and Length."
  },
  {
    id: 11,
    question: "In Google Sheets, why is a phone number (e.g., 03001234567) treated as Category/Text instead of a mathematical Number?",
    options: {
      A: "Because you never add, subtract, or calculate the average of phone numbers",
      B: "Because phone numbers have 11 digits and computers cannot count that high",
      C: "Because phone numbers can only be written on paper",
      D: "Because it contains letters"
    },
    correct: "A",
    explanation: "Digits only represent a mathematical 'Number' if arithmetic operations (sum, average) make semantic sense."
  },
  {
    id: 12,
    question: "In a raw spreadsheet, you see 'Gulberg', 'gulberg', and 'Gulburg'. How does a computer count them before cleaning?",
    options: {
      A: "It knows they are all the same place in Lahore",
      B: "It automatically merges them into one bar chart",
      C: "It treats them as three completely different, separate places",
      D: "It deletes them automatically"
    },
    correct: "C",
    explanation: "Computers match characters literally; differences in letter case or spelling are treated as separate categories."
  },
  {
    id: 13,
    question: "When cleaning data, you find two orders with empty 'Quantity' cells. What is the most honest practice?",
    options: {
      A: "Type 1 because it is probably 1",
      B: "Leave them blank, record them in your cleaning log, and exclude them from totals",
      C: "Delete the whole Quantity column",
      D: "Guess a big number to help the shop"
    },
    correct: "B",
    explanation: "A visible blank is honest. Never fabricate data, and document any missing values in your cleaning log."
  },
  {
    id: 14,
    question: "A bar chart has two bars: 95 and 98. But because the vertical axis starts at 90 instead of 0, 98 looks three times taller. This chart is:",
    options: {
      A: "A Pie Chart",
      B: "Misleading due to a truncated axis",
      C: "100% honest and accurate",
      D: "An Unsupervised Chart"
    },
    correct: "B",
    explanation: "Truncating the vertical axis exaggerates minor numerical variations and visually distorts the true proportion."
  },
  {
    id: 15,
    question: "Natural Language Processing (NLP) models read text by breaking sentences into small pieces called:",
    options: {
      A: "Pixels",
      B: "Tokens",
      C: "Epochs",
      D: "Layers"
    },
    correct: "B",
    explanation: "Tokens are the fundamental sub-word chunks into which text is segmented for language models."
  },
  {
    id: 16,
    question: "Why does Roman Urdu ('Mujhe cricket pasand hai') usually cost more tokens than English ('I like cricket')?",
    options: {
      A: "Roman Urdu is an illegal computer language",
      B: "Tokenizers were trained mostly on English, so unfamiliar words get cut into more pieces",
      C: "English letters take up less screen space",
      D: "Roman Urdu words are physically heavier"
    },
    correct: "B",
    explanation: "Tokenizer vocabularies are heavily biased toward English, causing non-English words to fragment into smaller sub-tokens."
  },
  {
    id: 17,
    question: "A user posts: 'Wah, kya service hai! Sirf 3 ghantay late delivery hui.' An AI marks this Positive. Why did it fail?",
    options: {
      A: "It saw the praise word 'Wah' and missed the sarcasm",
      B: "The AI cannot read Urdu words at all",
      C: "3 hours is actually very fast",
      D: "The customer was genuinely very happy"
    },
    correct: "A",
    explanation: "Sarcasm uses superficial praise words to convey complaints, tricking simple keyword-based sentiment systems."
  },
  {
    id: 18,
    question: "What does a computer actually see when it looks at a black-and-white digital photo?",
    options: {
      A: "Physical ink and paper",
      B: "A grid (matrix) of numbers called pixels (brightness 0 to 255)",
      C: "A list of English sentences",
      D: "A sound file"
    },
    correct: "B",
    explanation: "Digital images are numerical arrays where each pixel is represented by brightness intensity values (0-255)."
  },
  {
    id: 19,
    question: "An AI screens chest X-rays in a hospital. Which kind of mistake is far more dangerous?",
    options: {
      A: "Telling a healthy person to do an extra checkup (False Alarm)",
      B: "Telling a sick person 'You are fine' and sending them home untreated (A Miss)",
      C: "Taking 5 seconds longer to process the scan",
      D: "Misspelling the hospital name"
    },
    correct: "B",
    explanation: "A Miss (false negative) sends an untreated diseased patient home, with potentially fatal consequences."
  },
  {
    id: 20,
    question: "What is the difference between Image Classification and Object Detection?",
    options: {
      A: "Classification names what the whole image is; Detection draws boxes around where each object is",
      B: "Classification is for audio; Detection is for text",
      C: "Classification is always wrong; Detection is always right",
      D: "Classification requires a doctor; Detection requires a farmer"
    },
    correct: "A",
    explanation: "Classification assigns a single category label to the whole image; Detection locates and labels multiple objects with bounding boxes."
  }
];

export const SHORT_QUESTIONS: ShortQuestion[] = [
  {
    id: "q1",
    title: "Question 1: Supervised vs. Unsupervised Learning",
    marks: 5,
    scenario: "A junior 6th-grade student says: 'Supervised and Unsupervised learning are the exact same thing because both run on a computer.'",
    parts: [
      {
        id: "q1_a",
        label: "(a) Main Difference",
        prompt: "Explain the single main difference between Supervised and Unsupervised Learning in simple words (Hint: Mention labels/answers).",
        marks: 2,
        rubric: "Award 2 marks for stating that Supervised Learning trains with known labels/answers (like solved past papers), whereas Unsupervised Learning receives unlabelled data and finds groups/clusters on its own.",
        sampleAnswer: "Supervised learning gives the computer examples WITH the correct answers (labels), like studying with solved past papers. Unsupervised learning gives NO answers; the computer discovers hidden groups or patterns on its own, like a shopkeeper organizing mixed items."
      },
      {
        id: "q1_b_sup",
        label: "(b1) Supervised Pakistani Example",
        prompt: "Give ONE real-life Pakistani example of Supervised Learning (e.g. from Easypaisa, farming, or spam filters).",
        marks: 1.5,
        rubric: "Award 1.5 marks for a clear real-life supervised case (e.g. Easypaisa fraud detector using past marked transactions, cotton leaf disease scanner using healthy/diseased photos, spam filter).",
        sampleAnswer: "Easypaisa fraud detection: The AI checks new transactions against millions of past transactions labelled by humans as 'fraud' or 'normal'."
      },
      {
        id: "q1_b_unsup",
        label: "(b2) Unsupervised Pakistani Example",
        prompt: "Give ONE real-life Pakistani example of Unsupervised Learning (e.g. grouping shoppers or organizing news).",
        marks: 1.5,
        rubric: "Award 1.5 marks for a clear real-life unsupervised case (e.g. online store clustering customer buying habits with no pre-set groups, news app grouping articles by topic without tags).",
        sampleAnswer: "An online store (like Daraz) grouping shoppers into customer clusters based on similar purchasing habits without any human pre-defining the categories."
      }
    ]
  },
  {
    id: "q2",
    title: "Question 2: Fixing the 'Ratta' (Overfitted) Model",
    marks: 5,
    scenario: "In Week 2 and Week 6, we discovered that an AI model can do 'ratta' (memorization without real understanding).",
    parts: [
      {
        id: "q2_a",
        label: "(a) Cause of Ratta",
        prompt: "What mistake during data collection causes an AI model to become a Ratta Model (overfitted)?",
        marks: 2,
        rubric: "Award 2 marks for stating that training on identical, unvaried photos (same angle, same desk, same lighting) or training for excessive epochs causes the model to memorize the background instead of learning general object features.",
        sampleAnswer: "A model does ratta when training photos lack variety (e.g. all taken on the same desk, same light, same hand). It memorizes the background or specific pose instead of the actual object."
      },
      {
        id: "q2_b",
        label: "(b) Four Words of Good Data",
        prompt: "Name the Four Words of Good Data (in English or Urdu) that prevent a model from overfitting.",
        marks: 3,
        rubric: "Award 3 marks for naming all 4: Enough (Kaafi), Balanced (Mutawazin), Varied (Mutanawwo), Correct (Durust). Award 0.75 marks per correct word.",
        sampleAnswer: "1. Enough (کافی) - Plenty of examples.\n2. Balanced (متوازن) - Equal counts across classes.\n3. Varied (متنوع) - Diverse angles, lights, hands, backgrounds.\n4. Correct (درست) - Accurate, error-free labels."
      }
    ]
  }
];

export const LONG_QUESTION: LongQuestion = {
  id: "q3",
  title: "Question 3: Building Reliable and Safe AI Systems",
  marks: 20,
  parts: [
    {
      id: "part_a_chain",
      title: "Part (a1): The Voice Assistant Chain (3 Marks)",
      marks: 3,
      prompt: "State the technical AI name for each stage of a voice assistant (like Siri or Bykea audio booking): Ears -> Brain -> Mouth.",
      rubric: "Award 1 mark each: Ears = Speech-to-Text (STT) / Speech Recognition; Brain = Large Language Model (LLM) / NLP Engine; Mouth = Text-to-Speech (TTS) / Speech Synthesis.",
      sampleAnswer: "• Ears (Listening): Speech-to-Text (STT)\n• Brain (Understanding): Large Language Model (LLM) / NLP Engine\n• Mouth (Speaking): Text-to-Speech (TTS)"
    },
    {
      id: "part_a_error",
      title: "Part (a2): Noise Error Propagation (3 Marks)",
      marks: 3,
      prompt: "If a Bykea user records a voice note on a noisy road, which stage breaks first, and how does that error affect the final spoken output?",
      rubric: "Award 3 marks for explaining that the 'Ears' (STT) break first by mishearing noisy speech, passing wrong text to the 'Brain', causing the 'Mouth' to speak an irrelevant, confident wrong answer.",
      sampleAnswer: "The Ears (STT) break first due to acoustic distortion. The misheard text is passed into the Brain (LLM), which processes wrong input and commands the Mouth (TTS) to confidently announce an incorrect location or action."
    },
    {
      id: "part_b_sarcasm",
      title: "Part (b1): Sentiment Trap - Sarcasm (3 Marks)",
      marks: 3,
      prompt: "Explain how Sarcasm (e.g. 'Shukriya itna kharab suit bhejne ka') tricks an AI sentiment tool into giving a wrong score.",
      rubric: "Award 3 marks for noting that the AI scans superficial praise words ('Shukriya') and calculates a positive score, failing to detect that the overall human tone conveys annoyance or complaint.",
      sampleAnswer: "Sarcastic reviews use polite praise words ('Shukriya') to convey anger. A basic AI model only counts positive word weights and wrongly classifies the review as Positive, missing the hidden complaint."
    },
    {
      id: "part_b_slang",
      title: "Part (b2): Sentiment Trap - Local Slang (3 Marks)",
      marks: 3,
      prompt: "Explain how Local Slang / Cricket terms (e.g. 'Ye bowler to aag hai!' or 'Sick shot!') confuse a basic AI model into marking them Negative.",
      rubric: "Award 3 marks for explaining that words like 'aag', 'sick', or 'tabahi' mean excellence in slang, but a standard dictionary or non-localized model interprets them literally as fire, illness, or destruction.",
      sampleAnswer: "In sports slang, 'aag' (fire) or 'sick' means brilliant and exciting. A non-localized AI takes the words literally as fire hazard or sickness, mistakenly scoring positive praise as Negative."
    },
    {
      id: "part_c_strangers",
      title: "Part (c1): Testing With Strangers (3 Marks)",
      marks: 3,
      prompt: "Why does an image model tested on fresh photos taken by strangers score much lower than when tested on its own training photos?",
      rubric: "Award 3 marks for highlighting that the model memorized the builder's background, lighting, and hands. Strangers introduce unseen variations (distribution shift) that expose memorization.",
      sampleAnswer: "When testing on your own photos, the model cheats by recognizing familiar desk backgrounds, room lighting, and your skin tone. Strangers introduce new hands, different angles, and varied lighting that the model never memorized."
    },
    {
      id: "part_c_doctor_ethics",
      title: "Part (c2): Hospital Ethics & The Final Decision (5 Marks)",
      marks: 5,
      prompt: "A hospital's TB screening AI claims '95% Accuracy'. Why must a human doctor ALWAYS make the final decision? (Compare 'A False Alarm' vs. 'A Miss').",
      rubric: "Award 2 marks for noting that 95% accuracy means 5 out of 100 people are misdiagnosed. Award 2 marks for distinguishing False Alarm (extra re-test) vs Miss (sick patient sent home untreated to worsen). Award 1 mark for concluding AI flags while human doctors hold ethical and medical responsibility.",
      sampleAnswer: "1) 95% accuracy still means 5 out of 100 patients receive an erroneous diagnosis.\n2) A False Alarm causes temporary worry and a re-test, but A Miss is life-threatening: a diseased patient is told they are healthy and sent home without medical care.\n3) The AI acts as a triaging tool to flag suspicious scans, but only a licensed human doctor can evaluate full patient history and make the final life-and-death call."
    }
  ]
};

export const PRACTICAL_PROJECT_MILESTONES: PracticalMilestone[] = [
  {
    id: "m1",
    title: "Milestone 1: Camera Vision & Data Collection",
    marks: 10,
    description: "Setting up the vision model for the Smart School Canteen counter.",
    tasks: [
      {
        id: "m1_classes",
        prompt: "Name TWO food item classes to recognize, and ONE essential safety class to avoid false detections when the counter is clear.",
        marks: 3,
        type: "text",
        rubric: "Award 2 marks for 2 distinct food items (e.g. Chicken Roll, Samosa Chaat, Biryani Plate) and 1 mark for the 'Nothing' / 'Empty Counter' safety class.",
        sampleAnswer: "• Food Class 1: Chicken Roll Plate\n• Food Class 2: Samosa Chaat Plate\n• Safety Class: 'Nothing' (Empty Counter)"
      },
      {
        id: "m1_variations",
        prompt: "Give THREE specific variations you will capture in your training photos so the model works under real canteen conditions (Varied Rule).",
        marks: 4,
        type: "text",
        rubric: "Award 4 marks for 3 realistic variations: different angles (top/side/tilt), different lighting (morning bright sunlight vs dim afternoon indoor), and different trays/hands holding the food.",
        sampleAnswer: "1. Different angles (overhead top-down view, 45-degree angle, side view).\n2. Different lighting (bright morning sunlight vs dim indoor shadows).\n3. Different backgrounds and hands (held by different students, on steel tray, on plastic plate)."
      },
      {
        id: "m1_privacy",
        prompt: "State ONE vital camera privacy rule before deploying any camera in the school canteen.",
        marks: 3,
        type: "text",
        rubric: "Award 3 marks for mentioning consent/permission and data minimization: never record or store student faces, ID cards, or private personal information.",
        sampleAnswer: "Strict Camera Rule: Ask permission and point the camera strictly down at the food counter. Never record, store, or identify student faces or personal ID cards."
      }
    ]
  },
  {
    id: "m2",
    title: "Milestone 2: Spreadsheet Table Design & Data Types",
    marks: 10,
    description: "Structuring canteen sales data for accurate reporting and inventory management.",
    tasks: [
      {
        id: "m2_table_types",
        prompt: "List 5 clean Column Headers for your canteen order sheet and state the Data Type for each (choose only from: Number, Category, Text, Date).",
        marks: 8,
        type: "table",
        rubric: "Award 8 marks for 5 logical columns with correct types: e.g. Order_ID (Category/Text), Item_Name (Category), Quantity (Number), Price_PKR (Number), Order_Date (Date).",
        sampleAnswer: "1. Order_ID -> Category/Text\n2. Item_Name -> Category\n3. Quantity -> Number\n4. Price_PKR -> Number\n5. Order_Date -> Date"
      },
      {
        id: "m2_privacy_removal",
        prompt: "Why must student names and phone numbers be removed before sharing sales reports with the school council?",
        marks: 2,
        type: "text",
        rubric: "Award 2 marks for explaining data privacy (PII): sales reports only need item counts and revenue totals; individual personal identities must be protected (collect less, share less).",
        sampleAnswer: "Student names and phone numbers are private personal data. The school council only needs total quantities and revenue to plan inventory, not private identities."
      }
    ]
  },
  {
    id: "m3",
    title: "Milestone 3: Data Cleaning & Troubleshooting",
    marks: 10,
    description: "Cleaning a messy canteen order sheet before feeding it into pivot tables or AI.",
    tasks: [
      {
        id: "m3_cleaning_fixes",
        prompt: "Provide the exact fix for each row in the messy dataset:\nRow 1 & 2: 'Chicken Roll' and 'chicken roll'\nRow 3: Biryani Box with blank Qty and price '250 rs'\nRow 4: 'TEST ENTRY' with 0, 0\nRow 5: Rating showing 15 (Scale is 1 to 5)",
        marks: 10,
        type: "table",
        rubric: "Award 2.5 marks per row: Row 1&2 (unify case and remove duplicate); Row 3 (mark blank Qty yellow and exclude from totals; strip 'rs' text so price is clean number 250); Row 4 (delete test row entirely); Row 5 (clear/blank invalid 15 rating and log in cleaning log; do not guess).",
        sampleAnswer: "• Row 1 & 2: Unify letter case using Find & Replace, then run Remove Duplicates.\n• Row 3: Mark blank Qty yellow and do not guess; remove ' rs' using Find & Replace so price is numeric 250.\n• Row 4: Right-click and delete the fake TEST row completely.\n• Row 5: Clear the impossible rating (15), leave it blank, and record it in the cleaning log."
      }
    ]
  },
  {
    id: "m4",
    title: "Milestone 4: Canteen Chatbot Design & Prompting",
    marks: 10,
    description: "Automating customer inquiries with no-code flows and safe AI prompts.",
    tasks: [
      {
        id: "m4_buttons",
        prompt: "Write THREE clear menu buttons for a WhatsApp no-code Landbot flow for the canteen.",
        marks: 3,
        type: "text",
        rubric: "Award 3 marks for 3 logical user buttons: e.g. Button 1: 'Today's Menu & Prices', Button 2: 'Order Timings', Button 3: 'Talk to Staff / Human'.",
        sampleAnswer: "Button 1: 'Today's Fresh Menu'\nButton 2: 'Canteen Break Timings'\nButton 3: 'Talk to Canteen Staff'"
      },
      {
        id: "m4_prompt",
        prompt: "Write a 4-part recipe prompt for Gemini to act as the Canteen Assistant in Roman Urdu (Who, What, Details, Length). Forbid making up prices.",
        marks: 5,
        type: "prompt_recipe",
        rubric: "Award 5 marks for containing all 4 parts: Who (canteen helper), What (handle lunch questions), Details (polite Roman Urdu using 'Aap', official prices only, never guess), Length (max 2 lines).",
        sampleAnswer: "Prompt: You are the friendly ordering helper for the School Canteen. Your job is to answer student lunch questions. Reply in polite Roman Urdu using 'Aap'. Use only these prices: Roll Rs 200, Biryani Rs 250. Never guess or invent unlisted prices; say 'Canteen counter par rabta karein'. Maximum 2 short lines."
      },
      {
        id: "m4_safety",
        prompt: "What safety fallback message must the bot provide if a student asks about a severe food allergy or urgent problem?",
        marks: 2,
        type: "text",
        rubric: "Award 2 marks for directing the student immediately to a human staff member or teacher for health safety.",
        sampleAnswer: "Emergency Fallback: 'Khurak ki allergy ya emergency ke liye foran canteen counter par Sir Aslam se milain ya staff ko call karein: 03XX-XXXXXXX.'"
      }
    ]
  },
  {
    id: "m5",
    title: "Milestone 5: Accuracy, Business Insight & Model Card",
    marks: 10,
    description: "Evaluating model accuracy, deriving actionable business insights, and publishing a transparent Model Card.",
    tasks: [
      {
        id: "m5_accuracy_math",
        prompt: "You test your canteen food camera on 20 fresh photos. It gets 17 right and 3 wrong. Show the calculation and final Accuracy %.",
        marks: 3,
        type: "math_insight",
        rubric: "Award 3 marks for correct formula and result: Accuracy = (Correct / Total) * 100 = (17 / 20) * 100 = 85%.",
        sampleAnswer: "Formula: Accuracy = (Correct / Total) x 100\nCalculation: (17 / 20) x 100 = 85%"
      },
      {
        id: "m5_insight",
        prompt: "Sales data shows: Chicken Roll sold 85 units, while Vegetable Soup sold only 5 units. Write a 3-part Insight (What -> So What -> Now What).",
        marks: 4,
        type: "math_insight",
        rubric: "Award 4 marks: What = Roll 85, Soup 5 (1.5 mks); So What = students prefer finger food over hot soup in short recess (1.5 mks); Now What = prepare 100 rolls and stop making soup to save cost (1 mk).",
        sampleAnswer: "• WHAT: Chicken Rolls sold 85 units while Vegetable Soup sold only 5 units.\n• SO WHAT: Students overwhelmingly prefer quick finger-food to eat during a short 20-minute break.\n• NOW WHAT: Double Chicken Roll preparation to 100 units tomorrow, and discontinue Vegetable Soup to eliminate waste."
      },
      {
        id: "m5_model_card",
        prompt: "Write a complete 3-line Model Card for the school administration: (Line 1: What it does; Line 2: Training data used; Line 3: Where it fails).",
        marks: 3,
        type: "text",
        rubric: "Award 1 mark per honest line: What it does (classifies 2 food items or empty counter), Training data (e.g. 60 photos per class across 3 lights), Where it fails (dim light, covered in foil, unusual packaging).",
        sampleAnswer: "1. WHAT IT DOES: Classifies food plates (Chicken Roll vs Samosa Chaat) or reports 'Nothing' on the counter.\n2. DATA USED: 60 webcam photos per class across 3 lighting conditions and 2 student hands.\n3. WHERE IT FAILS: Fails when food is wrapped in reflective aluminum foil, held far away, or in very dim lighting."
      }
    ]
  }
];

