import { useEffect, useState } from 'react';
import { integrationsAPI } from '../lib/api';
import { CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';

const PLATFORMS = [
  { id: 'microsoft', name: 'Microsoft 365', description: 'Email, calendar, OneDrive' },
  { id: 'shopify', name: 'Shopify', description: 'E-commerce customers and orders' },
  { id: 'gorgias', name: 'Gorgias', description: 'Customer support tickets' },
  { id: 'shipstation', name: 'ShipStation', description: 'Order fulfillment' },
  { id: 'slack', name: 'Slack', description: 'Team communication' },
  { id: 'clickup', name: 'ClickUp', description: 'Project management' },
  { id: 'gohighlevel', name: 'GoHighLevel', description: 'CRM and marketing' },
  { id: 'quickbooks', name: 'QuickBooks', description: 'Accounting and invoices' },
  { id: 'google_ads', name: 'Google Ads', description: 'Ad campaigns' },
  { id: 'meta', name: 'Meta Ads', description: 'Facebook/Instagram ads' },
  { id: 'google_analytics', name: 'Google Analytics', description: 'Website analytics' },
];

export default function Integrations() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [setLoading] = useState(true);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const response = await integrationsAPI.list();
      setIntegrations(response.data.integrations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform: string) => {
    try {
      const response = await integrationsAPI.connect(platform);
      if (response.data.authUrl) {
        window.open(response.data.authUrl, '_blank');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSync = async (platform: string) => {
    try {
      await integrationsAPI.sync(platform);
      alert(`${platform} sync started`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisconnect = async (platform: string) => {
    if (!confirm(`Disconnect ${platform}?`)) return;
    try {
      await integrationsAPI.disconnect(platform);
      fetchIntegrations();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-gray-600 mt-1">Connect your business tools</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLATFORMS.map((platform) => {
          const integration = integrations.find((i) => i.platform === platform.id);
          const isConnected = integration?.isConnected || false;

          return (
            <div key={platform.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                  <p className="text-sm text-gray-600">{platform.description}</p>
                </div>
                {isConnected ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-gray-400" />
                )}
              </div>

              {isConnected && integration?.lastSyncAt && (
                <p className="text-xs text-gray-500 mb-3">
                  Last synced: {new Date(integration.lastSyncAt).toLocaleDateString()}
                </p>
              )}

              <div className="flex gap-2">
                {isConnected ? (
                  <>
                    <button
                      onClick={() => handleSync(platform.id)}
                      className="btn-secondary text-sm py-1.5 flex items-center gap-1"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Sync
                    </button>
                    <button
                      onClick={() => handleDisconnect(platform.id)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.id)}
                    className="btn-primary text-sm py-1.5 flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
