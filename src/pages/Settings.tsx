
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
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
  Monitor
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';

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
    lastBackup, setLastBackup
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
    toast({ title: 'Settings saved successfully!' });
  };

  return (
    <div className="space-y-6 w-full max-w-none">
      <div className="flex items-center space-x-2">
        <SettingsIcon className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Backup & Data Management */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Backup & Data Management</span>
            </CardTitle>
            <CardDescription>Manage your data backup and restore settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Backup</Label>
                <div className="text-sm text-gray-500">Automatically backup data</div>
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
                  <SelectItem value="hourly">Hourly</SelectItem>
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
              />
            </div>

            <div className="space-y-2">
              <Label>Last Backup</Label>
              <div className="text-sm text-gray-600">{lastBackup}</div>
            </div>

            <Separator />

            <div className="flex flex-col space-y-2">
              <Button onClick={handleBackupNow} className="w-full">
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
          </CardContent>
        </Card>

        {/* UI & Display Settings */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>UI & Display Settings</span>
            </CardTitle>
            <CardDescription>Customize the appearance and behavior</CardDescription>
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
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="gujarati">Gujarati</SelectItem>
                  <SelectItem value="marathi">Marathi</SelectItem>
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
                <div className="text-sm text-gray-500">Enable UI animations</div>
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

        {/* Role & Access Management */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Role & Access Management</span>
            </CardTitle>
            <CardDescription>Configure user roles and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Admin Access</Label>
                <div className="text-sm text-gray-500">Full system access</div>
              </div>
              <Switch
                checked={adminAccess}
                onCheckedChange={setAdminAccess}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Accountant Access</Label>
                <div className="text-sm text-gray-500">Financial data access</div>
              </div>
              <Switch
                checked={accountantAccess}
                onCheckedChange={setAccountantAccess}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sales Access</Label>
                <div className="text-sm text-gray-500">Sales and customer data</div>
              </div>
              <Switch
                checked={salesAccess}
                onCheckedChange={setSalesAccess}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Viewer Access</Label>
                <div className="text-sm text-gray-500">Read-only access</div>
              </div>
              <Switch
                checked={viewerAccess}
                onCheckedChange={setViewerAccess}
              />
            </div>

            <Separator />

            <Button variant="outline" className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </CardContent>
        </Card>

        {/* Company Settings */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Update your company details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

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
              <Label>Address</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Company address"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="company@email.com"
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
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
