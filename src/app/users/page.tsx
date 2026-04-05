"use client";

import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserPlus, UserCog, Trash2, ShieldCheck, UserCheck, Search, Loader2, KeyRound } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // 对话框状态
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const result = await getUsers();
    if (result.success) {
      setUsers(result.data || []);
    }
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    const result = await createUser(data);
    if (result.success) {
      setIsCreateOpen(false);
      fetchUsers();
    } else {
      alert(result.error);
    }
    setFormLoading(false);
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    const result = await updateUser(selectedUser.id, data);
    if (result.success) {
      setIsEditOpen(false);
      fetchUsers();
    } else {
      alert(result.error);
    }
    setFormLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("确定要删除该系统账号吗？此操作不可逆。")) return;
    
    const result = await deleteUser(id);
    if (result.success) {
      fetchUsers();
    } else {
      alert(result.error);
    }
  }

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    if (role === "ADMIN") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase border border-blue-200">
          <ShieldCheck className="w-3 h-3" /> 超级管理员
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase border border-slate-200">
        <UserCheck className="w-3 h-3" /> 授课教师
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">教职账号管理</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            配置系统访问权限，设置管理员与教师登录账号
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger>
            <div className="flex items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 h-12 px-6 text-white text-sm font-medium transition-all active:scale-95 cursor-pointer">
              <UserPlus className="w-4 h-4 mr-2" /> 新建教职账号
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-3xl border-0 shadow-2xl">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">创建新账号</DialogTitle>
                <DialogDescription>
                  为新老师或管理人员创建系统登录凭证
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-6">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名 / 称呼</Label>
                  <Input id="name" name="name" placeholder="例如：陈老师" required className="rounded-xl h-11 bg-slate-50 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">登录用户名</Label>
                  <Input id="username" name="username" placeholder="建议使用拼音或工号" required className="rounded-xl h-11 bg-slate-50 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">登录密码</Label>
                  <div className="relative group">
                    <Input id="password" name="password" type="text" placeholder="设置初始密码" required className="rounded-xl h-11 bg-slate-50 border-slate-200" />
                    <KeyRound className="absolute right-3 top-3 w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">权限等级</Label>
                  <Select name="role" defaultValue="TEACHER">
                    <SelectTrigger className="rounded-xl h-11 bg-slate-50 border-slate-200">
                      <SelectValue placeholder="选择权限角色" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                      <SelectItem value="TEACHER">授课教师</SelectItem>
                      <SelectItem value="ADMIN">管理员</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="rounded-xl">取消</Button>
                <Button type="submit" disabled={formLoading} className="rounded-xl bg-blue-600 hover:bg-blue-700 px-8">
                  {formLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  确认创建
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-slate-100/50 bg-slate-50/30 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder="搜索姓名或账号..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl border-slate-200 bg-white focus:bg-white transition-all shadow-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="py-4 pl-6 font-bold text-slate-600">教职人员</TableHead>
                <TableHead className="font-bold text-slate-600">登录账号</TableHead>
                <TableHead className="font-bold text-slate-600">权限角色</TableHead>
                <TableHead className="font-bold text-slate-600 text-right pr-6">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                    <p className="mt-4 text-sm text-slate-400 font-medium">全力加载账号数据中...</p>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-slate-50 hover:bg-slate-50/50 group transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-500 border border-white shadow-sm">
                          {user.name?.charAt(0) || user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{user.name || "未设置姓名"}</p>
                          <p className="text-[10px] text-slate-400 font-medium tracking-tight">注册于 {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-slate-100/50 px-2 py-1 rounded-md text-xs font-bold text-slate-600">
                        {user.username}
                      </code>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2 pr-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all border border-transparent"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditOpen(true);
                          }}
                        >
                          <UserCog className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all border border-transparent"
                          onClick={() => handleDelete(user.id)}
                          disabled={user.username === 'admin'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center grayscale opacity-10 blur-[1px]">
                       <UserCog className="h-20 w-20" />
                    </div>
                    <p className="mt-4 text-sm text-slate-400 font-medium">未发现匹配的账号信息</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 编辑账号对话框 */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl border-0 shadow-2xl">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">修改账号设置</DialogTitle>
              <DialogDescription>
                管理该教职人员的登录名、密码及系统权限
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="space-y-2">
                <Label htmlFor="edit-name">姓名 / 称呼</Label>
                <Input id="edit-name" name="name" defaultValue={selectedUser?.name} required className="rounded-xl h-11 bg-slate-50 border-slate-200 shadow-none focus:ring-0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-username">登录用户名</Label>
                <Input id="edit-username" name="username" defaultValue={selectedUser?.username} required className="rounded-xl h-11 bg-slate-50 border-slate-200" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center pr-1">
                  <Label htmlFor="edit-password">登录密码</Label>
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded uppercase">明文存储</span>
                </div>
                <div className="relative group">
                  <Input id="edit-password" name="password" defaultValue={selectedUser?.password} type="text" placeholder="输入新的登录密码" required className="rounded-xl h-11 border-blue-100 bg-blue-50/30 focus:border-blue-600 transition-colors" />
                  <KeyRound className="absolute right-3 top-3 w-4 h-4 text-blue-300 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">系统权限</Label>
                <Select name="role" defaultValue={selectedUser?.role}>
                  <SelectTrigger className="rounded-xl h-11 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="更改权限角色" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    <SelectItem value="TEACHER">授课教师</SelectItem>
                    <SelectItem value="ADMIN">超级管理员</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} className="rounded-xl">取消</Button>
              <Button type="submit" disabled={formLoading} className="rounded-xl bg-blue-600 hover:bg-blue-700 px-8">
                {formLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                提交保存
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
