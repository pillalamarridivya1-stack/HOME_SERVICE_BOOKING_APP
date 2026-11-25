import { LogOut } from 'lucide-react';

export default function Sidebar({
  roleLabel,
  userName,
  userEmail,
  tabs,
  activeTab,
  onSelectTab,
  onLogout,
  darkTheme = false
}) {
  return (
    <aside
      className={`w-full lg:w-64 shrink-0 rounded-xl p-4 ${
        darkTheme
          ? 'bg-[#1E3A8A] text-blue-100'
          : 'bg-white border border-slate-200 text-slate-800'
      }`}
    >
      <div
        className={`pb-4 mb-4 border-b ${
          darkTheme ? 'border-blue-800' : 'border-slate-200'
        }`}
      >
        <p className={`text-xs font-medium ${darkTheme ? 'text-blue-200' : 'text-blue-600'}`}>
          {roleLabel}
        </p>
        <h2
          className={`text-base font-bold truncate ${
            darkTheme ? 'text-white' : 'text-[#1F2937]'
          }`}
        >
          {userName}
        </h2>
        <p
          className={`text-xs truncate ${
            darkTheme ? 'text-blue-200/80' : 'text-slate-500'
          }`}
        >
          {userEmail}
        </p>
      </div>

      <nav className="space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                darkTheme
                  ? isActive
                    ? 'bg-[#2563EB] text-white'
                    : 'text-blue-100 hover:bg-blue-800/70 hover:text-white'
                  : isActive
                    ? 'bg-[#2563EB] text-white'
                    : 'text-[#1F2937] hover:bg-[#F5F8FF] hover:text-[#2563EB]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer mt-2 ${
            darkTheme
              ? 'text-red-200 hover:bg-blue-900/80'
              : 'text-red-600 hover:bg-red-50'
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
