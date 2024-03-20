module.exports = {
  apps: [
    {
      name: "Grafibot",
      script: "src/index.ts",
      interpreter: '~/.bun/bin/bun',
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      output: "./logs/out.log",
      error: "./logs/error.log",
    },
  ],
};
