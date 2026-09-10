import React, { useState } from 'react';
import { parseWeeklyPlanWithGemini } from '../lib/geminiWeeklyPlan';
import { WeeklyPlanItem } from '../types';

interface Props {
  grade: string;
  weekNumber: number;
  onPlanParsed: (items: WeeklyPlanItem[]) => void;
}

export const WeeklyPlanPDFUploader: React.FC<Props> = ({ grade, weekNumber, onPlanParsed }) => {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatusText('جاري قراءة وتحليل ملف الـ Weekly Plan بواسطة الذكاء الاصطناعي...');

    try {
      // تحويل الملف إلى Base64 لإرساله لـ Gemini مباشرة
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = (reader.result as string).split(',')[1];
        
        const extractedItems = await parseWeeklyPlanWithGemini(
          {
            base64Data: base64String,
            mimeType: file.type || 'application/pdf'
          },
          grade,
          weekNumber
        );

        onPlanParsed(extractedItems);
        setStatusText('تم استخراج البيانات بنجاح وتحديث الـ Classwork والـ Homework!');
        setLoading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setStatusText('حدث خطأ أثناء القراءة. تأكد من ضبط مفتاح GEMINI_API_KEY في ملف .env');
      setLoading(false);
    }
  };

  return (
    <div className="p-5 border-2 border-dashed border-indigo-400 rounded-xl bg-indigo-50/40 text-center my-4">
      <h3 className="text-lg font-bold text-indigo-900 mb-2">
        📄 رفع ملف الـ Weekly Plan (PDF / صورة)
      </h3>
      <p className="text-xs text-gray-600 mb-4">
        يرجى رفع الملف وسيتم قراءة وتحليل الـ Classwork والـ Homework تلقائياً وتوزيعها على الحصص.
      </p>

      <input
        type="file"
        accept="application/pdf,image/*"
        onChange={handleFileUpload}
        disabled={loading}
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:bg-indigo-600 file:text-white file:font-semibold hover:file:bg-indigo-700 cursor-pointer"
      />

      {statusText && (
        <div className={`mt-3 text-sm font-medium ${loading ? 'text-indigo-600 animate-pulse' : 'text-green-700'}`}>
          {statusText}
        </div>
      )}
    </div>
  );
};
