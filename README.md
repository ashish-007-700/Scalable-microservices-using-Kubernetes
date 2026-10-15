# Scalable Microservices Deployment Using Kubernetes

## 1. Project Objective

This project demonstrates how to build, containerize, and deploy scalable microservices using **Kubernetes (Minikube)**. Two independent microservices — **Student Service** and **Course Service** — are developed using Node.js and Express.js, packaged into Docker containers, and deployed on a local Kubernetes cluster. The project showcases core DevOps concepts including containerization, orchestration, service discovery, scalability, and self-healing.

---

## 2. Technologies Used

| Technology      | Purpose                                      |
|-----------------|----------------------------------------------|
| Node.js         | Runtime for building the microservices        |
| Express.js      | Web framework for creating REST APIs          |
| Docker          | Containerization of each microservice         |
| Kubernetes      | Container orchestration and scaling           |
| Minikube        | Running a local single-node Kubernetes cluster|
| kubectl         | Command-line tool to manage Kubernetes        |

---

## 3. Project Folder Structure

```
Scalable microservices/
├── student-service/
│   ├── index.js          # Express app with /students and /health endpoints
│   ├── package.json      # Node.js dependencies
│   └── Dockerfile        # Docker build instructions
├── course-service/
│   ├── index.js          # Express app with /courses and /health endpoints
│   ├── package.json      # Node.js dependencies
│   └── Dockerfile        # Docker build instructions
├── k8s/
│   ├── student-deployment.yaml   # Kubernetes Deployment (2 replicas)
│   ├── student-service.yaml      # Kubernetes Service (NodePort 30001)
│   ├── course-deployment.yaml    # Kubernetes Deployment (1 replica)
│   └── course-service.yaml       # Kubernetes Service (NodePort 30002)
└── README.md             # Project documentation (this file)
```

---

## 4. Prerequisites

Make sure the following tools are installed on your Windows machine:

