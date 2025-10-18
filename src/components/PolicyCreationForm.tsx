import { useState } from 'react';
import { AlertCircle, Plus, X, ChevronRight } from 'lucide-react';

interface FormData {
  name: string;
  description: string;
  tags: string[];
  ruleType: string;
  sourceZones: string[];
  sourceAddresses: string[];
  negateSource: boolean;
  sourceUsers: string[];
  destinationZones: string[];
  destinationAddresses: string[];
  negateDestination: boolean;
  applications: string[];
  services: string[];
  urlCategories: string[];
  action: string;
  logStart: boolean;
  logEnd: boolean;
  securityProfile: string;
  schedule: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function PolicyCreationForm() {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    tags: [],
    ruleType: 'universal',
    sourceZones: [],
    sourceAddresses: [],
    negateSource: false,
    sourceUsers: [],
    destinationZones: [],
    destinationAddresses: [],
    negateDestination: false,
    applications: [],
    services: [],
    urlCategories: [],
    action: 'allow',
    logStart: false,
    logEnd: true,
    securityProfile: 'none',
    schedule: 'none'
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'source', label: 'Source' },
    { id: 'destination', label: 'Destination' },
    { id: 'application', label: 'Application' },
    { id: 'service', label: 'Service/URL Category' },
    { id: 'actions', label: 'Actions' }
  ];

  const zones = ['trust', 'untrust', 'dmz', 'any'];
  const commonAddresses = ['any', '10.0.0.0/8', '192.168.0.0/16', '172.16.0.0/12'];
  const commonApps = ['any', 'web-browsing', 'ssl', 'ssh', 'ftp', 'dns', 'smtp', 'ping'];
  const commonServices = ['application-default', 'any', 'service-http', 'service-https'];
  const securityProfiles = ['none', 'default', 'strict', 'alert-only'];

  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleAddToArray = (field: keyof FormData, value: string) => {
    const currentValue = formData[field];
    if (value && Array.isArray(currentValue) && !currentValue.includes(value)) {
      setFormData({ ...formData, [field]: [...currentValue, value] });
    }
  };

  const handleRemoveFromArray = (field: keyof FormData, value: string) => {
    const currentValue = formData[field];
    if (Array.isArray(currentValue)) {
      setFormData({ ...formData, [field]: currentValue.filter((item: string) => item !== value) });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Rule name is required';
    }
    if (formData.sourceZones.length === 0) {
      newErrors.sourceZones = 'At least one source zone is required';
    }
    if (formData.destinationZones.length === 0) {
      newErrors.destinationZones = 'At least one destination zone is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Policy submitted:', formData);
      alert('Security policy rule created successfully!');
    }
  };

  const renderArrayInput = (label: string, field: keyof FormData, options: string[], required = false) => {
    const fieldValue = formData[field];
    const fieldArray = Array.isArray(fieldValue) ? fieldValue : [];
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex gap-2">
          <select
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => {
              if (e.target.value) {
                handleAddToArray(field, e.target.value);
                e.target.value = '';
              }
            }}
          >
            <option value="">Select {label}</option>
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <button
            type="button"
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center gap-1"
            onClick={() => {
              const select = document.querySelector(`select`);
              if (select && (select as HTMLSelectElement).value) handleAddToArray(field, (select as HTMLSelectElement).value);
            }}
          >
            <Plus size={16} />
          </button>
        </div>
        {fieldArray.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {fieldArray.map((item: string) => (
              <span key={item} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveFromArray(field, item)}
                  className="hover:text-blue-900"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
        {errors[field] && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle size={14} />
            {errors[field]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Create Security Policy Rule</h1>
              <p className="text-sm text-gray-500 mt-1">Configure a new security policy rule for your NGFW</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => window.location.reload()}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center gap-2"
                onClick={handleSubmit}
              >
                Create Rule
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rule Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter rule name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                    placeholder="Enter rule description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rule Type
                  </label>
                  <select
                    value={formData.ruleType}
                    onChange={(e) => setFormData({ ...formData, ruleType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="universal">Universal</option>
                    <option value="interzone">Interzone</option>
                    <option value="intrazone">Intrazone</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Universal rules apply to all traffic. Interzone rules apply between different zones. Intrazone rules apply within a single zone.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Add tag and press Enter"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag: string) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-gray-900"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Source Tab */}
            {activeTab === 'source' && (
              <div className="space-y-6">
                {renderArrayInput('Source Zone', 'sourceZones', zones, true)}
                
                {renderArrayInput('Source Address', 'sourceAddresses', commonAddresses)}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="negateSource"
                    checked={formData.negateSource}
                    onChange={(e) => setFormData({ ...formData, negateSource: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="negateSource" className="text-sm text-gray-700">
                    Negate Source
                  </label>
                </div>

                {renderArrayInput('Source User', 'sourceUsers', ['any', 'pre-logon', 'known-user', 'unknown'])}

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Use 'any' to match all sources, or specify zones and addresses for more granular control.
                  </p>
                </div>
              </div>
            )}

            {/* Destination Tab */}
            {activeTab === 'destination' && (
              <div className="space-y-6">
                {renderArrayInput('Destination Zone', 'destinationZones', zones, true)}
                
                {renderArrayInput('Destination Address', 'destinationAddresses', commonAddresses)}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="negateDestination"
                    checked={formData.negateDestination}
                    onChange={(e) => setFormData({ ...formData, negateDestination: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="negateDestination" className="text-sm text-gray-700">
                    Negate Destination
                  </label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Best Practice:</strong> Use specific destination addresses for commonly exploited services like DNS and SMTP to prevent data exfiltration.
                  </p>
                </div>
              </div>
            )}

            {/* Application Tab */}
            {activeTab === 'application' && (
              <div className="space-y-6">
                {renderArrayInput('Application', 'applications', commonApps)}

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Applications with dependencies will automatically include required applications. Use App-ID for better visibility and control.
                  </p>
                </div>
              </div>
            )}

            {/* Service/URL Category Tab */}
            {activeTab === 'service' && (
              <div className="space-y-6">
                {renderArrayInput('Service', 'services', commonServices)}

                {renderArrayInput('URL Category', 'urlCategories', ['any', 'adult', 'hacking', 'malware', 'phishing'])}

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Recommendation:</strong> Use 'application-default' to allow applications on their standard ports for better security.
                  </p>
                </div>
              </div>
            )}

            {/* Actions Tab */}
            {activeTab === 'actions' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.action}
                    onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="allow">Allow</option>
                    <option value="deny">Deny</option>
                    <option value="drop">Drop</option>
                    <option value="reset-client">Reset Client</option>
                    <option value="reset-server">Reset Server</option>
                    <option value="reset-both">Reset Both</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Logging Options
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="logStart"
                      checked={formData.logStart}
                      onChange={(e) => setFormData({ ...formData, logStart: e.target.checked })}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="logStart" className="text-sm text-gray-700">
                      Log at Session Start
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="logEnd"
                      checked={formData.logEnd}
                      onChange={(e) => setFormData({ ...formData, logEnd: e.target.checked })}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="logEnd" className="text-sm text-gray-700">
                      Log at Session End (Recommended)
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Profile Group
                  </label>
                  <select
                    value={formData.securityProfile}
                    onChange={(e) => setFormData({ ...formData, securityProfile: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {securityProfiles.map(profile => (
                      <option key={profile} value={profile}>{profile}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule
                  </label>
                  <select
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="none">None (Always Active)</option>
                    <option value="business-hours">Business Hours</option>
                    <option value="after-hours">After Hours</option>
                  </select>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm text-green-800">
                    <strong>Best Practice:</strong> Enable 'Log at Session End' for better performance. Apply security profiles to inspect traffic for threats.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rule Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Rule Name:</span>
              <span className="ml-2 text-gray-600">{formData.name || 'Not set'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Action:</span>
              <span className="ml-2 text-gray-600">{formData.action}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Source Zones:</span>
              <span className="ml-2 text-gray-600">{formData.sourceZones.join(', ') || 'None'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Destination Zones:</span>
              <span className="ml-2 text-gray-600">{formData.destinationZones.join(', ') || 'None'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Applications:</span>
              <span className="ml-2 text-gray-600">{formData.applications.join(', ') || 'None'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Services:</span>
              <span className="ml-2 text-gray-600">{formData.services.join(', ') || 'None'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

