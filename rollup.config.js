import typescript from "rollup-plugin-typescript2";

export default {
    input: "./index.ts",
    output: {
        file: "./dist/index.js",
        format: "cjs"
    },
    plugins: [
        typescript()
    ]
}
