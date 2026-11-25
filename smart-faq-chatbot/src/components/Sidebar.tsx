import {
  BarChart3,
  BookOpen,
  History,
  LayoutDashboard,
  MessageSquare,
  MessageSquarePlus,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';
import type { ComponentType } from 'react';
import type { AppView } from '../types/chat';

interface SidebarProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  onNewConversation: () => void;
  totalFaqs: number;
  historyCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: AppView;
  label: string;
  icon: ComponentType<{ className?: string }>;
  meta?: string;
}

export function Sidebar({
  activeView,
  onSelectView,
  onNewConversation,
  totalFaqs,
  historyCount,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chatbot', label: 'Chatbot Workspace', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    {
      id: 'faq-manager',
      label: 'FAQ Knowledge Base',
      icon: BookOpen,
      meta: String(totalFaqs),
    },
    {
      id: 'history',
      label: 'Conversation History',
      icon: History,
      meta: historyCount > 0 ? String(historyCount) : undefined,
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavigate = (view: AppView) => {
    onSelectView(view);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-[#0B1F3A] text-slate-100 w-64 shrink-0 border-r border-slate-800/80">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold tracking-tight text-white truncate">
              FAQ Assistant
            </p>
            <p className="text-xs text-blue-200/80 truncate">
              Customer Support AI
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Primary Action */}
      <div className="p-4">
        <button
          type="button"
          onClick={() => {
            onNewConversation();
            onCloseMobile();
          }}
          className="w-full h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <MessageSquarePlus className="w-4 h-4 shrink-0" />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Navigation */}
      <nav aria-label="Primary Navigation" className="flex-1 px-3 space-y-1">
        {navItems.map(({ id, label, icon: Icon, meta }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleNavigate(id)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                isActive
                  ? 'bg-white/12 text-white'
                  : 'text-slate-300 hover:bg-white/8 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-blue-300' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{label}</span>
              </span>
              {meta !== undefined && (
                <span className="text-xs font-mono tabular-nums text-blue-200/80">
                  {meta}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer note */}
      <div className="p-4 border-t border-white/10 text-xs text-slate-400">
        <p className="font-medium text-slate-300">TF-IDF & Cosine Engine</p>
        <p className="mt-0.5 text-slate-400">CodeAlpha AI Internship</p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block h-full shrink-0">{sidebarContent}</aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
