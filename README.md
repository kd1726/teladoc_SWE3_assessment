# Teladoc SWE3 Assessment

## How to Run

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) must be installed and running
- **Git Bash** or **zsh** is recommended for running the startup script

### Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd teladoc_SWE3_assessment
```

2. From the root directory, change the permissions on the file and run the startup script:

```bash
sudo chmod 774 ./scripts/start.sh
./scripts/start.sh
```

This will build and start all services (frontend, backend, Celery, PostgreSQL, Redis), then seed the database with users.

3. Once the script finishes, open **http://localhost** in your browser.

### Default Credentials

| Username | Password | Role |
|---|---|---|
| `admin` | `admin_password` | Admin |
| `tenant1` | `password123` | Tenant |
| `tenant2` | `password123` | Tenant |
| `tenant3` | `password123` | Tenant |
| `tenant4` | `password123` | Tenant |
| `tenant5` | `password123` | Tenant |

### Design Decisions / Tradeoffs
I try to follow SOLID design principles. Much of the business logic in this application is handled either in a service or in a Celery task. I decided to use Redis and Celery for maintaining suspended, pending events and for handling resource-intensive requests. This also helped in making the event consumer idempotent. The tradeoff of using so many different tools is, of course, scaling complexity. With diversified tools we make it harder for newcomers to contribute to the codebase, but it is a worthy sacrifice for the performance gains.

### AI Review
Most of my utilization of AI was using it as a very sentient Google search. The overwhelming majority of the code I wrote, though there are some tests that AI wrote due to time constraints. As mentioned in the prompt, it is not code I don't understand, and in fact I know how I would be able to write it better.