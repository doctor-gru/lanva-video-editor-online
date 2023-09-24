import esbuild from "esbuild";
import svgPlugin from 'esbuild-plugin-svg';

esbuild
    .build({
        entryPoints: ["src/_build_index.mjs"],
        bundle: true,
        loader: { '.js': 'jsx' },
        minify: true,
        outfile: "dist.js",
        plugins: [svgPlugin()],
    })
    .catch(() => process.exit(1));
