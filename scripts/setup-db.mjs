import fs from 'fs';
import path from 'path';

const schemaPath = path.resolve(process.cwd(), 'prisma/schema.prisma');
const dbUrl = process.env.DATABASE_URL || '';

// 识别数据库类型逻辑
let provider = 'sqlite'; 
if (dbUrl.includes('postgres') || dbUrl.includes('postgresql')) {
  provider = 'postgresql'; 
}

// 补偿逻辑：如果 DATABASE_URL 为空且为 SQLite 模式，在 process.env 中注入一个默认值
// 这样可以确保在该进程后续执行 npx prisma generate 时不会因为找不到环境变量而报错
if (!dbUrl && provider === 'sqlite') {
  process.env.DATABASE_URL = 'file:./dev.db';
}

try {
  let schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  
  // 使用正则匹配替换 provider
  const updatedContent = schemaContent.replace(
    /datasource db\s*{[\s\S]*?provider\s*=\s*".*?"/,
    `datasource db {\n  provider = "${provider}"`
  );
  
  if (schemaContent !== updatedContent) {
    fs.writeFileSync(schemaPath, updatedContent);
    console.log(`✅ [数据库切换] 已自动切换到: ${provider.toUpperCase()} 模式`);
  } else {
    console.log(`ℹ️ [状态保持] 当前配置已符合: ${provider.toUpperCase()} 模式`);
  }
} catch (error) {
  console.error('❌ [数据库切换] 脚本执行异常:', error);
}
