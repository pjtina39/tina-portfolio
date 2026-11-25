import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // House rule: no useEffect / useLayoutEffect. Derive values during render,
  // compute on the server, use CSS for animation, or use ref callbacks for DOM
  // subscriptions. See https://react.dev/learn/you-might-not-need-an-effect
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              importNames: ["useEffect", "useLayoutEffect", "useInsertionEffect"],
              message: "useEffect is banned in this project. Derive state in render, compute on the server, use CSS, or use a ref callback.",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "MemberExpression[object.name='React'][property.name=/^use(Layout|Insertion)?Effect$/]",
          message: "useEffect is banned in this project. Derive state in render, compute on the server, use CSS, or use a ref callback.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
