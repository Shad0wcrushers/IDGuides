
import React, { useState, useEffect } from "react";
import { mockUsers } from "../../services/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { User } from "../../../types/docs";
import { Shield, UserPlus } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

const USERS_KEY = "persistedUsers";

const UsersAdmin = () => {
  const [emailFilter, setEmailFilter] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  // Load users from localStorage or mockUsers on mount
  useEffect(() => {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
      setUsers(JSON.parse(stored));
    } else {
      setUsers(mockUsers);
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  // Filter users based on email containing 'idhosting'
  const filteredUsers = users.filter(user =>
    emailFilter ? user.email.toLowerCase().includes(emailFilter.toLowerCase()) : true
  );

  const handleRoleChange = (user: User, newRole: User["role"]) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === user.id ? { ...u, role: newRole } : u
      )
    );
    toast({
      title: "Role Updated",
      description: `${user.name || user.email} is now a ${newRole}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Filter by email..."
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" onClick={() => setEmailFilter("idhosting")}>
            <UserPlus className="h-4 w-4 mr-2" />
            Show idhosting employees
          </Button>
        </div>
      </div>

      <div className="border rounded-md dark:bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name?.charAt(0) || user.email.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name || user.email}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "admin"
                        ? "default"
                        : user.role === "guide editor"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(value) => handleRoleChange(user, value as User["role"])}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="guide_editor">Guide Editor</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersAdmin;
