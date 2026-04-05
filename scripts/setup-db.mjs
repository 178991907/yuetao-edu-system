import fs from 'fs';
import path from 'path';

const schemaPath = path.resolve(process.cwd(), 'prisma/schema.prisma');
const dbUrl = process.env.DATABASE_URL || '';

// 识别数据库类型逻辑
let provider = 'sqlite'; 
if (dbUrl.includes('postgres') || dbUrl.includes('postgresql')) {
  provider = 'postgresql'; 
}

try {
  let schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  
  // 1. 替换 provider
  let updatedContent = schemaContent.replace(
    /datasource db\s*{[\s\S]*?provider\s*=\s*".*?"/,
    `datasource db {\n  provider = "${provider}"`
  );
  
  // 2. 如果是 Vercel 环境且无数据库，强制注入一个合法的 SQLite 本地空路径
  // 确保 npx prisma generate 不会因为 URL 环境变量缺失而挂掉
  if (!dbUrl && provider === 'sqlite') {
    process.env.DATABASE_URL = "file:./dev.db";
  }

  if (schemaContent !== updatedContent) {
    fs.writeFileSync(schemaPath, updatedContent);
    console.log(`✅ [数据库切换] 已自动切换到: ${provider.toUpperCase()} 模式`);
  } else {
    console.log(`ℹ️ [状态保持] 当前配置已符合: ${provider.toUpperCase()} 模式`);
  }
} catch (error) {
  console.error('❌ [数据库切换] 脚本执行异常:', error);
}
