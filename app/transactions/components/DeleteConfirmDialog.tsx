'use client';

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({ onCancel, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Hapus Transaksi?</h2>
        <p className="mb-4 text-sm text-gray-600">
          Tindakan ini tidak dapat dibatalkan. Transaksi akan dihapus secara permanen.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
