import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getInventoryItems, getInventoryTransactions } from "../actions/inventory"
import { getStudents, getStudentById } from "../actions/student"
import { CreateInventoryDialog, InventoryActionDialog, DeleteInventoryButton } from "./client-components"

type InventorySearchParams = Promise<{ student?: string }>

export default async function InventoryPage({ searchParams }: { searchParams: InventorySearchParams }) {
  const params = await searchParams
  const studentId = params.student
  
  let student = null
  if (studentId) {
    const { data } = await getStudentById(studentId)
    student = data
  }
  
  const [{ data: items = [] }, { data: students = [] }, { data: transactions = [] }] = await Promise.all([
    getInventoryItems(),
    getStudents(),
    getInventoryTransactions(studentId)
  ]);

  const totalStockQuantity = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const lowStockCount = items.filter((i: any) => i.quantity <= 5).length;

  // 提取数据库中已有的所有分类，用于下拉框复用
  const uniqueCategories = Array.from(new Set(items.map((item: any) => item.category))) as string[];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {student && (
        <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-100 p-2 rounded-full">
              <Package className="h-4 w-4 text-cyan-600" />
            </div>
            <div>
              <div className="text-xs text-cyan-500 font-medium">学员档案专属领用记录</div>
              <div className="font-bold text-cyan-900 text-lg">{student.name}</div>
            </div>
          </div>
          <Link href={`/students/${studentId}`}>
            <Button variant="outline" size="sm" className="border-cyan-200 text-cyan-700 hover:bg-cyan-100 rounded-xl">
              返回档案中心
            </Button>
          </Link>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Package className="h-6 w-6 text-cyan-500" />
            进销存管理与台账
          </h2>
          <p className="text-sm text-slate-500 mt-2">统筹管理教材、课外书、教具等库存。出入库情况可直接关联财务与学员档案。</p>
        </div>
        {!studentId && <CreateInventoryDialog existingCategories={uniqueCategories} />}
      </div>

      {!studentId && (
        <div className="grid gap-6 md:grid-cols-4 mb-6">
          <Card className="border-0 shadow-sm bg-white/80">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-slate-500">库存总件数</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-bold text-slate-800">{totalStockQuantity} <span className="text-sm text-slate-400 font-normal">件</span></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white/80">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-slate-500">预警库存 (≤ 5)</CardTitle>
            </CardHeader>
            <CardContent>
               <div className={`text-3xl font-bold ${lowStockCount > 0 ? "text-red-500" : "text-emerald-500"}`}>
                 {lowStockCount} <span className="text-sm text-slate-400 font-normal">项</span>
               </div>
            </CardContent>
          </Card>
        </div>
      )}

      {student && (
        <Card className="border-0 shadow-sm bg-white/80">
          <CardHeader className="py-4 px-6 border-b border-cyan-100/50">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Package className="h-5 w-5 text-cyan-500" />
              学员物资领用明细表
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-cyan-50/20 whitespace-nowrap">
                <TableRow>
                  <TableHead className="pl-6 font-semibold">领取的人</TableHead>
                  <TableHead className="font-semibold">领取日期</TableHead>
                  <TableHead className="font-semibold">物品名称</TableHead>
                  <TableHead className="font-semibold text-center">类型</TableHead>
                  <TableHead className="font-semibold text-center">数量</TableHead>
                  <TableHead className="pr-6 font-semibold">备注说明</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="whitespace-nowrap">
                {transactions.map((trans: any) => (
                  <TableRow key={trans.id} className="hover:bg-cyan-50/10 transition-colors">
                    <TableCell className="pl-6 font-medium text-slate-700">
                      {student.name}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {new Date(trans.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-bold text-slate-800">
                      {trans.itemName || trans.item?.name || '---'}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold border uppercase tracking-wider ${
                        trans.type === 'OUT' 
                        ? 'bg-blue-50 text-blue-700 border-blue-100' 
                        : 'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                        {trans.type === 'OUT' ? '领取/使用' : '退还'}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-700">
                      {Math.abs(trans.quantity)}
                    </TableCell>
                    <TableCell className="pr-6 text-slate-500 text-sm italic max-w-[200px] truncate">
                      {trans.remark || '-'}
                    </TableCell>
                  </TableRow>
                ))}
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-500">该学员暂无物资领用记录</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* 只有在非学员视角下才显示全库台账 */}
      {!studentId && (
        <Card className="border-0 shadow-sm bg-white/80">
          <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium">当前库存台账</CardTitle>
              <CardDescription className="text-xs mt-1">发售时点击“领用/出库”可以关联指定的学员。</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-cyan-50/30">
                <TableRow>
                  <TableHead className="pl-6 font-semibold">物品名称</TableHead>
                  <TableHead className="font-semibold">分类</TableHead>
                  <TableHead className="font-semibold text-right">进货单价</TableHead>
                  <TableHead className="font-semibold text-right">出货/发售单价</TableHead>
                  <TableHead className="font-semibold text-right">当前库存量</TableHead>
                  <TableHead className="text-right pr-6 font-semibold">快捷操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((row: any) => (
                  <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-6 font-bold text-slate-800">{row.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium border bg-slate-50 text-slate-600">
                        {row.category === 'BOOK' && '教材书籍'}
                        {row.category === 'MATERIAL' && '教具材料'}
                        {row.category === 'DEVICE' && '设备设施'}
                        {row.category === 'OTHER' && '其它分类'}
                        {!['BOOK', 'MATERIAL', 'DEVICE', 'OTHER'].includes(row.category) && row.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-slate-500">¥ {row.costPrice?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell className="text-right text-emerald-600 font-medium">¥ {row.price?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell className="text-right">
                      <span className={`font-bold ${row.quantity <= 5 ? "text-red-500" : "text-slate-700"}`}>
                        {row.quantity} <span className="text-xs font-normal">{row.unit}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6 space-x-2 flex items-center justify-end">
                      <InventoryActionDialog item={row} type="IN" />
                      <InventoryActionDialog item={row} type="OUT" students={students} studentId={studentId} />
                      {!studentId && <DeleteInventoryButton id={row.id} />}
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">暂无库存品类，请先新增</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

