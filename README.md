# 🚀 Scalable Microservices Deployment Using Kubernetes

> Build, containerize, and deploy scalable microservices on a local Kubernetes cluster with auto-scaling and self-healing.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Start Minikube](#1-start-minikube)
  - [2. Build Docker Images](#2-build-docker-images)
  - [3. Deploy to Kubernetes](#3-deploy-to-kubernetes)
- [Testing the APIs](#-testing-the-apis)
- [Auto-Scaling (HPA)](#-auto-scaling-hpa)
- [Self-Healing Demo](#-self-healing-demo)
- [Useful Commands](#-useful-commands)
- [Cleanup](#-cleanup)
- [Conclusion](#-conclusion)

---

## 🎯 Project Overview

This project demonstrates core **DevOps and cloud-native concepts** by deploying two independent microservices on a local Kubernetes cluster:

| Microservice        | Description                          | Port  | Replicas |
|---------------------|--------------------------------------|-------|----------|
| **Student Service** | REST API serving student records     | 3001  | 2 (auto-scales to 5) |
| **Course Service**  | REST API serving course catalog      | 3002  | 1        |

**Key concepts demonstrated:**

- ✅ Containerization with Docker
- ✅ Orchestration with Kubernetes
- ✅ Horizontal auto-scaling (HPA)
- ✅ Self-healing & desired-state maintenance
- ✅ Service discovery via Kubernetes Services

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Minikube Cluster                       │
│                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐     │
│  │  Student Service      │  │  Course Service       │     │
│  │  (Deployment)         │  │  (Deployment)         │     │
│  │                       │  │                       │     │
│  │  ┌─────┐  ┌─────┐    │  │  ┌─────┐              │     │
│  │  │Pod 1│  │Pod 2│    │  │  │Pod 1│              │     │
│  │  └─────┘  └─────┘    │  │  └─────┘              │     │
│  │  (scales up to 5)     │  │  (1 replica)          │     │
│  └──────────┬───────────┘  └──────────┬───────────┘     │
│             │                         │                  │
│  ┌──────────▼───────────┐  ┌──────────▼───────────┐     │
│  │  Service (NodePort)   │  │  Service (NodePort)   │     │
│  │  Port: 30001          │  │  Port: 30002          │     │
│  └──────────────────────┘  └──────────────────────┘     │
│                                                         │
│  ┌──────────────────────┐                               │
│  │  HPA (Auto-Scaler)   │                               │
│  │  Target: 50% CPU     │                               │
│  │  Min: 2 → Max: 5     │                               │
│  └──────────────────────┘                               │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Technology   | Purpose                                       |
|--------------|-----------------------------------------------|
| Node.js      | Runtime for building the microservices         |
| Express.js   | Web framework for creating REST APIs           |
| Docker       | Containerization of each microservice          |
| Kubernetes   | Container orchestration and scaling            |
| Minikube     | Local single-node Kubernetes cluster           |
| kubectl      | CLI tool to manage Kubernetes resources        |

---

## 📁 Project Structure

```
Scalable microservices/
├── student-service/
│   ├── index.js              # Express app — /students & /health endpoints
│   ├── package.json           # Node.js dependencies
│   └── Dockerfile             # Docker build instructions
├── course-service/
│   ├── index.js              # Express app — /courses & /health endpoints
│   ├── package.json           # Node.js dependencies
│   └── Dockerfile             # Docker build instructions
├── k8s/
│   ├── student-deployment.yaml    # Deployment (2 replicas)
│   ├── student-service.yaml       # Service (NodePort 30001)
│   ├── student-hpa.yaml           # HorizontalPodAutoscaler (2→5 pods)
│   ├── course-deployment.yaml     # Deployment (1 replica)
│   └── course-service.yaml        # Service (NodePort 30002)
└── README.md
```

---

## ✅ Prerequisites

Ensure the following tools are installed on your machine:

| Tool              | Version   | Download                                                              |
|-------------------|-----------|-----------------------------------------------------------------------|
| Node.js           | v18+      | [nodejs.org](https://nodejs.org/)                                     |
| Docker Desktop    | Latest    | [docker.com](https://www.docker.com/products/docker-desktop/)         |
| Minikube          | Latest    | [minikube.sigs.k8s.io](https://minikube.sigs.k8s.io/docs/start/)     |
| kubectl           | Latest    | [kubernetes.io](https://kubernetes.io/docs/tasks/tools/)              |

**Verify installations:**

```powershell
node --version
docker --version
minikube version
kubectl version --client
```

---

## 🚀 Getting Started

### 1. Start Minikube

```powershell
minikube start --driver=docker
```

Then point your Docker CLI to Minikube's Docker daemon (required so K8s can find locally-built images):

```powershell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

> **⚠️ Important:** This only affects the current terminal session. Re-run it if you open a new window.

### 2. Build Docker Images

From the project root directory:

```powershell
# Build Student Service image
docker build -t student-service:latest ./student-service

# Build Course Service image
docker build -t course-service:latest ./course-service
```

**Verify both images exist:**

```powershell
docker images | Select-String "student-service|course-service"
```

### 3. Deploy to Kubernetes

Apply all manifests from the `k8s/` directory:

```powershell
kubectl apply -f ./k8s/student-deployment.yaml
kubectl apply -f ./k8s/student-service.yaml
kubectl apply -f ./k8s/student-hpa.yaml
kubectl apply -f ./k8s/course-deployment.yaml
kubectl apply -f ./k8s/course-service.yaml
```

**Verify everything is running:**

```powershell
kubectl get pods
```

Expected output:

```
NAME                               READY   STATUS    RESTARTS   AGE
student-service-xxxxxxxxx-xxxxx    1/1     Running   0          30s
student-service-xxxxxxxxx-yyyyy    1/1     Running   0          30s
course-service-xxxxxxxxx-zzzzz     1/1     Running   0          30s
```

> 💡 Student Service has **2 pods** (2 replicas), Course Service has **1 pod**.

```powershell
kubectl get services
```

Expected output:

```
NAME              TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
student-service   NodePort   10.x.x.x        <none>        3001:30001/TCP   30s
course-service    NodePort   10.x.x.x        <none>        3002:30002/TCP   30s
```

---

## 🧪 Testing the APIs

### Get the Service URLs

```powershell
minikube service student-service --url
minikube service course-service --url
```

### Test Endpoints

Replace `<URL>` with the URLs from above:

```powershell
# Student Service
curl <STUDENT_URL>/students
curl <STUDENT_URL>/health

# Course Service
curl <COURSE_URL>/courses
curl <COURSE_URL>/health
```

### Expected Responses

**`GET /students`**

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Aarav Sharma", "rollNo": "CS2024001", "branch": "Computer Science" },
    { "id": 2, "name": "Priya Patel", "rollNo": "CS2024002", "branch": "Computer Science" },
    { "id": 3, "name": "Rahul Verma", "rollNo": "IT2024001", "branch": "Information Technology" },
    { "id": 4, "name": "Sneha Reddy", "rollNo": "EC2024001", "branch": "Electronics" },
    { "id": 5, "name": "Vikram Singh", "rollNo": "ME2024001", "branch": "Mechanical" }
  ]
}
```

**`GET /courses`**

```json
{
  "success": true,
  "data": [
    { "id": 1, "code": "CS301", "name": "Cloud Computing", "credits": 4 },
    { "id": 2, "code": "CS302", "name": "DevOps Practices", "credits": 3 },
    { "id": 3, "code": "CS303", "name": "Microservices Architecture", "credits": 3 },
    { "id": 4, "code": "IT201", "name": "Database Management Systems", "credits": 4 },
    { "id": 5, "code": "CS401", "name": "Machine Learning", "credits": 4 }
  ]
}
```

**`GET /health`**

```json
{ "status": "healthy", "service": "student-service" }
```

---

## 📈 Auto-Scaling (HPA)

The Student Service is configured with a **HorizontalPodAutoscaler** that automatically scales pods based on CPU usage:

| Parameter          | Value                |
|--------------------|----------------------|
| Target Deployment  | `student-service`    |
| Min Replicas       | 2                    |
| Max Replicas       | 5                    |
| CPU Target         | 50% utilization      |

**Check HPA status:**

```powershell
kubectl get hpa
```

When CPU utilization exceeds 50%, Kubernetes will automatically spin up additional pods (up to 5) to handle the load. When load decreases, it scales back down to the minimum of 2.

---

## 🔄 Self-Healing Demo

Kubernetes automatically replaces deleted pods to maintain the desired replica count.

**Step 1 — List current pods:**

```powershell
kubectl get pods
```

**Step 2 — Delete a pod:**

```powershell
# Replace <pod-name> with an actual student-service pod name
kubectl delete pod <pod-name>
```

**Step 3 — Watch the recovery:**

```powershell
kubectl get pods
```

You'll see:
- The deleted pod enters `Terminating` state
- A **new pod** is automatically created as a replacement
- Within seconds, the new pod reaches `Running` state
- Total count returns to **2 pods** for Student Service

This confirms Kubernetes maintains the desired state defined in the Deployment spec.

---

## 📌 Useful Commands

| Command                                  | Description                          |
|------------------------------------------|--------------------------------------|
| `kubectl get pods -o wide`               | List pods with node/IP details       |
| `kubectl get services`                   | List all services                    |
| `kubectl get deployments`                | List all deployments                 |
| `kubectl get hpa`                        | Check auto-scaler status             |
| `kubectl logs <pod-name>`                | View logs for a specific pod         |
| `kubectl describe deployment <name>`     | Detailed info about a deployment     |
| `kubectl describe hpa <name>`            | Detailed info about an HPA           |

---

## 🧹 Cleanup

Remove all deployed resources and stop the cluster:

```powershell
# Delete all K8s resources
kubectl delete -f ./k8s/

# Stop Minikube
minikube stop
```

---

## 📝 Conclusion

This project demonstrates the deployment of **scalable microservices** on a local Kubernetes cluster using Minikube. Key takeaways:

| Concept              | What Was Demonstrated                                                       |
|----------------------|-----------------------------------------------------------------------------|
| **Containerization** | Each service packaged into an independent Docker container                  |
| **Orchestration**    | Kubernetes manages deployment, networking, and pod lifecycle                 |
| **Scalability**      | HPA auto-scales Student Service from 2 to 5 pods based on CPU load         |
| **Self-Healing**     | Deleted pods are automatically replaced to maintain desired state           |
| **Service Discovery**| Kubernetes Services provide stable endpoints regardless of pod identity     |

> This architecture can be extended to production by adding **Ingress controllers**, **CI/CD pipelines**, **monitoring (Prometheus/Grafana)**, and deploying to managed clusters like **GKE**, **EKS**, or **AKS**.

---

*Project developed for academic submission — Scalable Microservices Deployment Using Kubernetes.*