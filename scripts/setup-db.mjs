import fs from 'fs';
import path from 'path';

const schemaPath = path.resolve(process.cwd(), 'prisma/schema.prisma');
const dbUrl = process.env.DATABASE_URL || '';

// 识别数据库类型逻辑
let provider = 'sqlite'; // 默认优先级：本地模式
if (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')) {
  provider = 'postgresql'; // 自动切换：云端模式
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
    console.log(`✅ [数据库切换] 已自动检测并切换到: ${provider.toUpperCase()} 模式`);
  } else {
    console.log(`ℹ️ [数据库保持] 当前配置已符合: ${provider.toUpperCase()} 模式`);
  }
} catch (error) {
  console.error('❌ [数据库切换] 脚本执行异常:', error);
}
