import { useAuthStore } from '@/lib/store/authStore';

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hoşgeldiniz
          </h1>
          <button
            onClick={() => useAuthStore.getState().logout()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Bu sayfa sadece giriş yapmış kullanıcılar tarafından görüntülenebilir.
        </p>
        <p className="text-lg font-medium">
          Merhaba, <span className="text-blue-600">{user?.email}</span>
        </p>
      </main>
    </div>
  );
}