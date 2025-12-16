#!/bin/bash

# --- 설정 변수 ---
# Docker Hub 유저/이미지명 (GitHub Actions에서 빌드 및 푸시한 이미지)
IMAGE_NAME="peterseo9503/personal_blog:latest" 
# 컨테이너 이름 (스크립트에서 관리할 이름)
CONTAINER_NAME="personal_blog_container" 
# 컨테이너 내부 포트와 EC2 호스트 외부 포트
HOST_PORT="80" 
CONTAINER_PORT="3000"
# -----------------

echo "========================================"
echo "      Start Deployment Process          "
echo "========================================"

# 1. 기존 컨테이너 중지 및 삭제
echo "1. Checking and cleaning up existing container..."

# 컨테이너가 존재하는지 확인
EXISTING_CONTAINER=$(docker ps -a -q --filter name=${CONTAINER_NAME})

if [ "${EXISTING_CONTAINER}" ]; then
    echo "  -> Existing container found. Attempting to stop and remove it."
    
    # 중지 (10초 대기 후 강제 중지)
    docker stop -t 10 ${CONTAINER_NAME} 
    
    # 삭제 (실패하더라도 스크립트가 멈추지 않도록 || true 추가)
    docker rm ${CONTAINER_NAME} || true 
else
    echo "  -> No existing container found with name ${CONTAINER_NAME}."
fi

# 2. 최신 이미지 다운로드 (Pull)
echo "2. Pulling the latest image: ${IMAGE_NAME}"
if ! docker pull ${IMAGE_NAME}; then
    echo "Error: Failed to pull Docker image. Aborting deployment."
    exit 1
fi
echo "  -> Image pulled successfully."

# 3. 새 컨테이너 실행
echo "3. Running new container: ${CONTAINER_NAME} (Port ${HOST_PORT}:${CONTAINER_PORT})"
docker run -d \
    --name ${CONTAINER_NAME} \
    -p ${HOST_PORT}:${CONTAINER_PORT} \
    --restart always \
    ${IMAGE_NAME}

if [ $? -eq 0 ]; then
    echo "========================================"
    echo "✅ Deployment Successful!"
    echo "Container ${CONTAINER_NAME} is running."
    echo "========================================"
else
    echo "========================================"
    echo "❌ Deployment Failed during docker run!"
    echo "========================================"
    exit 1
fi