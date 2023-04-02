import * as path from "path";

/* 应用根路径 */
export const PACKAGE_ROOT = path.join(__dirname);

/* package.json 标识为 cjs 模块，因此可以使用 __dirname 用法 */
export const SRC_PATH = path.join(PACKAGE_ROOT, "src");

/* 输出路径 */
export const DIST_PATH = path.join(PACKAGE_ROOT, "dist");
