
import React, { useState } from 'react';
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

const Settings = () => {
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: 30,
    lastBackup: '2024-01-15 10:30:00'
  });

  const [uiSettings, setUiSettings] = useState({
    theme: 'light',
    language: 'english',
    dateFormat: 'dd-mm-yyyy',
    timeFormat: '24h',
    showAnimations: true,
    compactMode: false
  });

  const [roleSettings, setRoleSettings] = useState({
    adminAccess: true,
    accountantAccess: true,
    salesAccess: false,
    viewerAccess: false
  });

  const [systemSettings, setSystemSettings] = useState({
    companyName: 'Accounting Pro',
    gstNumber: '',
    panNumber: '',
    address: '',
    phone: '',
    email: '',
    financialYear: '2024-25'
  });

  const handleBackupNow = () => {
    toast({ title: 'Backup initiated', description: 'Your data is being backed up...' });
    // Simulate backup process
    setTimeout(() => {
      setBackupSettings({
        ...backupSettings,
        lastBackup: new Date().toLocaleString()
      });
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup & Data Management */}
        <Card>
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
                checked={backupSettings.autoBackup}
                onCheckedChange={(checked) => 
                  setBackupSettings({...backupSettings, autoBackup: checked})
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Backup Frequency</Label>
              <Select 
                value={backupSettings.backupFrequency} 
                onValueChange={(value) => 
                  setBackupSettings({...backupSettings, backupFrequency: value})
                }
              >
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
                value={backupSettings.retentionDays}
                onChange={(e) => 
                  setBackupSettings({...backupSettings, retentionDays: parseInt(e.target.value) || 30})
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Last Backup</Label>
              <div className="text-sm text-gray-600">{backupSettings.lastBackup}</div>
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
        <Card>
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
              <Select 
                value={uiSettings.theme} 
                onValueChange={(value) => 
                  setUiSettings({...uiSettings, theme: value})
                }
              >
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
              <Select 
                value={uiSettings.language} 
                onValueChange={(value) => 
                  setUiSettings({...uiSettings, language: value})
                }
              >
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
              <Select 
                value={uiSettings.dateFormat} 
                onValueChange={(value) => 
                  setUiSettings({...uiSettings, dateFormat: value})
                }
              >
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
                checked={uiSettings.showAnimations}
                onCheckedChange={(checked) => 
                  setUiSettings({...uiSettings, showAnimations: checked})
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compact Mode</Label>
                <div className="text-sm text-gray-500">Reduce spacing and padding</div>
              </div>
              <Switch
                checked={uiSettings.compactMode}
                onCheckedChange={(checked) => 
                  setUiSettings({...uiSettings, compactMode: checked})
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Role & Access Management */}
        <Card>
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
                checked={roleSettings.adminAccess}
                onCheckedChange={(checked) => 
                  setRoleSettings({...roleSettings, adminAccess: checked})
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Accountant Access</Label>
                <div className="text-sm text-gray-500">Financial data access</div>
              </div>
              <Switch
                checked={roleSettings.accountantAccess}
                onCheckedChange={(checked) => 
                  setRoleSettings({...roleSettings, accountantAccess: checked})
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sales Access</Label>
                <div className="text-sm text-gray-500">Sales and customer data</div>
              </div>
              <Switch
                checked={roleSettings.salesAccess}
                onCheckedChange={(checked) => 
                  setRoleSettings({...roleSettings, salesAccess: checked})
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Viewer Access</Label>
                <div className="text-sm text-gray-500">Read-only access</div>
              </div>
              <Switch
                checked={roleSettings.viewerAccess}
                onCheckedChange={(checked) => 
                  setRoleSettings({...roleSettings, viewerAccess: checked})
                }
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
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Update your company details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={systemSettings.companyName}
                onChange={(e) => 
                  setSystemSettings({...systemSettings, companyName: e.target.value})
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>GST Number</Label>
                <Input
                  value={systemSettings.gstNumber}
                  onChange={(e) => 
                    setSystemSettings({...systemSettings, gstNumber: e.target.value.toUpperCase()})
                  }
                  placeholder="27ABCDE1234F1Z5"
                />
              </div>
              <div className="space-y-2">
                <Label>PAN Number</Label>
                <Input
                  value={systemSettings.panNumber}
                  onChange={(e) => 
                    setSystemSettings({...systemSettings, panNumber: e.target.value.toUpperCase()})
                  }
                  placeholder="ABCDE1234F"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={systemSettings.address}
                onChange={(e) => 
                  setSystemSettings({...systemSettings, address: e.target.value})
                }
                placeholder="Company address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={systemSettings.phone}
                  onChange={(e) => 
                    setSystemSettings({...systemSettings, phone: e.target.value})
                  }
                  placeholder="Phone number"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={systemSettings.email}
                  onChange={(e) => 
                    setSystemSettings({...systemSettings, email: e.target.value})
                  }
                  placeholder="company@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Financial Year</Label>
              <Select 
                value={systemSettings.financialYear} 
                onValueChange={(value) => 
                  setSystemSettings({...systemSettings, financialYear: value})
                }
              >
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
