export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">資産管理アプリ</h1>
        <p className="text-lg text-gray-600 mb-8">
          老後資産シミュレーションを目的とした資産管理アプリ
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold mb-1">資産管理</h2>
            <p className="text-sm text-gray-500">現在の総資産を把握する</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold mb-1">収支管理</h2>
            <p className="text-sm text-gray-500">毎月の収支と積立可能額を把握する</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold mb-1">老後条件設定</h2>
            <p className="text-sm text-gray-500">退職年齢・生活費・年金などを設定する</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold mb-1">シミュレーション</h2>
            <p className="text-sm text-gray-500">将来の資産推移を試算する</p>
          </div>
        </div>
      </div>
    </main>
  );
}
