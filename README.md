# MovieOps - Deploy Netflix Clone on Cloud using Jenkins

**MovieOps** is a Netflix clone deployment project that automates the setup and deployment process using Jenkins, Docker, and AWS EC2, with a focus on continuous integration and security testing.

## Project Overview

This project demonstrates the steps required to deploy a Netflix clone application on the cloud using AWS EC2, Docker, Jenkins, and a variety of security tools to ensure a secure and robust deployment pipeline. It integrates various DevSecOps tools for automated vulnerability scanning and monitoring.

## Project Flow
![Screenshot 2024-12-04 182539](https://github.com/user-attachments/assets/76fe7b69-85ef-42e9-9628-a0575f499b83)


## Prerequisites

- AWS account and EC2 instance (Ubuntu 22.04) 
- Docker installed on the EC2 instance 
- Jenkins installed and configured for CI/CD automation 
- SonarQube, Trivy, and other security tools for vulnerability scanning 
- DockerHub account for pushing and pulling Docker images 
- API Key from TMDB (The Movie Database) 

## Setup and Deployment

### Step 1: Launch EC2 and Set Up Docker 

#### Provision EC2 Instance:
- Launch an Ubuntu 22.04 EC2 instance on AWS.

#### SSH into EC2:
- Connect to the instance via SSH.

#### Install Docker:
```bash
sudo apt-get update
sudo apt-get install docker.io -y
sudo usermod -aG docker $USER
newgrp docker
sudo chmod 777 /var/run/docker.sock
```

### Step 2: Clone the Code and Set Up API Key

#### Clone the repository:
```bash
git clone https://github.com/deveshidwivedi/MovieOps.git
cd MovieOps
```

#### Get API Key: 
Visit TMDB, create an account, and generate your API key from the API settings.

#### Build Docker image with API key:
```bash
docker build --build-arg TMDB_V3_API_KEY=<your-api-key> -t movieops .
```

### Step 3: CI/CD Pipeline with Jenkins
```bash
sudo apt update
sudo apt install openjdk-17-jre wget -y
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian/jenkins.io.key
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable/ binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list
sudo apt update
sudo apt install jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

#### Configure Jenkins:
- Access Jenkins at http://<your-ec2-public-ip>:8080.
- Install necessary plugins: SonarQube, Docker, NodeJS, Email Extension.
- Set up SonarQube for code analysis and configure it in Jenkins.

### Step 4: Security Scanning with SonarQube and Trivy

#### 1. SonarQube setup:
- Run SonarQube using Docker
```bash
docker run -d --name sonar -p 9000:9000 sonarqube:lts-community
```
- Access SonarQube at http://<your-ec2-public-ip>:9000.

### 2. Install and Configure Trivy:
- Install Trivy:
```bash
sudo apt-get install trivy -y
```
- Run vulnerability scan on Docker images:
```bash
trivy image <image-id>
```

### Step 5: Jenkins Pipeline Configuration

#### 1. Configure Jenkins Pipeline:
- Create a new pipeline in Jenkins and use the following configuration:
```bash
pipeline {
    agent any
    tools {
        jdk 'jdk17'
        nodejs 'node16'
    }
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/deveshidwivedi/MovieOps.git'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh "$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectKey=MovieOps"
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t movieops .'
                }
            }
        }
        stage('Docker Push') {
            steps {
                script {
                    sh 'docker tag movieops your-dockerhub-username/movieops:latest'
                    sh 'docker push your-dockerhub-username/movieops:latest'
                }
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker run -d --name movieops -p 8080:80 your-dockerhub-username/movieops:latest'
            }
        }
    }
}
```

### Step 6: Monitoring with Prometheus and Grafana

#### 1. Install Prometheus:
```bash
sudo useradd --system --no-create-home --shell /bin/false prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.47.1/prometheus-2.47.1.linux-amd64.tar.gz
tar -xvf prometheus-2.47.1.linux-amd64.tar.gz
sudo mv prometheus promtool /usr/local/bin/
sudo mv prometheus.yml /etc/prometheus/
```
### 2. Set Up Grafana:
- Install Grafana and configure it to connect to Prometheus for monitoring your deployment.
- Access Grafana at http://<your-ec2-public-ip>:3000.

## Contributing to MovieOps

#### 1. Bug Reporting
- Feel free to [open an issue](https://github.com/deveshidwivedi/MovieOps/issues) on GitHub if you find any bug.
#### 2. Feature Request
- Feel free to [open an issue](https://github.com/deveshidwivedi/MovieOps/issues) on GitHub to request any additional features you might need for your use case.
