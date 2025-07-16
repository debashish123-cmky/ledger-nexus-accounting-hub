
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, User, UserPlus } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const RoleManagement = () => {
  const { roles, accounts, addRole, updateRole, deleteRole, addAccount, updateAccount, deleteAccount } = useData();
  const [activeTab, setActiveTab] = useState<'roles' | 'accounts'>('roles');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [editingAccount, setEditingAccount] = useState<any>(null);

  const [newRole, setNewRole] = useState({
    name: '',
    permissions: [] as string[]
  });

  const [newAccount, setNewAccount] = useState({
    username: '',
    email: '',
    role: '',
    status: 'active' as 'active' | 'inactive'
  });

  const availablePermissions = [
    'read_sales',
    'write_sales',
    'delete_sales',
    'read_inventory',
    'write_inventory',
    'delete_inventory',
    'read_customers',
    'write_customers',
    'delete_customers',
    'read_reports',
    'admin_access'
  ];

  const handleAddRole = () => {
    const role = {
      id: Date.now().toString(),
      ...newRole,
      createdAt: new Date().toISOString()
    };

    if (editingRole) {
      updateRole(editingRole.id, role);
      setEditingRole(null);
    } else {
      addRole(role);
    }

    setNewRole({ name: '', permissions: [] });
    setIsRoleDialogOpen(false);
  };

  const handleAddAccount = () => {
    const account = {
      id: Date.now().toString(),
      ...newAccount,
      createdAt: new Date().toISOString()
    };

    if (editingAccount) {
      updateAccount(editingAccount.id, account);
      setEditingAccount(null);
    } else {
      addAccount(account);
    }

    setNewAccount({ username: '', email: '', role: '', status: 'active' });
    setIsAccountDialogOpen(false);
  };

  const handleEditRole = (role: any) => {
    setEditingRole(role);
    setNewRole({
      name: role.name,
      permissions: role.permissions
    });
    setIsRoleDialogOpen(true);
  };

  const handleEditAccount = (account: any) => {
    setEditingAccount(account);
    setNewAccount({
      username: account.username,
      email: account.email,
      role: account.role,
      status: account.status
    });
    setIsAccountDialogOpen(true);
  };

  const togglePermission = (permission: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Role Management</h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'roles' ? 'default' : 'outline'}
            onClick={() => setActiveTab('roles')}
          >
            Roles
          </Button>
          <Button
            variant={activeTab === 'accounts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('accounts')}
          >
            Accounts
          </Button>
        </div>
      </div>

      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">System Roles</h3>
            <Dialog open={isRoleDialogOpen} onOpenChange={(open) => {
              setIsRoleDialogOpen(open);
              if (!open) {
                setEditingRole(null);
                setNewRole({ name: '', permissions: [] });
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="roleName" className="text-right">Name</Label>
                    <Input
                      id="roleName"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                      className="col-span-3"
                      placeholder="Enter role name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {availablePermissions.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission}
                            checked={newRole.permissions.includes(permission)}
                            onCheckedChange={() => togglePermission(permission)}
                          />
                          <Label htmlFor={permission} className="text-sm">
                            {permission.replace(/_/g, ' ').toUpperCase()}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setIsRoleDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRole}>
                    {editingRole ? 'Update' : 'Save'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {role.name}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditRole(role)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => deleteRole(role.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Permissions:</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {roles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No roles created yet. Add your first role to get started.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">User Accounts</h3>
            <Dialog open={isAccountDialogOpen} onOpenChange={(open) => {
              setIsAccountDialogOpen(open);
              if (!open) {
                setEditingAccount(null);
                setNewAccount({ username: '', email: '', role: '', status: 'active' });
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingAccount ? 'Edit Account' : 'Add New Account'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">Username</Label>
                    <Input
                      id="username"
                      value={newAccount.username}
                      onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                      className="col-span-3"
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newAccount.email}
                      onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                      className="col-span-3"
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">Role</Label>
                    <Select value={newAccount.role} onValueChange={(value) => setNewAccount({ ...newAccount, role: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Status</Label>
                    <Select value={newAccount.status} onValueChange={(value: 'active' | 'inactive') => setNewAccount({ ...newAccount, status: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setIsAccountDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAccount}>
                    {editingAccount ? 'Update' : 'Save'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {accounts.map((account) => (
              <Card key={account.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {account.username}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                        {account.status}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleEditAccount(account)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => deleteAccount(account.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-muted-foreground">{account.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Role</p>
                      <p className="text-muted-foreground">{account.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {accounts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No accounts created yet. Add your first account to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
