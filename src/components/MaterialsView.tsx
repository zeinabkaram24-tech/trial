import React, { useState, useRef } from 'react';
import {
  FolderOpen,
  Eye,
  Download,
  Printer,
  Upload,
  Plus,
  Edit2,
  Trash2,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  File,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Copy,
  BookOpen,
  Filter,
  GraduationCap
} from 'lucide-react';
import { SchoolMaterialFile, SchoolClass, UserRole } from '../types';
import { SubjectBadge, getSubjectInfo } from './SubjectBadge';
import { SUBJECTS } from '../data/initialData';

interface MaterialsViewProps {
  currentRole: UserRole;
  selectedClass: SchoolClass;
  selectedBlock: string;
  selectedWeek: string;
  materials: SchoolMaterialFile[];
  onUpdateMaterials: (materials: SchoolMaterialFile[]) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  currentRole,
  selectedClass,
  selectedBlock,
  selectedWeek,
  materials,
  onUpdateMaterials
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');

  // Preview Modal State
  const [previewFile, setPreviewFile] = useState<SchoolMaterialFile | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Admin Upload/Edit Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState(SUBJECTS[0].id);
  const [formClass, setFormClass] = useState<SchoolClass | 'all'>('all');
  const [formType, setFormType] = useState<'pdf' | 'doc' | 'image' | 'sheet'>('pdf');
  const [formDescription, setFormDescription] = useState('');
  const [formPreviewSummary, setFormPreviewSummary] = useState('');
  const [formFileName, setFormFileName] = useState('');
  const [formFileSize, setFormFileSize] = useState('1.2 MB');
  const [formFileDataUrl, setFormFileDataUrl] = useState<string | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filtered Materials
  const filteredMaterials = materials.filter((item) => {
    // Subject filter
    if (selectedSubjectFilter !== 'all' && item.subjectId !== selectedSubjectFilter) {
      return false;
    }
    // Type filter
    if (selectedTypeFilter !== 'all' && item.fileType !== selectedTypeFilter) {
      return false;
    }
    // Class filter
    if (classFilter !== 'all' && item.classId !== 'all' && item.classId !== classFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q) || false;
      const matchFile = item.fileName.toLowerCase().includes(q);
      const sub = getSubjectInfo(item.subjectId);
      const matchSub = sub.nameEn.toLowerCase().includes(q) || sub.nameAr.includes(q);
      if (!matchTitle && !matchDesc && !matchFile && !matchSub) {
        return false;
      }
    }
    return true;
  });

  // Action 1: Open (فتح)
  const handleOpenFile = (file: SchoolMaterialFile) => {
    if (file.fileDataUrl) {
      // Open the real data URL in new tab
      const win = window.open();
      if (win) {
        win.document.write(
          `<html><head><title>${file.title}</title></head><body style="margin:0;display:flex;justify-content:center;background:#1e293b;"><img src="${file.fileDataUrl}" style="max-width:100%;height:auto;"/></body></html>`
        );
      }
      return;
    }

    // Generate dedicated HTML preview viewer page
    const sub = getSubjectInfo(file.subjectId);
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>${file.title} - مدارس النيل المصرية الدولية</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; background: #f8fafc; color: #0f172a; }
          .header { background: #0f172a; color: white; padding: 24px; border-radius: 16px; margin-bottom: 24px; }
          .title { font-size: 20px; font-weight: bold; margin: 0 0 8px 0; }
          .meta { font-size: 13px; color: #94a3b8; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: bold; background: #38bdf8; color: #082f49; margin-top: 8px; }
          .content-box { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); white-space: pre-wrap; font-size: 15px; line-height: 1.8; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 16px; }
          @media print { body { padding: 0; background: white; } .header { background: white; color: black; border: 1px solid #ccc; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${file.title}</div>
          <div class="meta">مدارس النيل المصرية الدولية - فرع المنيا • جريد 2 (${file.classId === 'all' ? 'لكل الفصول 2A, 2B, 2C' : 'فصل ' + file.classId})</div>
          <div class="badge">${sub.nameEn} (${sub.nameAr}) • ملف ${file.fileType.toUpperCase()}</div>
        </div>
        <div class="content-box">
          ${file.previewSummary || file.description || 'محتوى المادة الدراسية متوفر لدى إدارة المدرسة.'}
        </div>
        <div class="footer">
          وثيقة رسمية معتمدة من مدارس النيل المصرية الدولية - فرع المنيا • العام الدراسي 2026/2027
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Action 2: Preview (معاينة)
  const handlePreviewFile = (file: SchoolMaterialFile) => {
    setPreviewFile(file);
  };

  // Action 3: Download (تحميل)
  const handleDownloadFile = (file: SchoolMaterialFile) => {
    if (file.fileDataUrl) {
      const link = document.createElement('a');
      link.href = file.fileDataUrl;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }

    // If text/doc preview summary, generate downloadable file
    const content = `======================================================
مدارس النيل المصرية الدولية - فرع المنيا (Nile Egyptian Schools)
الصف الثاني الابتدائي (Grade 2) - المواد الدراسية والخطط
======================================================
عنوان الملف: ${file.title}
المادة: ${getSubjectInfo(file.subjectId).nameEn} (${getSubjectInfo(file.subjectId).nameAr})
الفصل: ${file.classId === 'all' ? 'جميع فصول جريد 2 (2A, 2B, 2C)' : file.classId}
تاريخ الرفع: ${file.uploadDate}
اسم الملف: ${file.fileName}
الوصف: ${file.description || ''}

---------------- محتوى الملف والمذكرة ----------------
${file.previewSummary || 'محتوى معتمد من منسق المادة وإدارة المدرسة.'}
======================================================
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.fileName.endsWith('.txt') ? file.fileName : `${file.fileName.split('.')[0]}_Summary.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // Action 4: Print (طباعة)
  const handlePrintFile = (file: SchoolMaterialFile) => {
    const sub = getSubjectInfo(file.subjectId);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>طباعة: ${file.title}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: 'Segoe UI', Tahoma, sans-serif; color: #111; line-height: 1.6; margin: 0; padding: 10px; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .school-info h1 { font-size: 16pt; margin: 0 0 4px 0; color: #0f172a; font-weight: bold; }
          .school-info p { font-size: 10pt; margin: 0; color: #475569; }
          .doc-box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 20px; background: #f8fafc; }
          .doc-title { font-size: 13pt; font-weight: bold; margin-bottom: 6px; color: #0f172a; }
          .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); font-size: 9pt; color: #475569; gap: 6px; }
          .body-content { font-size: 11pt; white-space: pre-wrap; line-height: 1.8; border: 1px dashed #cbd5e1; padding: 20px; border-radius: 8px; }
          .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 9pt; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-info">
            <h1>مدارس النيل المصرية الدولية - فرع المنيا</h1>
            <p>Nile Egyptian Schools - Minya Branch • المرحلة الابتدائية (جريد 2)</p>
          </div>
          <div style="text-align: left; font-size: 10pt; font-weight: bold;">
            وثيقة دراسية معتمدة<br>
            <span style="font-size: 9pt; color: #64748b;">العام الدراسي 2026/2027</span>
          </div>
        </div>

        <div class="doc-box">
          <div class="doc-title">${file.title}</div>
          <div class="meta-grid">
            <div><strong>المادة:</strong> ${sub.nameEn} (${sub.nameAr})</div>
            <div><strong>الفصل:</strong> ${file.classId === 'all' ? 'جميع فصول جريد 2' : 'فصل ' + file.classId}</div>
            <div><strong>تاريخ النشر:</strong> ${file.uploadDate}</div>
            <div><strong>المعلم / الرافع:</strong> ${file.uploadedBy || 'إدارة المدرسة'}</div>
            <div><strong>نوع الملف:</strong> ${file.fileType.toUpperCase()} (${file.fileSize})</div>
            <div><strong>اسم الملف:</strong> ${file.fileName}</div>
          </div>
          ${file.description ? `<p style="margin: 8px 0 0 0; font-size: 9.5pt; color: #334155;"><strong>الوصف:</strong> ${file.description}</p>` : ''}
        </div>

        <div class="body-content">
${file.previewSummary || file.description || 'محتوى المادة الدراسية متوفر في منصة المدرسة المعتمدة.'}
        </div>

        <div class="footer">
          طُبع بواسطة نظام المتابعة المدرسية لمدارس النيل المصرية - فرع المنيا • ${new Date().toLocaleDateString('ar-EG')}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  // Admin: Open Add Modal
  const handleOpenAddModal = () => {
    setEditingFileId(null);
    setFormTitle('');
    setFormSubject(SUBJECTS[0].id);
    setFormClass('all');
    setFormType('pdf');
    setFormDescription('');
    setFormPreviewSummary('');
    setFormFileName('New_Material_Grade2.pdf');
    setFormFileSize('1.2 MB');
    setFormFileDataUrl(undefined);
    setIsUploadModalOpen(true);
  };

  // Admin: Open Edit Modal
  const handleOpenEditModal = (file: SchoolMaterialFile) => {
    setEditingFileId(file.id);
    setFormTitle(file.title);
    setFormSubject(file.subjectId);
    setFormClass(file.classId);
    setFormType(file.fileType);
    setFormDescription(file.description || '');
    setFormPreviewSummary(file.previewSummary || '');
    setFormFileName(file.fileName);
    setFormFileSize(file.fileSize);
    setFormFileDataUrl(file.fileDataUrl);
    setIsUploadModalOpen(true);
  };

  // Admin: Delete Material
  const handleDeleteFile = (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الملف من الماتيريال المدرسية؟')) return;
    const updated = materials.filter((m) => m.id !== id);
    onUpdateMaterials(updated);
  };

  // Handle File Upload from Local System
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormFileName(file.name);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setFormFileSize(`${sizeInMb} MB`);

    // Detect type
    if (file.type.includes('pdf')) setFormType('pdf');
    else if (file.type.includes('image')) setFormType('image');
    else if (file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.csv')) setFormType('sheet');
    else setFormType('doc');

    // Read Data URL for preview/download
    const reader = new FileReader();
    reader.onload = () => {
      setFormFileDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    if (!formTitle) {
      setFormTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
    }
  };

  // Admin: Save File
  const handleSaveFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingFileId) {
      // Update
      const updated = materials.map((m) => {
        if (m.id === editingFileId) {
          return {
            ...m,
            title: formTitle.trim(),
            subjectId: formSubject,
            classId: formClass,
            fileType: formType,
            fileName: formFileName.trim() || m.fileName,
            fileSize: formFileSize || m.fileSize,
            description: formDescription.trim() || undefined,
            previewSummary: formPreviewSummary.trim() || undefined,
            fileDataUrl: formFileDataUrl || m.fileDataUrl
          };
        }
        return m;
      });
      onUpdateMaterials(updated);
    } else {
      // Add new
      const newFile: SchoolMaterialFile = {
        id: `mat-${Date.now()}`,
        title: formTitle.trim(),
        subjectId: formSubject,
        classId: formClass,
        blockId: selectedBlock,
        weekId: selectedWeek,
        fileType: formType,
        fileName: formFileName.trim() || `Material_${Date.now()}.${formType === 'pdf' ? 'pdf' : 'docx'}`,
        fileSize: formFileSize || '1.5 MB',
        uploadDate: new Date().toISOString().slice(0, 10),
        uploadedBy: 'أدمن المدرسة (Admin)',
        description: formDescription.trim() || undefined,
        previewSummary: formPreviewSummary.trim() || undefined,
        fileDataUrl: formFileDataUrl
      };
      onUpdateMaterials([newFile, ...materials]);
    }

    setIsUploadModalOpen(false);
  };

  // Helper to render type icon
  const renderFileTypeIcon = (type: SchoolMaterialFile['fileType']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'sheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-sky-500" />;
      case 'doc':
      default:
        return <File className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center font-bold">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">
                  مكتبة الماتيريال والمذكرات (School Materials)
                </h2>
                <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {filteredMaterials.length} ملف متوفر
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                مدارس النيل المصرية الدولية فرع المنيا • جريد 2 • المذكرات والخطط المعتمدة مع أدوات: فتح، معاينة، تحميل، وطباعة
              </p>
            </div>
          </div>

          {/* Admin Upload Button */}
          {currentRole === 'admin' ? (
            <button
              id="admin-upload-material-btn"
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>+ رفع فايل ماتيريال جديد</span>
            </button>
          ) : (
            <div className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>متاح لكل ملف: فتح • معاينة • تحميل • طباعة</span>
            </div>
          )}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث باسم المذكرة، المادة، أو اسم الملف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
            />
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Class filter */}
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="all">كل الفصول (2A, 2B, 2C)</option>
              <option value="2A">فصل 2A</option>
              <option value="2B">فصل 2B</option>
              <option value="2C">فصل 2C</option>
            </select>

            {/* File Type Filter */}
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="all">جميع أنواع الملفات</option>
              <option value="pdf">ملفات PDF</option>
              <option value="doc">مستندات Word (DOC)</option>
              <option value="sheet">جداول وبيانات (Sheet)</option>
              <option value="image">صور وخرائط (Image)</option>
            </select>
          </div>
        </div>

        {/* Subject Filter Pills (English Names First!) */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            id="mat-sub-filter-all"
            type="button"
            onClick={() => setSelectedSubjectFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedSubjectFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            جميع المواد
          </button>
          {SUBJECTS.map((sub) => {
            const isSelected = selectedSubjectFilter === sub.id;
            return (
              <button
                key={sub.id}
                id={`mat-sub-filter-${sub.id}`}
                type="button"
                onClick={() => setSelectedSubjectFilter(sub.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? `${sub.color} border-current shadow-xs font-bold`
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sub.nameEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Materials Cards Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-base mb-1">
            لا توجد ملفات تطابق الفلتر المحدد
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            جرب اختيار مادة أخرى أو مسح البحث، أو يمكن للمسؤول إضافة ملفات ومذكرات جديدة من زر "رفع فايل ماتيريال جديد".
          </p>
          {currentRole === 'admin' && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
            >
              + إضافة ملف الآن
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((file) => {
            const sub = getSubjectInfo(file.subjectId);
            return (
              <div
                key={file.id}
                id={`material-card-${file.id}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Top Section */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                        {renderFileTypeIcon(file.fileType)}
                      </div>
                      <div>
                        <SubjectBadge subjectId={file.subjectId} size="sm" />
                        <span className="block text-[11px] text-slate-400 mt-0.5">
                          {file.classId === 'all' ? 'لكل فصول جريد 2' : `فصل ${file.classId}`}
                        </span>
                      </div>
                    </div>

                    {/* Admin Edit/Delete */}
                    {currentRole === 'admin' && (
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(file)}
                          className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                          title="تعديل بيانات الملف"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف الملف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-black text-slate-900 text-sm leading-snug mb-2 line-clamp-2">
                    {file.title}
                  </h3>
                  {file.description && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                      {file.description}
                    </p>
                  )}

                  {/* File Metadata Pill */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-semibold uppercase">
                      {file.fileType}
                    </span>
                    <span>•</span>
                    <span>{file.fileSize}</span>
                    <span>•</span>
                    <span>{file.uploadDate}</span>
                  </div>
                </div>

                {/* The 4 User-Requested Action Icons: فتح، معاينة، تحميل، طباعة */}
                <div className="border-t border-slate-100 bg-slate-50/70 p-3">
                  <div className="grid grid-cols-4 gap-1.5">
                    {/* 1. أيقونة فتح (Open) */}
                    <button
                      id={`btn-open-${file.id}`}
                      type="button"
                      onClick={() => handleOpenFile(file)}
                      className="flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 transition-all text-[11px] font-bold shadow-2xs group/btn"
                      title="فتح الملف في نافذة مستقلة"
                    >
                      <ExternalLink className="w-4 h-4 text-sky-600 group-hover/btn:scale-110 transition-transform" />
                      <span>فتح</span>
                    </button>

                    {/* 2. أيقونة معاينة (Preview) */}
                    <button
                      id={`btn-preview-${file.id}`}
                      type="button"
                      onClick={() => handlePreviewFile(file)}
                      className="flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-all text-[11px] font-bold shadow-2xs group/btn"
                      title="معاينة محتوى المذكرة"
                    >
                      <Eye className="w-4 h-4 text-purple-600 group-hover/btn:scale-110 transition-transform" />
                      <span>معاينة</span>
                    </button>

                    {/* 3. أيقونة تحميل (Download) */}
                    <button
                      id={`btn-download-${file.id}`}
                      type="button"
                      onClick={() => handleDownloadFile(file)}
                      className="flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all text-[11px] font-bold shadow-2xs group/btn"
                      title="تحميل الملف على جهازك"
                    >
                      <Download className="w-4 h-4 text-emerald-600 group-hover/btn:scale-110 transition-transform" />
                      <span>تحميل</span>
                    </button>

                    {/* 4. أيقونة طباعة (Print) */}
                    <button
                      id={`btn-print-${file.id}`}
                      type="button"
                      onClick={() => handlePrintFile(file)}
                      className="flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition-all text-[11px] font-bold shadow-2xs group/btn"
                      title="طباعة المذكرة مباشرة"
                    >
                      <Printer className="w-4 h-4 text-amber-600 group-hover/btn:scale-110 transition-transform" />
                      <span>طباعة</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL 1: PREVIEW MODAL (معاينة) ================= */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    {renderFileTypeIcon(previewFile.fileType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <SubjectBadge subjectId={previewFile.subjectId} size="sm" />
                      <span className="text-[11px] font-semibold text-slate-400">
                        {previewFile.fileName}
                      </span>
                    </div>
                    <h3 className="font-black text-slate-900 text-base mt-1">
                      {previewFile.title}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Document Meta Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 bg-slate-50 p-3 rounded-xl text-xs">
                <div>
                  <span className="block text-slate-400 text-[10px]">الفصل المستهدف</span>
                  <span className="font-bold text-slate-700">
                    {previewFile.classId === 'all' ? 'جميع فصول جريد 2' : previewFile.classId}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px]">نوع وحجم الملف</span>
                  <span className="font-bold text-slate-700 uppercase">
                    {previewFile.fileType} • {previewFile.fileSize}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px]">تاريخ النشر</span>
                  <span className="font-bold text-slate-700">{previewFile.uploadDate}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px]">جهة الرفع</span>
                  <span className="font-bold text-slate-700">{previewFile.uploadedBy || 'المدرسة'}</span>
                </div>
              </div>
            </div>

            {/* Document Content Viewer */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 rounded-xl border border-slate-200 my-2 max-h-[50vh]">
              {previewFile.fileDataUrl && previewFile.fileType === 'image' ? (
                <div className="text-center">
                  <img
                    src={previewFile.fileDataUrl}
                    alt={previewFile.title}
                    className="max-h-80 mx-auto rounded-lg shadow-xs"
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                      معاينة محتوى المذكرة والدليل الإرشادي:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const text = previewFile.previewSummary || previewFile.description || '';
                        navigator.clipboard.writeText(text);
                        setCopiedNotification(true);
                        setTimeout(() => setCopiedNotification(false), 2000);
                      }}
                      className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedNotification ? 'تم النسخ بنجاح ✓' : 'نسخ النص'}</span>
                    </button>
                  </div>
                  <div className="text-xs text-slate-800 font-sans leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-lg border border-slate-200">
                    {previewFile.previewSummary ||
                      previewFile.description ||
                      'ملف معتمد من إدارة المدرسة جاهز للفتح أو التحميل أو الطباعة.'}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action Icons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenFile(previewFile)}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>فتح في نافذة كاملة</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadFile(previewFile)}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل الملف</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePrintFile(previewFile)}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة فورية</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: ADMIN UPLOAD & EDIT MODAL ================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-slate-900 mb-4">
              {editingFileId ? 'تعديل فايل الماتيريال' : 'رفع فايل ماتيريال جديد لجريد 2'}
            </h3>

            <form onSubmit={handleSaveFile} className="space-y-4">
              {/* Native File Upload Input */}
              <div className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/40 rounded-xl p-4 text-center cursor-pointer transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-700">
                  انقر هنا لاختيار ملف من جهازك (PDF، Word، صورة، Excel)
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  أو يمكنك تعبئة تفاصيل المذكرة يدوياً بالأسفل
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx,.txt"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  عنوان الملف أو المذكرة:
                </label>
                <input
                  type="text"
                  placeholder="مثال: مذكرة مراجعة Math Addition مع بنك الأسئلة"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    المادة الدراسية:
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameEn} ({s.nameAr})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    الفصل المستهدف:
                  </label>
                  <select
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">جميع فصول جريد 2 (2A, 2B, 2C)</option>
                    <option value="2A">فصل 2A فقط</option>
                    <option value="2B">فصل 2B فقط</option>
                    <option value="2C">فصل 2C فقط</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    نوع الملف:
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="doc">Word Document (DOCX)</option>
                    <option value="sheet">Excel / Sheet</option>
                    <option value="image">صورة / خريطة (Image)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    اسم الملف وحجمه:
                  </label>
                  <input
                    type="text"
                    placeholder="Math_Grade2_Review.pdf"
                    value={formFileName}
                    onChange={(e) => setFormFileName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  نبذة وصفية عن المذكرة أو الملف:
                </label>
                <input
                  type="text"
                  placeholder="مثال: أوراق عمل شاملة للوحدة الثانية مع نماذج إجابات استرشادية..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  محتوى المعاينة والطباعة (نص المذكرة أو ملخص الأسئلة):
                </label>
                <textarea
                  placeholder="اكتب هنا محتوى المذكرة أو التوجيهات التي تظهر عند المعاينة والطباعة..."
                  value={formPreviewSummary}
                  onChange={(e) => setFormPreviewSummary(e.target.value)}
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {editingFileId ? 'حفظ التعديلات' : 'رفع وحفظ الفايل'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
