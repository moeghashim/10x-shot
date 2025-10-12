"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Shield, 
  Calendar,
  Activity
} from "lucide-react"
import { format } from "date-fns"
import { AuthService } from "@/lib/auth"
import { fetchAdminUsers, fetchUserActivity, updateAdminUser, logActivity } from "@/lib/data-fetching"
import type { AdminUser, UserActivity } from "@/types/database"

export function UserManager() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [newUser, setNewUser] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'admin' as 'admin' | 'super_admin'
  })

  useEffect(() => {
    loadUsers()
    loadActivity()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    const { data } = await fetchAdminUsers()
    setUsers(data || [])
    setLoading(false)
  }

  const loadActivity = async () => {
    const { data } = await fetchUserActivity(50)
    setActivities(data || [])
  }

  const createUser = async () => {
    try {
      const { success, error } = await AuthService.createAdminUser({
        email: newUser.email,
        password: newUser.password,
        full_name: newUser.full_name,
        role: newUser.role
      })

      if (!success) {
        console.warn('Failed to create user:', error)
        return
      }

      loadUsers()
      setShowCreateForm(false)
      setNewUser({ email: '', full_name: '', password: '', role: 'admin' })
    } catch (error) {
      console.warn('Failed to create user:', error)
    }
  }

  const updateUser = async (user: AdminUser) => {
    const { error } = await updateAdminUser(user.id, {
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_active: user.is_active
    })

    if (!error) {
      await logActivity('UPDATE_USER', 'admin_user', undefined, `Updated user: ${user.email}`)
      loadUsers()
      setEditingUser(null)
    }
  }

  const toggleUserStatus = async (user: AdminUser) => {
    const updatedUser = { ...user, is_active: !user.is_active }
    await updateUser(updatedUser)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="text-center">Loading user management...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage admin users and view system activity</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Admin User</CardTitle>
            <CardDescription>Add a new administrator to the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Secure password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <Select value={newUser.role} onValueChange={(value: 'admin' | 'super_admin') => setNewUser({...newUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={createUser}>Create User</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Admin Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(users || []).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-medium">{user.full_name || user.email}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role.replace('_', ' ')}
                    </Badge>
                    <Badge variant={user.is_active ? "default" : "secondary"}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created {format(new Date(user.created_at), 'MMM dd, yyyy')}
                    </span>
                    {user.last_login && (
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Last login {format(new Date(user.last_login), 'MMM dd, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleUserStatus(user)}
                    className="flex items-center gap-1"
                  >
                    {user.is_active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingUser(user)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-gray-500 text-sm">No activity recorded yet</p>
            ) : (
              (activities || []).slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="text-sm font-medium">{activity.action.replace('_', ' ')}</p>
                    {activity.details && <p className="text-xs text-gray-500">{activity.details}</p>}
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(activity.created_at), 'MMM dd, HH:mm')}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  value={editingUser.full_name || ''}
                  onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <Select value={editingUser.role} onValueChange={(value: 'admin' | 'super_admin') => setEditingUser({...editingUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => updateUser(editingUser)}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}