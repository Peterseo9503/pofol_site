#!/bin/bash

# Docker Hub 유저/이미지명
IMAGE_NAME="peterseo9503/personal_blog:latest"

# 1. 기존 컨테이너 중지 및 삭제
if [ "$(docker ps -a -q --filter name=personal_blog_container)" ]; then
    echo "Stopping and removing existing container..."
    docker stop personal_blog_container
    docker rm personal_blog_container
fi

# 2. 최신 이미지 다운로드 (pull)
echo "Pulling the latest image: $IMAGE_NAME"
docker pull $IMAGE_NAME

# 3. 새 컨테이너 실행
echo "Running new container..."
docker run -d \
    --name personal_blog_container \
    -p 80:3000 \
    $IMAGE_NAME