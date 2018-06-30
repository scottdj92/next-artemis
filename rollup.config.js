import typescript from "rollup-plugin-typescript2";
import peerDeps from "rollup-plugin-peer-deps-external";

export default {
    input: "./index.ts",
    output: {
        file: "./dist/index.js",
        format: "cjs"
    },
    plugins: [
        peerDeps(),
        typescript()
    ]
}
