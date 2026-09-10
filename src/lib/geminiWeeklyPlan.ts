import { GoogleGenerativeAI } from '@google/generative-ai';
import { WeeklyPlanItem } from '../types';

// استدعاء مفتاح الـ API من ملف البيئة
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * دالة إرسال نص أو صورة الخطة الأسبوعية إلى Gemini لاستخراج Classwork و Homework
 */
export async function parseWeeklyPlanWithGemini(
  fileOrText: { base64Data?: string; mimeType?: string; rawText?: string },
  grade: string,
  weekNumber: number
): Promise<WeeklyPlanItem[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
أنت مساعد ذكي متخصص في تحليل الخطط الأسبوعية المدرسية (Weekly Plans).
المطلوب منك استخراج الجدول وتصنيفه إلى قائمة JSON بالصيغة التالية تماماً وبدون أي نصوص إضافية:

[
  {
    "day": "الأحد", // أو Sunday
    "subject": "Math",
    "classwork": "نص الكلاس وورك المستخرج",
    "homework": "نص الهوم وورك المستخرج"
  }
]

المرحلة الدراسية: ${grade}
الأسبوع رقم: ${weekNumber}

ملاحظات هامة جداً:
1. استخرج الكلاس وورك والواجب المنزلي (Homework) بدقة لكل مادة ولكل يوم.
2. إذا لم يكن هناك واجب اكتب "لا يوجد واجب".
3. أرجع النتيجة فقط بصيغة JSON Array صالحة.
`;

    let response;
    if (fileOrUrl.base64Data && fileOrUrl.mimeType) {
      // إذا كان الملف عبارة عن صورة أو PDF مصور
      response = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: fileOrUrl.base64Data,
            mimeType: fileOrUrl.mimeType
          }
        }
      ]);
    } else {
      // إذا كان نصاً مستخرجاً
      response = await model.generateContent([prompt, fileOrUrl.rawText || '']);
    }

    const textResult = response.response.text();
    // تنظيف النتيجة لاستخراج الـ JSON
    const jsonMatch = textResult.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("لم يتمكن الذكاء الاصطناعي من تنسيق البيانات بشكل صحيح.");
    }

    const parsedItems = JSON.parse(jsonMatch[0]);

    // تحويل البيانات إلى Structure التطبيق الرسمية
    return parsedItems.map((item: any, index: number) => ({
      id: `plan-${weekNumber}-${index}-${Date.now()}`,
      weekNumber: weekNumber,
      grade: grade,
      day: item.day,
      subject: item.subject,
      classwork: item.classwork || '',
      homework: item.homework || ''
    }));

  } catch (error) {
    console.error("خطأ في تحليل الخطة عبر Gemini:", error);
    throw error;
  }
}
