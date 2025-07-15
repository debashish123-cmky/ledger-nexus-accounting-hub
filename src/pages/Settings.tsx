
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings as SettingsIcon, 
  Database, 
  Palette, 
  Users, 
  Shield, 
  Download, 
  Upload,
  Save,
  RefreshCw,
  Moon,
  Sun,
  Monitor,
  Building
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import RoleManagement from '@/components/RoleManagement';
import VoiceToText from '@/components/VoiceToText';

const Settings = () => {
  const {
    // UI Settings
    theme, setTheme,
    language, setLanguage,
    dateFormat, setDateFormat,
    timeFormat, setTimeFormat,
    showAnimations, setShowAnimations,
    compactMode, setCompactMode,
    
    // Role Settings
    adminAccess, setAdminAccess,
    accountantAccess, setAccountantAccess,
    salesAccess, setSalesAccess,
    viewerAccess, setViewerAccess,
    
    // Company Settings
    companyName, setCompanyName,
    gstNumber, setGstNumber,
    panNumber, setPanNumber,
    address, setAddress,
    phone, setPhone,
    email, setEmail,
    financialYear, setFinancialYear,
    
    // Backup Settings
    autoBackup, setAutoBackup,
    backupFrequency, setBackupFrequency,
    retentionDays, setRetentionDays,
    lastBackup, setLastBackup,
    
    // Translation
    t
  } = useSettings();

  const handleBackupNow = () => {
    toast({ title: 'Backup initiated', description: 'Your data is being backed up...' });
    setTimeout(() => {
      setLastBackup(new Date().toLocaleString());
      toast({ title: 'Backup completed successfully!' });
    }, 2000);
  };

  const handleRestoreData = () => {
    toast({ title: 'Data restore initiated', description: 'Please wait while we restore your data...' });
  };

  const handleExportData = () => {
    toast({ title: 'Data export started', description: 'Your data will be downloaded shortly...' });
  };

  const handleSaveSettings = () => {
    toast({ title: 'Settings saved successfully!', description: 'All your settings have been updated.' });
  };

  const handleVoiceInput = (text: string, setter: (value: string) => void) => {
    setter(text);
  };

  return (
    <div className="space-y-6 w-full max-w-none p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <SettingsIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">{t('settings')}</h2>
        </div>
        <VoiceToText 
          onTranscript={(text) => toast({ title: 'Voice command', description: text })}
          language={language}
          placeholder="Voice settings command"
        />
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
          <TabsTrigger value="company" className="flex items-center space-x-2 p-3">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Company</span>
          </TabsTrigger>
          <TabsTrigger value="ui" className="flex items-center space-x-2 p-3">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">UI & Display</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center space-x-2 p-3">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Roles</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2 p-3">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center space-x-2 p-3">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Backup</span>
          </TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Company Information</span>
              </CardTitle>
              <CardDescription>Update your company details and business information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="flex-1"
                      />
                      <VoiceToText 
                        onTranscript={(text) => handleVoiceInput(text, setCompanyName)}
                        language={language}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Address</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Company address"
                        className="flex-1"
                      />
                      <VoiceToText 
                        onTranscript={(text) => handleVoiceInput(text, setAddress)}
                        language={language}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone number"
                          className="flex-1"
                        />
                        <VoiceToText 
                          onTranscript={(text) => handleVoiceInput(text, setPhone)}
                          language={language}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="company@email.com"
                          className="flex-1"
                        />
                        <VoiceToText 
                          onTranscript={(text) => handleVoiceInput(text, setEmail)}
                          language={language}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>GST Number</Label>
                      <Input
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                        placeholder="27ABCDE1234F1Z5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>PAN Number</Label>
                      <Input
                        value={panNumber}
                        onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Financial Year</Label>
                    <Select value={financialYear} onValueChange={setFinancialYear}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023-24">2023-24</SelectItem>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2025-26">2025-26</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* UI & Display Settings */}
        <TabsContent value="ui" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Appearance</span>
                </CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center space-x-2">
                          <Sun className="h-4 w-4" />
                          <span>Light</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center space-x-2">
                          <Moon className="h-4 w-4" />
                          <span>Dark</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center space-x-2">
                          <Monitor className="h-4 w-4" />
                          <span>System</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Animations</Label>
                    <div className="text-sm text-gray-500">Enable UI animations and transitions</div>
                  </div>
                  <Switch
                    checked={showAnimations}
                    onCheckedChange={setShowAnimations}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <div className="text-sm text-gray-500">Reduce spacing and padding</div>
                  </div>
                  <Switch
                    checked={compactMode}
                    onCheckedChange={setCompactMode}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Role Access Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Role Access Control</span>
                </CardTitle>
                <CardDescription>Configure access permissions for different roles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Admin Access</Label>
                    <div className="text-sm text-gray-500">Full system access and management</div>
                  </div>
                  <Switch
                    checked={adminAccess}
                    onCheckedChange={setAdminAccess}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Accountant Access</Label>
                    <div className="text-sm text-gray-500">Financial data and reporting access</div>
                  </div>
                  <Switch
                    checked={accountantAccess}
                    onCheckedChange={setAccountantAccess}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sales Access</Label>
                    <div className="text-sm text-gray-500">Sales and customer data access</div>
                  </div>
                  <Switch
                    checked={salesAccess}
                    onCheckedChange={setSalesAccess}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Viewer Access</Label>
                    <div className="text-sm text-gray-500">Read-only access to data</div>
                  </div>
                  <Switch
                    checked={viewerAccess}
                    onCheckedChange={setViewerAccess}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <RoleManagement />
        </TabsContent>

        {/* Backup & Data Management */}
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Backup & Data Management</span>
              </CardTitle>
              <CardDescription>Manage your data backup, restore, and export settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Backup</Label>
                      <div className="text-sm text-gray-500">Automatically backup data at scheduled intervals</div>
                    </div>
                    <Switch
                      checked={autoBackup}
                      onCheckedChange={setAutoBackup}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Every Hour</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Retention Period (Days)</Label>
                    <Input
                      type="number"
                      value={retentionDays}
                      onChange={(e) => setRetentionDays(parseInt(e.target.value) || 30)}
                      min="1"
                      max="365"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Last Backup</Label>
                    <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded border">
                      {lastBackup}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Backup Information</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Automatic backups run in the background</li>
                      <li>• All your data is securely encrypted</li>
                      <li>• Backups include all transactions and settings</li>
                      <li>• You can restore data from any backup point</li>
                    </ul>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <Button onClick={handleBackupNow} className="w-full bg-green-600 hover:bg-green-700">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Backup Now
                    </Button>
                    <Button onClick={handleRestoreData} variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Restore Data
                    </Button>
                    <Button onClick={handleExportData} variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-center pt-6">
        <Button onClick={handleSaveSettings} size="lg" className="bg-green-600 hover:bg-green-700 px-8">
          <Save className="h-5 w-5 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
