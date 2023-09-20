# GraphQL Conf Federation Competition 2023

You have two postgres databases. One contains the `Artist` table and another contains the `Album` table.

Build a federated system that can process the following query: retrieve the first 100 Artists sorted by `Name` and for each, return the first 5 Albums sorted by `Title`.

The system must mirror the common pattern of having a service that resolves queries for each database, and a separate federation component.

Submit a link to your git repository as a Github Issue.

## How to Win

Have the lowest P95 latency at 100rps (we may decide to change the rps depending on the latency spread).

Your system will be run on an e2-small GCE instance.

## Acceptance Criteria

- Your repository must contain one `docker-compose.yml` that brings up all the services
- Your repository must contain one `load_services.sh` script that will be run after the services are brought up that can perform additional initialisation
  - The test bench will run only this script for setup. Please make sure that you bring up the docker services in this script.
- Use the `docker-compose.database.yml` and `load_data.sh` files to create standard database services
- Do not implement query based caching in your services (our test bench is pretty simple)
- The single query endpoint must return the data in the following JSON format, which may contain additional root level properties

```json
{
  "data": {
    "Artist": [
      {
        "ArtistId": 1,
        "Name": "AC/DC",
        "Album": [
          {
            "AlbumId": 1,
            "Title": "For Those About To Rock We Salute You"
          },
          {
            "AlbumId": 4,
            "Title": "Let There Be Rock"
          }
        ]
      }
    ]
  }
}
```