1. **Node.js** (v18 or later) — [Download](https://nodejs.org/)
2. **Docker Desktop** — [Download](https://www.docker.com/products/docker-desktop/)
3. **Minikube** — [Download](https://minikube.sigs.k8s.io/docs/start/)
4. **kubectl** — [Download](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/)

Verify installations by running these commands in **PowerShell**:

```powershell
node --version
docker --version
minikube version
kubectl version --client
```

---

## 5. Build Docker Images

### Step 5.1 — Start Minikube

Open **PowerShell** and run:

```powershell
minikube start --driver=docker
```

Wait until you see a message confirming that the cluster is ready.

### Step 5.2 — Point Docker to Minikube's Docker Daemon

This step is **critical**. It makes Docker build images directly inside Minikube so that Kubernetes can find them without needing a remote registry.

```powershell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

> **Note:** This command only affects the current PowerShell session. If you open a new terminal, you must run this command again.

### Step 5.3 — Build the Student Service Image

Navigate to the project root folder first:

```powershell
cd "C:\PROJECTS\Scalable microservices"
```

Then build the image:

```powershell
docker build -t student-service:latest ./student-service
```

### Step 5.4 — Build the Course Service Image

From the same project root folder:

```powershell
docker build -t course-service:latest ./course-service
```

### Step 5.5 — Verify the Images

```powershell
docker images | Select-String "student-service|course-service"
```

You should see both `student-service` and `course-service` with the `latest` tag.

---

## 6. Deploy to Kubernetes

### Step 6.1 — Apply All Kubernetes Configurations

From the project root folder (`C:\PROJECTS\Scalable microservices`):

```powershell
kubectl apply -f ./k8s/student-deployment.yaml
kubectl apply -f ./k8s/student-service.yaml
kubectl apply -f ./k8s/course-deployment.yaml
kubectl apply -f ./k8s/course-service.yaml
```

You should see output confirming that each deployment and service was created.

### Step 6.2 — Verify Pods Are Running

```powershell
kubectl get pods
```

Expected output (names will vary):

```
NAME                               READY   STATUS    RESTARTS   AGE
student-service-xxxxxxxxx-xxxxx    1/1     Running   0          30s
student-service-xxxxxxxxx-yyyyy    1/1     Running   0          30s
course-service-xxxxxxxxx-zzzzz     1/1     Running   0          30s
```

> Notice that **Student Service has 2 pods** (2 replicas) and **Course Service has 1 pod**.

### Step 6.3 — Verify Services

```powershell
kubectl get services
```

Expected output:

```
NAME              TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
student-service   NodePort   10.x.x.x        <none>        3001:30001/TCP   30s
course-service    NodePort   10.x.x.x        <none>        3002:30002/TCP   30s
kubernetes        ClusterIP  10.96.0.1        <none>        443/TCP          5m
```

---

## 7. Access and Test the APIs

### Step 7.1 — Get the Minikube IP

```powershell
minikube ip
```

Note the IP address (e.g., `192.168.49.2`).

### Step 7.2 — Open the Services Using Minikube

The most reliable way to access NodePort services on Windows is using `minikube service`:

**Student Service:**

```powershell
minikube service student-service --url
```

This will print a URL like `http://127.0.0.1:xxxxx`. Use that URL to test.

**Course Service:**

```powershell
minikube service course-service --url
```

### Step 7.3 — Test the Endpoints

Replace `<STUDENT_URL>` and `<COURSE_URL>` with the URLs from the previous step.

**Test Student Service:**

```powershell
curl <STUDENT_URL>/students
curl <STUDENT_URL>/health
```

**Test Course Service:**

```powershell
curl <COURSE_URL>/courses
curl <COURSE_URL>/health
```

**Expected JSON Responses:**

`GET /students`:
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

`GET /courses`:
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

`GET /health`:
```json
{ "status": "healthy", "service": "student-service" }
```

---

## 8. Verify Running Pods and Services

### View All Pods with Details

```powershell
kubectl get pods -o wide
```

### View All Services

```powershell
kubectl get services
```

### View All Deployments

```powershell
kubectl get deployments
```

### View Logs of a Specific Pod

```powershell
# Replace <pod-name> with the actual pod name from "kubectl get pods"
kubectl logs <pod-name>
```

### Describe a Deployment

```powershell
kubectl describe deployment student-service
```

---

## 9. Demonstrate Kubernetes Self-Healing

Kubernetes automatically replaces deleted pods to maintain the desired replica count. This demonstrates the **self-healing** capability.

### Step 9.1 — List the Current Pods

```powershell
kubectl get pods
```

Note the names of the Student Service pods.

### Step 9.2 — Delete One Pod

```powershell
# Replace <pod-name> with one of the student-service pod names
kubectl delete pod <pod-name>
```

### Step 9.3 — Observe the Recovery

Immediately run:

```powershell
kubectl get pods
```

You will see that:
- The deleted pod is in `Terminating` state.
- A **new pod** has been automatically created to replace it.
- After a few seconds, the new pod reaches `Running` state.
- The total count is back to **2 pods** for Student Service.

This proves that Kubernetes automatically maintains the desired number of replicas as defined in the Deployment configuration.

---

## 10. Cleanup

To remove all deployed resources:

```powershell
kubectl delete -f ./k8s/student-deployment.yaml
kubectl delete -f ./k8s/student-service.yaml
kubectl delete -f ./k8s/course-deployment.yaml
kubectl delete -f ./k8s/course-service.yaml
```

To stop Minikube:

```powershell
minikube stop
```

---

## 11. Conclusion

This project successfully demonstrates the deployment of scalable microservices using Kubernetes on a local Minikube cluster. The key DevOps concepts covered include:

- **Containerization** — Each microservice is packaged into an independent Docker container, ensuring consistency across environments.
- **Orchestration** — Kubernetes manages the deployment, networking, and lifecycle of containers.
- **Scalability** — The Student Service is deployed with multiple replicas, showing how Kubernetes can distribute load across pods.
- **Self-Healing** — When a pod is deleted, Kubernetes automatically creates a replacement to maintain the desired state.
- **Service Discovery** — Kubernetes Services provide stable network endpoints for accessing the microservices, regardless of which pod handles the request.

This architecture can be extended to production-grade systems by adding features such as Ingress controllers, CI/CD pipelines, monitoring, and cloud-based Kubernetes clusters (e.g., GKE, EKS, AKS).

---

*Project developed for academic submission — Scalable Microservices Deployment Using Kubernetes.*
#   S c a l a b l e - m i c r o s e r v i c e s - u s i n g - K u b e r n e t e s  
 