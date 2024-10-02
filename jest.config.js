module.exports = {
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom', // Это нужно для работы с DOM в React
  transformIgnorePatterns: ['/node_modules/(?!axios)'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy', // Для работы с CSS/SCSS
    '\\.(jpg|jpeg|png|svg)$': '<rootDir>/src/__mocks__/fileMock.js', // Для работы с изображениями
    '^axios$': '<rootDir>/__mocks__/axios.js',
  },
}
