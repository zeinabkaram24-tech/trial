// Generate authentic high-fidelity printable HTML document with mobile responsiveness
  const generateDocumentHtml = (file: SchoolMaterialFile) => {
    const sub = getSubjectInfo(file.subjectId);
    const blockName = getBlockName(file.blockId || 'block1');
    const classLabel = file.classId === 'all' ? 'All Classes (2A, 2B, 2C)' : `Class ${file.classId}`;

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${file.title} - Nile Egyptian Schools</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      background: #f8fafc;
      font-family: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
    }
    body {
      display: flex;
      justify-content: center;
      padding: 12px;
    }
    .page {
      background: white;
      width: 100%;
      max-width: 820px;
      min-height: 100vh;
      padding: 24px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      border: 1px solid #cbd5e1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: clamp(28px, 6vw, 52px);
      font-weight: 900;
      color: rgba(2, 132, 199, 0.04);
      pointer-events: none;
      white-space: nowrap;
      user-select: none;
      z-index: 1;
    }
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      position: relative;
      z-index: 2;
    }
    .school-title-ar { font-size: 15px; font-weight: 900; color: #0f172a; margin-bottom: 2px; }
    .school-title-en { font-size: 12px; font-weight: 700; color: #0284c7; margin-bottom: 4px; }
    .school-sub { font-size: 10px; color: #64748b; }
    .badge-subject {
      background: #0f172a;
      color: white;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
      shrink: 0;
    }
    .student-fields {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 11px;
      margin-bottom: 16px;
      position: relative;
      z-index: 2;
    }
    .student-field strong { color: #0f172a; }
    .sheet-title-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 10px 14px;
      border-radius: 8px;
      margin-bottom: 16px;
      text-align: center;
      position: relative;
      z-index: 2;
    }
    .sheet-title-box h2 {
      margin: 0 0 4px 0;
      font-size: 15px;
      font-weight: 900;
      color: #166534;
    }
    .sheet-meta {
      font-size: 10px;
      color: #15803d;
      font-weight: 600;
    }
    .content-box {
      flex: 1;
      font-size: 13px;
      line-height: 1.8;
      color: #1e293b;
      white-space: pre-wrap;
      word-break: break-word;
      position: relative;
      z-index: 2;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 16px;
      background: #ffffff;
    }
    .footer {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      font-size: 10px;
      color: #64748b;
      position: relative;
      z-index: 2;
    }
    .seal {
      border: 2px solid #0284c7;
      color: #0284c7;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 800;
      font-size: 9px;
    }
    @media print {
      body { padding: 0; background: white; }
      .page { box-shadow: none; border: none; max-width: 100%; min-height: auto; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="watermark">NILE EGYPTIAN SCHOOLS</div>
    <div>
      <div class="header">
        <div>
          <div class="school-title-ar">مدارس النيل المصرية الدولية - فرع المنيا</div>
          <div class="school-title-en">Nile Egyptian Schools - Minya Branch</div>
          <div class="school-sub">Grade 2 • ${blockName} • العام الدراسي 2026/2027</div>
        </div>
        <div class="badge-subject">
          ${sub.nameAr}
          <div style="font-size: 9px; opacity: 0.8; font-weight: normal;">${sub.nameEn}</div>
        </div>
      </div>

      <div class="student-fields">
        <div><strong>اسم الطالب:</strong> ....................................</div>
        <div><strong>Class:</strong> ${classLabel}</div>
        <div><strong>التاريخ:</strong> ${file.uploadDate || '2026/2027'}</div>
      </div>

      <div class="sheet-title-box">
        <h2>${file.title}</h2>
        <div class="sheet-meta">${file.fileName} • ${file.fileSize}</div>
      </div>

      <div class="content-box">
${file.previewSummary || file.description || 'محتوى الشيت والتدريبات الدراسية المعتمدة لمدارس النيل المصرية الدولية.'}
      </div>
    </div>

    <div class="footer">
      <div>اعتماد الإدارة: ................................</div>
      <div class="seal">معتمد ✓ مدرسة النيل بالمنيا</div>
      <div>الصفحة 1 من 1</div>
    </div>
  </div>
</body>
</html>`;
  };
