import { existsSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "../..");

/**
 * @description 复制环境文件，如果目标文件不存在则从示例文件复制
 * @param {string} sourcePath - 源文件路径（相对于项目根目录）
 * @param {string} targetPath - 目标文件路径（相对于项目根目录）
 * @returns {boolean} 是否成功复制
 */
function copyEnvIfNotExists(sourcePath, targetPath) {
  const fullSourcePath = join(rootDir, sourcePath);
  const fullTargetPath = join(rootDir, targetPath);

  if (!existsSync(fullSourcePath)) {
    console.warn(`警告: 源文件 ${sourcePath} 不存在，跳过复制`);
    return false;
  }

  if (existsSync(fullTargetPath)) {
    console.log(`跳过: ${targetPath} 已存在`);
    return false;
  }

  try {
    copyFileSync(fullSourcePath, fullTargetPath);
    console.log(`已复制: ${sourcePath} -> ${targetPath}`);
    return true;
  } catch (error) {
    console.error(`错误: 复制 ${sourcePath} 到 ${targetPath} 失败:`, error.message);
    return false;
  }
}

const envFiles = [
  { source: "./frontend/.env.example", target: "./frontend/.env" },
  { source: "./server/.env.example", target: "./server/.env.development" },
  { source: "./collector/.env.example", target: "./collector/.env" },
  { source: "./docker/.env.example", target: "./docker/.env" },
];

let copiedCount = 0;
envFiles.forEach(({ source, target }) => {
  if (copyEnvIfNotExists(source, target)) {
    copiedCount++;
  }
});

console.log(`\n所有环境文件处理完成！${copiedCount > 0 ? `已复制 ${copiedCount} 个文件。` : "所有文件已存在，无需复制。"}`);

