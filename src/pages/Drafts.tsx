import { useEffect, useState } from 'react';
import { draftsAPI } from '../lib/api';
import { Mail, Check, X, RefreshCw, Send } from 'lucide-react';

export default function Drafts() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDraft, setSelectedDraft] = useState<any>(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const response = await draftsAPI.list('pending');
      setDrafts(response.data.drafts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await draftsAPI.approve(id);
      fetchDrafts();
      setSelectedDraft(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    const feedback = prompt('Why are you rejecting this draft?');
    if (!feedback) return;
    try {
      await draftsAPI.reject(id, feedback);
      fetchDrafts();
      setSelectedDraft(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (id: string) => {
    if (!confirm('Send this email?')) return;
    try {
      await draftsAPI.send(id);
      fetchDrafts();
      setSelectedDraft(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Draft Emails</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            drafts.map((draft) => (
              <div
                key={draft.id}
                onClick={() => setSelectedDraft(draft)}
                className={`card cursor-pointer transition-colors ${
                  selectedDraft?.id === draft.id ? 'bg-primary-50 border-primary-300' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{draft.subject}</p>
                    <p className="text-sm text-gray-600 truncate">
                      To: {draft.first_name} {draft.last_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(draft.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedDraft ? (
            <div className="card">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">{selectedDraft.subject}</h2>
                <p className="text-sm text-gray-600">
                  To: {selectedDraft.first_name} {selectedDraft.last_name} ({selectedDraft.email})
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 max-h-96 overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: selectedDraft.draft_content }} />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(selectedDraft.id)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleSend(selectedDraft.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Now
                </button>
                <button
                  onClick={() => handleReject(selectedDraft.id)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="card text-center py-12 text-gray-500">
              Select a draft to preview and approve
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
