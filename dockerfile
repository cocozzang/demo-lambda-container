# 빌드 단계
FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 실행 단계
FROM public.ecr.aws/lambda/nodejs:22.2025.03.28.05-x86_64
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["dist/lambda.handler"]
