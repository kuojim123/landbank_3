import { AfuAssistant } from "@/components/afu-assistant"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center sm:flex-row flex-col sm:space-x-3 space-x-0">
              <div className="flex items-center leading-7">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-QlEvvfqJsQiUYqnt72Qf8AZRfU6GxB.png"
                  alt="Land Bank of Taiwan Logo"
                  className="h-10 w-auto mr-3"
                />
                <span className="text-xl font-bold text-gray-900 sm:hidden">臺灣土地銀行</span>
              </div>
              <h1 className="text-xl font-bold text-green-700 sm:inline hidden">企業網路銀行</h1>
              <h1 className="text-sm font-bold text-green-700 sm:hidden block mt-1">企業網路銀行</h1>
            </div>
            <nav className="flex items-center space-x-4">
              {/* Notification dot */}
              <div className="relative">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              </div>

              {/* Bell notification icon */}
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5V3h0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.73 21a2 2 0 01-3.46 0" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z"
                  />
                </svg>
              </button>

              {/* Settings icon */}
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

              {/* Vertical divider */}
              <div className="h-8 w-px bg-gray-300"></div>

              {/* User profile section */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  陳
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">陳敏</div>
                  <div className="text-xs text-gray-600">財務經理</div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-3xl mb-3 font-normal text-slate-950">企業帳戶總覽</h2>
          <p className="text-lg text-slate-900">歡迎使用土地銀行企業網路銀行服務</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="border border-gray-100 rounded-2xl p-8 hover:border-gray-200 transition-colors bg-slate-200">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-medium text-gray-900">活期存款</h3>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-400 mb-4">123-456-789012</p>
            <p className="text-2xl font-light text-gray-900">1,234,567</p>
            <p className="text-sm text-gray-400 mt-1">TWD</p>
          </div>

          <div className="border border-gray-100 rounded-2xl p-8 hover:border-gray-200 transition-colors bg-slate-200">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-medium text-gray-900">支票存款</h3>
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-400 mb-4">987-654-321098</p>
            <p className="text-2xl font-light text-gray-900">987,654</p>
            <p className="text-sm text-gray-400 mt-1">TWD</p>
          </div>

          <div className="border border-gray-100 rounded-2xl p-8 hover:border-gray-200 transition-colors bg-slate-200">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-medium text-gray-900">外幣存款</h3>
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-400 mb-4">555-888-999777</p>
            <p className="text-2xl font-light text-gray-900">12,345</p>
            <p className="text-sm text-gray-400 mt-1">USD</p>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-xl font-medium text-gray-900 mb-8">常用功能</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <button className="group p-6 text-center hover:bg-gray-50 rounded-2xl transition-colors">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors bg-slate-200">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">轉帳匯款</span>
            </button>

            <button className="group p-6 text-center hover:bg-gray-50 rounded-2xl transition-colors">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors bg-slate-200">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">交易明細</span>
            </button>

            <button className="group p-6 text-center hover:bg-gray-50 rounded-2xl transition-colors">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors bg-slate-200">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">繳費服務</span>
            </button>

            <button className="group p-6 text-center hover:bg-gray-50 rounded-2xl transition-colors">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors bg-slate-200">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">帳戶設定</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium text-gray-900 mb-8">近期交易紀錄</h3>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="divide-y divide-gray-50">
              <div className="flex justify-between items-center p-6 hover:bg-gray-25 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">薪資轉帳</p>
                    <p className="text-sm text-gray-400 mt-1">2024-01-15 14:30</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+85,000</p>
                  <p className="text-sm text-gray-400 mt-1">TWD</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-6 hover:bg-gray-25 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">供應商付款</p>
                    <p className="text-sm text-gray-400 mt-1">2024-01-14 10:15</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-25,000</p>
                  <p className="text-sm text-gray-400 mt-1">TWD</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-6 hover:bg-gray-25 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">電費繳納</p>
                    <p className="text-sm text-gray-400 mt-1">2024-01-13 16:45</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-3,500</p>
                  <p className="text-sm text-gray-400 mt-1">TWD</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AfuAssistant />
    </div>
  )
}
