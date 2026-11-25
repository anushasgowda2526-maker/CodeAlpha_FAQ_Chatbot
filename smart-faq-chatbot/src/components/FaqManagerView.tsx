import { Edit2, Eye, Plus, Search, Trash2, X } from 'lucide-react';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { FAQ_CATEGORIES, type FaqCategory, type FaqItem } from '../data/faqData';
import type { FaqFormValues } from '../types/chat';
import { preprocessText } from '../utils/nlpEngine';

interface FaqManagerViewProps {
  faqs: FaqItem[];
  onAddFaq: (values: FaqFormValues) => void;
  onUpdateFaq: (id: string, values: FaqFormValues) => void;
  onDeleteFaq: (id: string) => void;
  prefillQuestion?: string | null;
  onClearPrefill?: () => void;
}

export function FaqManagerView({
  faqs,
  onAddFaq,
  onUpdateFaq,
  onDeleteFaq,
  prefillQuestion,
  onClearPrefill,
}: FaqManagerViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | FaqCategory>(
    'All'
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [viewingFaq, setViewingFaq] = useState<FaqItem | null>(null);

  const [category, setCategory] = useState<FaqCategory>(FAQ_CATEGORIES[0]);
  const [question, setQuestion] = useState('');
  const [alternativesText, setAlternativesText] = useState('');
  const [answer, setAnswer] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (prefillQuestion) {
      setEditingId(null);
      setCategory(FAQ_CATEGORIES[0]);
      setQuestion(prefillQuestion);
      setAlternativesText('');
      setAnswer('');
      setFormError(null);
      setIsFormOpen(true);
      onClearPrefill?.();
    }
  }, [prefillQuestion, onClearPrefill]);

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return faqs.filter((item) => {
      const matchesCat =
        selectedCategory === 'All' || item.category === selectedCategory;
      if (!matchesCat) return false;
      if (!query) return true;
      return (
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.alternatives.some((alt) => alt.toLowerCase().includes(query))
      );
    });
  }, [faqs, searchQuery, selectedCategory]);

  const openAddForm = () => {
    setEditingId(null);
    setCategory(
      selectedCategory === 'All' ? FAQ_CATEGORIES[0] : selectedCategory
    );
    setQuestion('');
    setAlternativesText('');
    setAnswer('');
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item: FaqItem) => {
    setEditingId(item.id);
    setCategory(item.category);
    setQuestion(item.question);
    setAlternativesText(item.alternatives.join('\n'));
    setAnswer(item.answer);
    setFormError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormError(null);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

    if (!trimmedQuestion) {
      setFormError('Please enter the FAQ question.');
      return;
    }
    if (!trimmedAnswer) {
      setFormError('Please enter the FAQ answer.');
      return;
    }

    // Prevent duplicate FAQ entries based on normalized question text
    const normalizedNew = trimmedQuestion.toLowerCase().replace(/\s+/g, ' ');
    const duplicate = faqs.find(
      (item) =>
        item.id !== editingId &&
        item.question.trim().toLowerCase().replace(/\s+/g, ' ') ===
          normalizedNew
    );

    if (duplicate) {
      setFormError(
        `An FAQ with this question already exists in "${duplicate.category}". Please edit the existing entry or use a distinct question.`
      );
      return;
    }

    const parsedAlternatives = Array.from(
      new Set(
        alternativesText
          .split('\n')
          .map((line) => line.trim())
          .filter(
            (line) =>
              line.length > 0 &&
              line.toLowerCase() !== trimmedQuestion.toLowerCase()
          )
      )
    );

    const payload: FaqFormValues = {
      category,
      question: trimmedQuestion,
      alternatives: parsedAlternatives,
      answer: trimmedAnswer,
    };

    if (editingId) {
      onUpdateFaq(editingId, payload);
    } else {
      onAddFaq(payload);
    }
    closeForm();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            FAQ Knowledge Base
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            View, search, add, edit, or remove FAQs. Changes update the TF-IDF
            chatbot immediately.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddForm}
          className="h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1F3A] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-medium transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Add / Edit Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSave}
          className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-xl p-5 sm:p-6 space-y-4"
        >
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              {editingId ? 'Edit FAQ Entry' : 'Add New FAQ Entry'}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              aria-label="Close FAQ form"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {formError && (
            <p className="text-xs text-red-600 dark:text-red-400" role="alert">
              {formError}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="faq-category"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Category
              </label>
              <select
                id="faq-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as FaqCategory)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              >
                {FAQ_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="faq-question"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Primary Question
              </label>
              <input
                id="faq-question"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., How do I track my order?"
                className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="faq-alternatives"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Alternative Phrasings (optional, one per line)
            </label>
            <textarea
              id="faq-alternatives"
              rows={2}
              value={alternativesText}
              onChange={(e) => setAlternativesText(e.target.value)}
              placeholder={'Where is my package?\nCheck shipment status'}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="faq-answer"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Answer
            </label>
            <textarea
              id="faq-answer"
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write the clear customer support response..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={closeForm}
              className="h-9 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-4 rounded-lg bg-[#0B1F3A] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-medium"
            >
              {editingId ? 'Save Changes' : 'Add FAQ'}
            </button>
          </div>
        </form>
      )}

      {/* Search and Category Filter */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <label htmlFor="faq-search" className="sr-only">
            Search FAQs
          </label>
          <input
            id="faq-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, answers, or alternative phrasings..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="faq-filter-category" className="sr-only">
            Filter by category
          </label>
          <select
            id="faq-filter-category"
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as 'All' | FaqCategory)
            }
            className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
          >
            <option value="All">All Categories ({faqs.length})</option>
            {FAQ_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {filteredFaqs.length} shown
          </span>
        </div>
      </div>

      {/* FAQ List */}
      {filteredFaqs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            No matching FAQs found
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Try clearing your search filter or add a new FAQ entry.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((item) => (
            <article
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-blue-700 dark:text-blue-400">
                      {item.category}
                    </span>
                    {item.alternatives.length > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">
                          {item.alternatives.length} alt phrasing
                          {item.alternatives.length > 1 ? 's' : ''}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="mt-1 text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                    {item.question}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewingFaq(item)}
                    aria-label={`View details for ${item.question}`}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditForm(item)}
                    aria-label={`Edit ${item.question}`}
                    className="p-2 rounded-lg text-slate-500 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {confirmDeleteId === item.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteFaq(item.id);
                          setConfirmDeleteId(null);
                          if (viewingFaq?.id === item.id) {
                            setViewingFaq(null);
                          }
                        }}
                        className="px-2.5 py-1 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(item.id)}
                      aria-label={`Delete ${item.question}`}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.answer}
              </p>

              {item.alternatives.length > 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                  Also matches: {item.alternatives.join(' / ')}
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      {/* FAQ Detail Modal */}
      {viewingFaq && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="faq-detail-title"
        >
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                  {viewingFaq.category} ·{' '}
                  <span className="font-mono text-slate-500 dark:text-slate-400">
                    {viewingFaq.id}
                  </span>
                </p>
                <h2
                  id="faq-detail-title"
                  className="mt-1 text-base sm:text-lg font-semibold text-slate-900 dark:text-white"
                >
                  {viewingFaq.question}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setViewingFaq(null)}
                aria-label="Close FAQ details"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Answer
                </p>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                  {viewingFaq.answer}
                </p>
              </div>

              {viewingFaq.alternatives.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Alternative Phrasings ({viewingFaq.alternatives.length})
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {viewingFaq.alternatives.map((alt) => (
                      <li key={alt}>{alt}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Indexed NLP Tokens (Primary Question)
                </p>
                <p className="font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5">
                  {preprocessText(viewingFaq.question).join(', ') || 'None'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  const target = viewingFaq;
                  setViewingFaq(null);
                  openEditForm(target);
                }}
                className="h-9 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Edit Entry
              </button>
              <button
                type="button"
                onClick={() => setViewingFaq(null)}
                className="h-9 px-4 rounded-lg bg-[#0B1F3A] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
