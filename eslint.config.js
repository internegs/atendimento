import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import prettier from '@vue/eslint-config-prettier'

export default [
    js.configs.recommended,

    ...vue.configs['flat/recommended'],

    prettier,

    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                console: 'readonly',
                window: 'readonly',
                document: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
            },
        },

        rules: {
            'vue/multi-word-component-names': 'off',
            'vue/component-definition-name-casing': ['warn', 'PascalCase'],
            'vue/component-name-in-template-casing': ['warn', 'kebab-case'],
            'vue/no-v-html': 'off',
            'vue/max-attributes-per-line': ['warn', { singleline: 1, multiline: 1 }],
            'vue/first-attribute-linebreak': ['warn', { singleline: 'ignore', multiline: 'below' }],
            'vue/html-closing-bracket-newline': [
                'warn',
                { singleline: 'never', multiline: 'always' },
            ],
            'vue/html-indent': ['warn', 4],
            'vue/multiline-html-element-content-newline': 'warn',
            'vue/singleline-html-element-content-newline': 'off',
            'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'prefer-const': 'warn',
            'no-var': 'warn',
            eqeqeq: 'warn',
            curly: 'warn',
            'no-duplicate-imports': 'warn',
            'no-return-await': 'warn',
            'prettier/prettier': ['warn', { endOfLine: 'auto' }],
            'vue/attribute-hyphenation': 'off',
            'vue/require-default-prop': 'off',
        },
    },
    {
        ignores: ['node_modules/**', 'dist/**', '.yarn/**', '*.min.js'],
    },
]
