export type Language = "en" | "ur";

export interface TranslationDict {
  navbar: {
    brandTitle: string;
    aiLab: string;
    grade: string;
    course: string;
    motto: string;
    patronTitle: string;
    patronName: string;
    timeRemaining: string;
    studentLabel: string;
    teacherMarksheet: string;
    backToExam: string;
    restricted: string;
  };
  registration: {
    underPatronage: string;
    patronMessageTitle: string;
    patronQuote: string;
    patronQuoteAuthor: string;
    examPattern: string;
    secA: string;
    secASub: string;
    secB: string;
    secBSub: string;
    secC: string;
    secCSub: string;
    secD: string;
    secDSub: string;
    timeAllowed: string;
    totalMarks: string;
    aiAssessingTitle: string;
    aiAssessingDesc: string;
    candidateVerif: string;
    candidateSub: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    rollNoLabel: string;
    rollNoPlaceholder: string;
    batchLabel: string;
    startExamBtn: string;
    timerNotice: string;
  };
  exam: {
    officialPaper: string;
    submitExamBtn: string;
    submitting: string;
    tabA: string;
    tabB: string;
    tabC: string;
    tabD: string;
    question: string;
    marks: string;
    yourAnswer: string;
    enterYourAnswer: string;
    next: string;
    prev: string;
    confirmSubmitTitle: string;
    confirmSubmitDesc: string;
    confirmYes: string;
    confirmCancel: string;
    answered: string;
  };
  result: {
    scorecard: string;
    paperAssessment: string;
    studentLabel: string;
    timeSpent: string;
    submittedAt: string;
    confidentialNotice: string;
    totalScore: string;
    letterGrade: string;
    summaryTab: string;
    mcqReviewTab: string;
    subjectiveTab: string;
    aiSummaryTitle: string;
    keyStrengths: string;
    areasToImprove: string;
    recommendations: string;
    generalSummary: string;
    yourAns: string;
    correctAns: string;
    printResult: string;
    retake: string;
    viewMarksheet: string;
  };
  dashboard: {
    examinerPortal: string;
    marksheetTitle: string;
    authorizedExaminer: string;
    refresh: string;
    downloadCSV: string;
    lockPortal: string;
    submissions: string;
    classAverage: string;
    highestScore: string;
    lowestScore: string;
    passRate: string;
    searchPlaceholder: string;
    rollNo: string;
    studentName: string;
    section: string;
    total: string;
    grade: string;
    action: string;
    inspect: string;
    closeInspection: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  en: {
    navbar: {
      brandTitle: "Bano Qabil",
      aiLab: "AI Lab",
      grade: "★ Midterm Exam",
      course: "Essentials of AI (BQ-009)",
      motto: "اپنی دنیا آپ پیدا کر",
      patronTitle: "Patron-in-Chief",
      patronName: "Hafiz Naeem ur Rehman",
      timeRemaining: "REMAINING",
      studentLabel: "Student",
      teacherMarksheet: "Instructor Portal",
      backToExam: "Back to Exam",
      restricted: "RESTRICTED",
    },
    registration: {
      underPatronage: "UNDER THE VISIONARY PATRONAGE OF HAFIZ NAEEM UR REHMAN",
      patronMessageTitle: "Patron's Message to Pakistani Youth",
      patronQuote: "ہماری جدوجہد ہے کہ پاکستان کا ہر باصلاحیت بیٹا اور بیٹی جدید ترین آرٹیفیشل انٹیلیجنس اور آئی ٹی کا ماہر بن کر ملک و قوم کا نام روشن کرے۔",
      patronQuoteAuthor: "حافظ نعیم الرحمن (بانی و سرپرستِ اعلیٰ، بنو قابل تحریک)",
      examPattern: "Official Examination Pattern",
      secA: "Section A: 20 MCQs",
      secASub: "Core Concepts (Weeks 1 to 6)",
      secB: "Section B: Short Questions",
      secBSub: "2 Conceptual Problems (5 mks each)",
      secC: "Section C: Long Scenario Q",
      secCSub: "Voice Assistant & Ethics",
      secD: "Section D: Practical Project",
      secDSub: "Canteen Vision (5 Milestones)",
      timeAllowed: "80 Minutes",
      totalMarks: "Total: 100 Marks",
      aiAssessingTitle: "Automated Groq AI Assessment",
      aiAssessingDesc: "Upon submission, your subjective responses and practical design will be automatically evaluated in seconds against the official Bano Qabil syllabus rubric.",
      candidateVerif: "Student Candidate Verification",
      candidateSub: "Please enter your registered Bano Qabil student credentials to begin the exam.",
      fullNameLabel: "Full Name (as registered in Bano Qabil)",
      fullNamePlaceholder: "e.g. Muhammad Bilal",
      emailLabel: "Email Address",
      emailPlaceholder: "e.g. student@banoqabil.pk",
      rollNoLabel: "Roll Number",
      rollNoPlaceholder: "e.g. BQ-801",
      batchLabel: "Batch / Section",
      startExamBtn: "Start Midterm Examination",
      timerNotice: "By starting, the 80-minute timer will activate automatically. Powered by Bano Qabil AI Lab.",
    },
    exam: {
      officialPaper: "Official Midterm Paper",
      submitExamBtn: "Submit & View Result",
      submitting: "Assessing Paper...",
      tabA: "Section A: MCQs",
      tabB: "Section B: Short Qs",
      tabC: "Section C: Long Q",
      tabD: "Section D: Project",
      question: "Question",
      marks: "Marks",
      yourAnswer: "Your Answer",
      enterYourAnswer: "Type your detailed answer here according to the syllabus...",
      next: "Next Question",
      prev: "Previous",
      confirmSubmitTitle: "Ready to Submit Your Exam Paper?",
      confirmSubmitDesc: "Once submitted, your paper will be locked and instantly assessed by Groq AI according to the official marking rubric.",
      confirmYes: "Yes, Submit Final Exam",
      confirmCancel: "Keep Reviewing",
      answered: "Answered",
    },
    result: {
      scorecard: "OFFICIAL BANO QABIL SCORECARD • PATRON: HAFIZ NAEEM UR REHMAN",
      paperAssessment: "Midterm Paper Assessment",
      studentLabel: "Student",
      timeSpent: "Time Spent",
      submittedAt: "Submitted",
      confidentialNotice: "Confidential Scorecard: Visible to student only. Master evaluation managed by Musharraf Aziz (Instructor of 'Applied AI', Bano Qabil Kasur • io@maziz.me).",
      totalScore: "TOTAL SCORE",
      letterGrade: "Grade",
      summaryTab: "Performance Summary",
      mcqReviewTab: "Section A (MCQs Review)",
      subjectiveTab: "Subjective Feedback & Rubric",
      aiSummaryTitle: "Automated AI Evaluation Notes",
      keyStrengths: "Key Conceptual Strengths",
      areasToImprove: "Suggestions for Improvement",
      recommendations: "Suggestions & Recommendations",
      generalSummary: "AI Assessment Summary",
      yourAns: "Your Answer",
      correctAns: "Correct Answer",
      printResult: "Print Official Marksheet",
      retake: "Take Retake / New Candidate",
      viewMarksheet: "View Full Marksheet (Instructor Access)",
    },
    dashboard: {
      examinerPortal: "INSTRUCTOR PORTAL",
      marksheetTitle: "Midterm Marksheet & Class Analytics",
      authorizedExaminer: "Instructor: Musharraf Aziz (Applied AI, Bano Qabil Kasur) • io@maziz.me",
      refresh: "Refresh",
      downloadCSV: "Download Marksheet (CSV)",
      lockPortal: "Lock Portal",
      submissions: "Submissions",
      classAverage: "Class Average",
      highestScore: "Highest Score",
      lowestScore: "Lowest Score",
      passRate: "Pass Rate",
      searchPlaceholder: "Search by name, roll no, section...",
      rollNo: "Roll No",
      studentName: "Student Name",
      section: "Section",
      total: "Total (/100)",
      grade: "Grade",
      action: "Action",
      inspect: "Inspect",
      closeInspection: "Close Inspection",
    },
  },
  ur: {
    navbar: {
      brandTitle: "بنو قابل",
      aiLab: "اے آئی لیب",
      grade: "★ مڈٹرم امتحان",
      course: "ایسینشلز آف اے آئی (BQ-009)",
      motto: "اپنی دنیا آپ پیدا کر",
      patronTitle: "سرپرستِ اعلیٰ",
      patronName: "حافظ نعیم الرحمن",
      timeRemaining: "باقی وقت",
      studentLabel: "طالب علم",
      teacherMarksheet: "انسٹرکٹر پورٹل",
      backToExam: "امتحان پر واپس",
      restricted: "محفوظ",
    },
    registration: {
      underPatronage: "حافظ نعیم الرحمن کی بصیرت افروز سرپرستی میں",
      patronMessageTitle: "پاکستانی نوجوانوں کے نام سرپرستِ اعلیٰ کا پیغام",
      patronQuote: "ہماری جدوجہد ہے کہ پاکستان کا ہر باصلاحیت بیٹا اور بیٹی جدید ترین آرٹیفیشل انٹیلیجنس اور آئی ٹی کا ماہر بن کر ملک و قوم کا نام روشن کرے۔",
      patronQuoteAuthor: "حافظ نعیم الرحمن (بانی و سرپرستِ اعلیٰ، بنو قابل تحریک)",
      examPattern: "امتحان کا امتحانی خاکہ اور نمبرز کی تقسیم",
      secA: "سیکشن A: 20 کثیر الانتخابی سوالات",
      secASub: "بنیادی تصورات (ہفتہ 1 تا 6)",
      secB: "سیکشن B: مختصر فکری سوالات",
      secBSub: "2 تصوراتی سوالات (5، 5 نمبر)",
      secC: "سیکشن C: تفصیلی سوال",
      secCSub: "وائس اسسٹنٹ اور اخلاقیات",
      secD: "سیکشن D: پریکٹیکل پروجیکٹ",
      secDSub: "اسمارٹ کینٹین ویژن (5 مراحل)",
      timeAllowed: "80 منٹ",
      totalMarks: "کل نمبر: 100",
      aiAssessingTitle: "خودکار گروک AI امتحانی جانچ",
      aiAssessingDesc: "پرچہ جمع کروانے پر آپ کے تمام جوابات کو چند سیکنڈوں میں گروک AI سرکاری ربرک کے مطابق خودکار چیک کرے گا۔",
      candidateVerif: "امیدوار کی رجسٹریشن و تصدیق",
      candidateSub: "امتحان شروع کرنے کے لیے اپنے بنو قابل میں رجسٹرڈ کوائف درج فرمائیں۔",
      fullNameLabel: "طالب علم کا مکمل نام (جیسا بنو قابل میں درج ہے)",
      fullNamePlaceholder: "مثلاً محمد بلال",
      emailLabel: "ای میل ایڈریس",
      emailPlaceholder: "مثلاً student@banoqabil.pk",
      rollNoLabel: "رول نمبر",
      rollNoPlaceholder: "مثلاً BQ-801",
      batchLabel: "بیچ / سیکشن",
      startExamBtn: "مڈٹرم امتحان شروع کریں",
      timerNotice: "شروع کرنے پر 80 منٹ کا ٹائمر خودکار شروع ہو جائے گا۔ بنو قابل اے آئی لیب۔",
    },
    exam: {
      officialPaper: "سرکاری مڈٹرم پرچہ",
      submitExamBtn: "جوابات جمع کرائیں اور نتیجہ دیکھیں",
      submitting: "پرچہ چیک کیا جا رہا ہے...",
      tabA: "سیکشن A: کثیر الانتخابی (20)",
      tabB: "سیکشن B: مختصر سوالات (10)",
      tabC: "سیکشن C: تفصیلی سوال (20)",
      tabD: "سیکشن D: عملی پروجیکٹ (50)",
      question: "سوال نمبر",
      marks: "نمبر",
      yourAnswer: "آپ کا جواب",
      enterYourAnswer: "اپنا تفصیلی جواب یہاں لکھیں...",
      next: "اگلا سوال",
      prev: "پچھلا",
      confirmSubmitTitle: "کیا آپ امتحانی پرچہ جمع کروانے کے لیے تیار ہیں؟",
      confirmSubmitDesc: "جمع کروانے کے بعد آپ کا پرچہ لاک ہو جائے گا اور فوری طور پر گروک AI سرکاری ربرک کے مطابق اس کی جانچ کر کے نتیجہ دکھائے گا۔",
      confirmYes: "ہاں، پرچہ حتمی جمع کروائیں",
      confirmCancel: "نظرِ ثانی جاری رکھیں",
      answered: "حل شدہ",
    },
    result: {
      scorecard: "بنو قابل آفیشل اسکور کارڈ • سرپرستِ اعلیٰ: حافظ نعیم الرحمن",
      paperAssessment: "مڈٹرم امتحانی نتیجہ و جانچ رپورٹ",
      studentLabel: "طالب علم",
      timeSpent: "صرف شدہ وقت",
      submittedAt: "جمع کرانے کا وقت",
      confidentialNotice: "خفیہ اسکور کارڈ: صرف متعلقہ طالب علم کے لیے قابلِ دید۔ مکمل امتحانی ریکارڈ مشرف عزیز (انسٹرکٹر 'اپلائیڈ اے آئی'، بنو قابل قصور • io@maziz.me) کے زیرِ انتظام ہے۔",
      totalScore: "کل حاصل کردہ نمبر",
      letterGrade: "گریڈ",
      summaryTab: "کارکردگی کا خلاصہ",
      mcqReviewTab: "سیکشن A (کثیر الانتخابی سوالات کا جائزہ)",
      subjectiveTab: "تفصیلی سوالات اور ربرک فیڈ بیک",
      aiSummaryTitle: "گروک AI کی خودکار تجزیاتی رپورٹ",
      keyStrengths: "نمایاں خوبیاں اور مضبوط تصورات",
      areasToImprove: "بہتری کے لیے رہنمائی و تجاویز",
      recommendations: "بہتری کے لیے رہنمائی و تجاویز",
      generalSummary: "گروک AI کی خودکار تجزیاتی رپورٹ",
      yourAns: "آپ کا منتخب کردہ جواب",
      correctAns: "درست جواب",
      printResult: "آفیشل مارک شیٹ پرنٹ کریں",
      retake: "نئے امیدوار کی رجسٹریشن",
      viewMarksheet: "مکمل کلاس مارک شیٹ (صرف برائے انسٹرکٹر)",
    },
    dashboard: {
      examinerPortal: "انسٹرکٹر پورٹل",
      marksheetTitle: "مڈٹرم مارک شیٹ اور کلاس کا شماریاتی تجزیہ",
      authorizedExaminer: "انسٹرکٹر: مشرف عزیز (اپلائیڈ اے آئی، بنو قابل قصور) • io@maziz.me",
      refresh: "تازہ کریں",
      downloadCSV: "مارک شیٹ ڈاؤنلوڈ کریں (CSV)",
      lockPortal: "پورٹل لاک کریں",
      submissions: "کل پیپرز",
      classAverage: "کلاس کی اوسط",
      highestScore: "سب سے زیادہ نمبر",
      lowestScore: "کم ترین نمبر",
      passRate: "کامیابی کا تناسب",
      searchPlaceholder: "نام، رول نمبر، سیکشن سے تلاش کریں...",
      rollNo: "رول نمبر",
      studentName: "طالب علم کا نام",
      section: "سیکشن",
      total: "ٹوٹل (/100)",
      grade: "گریڈ",
      action: "عمل",
      inspect: "معائنہ کریں",
      closeInspection: "معائنہ بند کریں",
    },
  },
};
