import { resolve, join } from "path";
import { readFileSync } from "fs";
import { defineConfig, externalizeDepsPlugin, swcPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";

const pkg = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf-8"));

const MAIN_PATH = resolve("src/main");
const PRELOAD_PATH = resolve("src/preload");
const RENDERER_PATH = resolve("src/renderer/src");
const TYPES_PATH = resolve("src/types");
const UTILS_PATH = resolve("src/utils");

export default defineConfig({
  main: {
    resolve: {
      alias: {
        "@main": join(MAIN_PATH),
        "@shared/types": join(TYPES_PATH),
        "@utils": join(UTILS_PATH)
      }
    },
    plugins: [externalizeDepsPlugin(), swcPlugin()]
  },
  preload: {
    resolve: {
      alias: {
        "@preload": join(PRELOAD_PATH),
        "@shared/types": join(TYPES_PATH),
        "@utils": join(UTILS_PATH)
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __APP_NAME__: JSON.stringify(pkg.name)
    },
    resolve: {
      alias: {
        "@renderer": join(RENDERER_PATH),
        "@components": join(RENDERER_PATH, "components"),
        "@shared/types": join(TYPES_PATH),
        "@utils": join(UTILS_PATH)
      }
    },
    plugins: [
      VueRouter({
        routesFolder: [
          {
            src: join(RENDERER_PATH, "pages"),
            path: "",
            // override globals
            exclude: (excluded) => excluded,
            filePatterns: (filePatterns) => filePatterns,
            extensions: (extensions) => extensions
          }
        ],

        // where to generate the types
        dts: join(RENDERER_PATH, "router.d.ts"),

        // how to import routes, can also be a string
        importMode: "async"
      }),
      vue({})
    ]
  }
});
