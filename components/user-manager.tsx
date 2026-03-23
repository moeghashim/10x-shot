"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Activity, Calendar, Edit, Eye, EyeOff, Plus, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AdminUser, UserActivity } from "@/types/database";

export function UserManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [newUser, setNewUser] = useState({
    email: "",
    full_name: "",
    password: "",
  });

  useEffect(() => {
    void loadUsers();
    void loadActivity();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const response = await fetch("/api/admin/users");
    const result = await response.json();
    setUsers(response.ok ? result.data || [] : []);
    setLoading(false);
  };

  const loadActivity = async () => {
    const response = await fetch("/api/admin/activity?limit=50");
    const result = await response.json();
    setActivities(response.ok ? result.data || [] : []);
  };

  const createUser = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const result = await response.json();

      if (!response.ok) {
        console.warn("Failed to create user:", result.error);
        return;
      }

      await loadUsers();
      setShowCreateForm(false);
      setNewUser({ email: "", full_name: "", password: "" });
    } catch (error) {
      console.warn("Failed to create user:", error);
    }
  };

  const updateUser = async (user: AdminUser) => {
    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        full_name: user.full_name,
        is_active: user.is_active,
      }),
    });

    if (response.ok) {
      await loadUsers();
      setEditingUser(null);
      return;
    }

    const result = await response.json();
    console.warn("Failed to update user:", result.error);
  };

  const toggleUserStatus = async (user: AdminUser) => {
    await updateUser({ ...user, is_active: !user.is_active });
  };

  if (loading) {
    return <div className="text-center">Loading user management...</div>;
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
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Secure password"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={createUser}>Create User</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Admin Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-medium">{user.full_name || user.email}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      <Shield className="h-3 w-3 mr-1" />
                      admin
                    </Badge>
                    <Badge variant={user.is_active ? "default" : "secondary"}>
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created {user.created_at ? format(new Date(user.created_at), "MMM dd, yyyy") : "Unknown"}
                    </span>
                    {user.last_login && (
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Last login {format(new Date(user.last_login), "MMM dd, yyyy")}
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
                    {user.is_active ? "Deactivate" : "Activate"}
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
              activities.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="text-sm font-medium">{activity.action.replace("_", " ")}</p>
                    {activity.details && <p className="text-xs text-gray-500">{activity.details}</p>}
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(activity.created_at), "MMM dd, HH:mm")}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input type="email" value={editingUser.email} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  value={editingUser.full_name || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => updateUser(editingUser)}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
