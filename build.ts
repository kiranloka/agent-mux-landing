import tailwind from "bun-plugin-tailwind";
import { rm, copyFile } from "node:fs/promises";
import path from "node:path";

const outdir = path.join(process.cwd(), "dist");
await rm(outdir, { recursive: true, force: true });

const entrypoints = [...new Bun.Glob("src/**/*.html").scanSync()];

const result = await Bun.build({
  entrypoints,
  outdir,
  plugins: [tailwind],
  minify: true,
  target: "browser",
  sourcemap: "linked",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

for (const output of result.outputs) {
  console.log(` ${path.relative(process.cwd(), output.path)}  ${(output.size / 1024).toFixed(1)} KB`);
}

// Copy static SEO files and the public installer script to dist root.
const staticFiles = [
  "src/robots.txt",
  "src/sitemap.xml",
  "src/og-image.png",
  "install.sh",
];
for (const file of staticFiles) {
  const src = path.join(process.cwd(), file);
  const dest = path.join(outdir, path.basename(file));
  try {
    await copyFile(src, dest);
    console.log(` ${path.relative(process.cwd(), dest)}  copied`);
  } catch (err) {
    console.error(` failed to copy ${file}:`, err);
  }
}
