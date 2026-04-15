import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contactsAPI } from '../lib/api';
import { Search, Plus, Mail, Building2 } from 'lucide-react';

export default function Contacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactsAPI.list({ limit: 50 });
      setContacts(response.data.contacts);
      setTotal(response.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length < 2) {
      fetchContacts();
      return;
    }
    try {
      const response = await contactsAPI.search(term);
      setContacts(response.data.contacts);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-gray-600 mt-1">{total} total contacts</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Contact
        </button>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <Link
              key={contact.id}
              to={`/contacts/${contact.id}`}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-lg">
                  {contact.first_name?.[0] || contact.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {contact.first_name} {contact.last_name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3" />
                    {contact.email}
                  </p>
                  {contact.company && (
                    <p className="text-sm text-gray-600 truncate flex items-center gap-1 mt-1">
                      <Building2 className="w-3 h-3" />
                      {contact.company}
                    </p>
                  )}
                  {contact.total_revenue > 0 && (
                    <p className="text-sm font-semibold text-green-600 mt-2">
                      ${contact.total_revenue.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
