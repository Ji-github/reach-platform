module.exports = {
    parserOptions: {
        tsconfigRootDir: __dirname // 这个配置项值为 tsconfig.json 所在目录， 可能需要各个代码库按需修改
    },
    extends: [
        '@baidu/eslint-config-sfe-vue/config/vue3-ts-pc-tob'
    ],
    rules: {
        'vue/prop-name-casing': 'off',
        'vue/require-default-prop': 'off',
        'vue/valid-v-model': 0,
        'vue/no-multiple-template-root': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-esslint/no-require-imports': 0
    }
};
