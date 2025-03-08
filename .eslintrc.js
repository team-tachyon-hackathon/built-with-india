module.exports = {
    root: true,
    extends: ['next/core-web-vitals'],
    // Turn off TypeScript rules that might cause deployment issues
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'import/no-anonymous-default-export': 'off',
      // Add any other rules you want to disable
    },
  }