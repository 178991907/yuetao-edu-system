import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * 阅陶教育管理系统 - Vercel 托管部署专用构建脚本 v1.0
 * 核心目标：解决 Next.js 15 + Prisma (SQLite/PG) 在 Vercel 的兼容性痛点
 */

const projectRoot = process.cwd();
const schemaPath = path.join(projectRoot, 'prisma/schema.prisma');
const dbUrl = process.env.DATABASE_URL || '';
const isVercel = process.env.VERCEL === '1';

function runCommand(command) {
  console.log(`\n🚀 [执行命令] ${command}`);
  try {
    execSync(command, { stdio: 'inherit', env: { ...process.env, DATABASE_URL: dbUrl || 'file:./dev.db' } });
  } catch (error) {
    console.error(`\n❌ [命令执行失败] ${command}`);
    process.exit(1);
  }
}

async function main() {
  console.log('--- 阅陶教育管理系统：构建管理中枢 ---');
  console.log(`🌍 [环境确认] Vercel: ${isVercel ? '是' : '否'} | 数据库 URL 配置: ${dbUrl ? '已提供' : '未提供'}`);

  // 第一步：根据 DATABASE_URL 自动切换 Prisma Provider
  console.log('\n🔄 [系统同步] 正在配置 Prisma 数据库适配器...');
  let provider = 'sqlite';
  if (dbUrl.includes('postgres') || dbUrl.includes('postgresql')) {
    provider = 'postgresql';
  }
  
  try {
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    const updatedContent = schemaContent.replace(
      /datasource db\s*{[\s\S]*?provider\s*=\s*".*?"/,
      `datasource db {\n  provider = "${provider}"`
    );
    fs.writeFileSync(schemaPath, updatedContent);
    console.log(`✅ [适配完成] 数据库模式已设置为: ${provider.toUpperCase()}`);
  } catch (err) {
    console.error('❌ [适配失败] 无法同步 schema.prisma:', err);
    process.exit(1);
  }

  // 第二步：生成 Prisma Client
  // 我们使用 --no-engine (如果可能) 或直接执行确保引擎可用
  runCommand('npx prisma generate');

  // 第三步：强制数据库架构推送到环境 (针对 Vercel 静态生成失败的防御)
  // 如果是本地模式且在部署中，必须先推一把 schema，否则 Page 预加载会因为找不到 table 而挂掉
  if (!dbUrl || provider === 'sqlite') {
    console.log('\n🛠️ [模式同步] 正在为 SQLite 构建临时数据表结构(不保留数据)...');
    runCommand('npx prisma db push --accept-data-loss --skip-generate');
  }

  // 第四步：执行 Next.js 构建进程
  console.log('\n📦 [核心构建] 正在启动 Next.js 15 生产环境构建...');
  runCommand('next build');

  console.log('\n🎉 [构建成功] 2.0 版本已准备就绪。');
}

main().catch(err => {
  console.error('\n💥 [构建流程崩溃]:', err);
  process.exit(1);
});
