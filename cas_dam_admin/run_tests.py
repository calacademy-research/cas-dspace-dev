import docker

client = docker.from_env()

dspace_container = client.containers.list(filters={'name': 'dspace'})

if dspace_container:
    pass
